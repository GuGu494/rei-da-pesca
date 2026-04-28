import React, { useState, useEffect } from 'react';
import './PainelSecao.css';
import { supabase } from '../services/supabase';

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({ data: '', categoria: '', valor: '', descricao: '' });

  useEffect(() => {
    buscarGastos();
  }, []);

  const buscarGastos = async () => {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .order('data_gasto', { ascending: false });

    if (error) {
      console.error('Erro ao buscar gastos:', error);
    } else {
      setGastos(data);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Deseja mesmo apagar este registro de gasto?")) {
      const { error } = await supabase
        .from('gastos')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Erro ao excluir gasto.");
      } else {
        buscarGastos();
      }
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdicionar = async () => {
    if (!form.data || !form.categoria || !form.valor) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase
        .from('gastos')
        .insert([
          {
            data_gasto: form.data,
            categoria: form.categoria,
            descricao: form.descricao,
            valor_total: parseFloat(form.valor),
          }
        ]);

      if (error) throw error;

      alert("Gasto registrado com sucesso!");
      setForm({ data: '', categoria: '', valor: '', descricao: '' });
      buscarGastos();
      
    } catch (error) {
      console.error('Erro ao inserir gasto:', error);
      alert("Erro ao salvar gasto no banco.");
    } finally {
      setCarregando(false);
    }
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
          <input type="text" name="categoria" placeholder="Ex: Energia..." value={form.categoria} onChange={handleChange} />
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

      <button className="btn-adicionar vermelho" onClick={handleAdicionar} disabled={carregando}>
        {carregando ? 'Salvando...' : 'Adicionar Gasto'}
      </button>

      <h3 className="tabela-titulo">Gastos Recentes</h3>
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>ID</th><th>Data</th><th>Categoria</th><th>Descrição</th><th>Valor</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {gastos.length === 0 ? (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Nenhum gasto registrado.</td></tr>
          ) : (
            gastos.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{new Date(g.data_gasto).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>{g.categoria}</td>
                <td>{g.descricao}</td>
                <td style={{ color: '#d9534f', fontWeight: 'bold' }}>- R$ {Number(g.valor_total).toFixed(2).replace('.', ',')}</td>
                <td>
                  <button onClick={() => handleExcluir(g.id)} style={{ backgroundColor: '#d9534f', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Gastos;