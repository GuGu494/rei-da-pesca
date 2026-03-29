import React, { useState } from 'react';
import './PainelSecao.css';
 
const estoqueInicial = [
  { id: 1, data: '15/03/2026', item: 'Peixe',   quantidade: 15, custo: 500, fornecedor: 'Pesque Pague'  },
  { id: 2, data: '16/03/2026', item: 'Arroz',   quantidade: 20, custo: 150, fornecedor: 'Atacadão'      },
  { id: 3, data: '17/03/2026', item: 'Cerveja', quantidade: 40, custo: 220, fornecedor: 'Distribuidora' },
];
 
function EstoqueAlimenticio() {
  const [estoque, setEstoque] = useState(estoqueInicial);
  const [form, setForm] = useState({
    data: '', categoria: '', item: '', descricao: '',
    quantidade: '', unidade: '', custo: '', fornecedor: '',
  });
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleAdicionar = () => {
    if (!form.data || !form.item || !form.quantidade) return;
    const novo = {
      id: estoque.length + 1,
      data: form.data,
      item: form.item,
      quantidade: parseFloat(form.quantidade),
      custo: parseFloat(form.custo) || 0,
      fornecedor: form.fornecedor,
    };
    setEstoque([...estoque, novo]);
    setForm({ data: '', categoria: '', item: '', descricao: '', quantidade: '', unidade: '', custo: '', fornecedor: '' });
  };
 
  return (
    <div className="secao-card">
      <div className="secao-titulo">
        <svg width="28" height="20" viewBox="0 0 80 50" fill="none">
          <path d="M70 25 C55 10,20 5,5 25 C20 45,55 40,70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
          <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
        </svg>
        <h2>Lançamento de Estoque</h2>
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
          <label>Item</label>
          <input type="text" name="item" value={form.item} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Descrição</label>
          <input type="text" name="descricao" value={form.descricao} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Quantidade</label>
          <input type="number" name="quantidade" value={form.quantidade} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Unidade – ex: kg, litros, etc.</label>
          <input type="text" name="unidade" value={form.unidade} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Custo Total R$</label>
          <input type="number" name="custo" value={form.custo} onChange={handleChange} />
        </div>
 
        <div className="form-group">
          <label>Fornecedor</label>
          <input type="text" name="fornecedor" value={form.fornecedor} onChange={handleChange} />
        </div>
      </div>
 
      <button className="btn-adicionar verde" onClick={handleAdicionar}>Adicionar Item</button>
 
      <h3 className="tabela-titulo">Estoque Recente</h3>
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>ID</th><th>Data</th><th>Item</th><th>Quantidade</th><th>Custo total</th><th>Fornecedor</th>
          </tr>
        </thead>
        <tbody>
          {estoque.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.data}</td>
              <td>{e.item}</td>
              <td>{e.quantidade}</td>
              <td>R${e.custo.toFixed(2).replace('.', ',')}</td>
              <td>{e.fornecedor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
export default EstoqueAlimenticio;