import React, { useState, useEffect } from 'react';
import './PainelSecao.css';
import { supabase } from '../services/supabase';

function EstoqueAlimenticio() {
  const [estoque, setEstoque] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({
    data: '', tipo_movimentacao: '', item: '',
    quantidade: '', unidade: '', custo: '', fornecedor: '',
  });

  // Busca o estoque do banco ao carregar a tela
  useEffect(() => {
    buscarEstoque();
  }, []);

  const buscarEstoque = async () => {
    const { data, error } = await supabase
      .from('estoque')
      .select('*')
      .order('data_movimentacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar estoque:', error);
    } else {
      setEstoque(data);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdicionar = async () => {
    // Validação simples
    if (!form.data || !form.item || !form.quantidade || !form.tipo_movimentacao) {
      alert("Preencha todos os campos obrigatórios (Data, Tipo, Item e Quantidade)!");
      return;
    }

    setCarregando(true);

    try {
      // Inserindo os dados na tabela 'estoque'
      const { error } = await supabase
        .from('estoque')
        .insert([
          {
            data_movimentacao: form.data,
            tipo_movimentacao: form.tipo_movimentacao,
            item: form.item,
            quantidade: parseFloat(form.quantidade),
            unidade: form.unidade,
            custo_total: parseFloat(form.custo) || 0,
            fornecedor: form.fornecedor,
          }
        ]);

      if (error) throw error;

      alert("Item registrado no estoque com sucesso!");
      
      // Limpa o formulário e atualiza a tabela
      setForm({ data: '', tipo_movimentacao: '', item: '', quantidade: '', unidade: '', custo: '', fornecedor: '' });
      buscarEstoque();
      
    } catch (error) {
      console.error('Erro ao inserir no estoque:', error);
      alert("Erro ao salvar no banco de dados.");
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
        <h2>Lançamento de Estoque</h2>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Data *</label>
          <div className="input-icon-wrap">
            <input type="date" name="data" value={form.data} onChange={handleChange} />
            <span className="campo-icone">📅</span>
          </div>
        </div>

        <div className="form-group">
          <label>Tipo (Entrada / Saída) *</label>
          <input 
            type="text" 
            name="tipo_movimentacao" 
            placeholder="Ex: Entrada" 
            value={form.tipo_movimentacao} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Item *</label>
          <input 
            type="text" 
            name="item" 
            placeholder="Ex: Tilápia, Cerveja..."
            value={form.item} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Fornecedor</label>
          <input 
            type="text" 
            name="fornecedor" 
            placeholder="Nome da empresa"
            value={form.fornecedor} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Quantidade *</label>
          <input type="number" name="quantidade" value={form.quantidade} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Unidade</label>
          <input 
            type="text" 
            name="unidade" 
            placeholder="ex: kg, litros, fardos"
            value={form.unidade} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Custo Total R$</label>
          <input type="number" name="custo" value={form.custo} onChange={handleChange} />
        </div>
      </div>

      <button 
        className="btn-adicionar verde" 
        onClick={handleAdicionar}
        disabled={carregando}
      >
        {carregando ? 'Salvando...' : 'Adicionar Item'}
      </button>

      <h3 className="tabela-titulo">Movimentações Recentes</h3>
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Item</th>
            <th>Qtd</th>
            <th>Custo Total</th>
            <th>Fornecedor</th>
          </tr>
        </thead>
        <tbody>
          {estoque.length === 0 ? (
            <tr>
              <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Nenhum item registrado.</td>
            </tr>
          ) : (
            estoque.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.data_movimentacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>
                  <span style={{ 
                    color: e.tipo_movimentacao.toLowerCase() === 'saída' || e.tipo_movimentacao.toLowerCase() === 'saida' ? '#d9534f' : '#2d6a2d',
                    fontWeight: 'bold'
                  }}>
                    {e.tipo_movimentacao}
                  </span>
                </td>
                <td>{e.item}</td>
                <td>{e.quantidade} {e.unidade}</td>
                <td>{e.custo_total ? `R$ ${Number(e.custo_total).toFixed(2).replace('.', ',')}` : '-'}</td>
                <td>{e.fornecedor || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EstoqueAlimenticio;