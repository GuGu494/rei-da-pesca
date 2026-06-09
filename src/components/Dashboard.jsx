import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Vendas from './Vendas';
import Gastos from './Gastos';
import EstoqueAlimenticio from './EstoqueAlimenticio';
import GestaoReservas from './GestaoReservas';
import ReservasEvento from './ReservasEvento';
import Relatorios from './Relatorios';
import { supabase } from '../services/supabase';

function LogoPeixe() {
  return (
    <svg width="36" height="24" viewBox="0 0 80 50" fill="none">
      <path d="M70 25 C55 10,20 5,5 25 C20 45,55 40,70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
      <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
    </svg>
  );
}

// ---- COMPONENTE: VISÃO GERAL ----
function VisaoGeral({ periodo, itensBaixoEstoque, reservasPendentesAlerta }) {
  const [metricas, setMetricas] = useState({
    lucro: 0, gastos: 0, fluxoReal: 0, expectativaHoje: 0, reservasPendentes: 0, contagemVendas: 0, kgPeixe: 0
  });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [maxValor, setMaxValor] = useState(1000);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarDadosDashboard();
  }, [periodo, itensBaixoEstoque, reservasPendentesAlerta]);

  const buscarDadosDashboard = async () => {
    setCarregando(true);
    try {
      // 1. Definição precisa das datas no escopo atual
      const hojeObj = new Date();
      const hoje = hojeObj.toISOString().split('T')[0];
      const mesAtual = hoje.substring(0, 7);

      // Descobre o início da semana atual (último Domingo) para zerar o faturamento semanal
      const domingoAtual = new Date(hojeObj);
      domingoAtual.setDate(hojeObj.getDate() - hojeObj.getDay());
      const dataInicioSemana = domingoAtual.toISOString().split('T')[0];

      const { data: todasVendas } = await supabase.from('vendas').select('*');
      const { data: todosGastos } = await supabase.from('gastos').select('*');
      const { data: estoque } = await supabase.from('estoque').select('*');
      
      const { data: reservasHoje } = await supabase.from('reservas')
        .select('numero_pessoas')
        .eq('data_reserva', hoje)
        .eq('status', 'Confirmada');

      const { count: pendentes } = await supabase.from('reservas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendente');

      let vendasFiltradas = todasVendas || [];
      let gastosFiltrados = todosGastos || [];
      let estoqueFiltrado = estoque || [];

      // 2. Lógica de filtragem por período selecionado (Cards e Resumos)
      if (periodo === 'Hoje') {
        vendasFiltradas = vendasFiltradas.filter(v => v.data_venda === hoje);
        gastosFiltrados = gastosFiltrados.filter(g => g.data_gasto === hoje);
        estoqueFiltrado = estoqueFiltrado.filter(e => e.data_movimentacao === hoje);
      } else if (periodo === 'Semana') {
        vendasFiltradas = vendasFiltradas.filter(v => v.data_venda >= dataInicioSemana && v.data_venda <= hoje);
        gastosFiltrados = gastosFiltrados.filter(g => g.data_gasto >= dataInicioSemana && g.data_gasto <= hoje);
        estoqueFiltrado = estoqueFiltrado.filter(e => e.data_movimentacao >= dataInicioSemana && e.data_movimentacao <= hoje);
      } else if (periodo === 'Mês') {
        vendasFiltradas = vendasFiltradas.filter(v => v.data_venda.startsWith(mesAtual));
        gastosFiltrados = gastosFiltrados.filter(g => g.data_gasto.startsWith(mesAtual));
        estoqueFiltrado = estoqueFiltrado.filter(e => e.data_movimentacao.startsWith(mesAtual));
      }

      // 3. Consolidação financeira unificada
      const totalGastosDiretos = gastosFiltrados.reduce((acc, curr) => acc + Number(curr.valor_total), 0);
      const totalGastosEstoque = estoqueFiltrado
        .filter(e => e.tipo_movimentacao.toLowerCase().trim() === 'entrada')
        .reduce((acc, curr) => acc + Number(curr.custo_total || 0), 0);

      const totalGastosUnificados = totalGastosDiretos + totalGastosEstoque;
      const totalVendas = vendasFiltradas.reduce((acc, curr) => acc + Number(curr.valor_total), 0);
      
      // CORREÇÃO: Calcula o saldo REAL de peixe varrendo TODO o histórico acumulado (Independe da semana)
      let saldoRealPeixe = 0;
      estoque?.forEach(mov => {
        const nomeItem = mov.item.toLowerCase().trim();
        if (nomeItem.includes('peixe') || nomeItem.includes('tilápia') || nomeItem.includes('tilapia')) {
          const qtd = Number(mov.quantidade) || 0;
          const tipo = mov.tipo_movimentacao.toLowerCase().trim();
          if (tipo === 'entrada') saldoRealPeixe += qtd;
          if (tipo === 'saída' || tipo === 'saida') saldoRealPeixe -= qtd;
        }
      });

      setMetricas({
        lucro: totalVendas - totalGastosUnificados,
        gastos: totalGastosUnificados,
        fluxoReal: vendasFiltradas.reduce((acc, curr) => acc + Number(curr.quantidade_pessoas), 0),
        expectativaHoje: reservasHoje?.reduce((acc, curr) => acc + Number(curr.numero_pessoas), 0) || 0,
        reservasPendentes: pendentes || 0,
        contagemVendas: vendasFiltradas.length,
        kgPeixe: Math.max(saldoRealPeixe, 0)
      });

      // 4. Lógica do Gráfico de Barras fixado na Semana Atual do Calendário
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      const lista7Dias = [];
      
      for (let i = 0; i < 7; i++) {
        const diaBarra = new Date(domingoAtual);
        diaBarra.setDate(domingoAtual.getDate() + i);
        const diaBarraStr = diaBarra.toISOString().split('T')[0];

        const faturamentoDia = todasVendas
          ?.filter(v => v.data_venda === diaBarraStr)
          .reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0;

        lista7Dias.push({ 
          dia: diasSemana[diaBarra.getDay()], 
          valor: faturamentoDia 
        });
      }

      setDadosGrafico(lista7Dias);
      setMaxValor(Math.max(...lista7Dias.map(d => d.valor), 1000));

    } catch (err) { console.error(err); } finally { setCarregando(false); }
  };

  if (carregando) return <p style={{ padding: '20px' }}>Sincronizando Dashboard...</p>;

  return (
    <>
      {reservasPendentesAlerta > 0 && (
        <div className="alerta-estoque-topo" style={{ backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba', marginBottom: '15px' }}>
          <div className="alerta-estoque-header">
            <span className="alerta-estoque-icone">⚠️</span>
            <strong>Atenção: Você tem {reservasPendentesAlerta} reservas aguardando confirmação!</strong>
          </div>
        </div>
      )}

      {itensBaixoEstoque.length > 0 && (
        <div className="alerta-estoque-topo">
          <div className="alerta-estoque-header">
            <span className="alerta-estoque-icone">⚠️</span>
            <strong>Alerta de Reposição: Saldo de Estoque Crítico!</strong>
          </div>
          <div className="alerta-estoque-corpo">
            {itensBaixoEstoque.map((item, idx) => (
              <span key={idx} className="alerta-estoque-tag">
                {item.item}: Restam apenas <strong>{item.quantidade} {item.unidade}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="cards-grid">
        <div className="card">
          <div className="card-icon verde">💰</div>
          <span className="card-label">Lucro ({periodo})</span>
          <span className={`card-valor ${metricas.lucro < 0 ? 'negativo-cor' : ''}`}>
            R$ {metricas.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="card-sub">Total líquido</span>
        </div>

        <div className="card">
          <div className="card-icon vermelho">📉</div>
          <span className="card-label">Gastos ({periodo})</span>
          <span className="card-valor">R$ {metricas.gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="card-sub">Saídas de caixa</span>
        </div>

        <div className="card">
          <div className="card-icon azul">👥</div>
          <span className="card-label">Fluxo de Pessoas</span>
          <span className="card-valor">{metricas.fluxoReal}</span>
          <span className="card-sub">Realizado (Vendas)</span>
          {metricas.expectativaHoje > 0 && (
            <div className="expectativa-badge">+{metricas.expectativaHoje} previstas hoje</div>
          )}
        </div>

        <div className="card">
          <div className="card-icon amarelo">⏳</div>
          <span className="card-label">Reservas Pendentes</span>
          <span className="card-valor">{metricas.reservasPendentes}</span>
          <span className="card-sub">No site público</span>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="grafico-card">
          <div className="grafico-header">
            <strong>Faturamento Semanal</strong>
            <p>Janela de dados da semana atual corporativa</p>
          </div>
          <div className="barras">
            {dadosGrafico.map((item, idx) => (
              <div key={idx} className="barra-col">
                <span className="barra-valor">R$ {item.valor.toFixed(0)}</span>
                <div className="barra" style={{ height: `${(item.valor / maxValor) * 160}px` }} />
                <span className="barra-dia">{item.dia}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="resumo-card">
          <strong className="resumo-titulo">Resumo: {periodo}</strong>
          <div className="resumo-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888' }}>
              <span>Vendas Realizadas</span><span>{metricas.contagemVendas}</span>
            </div>
            <div className="barra-prog"><div className="barra-fill verde" style={{ width: `${Math.min(metricas.contagemVendas * 10, 100)}%` }} /></div>
          </div>
          
          {/* CORREÇÃO: Barra de progresso vinculada ao saldo real acumulado de peixe */}
          <div className="resumo-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888' }}>
              <span>Estoque de Peixe</span><span>{metricas.kgPeixe}kg</span>
            </div>
            <div className="barra-prog">
              <div className="barra-fill vermelho" style={{ width: `${Math.min(metricas.kgPeixe, 100)}%` }} />
            </div>
          </div>
          <strong className="resumo-titulo" style={{ marginTop: '20px' }}>Avisos</strong>
          
          {itensBaixoEstoque.length > 0 && (
            <div className="aviso aviso-vermelho-pisca">
              Atenção: {itensBaixoEstoque.length} produtos em nível crítico!
            </div>
          )}

          {metricas.expectativaHoje > 0 && (
            <div className="aviso aviso-amarelo">Expectativa de {metricas.expectativaHoje} pessoas hoje</div>
          )}
          <div className="aviso aviso-azul">Status: Dados em tempo real</div>
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const [menuAtivo, setMenuAtivo] = useState('Visão Geral');
  const [periodo, setPeriodo] = useState('Semana');
  const [itensBaixoEstoque, setItensBaixoEstoque] = useState([]);
  const [reservasPendentesAlerta, setReservasPendentesAlerta] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarSaldosCriticos = async () => {
      try {
        const { data } = await supabase.from('estoque').select('*');
        if (data) {
          const saldos = {};
          
          data.forEach((mov) => {
            const nomeItem = mov.item.toLowerCase().trim();
            const qtd = Number(mov.quantidade) || 0;
            const tipo = mov.tipo_movimentacao.toLowerCase().trim();

            if (!saldos[nomeItem]) {
              saldos[nomeItem] = { item: mov.item, quantity: 0, unidade: mov.unidade || 'unid.' };
            }

            if (tipo === 'entrada') saldos[nomeItem].quantity += qtd;
            if (tipo === 'saída' || tipo === 'saida') saldos[nomeItem].quantity -= qtd;
          });

          const criticos = Object.values(saldos).filter(prod => prod.quantity <= 5);
          setItensBaixoEstoque(criticos);
        }

        const { count: pendentes } = await supabase.from('reservas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Pendente');
        
        setReservasPendentesAlerta(pendentes || 0);
      } catch (err) {
        console.error('Erro ao checar estoque crítico ou reservas:', err);
      }
    };

    verificarSaldosCriticos();
    const intervalo = setInterval(verificarSaldosCriticos, 30000);
    return () => clearInterval(intervalo);
  }, [menuAtivo]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><LogoPeixe /><span>Rei da Pesca</span></div>
        <nav className="sidebar-nav">
          {['Visão Geral', 'Vendas', 'Gastos', 'Reservas de evento', 'Estoque Alimentício', 'Relatórios'].map(m => (
            <button 
              key={m} 
              className={`nav-item ${menuAtivo === m ? 'ativo' : ''}`} 
              onClick={() => setMenuAtivo(m)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
            >
              <span>{m}</span>
              {m === 'Estoque Alimentício' && itensBaixoEstoque.length > 0 && (
                <span className="sidebar-badge-alerta">{itensBaixoEstoque.length}</span>
              )}
              {m === 'Reservas de evento' && reservasPendentesAlerta > 0 && (
                <span className="sidebar-badge-alerta">{reservasPendentesAlerta}</span>
              )}
            </button>
          ))}
          
          <hr style={{ border: '0', borderTop: '1px solid #3d3d3d', margin: '15px 0' }} />
          <button className="nav-item" onClick={() => navigate('/')} style={{ color: '#888', fontSize: '0.85rem' }}>
              🏠 Voltar ao Site Público
          </button>
        </nav>
        <button className="sair-btn" onClick={() => navigate('/login')}>Sair</button>
      </aside>

      <main className="main-content">
        <div className="painel-header">
          <div>
            <button 
              onClick={() => navigate('/')} 
              style={{ background: 'none', border: 'none', color: '#2d6a2d', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}
            >
               ← Voltar ao Site
            </button>
            <h1>{menuAtivo === 'Visão Geral' ? 'Painel de Gestão' : menuAtivo}</h1>
            <p>Controle de dados: <strong>{periodo}</strong></p>
          </div>
          {menuAtivo === 'Visão Geral' && (
            <div className="periodo-btns">
              {['Hoje', 'Semana', 'Mês'].map(p => (
                <button 
                  key={p} 
                  className={`periodo-btn ${periodo === p ? 'ativo' : ''}`}
                  onClick={() => setPeriodo(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="conteudo-dinamico">
          {menuAtivo === 'Vendas' && <Vendas />}
          {menuAtivo === 'Gastos' && <Gastos />}
          {menuAtivo === 'Reservas de evento' && <ReservasEvento />}
          {menuAtivo === 'Estoque Alimentício' && <EstoqueAlimenticio />}
          {menuAtivo === 'Relatórios' && <Relatorios />}
          {menuAtivo === 'Visão Geral' && <VisaoGeral periodo={periodo} itensBaixoEstoque={itensBaixoEstoque} reservasPendentesAlerta={reservasPendentesAlerta} />}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;