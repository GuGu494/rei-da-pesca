import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Vendas from './Vendas';
import Gastos from './Gastos';
import ReservasEvento from './ReservasEvento';
import EstoqueAlimenticio from './EstoqueAlimenticio';
 
// ---- Dados mockados para Visão Geral ----
const dadosSemana = [
  { dia: 'Seg', valor: 4800 },
  { dia: 'Ter', valor: 5600 },
  { dia: 'Qua', valor: 4500 },
  { dia: 'Qui', valor: 4300 },
  { dia: 'Sex', valor: 3200 },
  { dia: 'Sab', valor: 3700 },
  { dia: 'Dom', valor: 2900 },
];
const maxValor = Math.max(...dadosSemana.map((d) => d.valor));
 
const secaoInfo = {
  'Visão Geral':         { titulo: 'Painel de Gestão',        sub: 'Monitore o desempenho do seu negócio' },
  'Vendas':              { titulo: 'Vendas',                   sub: 'Deixe registrado as vendas do dia.' },
  'Gastos':              { titulo: 'Gastos',                   sub: 'Deixe registrado os gastos do dia.' },
  'Reservas de evento':  { titulo: 'Reservas de evento',       sub: 'Deixe registrado as reservas do seu espaço.' },
  'Estoque Alimentício': { titulo: 'Estoque Alimentício',      sub: 'Deixe registrado o seu estoque.' },
};
 
const menus = ['Visão Geral', 'Vendas', 'Gastos', 'Reservas de evento', 'Estoque Alimentício'];
 
function LogoPeixe() {
  return (
    <svg width="36" height="24" viewBox="0 0 80 50" fill="none">
      <path d="M70 25 C55 10,20 5,5 25 C20 45,55 40,70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
      <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
    </svg>
  );
}
 
function VisaoGeral() {
  return (
    <>
      <div className="cards-grid">
        <div className="card">
          <div className="card-icon verde">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <span className="card-label">Lucro Total</span>
          <span className="card-valor">R$ 12.500,00</span>
          <span className="card-variacao positivo">▲ +12,5%</span>
        </div>
 
        <div className="card">
          <div className="card-icon vermelho">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              <polyline points="17 18 23 18 23 12"/>
            </svg>
          </div>
          <span className="card-label">Gastos Totais</span>
          <span className="card-valor">R$ 4.300,00</span>
          <span className="card-variacao negativo">▼ -8,2%</span>
        </div>
 
        <div className="card">
          <div className="card-icon azul">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span className="card-label">Fluxo de Pessoas</span>
          <span className="card-valor">212</span>
          <span className="card-variacao positivo">▲ +22,5%</span>
        </div>
 
        <div className="card">
          <div className="card-icon amarelo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span className="card-label">Reservas de Hoje</span>
          <span className="card-valor">10</span>
          <span className="card-sub">2 confirmadas</span>
        </div>
      </div>
 
      <div className="bottom-grid">
        <div className="grafico-card">
          <div className="grafico-header">
            <div>
              <strong>Faturamento - Últimos 7 Dias</strong>
              <p>Receita diária do estabelecimento</p>
            </div>
          </div>
          <div className="barras">
            {dadosSemana.map((item) => (
              <div key={item.dia} className="barra-col">
                <span className="barra-valor">R$ {(item.valor / 1000).toFixed(1)}k</span>
                <div className="barra" style={{ height: `${(item.valor / maxValor) * 160}px` }} />
                <span className="barra-dia">{item.dia}</span>
              </div>
            ))}
          </div>
        </div>
 
        <div className="resumo-card">
          <strong className="resumo-titulo">Resumo do Dia</strong>
 
          <div className="resumo-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888' }}>
              <span>Total de Vendas</span><span>32</span>
            </div>
            <div className="barra-prog"><div className="barra-fill verde" style={{ width: '90%' }} /></div>
          </div>
 
          <div className="resumo-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888' }}>
              <span>Mesas Ocupadas</span><span>12/25</span>
            </div>
            <div className="barra-prog"><div className="barra-fill azul" style={{ width: '48%' }} /></div>
          </div>
 
          <div className="resumo-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888' }}>
              <span>Peixes Pescados</span><span>100kg</span>
            </div>
            <div className="barra-prog"><div className="barra-fill vermelho" style={{ width: '65%' }} /></div>
          </div>
 
          <strong className="resumo-titulo" style={{ marginTop: '20px' }}>Avisos Importante</strong>
          <div className="aviso aviso-amarelo">Grupo de 25 pessoas às 15h</div>
          <div className="aviso aviso-azul">Estoque de tilápia abaixo de 50kg</div>
        </div>
      </div>
    </>
  );
}
 
function Dashboard() {
  const [menuAtivo, setMenuAtivo] = useState('Visão Geral');
  const navigate = useNavigate();
 
  const info = secaoInfo[menuAtivo] || secaoInfo['Visão Geral'];
 
  const renderSecao = () => {
    switch (menuAtivo) {
      case 'Vendas':              return <Vendas />;
      case 'Gastos':              return <Gastos />;
      case 'Reservas de evento':  return <ReservasEvento />;
      case 'Estoque Alimentício': return <EstoqueAlimenticio />;
      default:                    return <VisaoGeral />;
    }
  };
 
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <LogoPeixe />
          <span>Rei da Pesca</span>
        </div>
 
        <nav className="sidebar-nav">
          {menus.map((item) => (
            <button
              key={item}
              className={`nav-item ${menuAtivo === item ? 'ativo' : ''}`}
              onClick={() => setMenuAtivo(item)}
            >
              {item}
            </button>
          ))}
        </nav>
 
        <button className="sair-btn" onClick={() => navigate('/login')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
      </aside>
 
      <main className="main-content">
        <div className="painel-header">
          <div>
            <h1>{info.titulo}</h1>
            <p>{info.sub}</p>
          </div>
          {menuAtivo === 'Visão Geral' && (
            <div className="periodo-btns">
              <button className="periodo-btn">Hoje</button>
              <button className="periodo-btn ativo">Semana</button>
              <button className="periodo-btn">Mês</button>
            </div>
          )}
        </div>
 
        {menuAtivo === 'Visão Geral' && (
          <button className="voltar-site-dash" onClick={() => navigate('/')}>
            ← Voltar ao Site
          </button>
        )}
 
        {renderSecao()}
      </main>
    </div>
  );
}
 
export default Dashboard;