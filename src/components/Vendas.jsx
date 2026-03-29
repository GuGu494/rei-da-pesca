import React, { useState } from 'react';
import './PainelSecao.css';
 
const vendasIniciais = [
  { id: 1, data: '15/03/2026', servico: 'Equipamento', descricao: 'Aluguel de vara', valor: 500 },
  { id: 2, data: '16/03/2026', servico: 'Isca',        descricao: 'Minhoca e iscas', valor: 300 },
  { id: 3, data: '17/03/2026', servico: 'Evento',      descricao: 'Festa privada',   valor: 400 },
];
 
function Vendas() {
  const [vendas, setVendas] = useState(vendasIniciais);
  const [form, setForm] = useState({ data: '', servico: '', valor: '', descricao: '' });
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleAdicionar = () => {
    if (!form.data || !form.servico || !form.valor) return;
    const nova = {
      id: vendas.length + 1,
      data: form.data,
      servico: form.servico,
      descricao: form.descricao,
      valor: parseFloat(form.valor),
    };
    setVendas([...vendas, nova]);
    setForm({ data: '', servico: '', valor: '', descricao: '' });
  };
 
  return (
    <div className="secao-card">
      {/* Cabeçalho */}
      <div className="secao-titulo">
        <svg width="28" height="20" viewBox="0 0 80 50" fill="none">
          <path d="M70 25 C55 10,20 5,5 25 C20 45,55 40,70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
          <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
        </svg>
        <h2>Lançamento de Vendas</h2>
      </div>
 
      {/* Formulário */}
      <div className="form-grid">
        <div className="form-group">
          <label>Data</label>
          <div className="input-icon-wrap">
            <input type="date" name="data" value={form.data} onChange={handleChange} />
            <span className="campo-icone">📅</span>
          </div>
        </div>
 
        <div className="form-group">
          <label>Serviço</label>
          <input type="text" name="servico" placeholder="" value={form.servico} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Valor Total</label>
          <input type="number" name="valor" placeholder="" value={form.valor} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Descrição</label>
          <input type="text" name="descricao" placeholder="" value={form.descricao} onChange={handleChange} />
        </div>
      </div>
 
      <button className="btn-adicionar verde" onClick={handleAdicionar}>Adicionar Venda</button>
 
      {/* Tabela */}
      <h3 className="tabela-titulo">Vendas Recentes</h3>
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>ID</th><th>Data</th><th>Serviço</th><th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.data}</td>
              <td>{v.servico}</td>
              <td>R${v.valor.toFixed(2).replace('.', ',')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
export default Vendas;