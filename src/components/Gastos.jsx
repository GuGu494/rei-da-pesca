import React, { useState } from 'react';
import './PainelSecao.css';
 
const gastosIniciais = [
  { id: 1, data: '15/03/2026', categoria: 'Fornecedor', descricao: 'Compra de peixes', valor: 500 },
  { id: 2, data: '16/03/2026', categoria: 'Energia',    descricao: 'Conta de luz',      valor: 300 },
  { id: 3, data: '17/03/2026', categoria: 'Manutenção', descricao: 'Reparo de tanque',  valor: 400 },
];
 
function Gastos() {
  const [gastos, setGastos] = useState(gastosIniciais);
  const [form, setForm] = useState({ data: '', categoria: '', valor: '', descricao: '' });
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleAdicionar = () => {
    if (!form.data || !form.categoria || !form.valor) return;
    const novo = {
      id: gastos.length + 1,
      data: form.data,
      categoria: form.categoria,
      descricao: form.descricao,
      valor: parseFloat(form.valor),
    };
    setGastos([...gastos, novo]);
    setForm({ data: '', categoria: '', valor: '', descricao: '' });
  };
 
  return (
    <div className="secao-card">
      <div className="secao-titulo">
        <svg width="28" height="20" viewBox="0 0 80 50" fill="none">
          <path d="M70 25 C55 10,20 5,5 25 C20 45,55 40,70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
          <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
        </svg>
        <h2>Lançamento de Gastos</h2>
      </div>
 
      <div className="form-grid">
        <div className="form-group">
          <label>Data</label>
          <div className="input-icon-wrap">
            <input type="date" name="data" value={form.data} onChange={handleChange} />
            <span className="campo-icone">📅</span>
          </div>
        </div>
 
        <div className="form-group">
          <label>Categoria</label>
          <input type="text" name="categoria" value={form.categoria} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Valor Total</label>
          <input type="number" name="valor" value={form.valor} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Descrição</label>
          <input type="text" name="descricao" value={form.descricao} onChange={handleChange} />
        </div>
      </div>
 
      <button className="btn-adicionar vermelho" onClick={handleAdicionar}>Adicionar Gasto</button>
 
      <h3 className="tabela-titulo">Gastos Recentes</h3>
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>ID</th><th>Data</th><th>Categoria</th><th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.data}</td>
              <td>{g.categoria}</td>
              <td>R${g.valor.toFixed(2).replace('.', ',')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
export default Gastos;