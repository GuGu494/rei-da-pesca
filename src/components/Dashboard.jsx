import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Vendas from './Vendas';
import Gastos from './Gastos';
import EstoqueAlimenticio from './EstoqueAlimenticio';
import GestaoReservas from './GestaoReservas';
import ReservasEvento from './ReservasEvento';
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
function VisaoGeral({ periodo }) {
  const [metricas, setMetricas] = useState({
    lucro: 0, gastos: 0, fluxoReal: 0, expectativaHoje: 0, reservasPendentes: 0, contagemVendas: 0, kgPeixe: 0
  });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [maxValor, setMaxValor] = useState(1000);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarDadosDashboard();
  }, [periodo]);

  const buscarDadosDashboard = async () => {
    setCarregando(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const mesAtual = hoje.substring(0, 7);

      const { data: todasVendas } = await supabase.from('vendas').select('*');
      const { data: todosGastos } = await supabase.from('gastos').select('*');
      const { data: estoque } = await supabase.from('estoque').select('*');
      
      // Busca reservas de hoje para a etiqueta "+X previstas"
      const { data: reservasHoje } = await supabase.from('reservas')
        .select('numero_pessoas')
        .eq('data_reserva', hoje)
        .eq('status', 'Confirmada');

      const { count: pendentes } = await supabase.from('reservas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendente');

      let vendasFiltradas = todasVendas || [];
      let gastosFiltrados = todosGastos || [];

      if (periodo === 'Hoje') {
        vendasFiltradas = vendasFiltradas.filter(v => v.data_venda === hoje);
        gastosFiltrados = gastosFiltrados.filter(g => g.data_gasto === hoje);
      } else if (periodo === 'Mês') {
        vendasFiltradas = vendasFiltradas.filter(v => v.data_venda.startsWith(mesAtual));
        gastosFiltrados = gastosFiltrados.filter(g => g.data_gasto.startsWith(mesAtual));
      }

      const totalVendas = vendasFiltradas.reduce((acc, curr) => acc + Number(curr.valor_total), 0);
      const totalGastos = gastosFiltrados.reduce((acc, curr) => acc + Number(curr.valor_total), 0);
      
      const kgPeixeTotal = estoque?.filter(i => i.item.toLowerCase().includes('peixe') || i.item.toLowerCase().includes('tilápia'))
                                   .reduce((acc, curr) => acc + Number(curr.quantidade), 0) || 0;

      setMetricas({
        lucro: totalVendas - totalGastos,
        gastos: totalGastos,
        fluxoReal: vendasFiltradas.reduce((acc, curr) => acc + Number(curr.quantidade_pessoas), 0),
        expectativaHoje: reservasHoje?.reduce((acc, curr) => acc + Number(curr.numero_pessoas), 0) || 0,
        reservasPendentes: pendentes || 0,
        contagemVendas: vendasFiltradas.length,
        kgPeixe: kgPeixeTotal
      });

      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      const lista7Dias = [];
      const dataAtual = new Date();
      for (let i = 6; i >= 0; i--) {
        const diaAlvo = new Date();
        diaAlvo.setDate(dataAtual.getDate() - i);
        const faturamentoDia = todasVendas?.filter(v => v.data_venda === diaAlvo.toISOString().split('T')[0]).reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0;
        lista7Dias.push({ dia: diasSemana[diaAlvo.getDay()], valor: faturamentoDia });
      }
      setDadosGrafico(lista7Dias);
      setMaxValor(Math.max(...lista7Dias.map(d => d.valor), 1000));

    } catch (err) { console.error(err); } finally { setCarregando(false); }
  };

  if (carregando) return <p style={{ padding: '20px' }}>Sincronizando Dashboard...</p>;

  return (
    <>
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

        {/* CARD DE FLUXO COM A VOLTA DAS ETIQUETAS */}
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
            <p>Tendência dos últimos 7 dias</p>
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
          <div className="resumo-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888' }}>
              <span>Estoque de Peixe</span><span>{metricas.kgPeixe}kg</span>
            </div>
            <div className="barra-prog"><div className="barra-fill vermelho" style={{ width: `${Math.min(metricas.kgPeixe, 100)}%` }} /></div>
          </div>
          <strong className="resumo-titulo" style={{ marginTop: '20px' }}>Avisos</strong>
          {metricas.expectativaHoje > 0 && (
            <div className="aviso aviso-amarelo">Expectativa de {metricas.expectativaHoje} pessoas hoje</div>
          )}
          <div className="aviso aviso-azul">Status: Dados em tempo real</div>
        </div>
      </div>
    </>
  );
}

// ---- COMPONENTE PRINCIPAL ----
function Dashboard() {
  const [menuAtivo, setMenuAtivo] = useState('Visão Geral');
  const [periodo, setPeriodo] = useState('Semana');
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><LogoPeixe /><span>Rei da Pesca</span></div>
        <nav className="sidebar-nav">
          {['Visão Geral', 'Vendas', 'Gastos', 'Reservas de evento', 'Estoque Alimentício'].map(m => (
            <button key={m} className={`nav-item ${menuAtivo === m ? 'ativo' : ''}`} onClick={() => setMenuAtivo(m)}>{m}</button>
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
          {menuAtivo === 'Visão Geral' && <VisaoGeral periodo={periodo} />}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;