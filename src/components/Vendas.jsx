import React, { useState, useEffect } from 'react';
import './PainelSecao.css';
import { supabase } from '../services/supabase';

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({ 
    data: '', 
    servico: '', 
    valor: '', 
    descricao: '',
    pessoas: '' 
  });

  useEffect(() => {
    buscarVendas();
  }, []);

  const buscarVendas = async () => {
    const { data, error } = await supabase
      .from('vendas')
      .select('*')
      .order('data_venda', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vendas:', error);
    } else {
      setVendas(data);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      const { error } = await supabase
        .from('vendas')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Erro ao excluir venda.");
      } else {
        buscarVendas();
      }
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdicionar = async () => {
    if (!form.data || !form.servico || !form.valor || !form.pessoas) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase
        .from('vendas')
        .insert([
          {
            data_venda: form.data,
            servico: form.servico,
            descricao: form.descricao,
            valor_total: parseFloat(form.valor),
            quantidade_pessoas: parseInt(form.pessoas)
          }
        ]);

      if (error) throw error;

      alert("Venda registrada com sucesso!");
      setForm({ data: '', servico: '', valor: '', descricao: '', pessoas: '' });
      buscarVendas();
      
    } catch (error) {
      console.error('Erro ao inserir venda:', error);
      alert("Erro ao salvar venda no banco.");
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
        <h2>Lançamento de Vendas</h2>
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
          <label>Serviço</label>
          <input type="text" name="servico" placeholder="Ex: Aluguel de Vara..." value={form.servico} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Valor Total</label>
          <input type="number" name="valor" value={form.valor} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Quantidade de Pessoas</label>
          <input type="number" name="pessoas" value={form.pessoas} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <input type="text" name="descricao" value={form.descricao} onChange={handleChange} />
        </div>
      </div>

      <button className="btn-adicionar verde" onClick={handleAdicionar} disabled={carregando}>
        {carregando ? 'Salvando...' : 'Adicionar Venda'}
      </button>

      <h3 className="tabela-titulo">Vendas Recentes</h3>
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>ID</th><th>Data</th><th>Serviço</th><th>Pessoas</th><th>Valor</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendas.length === 0 ? (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Nenhuma venda registrada.</td></tr>
          ) : (
            vendas.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{new Date(v.data_venda).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>{v.servico}</td>
                <td>{v.quantidade_pessoas}</td>
                <td>R$ {Number(v.valor_total).toFixed(2).replace('.', ',')}</td>
                <td>
                  <button onClick={() => handleExcluir(v.id)} style={{ backgroundColor: '#d9534f', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Vendas;