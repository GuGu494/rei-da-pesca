import React, { useState } from 'react';
import './PainelSecao.css';
 
const reservasIniciais = [
  { id: 1, data: '15/03/2026', nome: 'Maria Silva', horario: '13:00', pessoas: 25, valor: 500, status: 'Confirmado' },
  { id: 2, data: '16/03/2026', nome: 'João Santos', horario: '18:30', pessoas: 12, valor: 300, status: 'Pendente'   },
  { id: 3, data: '17/03/2026', nome: 'Pedro Lima',  horario: '9:00',  pessoas: 10, valor: 400, status: 'Cancelado'  },
];
 
const statusCores = {
  Confirmado: 'status-verde',
  Pendente:   'status-amarelo',
  Cancelado:  'status-vermelho',
};
 
function ReservasEvento() {
  const [reservas] = useState(reservasIniciais);
  const [filtroInicio, setFiltroInicio] = useState('');
  const [filtroFim, setFiltroFim] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [lista, setLista] = useState(reservasIniciais);
 
  const aplicarFiltro = () => {
    let resultado = [...reservas];
    if (filtroStatus) {
      resultado = resultado.filter((r) =>
        r.status.toLowerCase().includes(filtroStatus.toLowerCase())
      );
    }
    setLista(resultado);
  };
 
  return (
    <div className="secao-card">
      <div className="secao-titulo">
        <svg width="28" height="20" viewBox="0 0 80 50" fill="none">
          <path d="M70 25 C55 10,20 5,5 25 C20 45,55 40,70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
          <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
        </svg>
        <h2>Relatório de Reservas de Eventos</h2>
      </div>
 
      {/* Filtros */}
      <div className="form-grid">
        <div className="form-group">
          <label>De Data (dd/mm/aaaa)</label>
          <div className="input-icon-wrap">
            <input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
            <span className="campo-icone">📅</span>
          </div>
        </div>
 
        <div className="form-group">
          <label>Até Data (dd/mm/aaaa)</label>
          <div className="input-icon-wrap">
            <input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} />
            <span className="campo-icone">📅</span>
          </div>
        </div>
 
        <div className="form-group span-full">
          <label>Filtrar por Status</label>
          <input
            type="text"
            placeholder="Confirmado, Pendente, Cancelado..."
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          />
        </div>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <button className="btn-adicionar verde btn-filtro" onClick={aplicarFiltro}>
          Aplicar Filtro
        </button>
      </div>
 
      {/* Tabela */}
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Nome Responsável</th>
            <th>Horário</th>
            <th>Pessoas</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.data}</td>
              <td>{r.nome}</td>
              <td>{r.horario}</td>
              <td>{r.pessoas}</td>
              <td>R${r.valor.toFixed(2).replace('.', ',')}</td>
              <td><span className={`status-badge ${statusCores[r.status] || ''}`}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
export default ReservasEvento;