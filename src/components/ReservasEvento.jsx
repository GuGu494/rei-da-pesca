import React, { useState, useEffect } from 'react';
import './PainelSecao.css';
import { supabase } from '../services/supabase';

const statusCores = {
  Confirmada: 'status-verde',
  Pendente:   'status-amarelo',
  Cancelada:  'status-vermelho',
  Atendida:   'status-azul',
};

function ReservasEvento() {
  const [reservas, setReservas] = useState([]);
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [filtroInicio, setFiltroInicio] = useState('');
  const [filtroFim, setFiltroFim] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    buscarReservas();
  }, []);

  const buscarReservas = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .order('data_reserva', { ascending: true });

    if (!error) {
      setReservas(data);
      setLista(data);
    }
    setCarregando(false);
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Excluir esta reserva permanentemente?")) {
      const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', id);

      if (!error) {
        buscarReservas();
      } else {
        alert("Erro ao excluir reserva.");
      }
    }
  };

  const aplicarFiltro = () => {
    let resultado = [...reservas];
    if (filtroStatus) resultado = resultado.filter(r => r.status?.toLowerCase().includes(filtroStatus.toLowerCase()));
    if (filtroInicio) resultado = resultado.filter(r => r.data_reserva >= filtroInicio);
    if (filtroFim) resultado = resultado.filter(r => r.data_reserva <= filtroFim);
    setLista(resultado);
  };

  const handleAprovar = async (id) => {
    const { error } = await supabase.from('reservas').update({ status: 'Confirmada' }).eq('id', id);
    if (!error) { alert('Reserva Confirmada!'); buscarReservas(); }
  };

  const handleFinalizar = async (id) => {
    const { error } = await supabase.from('reservas').update({ status: 'Atendida' }).eq('id', id);
    if (!error) { alert('Check-in realizado!'); buscarReservas(); }
  };

  const handleWhatsApp = (telefone, nome, data) => {
    if (!telefone) return alert('Telefone não cadastrado.');
    const numeroLimpo = telefone.replace(/\D/g, '');
    const dataFormatada = data ? data.split('-').reverse().join('/') : '';
    const mensagem = `Olá ${nome}, tudo bem? Vimos sua solicitação de reserva para o dia ${dataFormatada}. Podemos confirmar?`;
    window.open(`https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div className="secao-card">
      <div className="secao-titulo">
        <svg width="28" height="20" viewBox="0 0 80 50" fill="none">
          <path d="M70 25 C55 10,20 5,5 25 C20 45,55 40,70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
          <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
        </svg>
        <h2>Gestão de Reservas de Eventos</h2>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>De Data</label>
          <input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Até Data</label>
          <input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} />
        </div>
        <div className="form-group span-full">
          <label>Status</label>
          <input type="text" placeholder="Pendente, Confirmada..." value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <button className="btn-adicionar verde" onClick={aplicarFiltro}>Filtrar</button>
      </div>

      {carregando ? <p>Carregando...</p> : (
        <table className="painel-tabela">
          <thead>
            <tr>
              <th>Data</th><th>Cliente</th><th>Pessoas</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((r) => (
              <tr key={r.id}>
                <td>{r.data_reserva?.split('-').reverse().join('/')}</td>
                <td>{r.nome_responsavel}</td>
                <td>{r.numero_pessoas}</td>
                <td><span className={`status-badge ${statusCores[r.status] || ''}`}>{r.status}</span></td>
                <td style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleWhatsApp(r.telefone, r.nome_responsavel, r.data_reserva)} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px' }}>WPP</button>
                  {r.status === 'Pendente' && <button onClick={() => handleAprovar(r.id)} style={{ backgroundColor: '#2d6a2d', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px' }}>Aprovar</button>}
                  {r.status === 'Confirmada' && <button onClick={() => handleFinalizar(r.id)} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px' }}>Finalizar</button>}
                  <button onClick={() => handleExcluir(r.id)} style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px' }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReservasEvento;