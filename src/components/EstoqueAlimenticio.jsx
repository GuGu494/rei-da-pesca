import React, { useState, useEffect } from 'react';
import './PainelSecao.css';
import { supabase } from '../services/supabase';

function EstoqueAlimenticio() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [saldosAtuais, setSaldosAtuais] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({
    data: '', tipo_movimentacao: '', item: '',
    quantidade: '', unidade: '', custo: '', fornecedor: '',
  });

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
      setMovimentacoes(data || []);
      processarSaldos(data || []);
    }
  };

  const processarSaldos = (lista) => {
    const saldos = {};
    
    // Passa do mais antigo para o mais recente para consolidar o saldo
    [...lista].reverse().forEach((mov) => {
      const nomeItem = mov.item.toLowerCase().trim();
      const qtd = Number(mov.quantidade) || 0;
      const tipo = mov.tipo_movimentacao.toLowerCase().trim();

      if (!saldos[nomeItem]) {
        saldos[nomeItem] = { nome: mov.item, quantidade: 0, unidade: mov.unidade };
      }

      if (tipo === 'entrada') {
        saldos[nomeItem].quantidade += qtd;
      } else if (tipo === 'saída' || tipo === 'saida') {
        saldos[nomeItem].quantidade -= qtd;
      }
    });

    setSaldosAtuais(saldos);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdicionar = async () => {
    if (!form.data || !form.item || !form.quantidade || !form.tipo_movimentacao) {
      alert("Preencha todos os campos obrigatórios (Data, Tipo, Item e Quantidade)!");
      return;
    }

    setCarregando(true);

    try {
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

      alert("Movimentação registrada com sucesso!");
      
      setForm({ data: '', tipo_movimentacao: '', item: '', quantidade: '', unidade: '', custo: '', fornecedor: '' });
      buscarEstoque();
      
    } catch (error) {
      console.error('Erro ao inserir no estoque:', error);
      alert("Erro ao salvar no banco de dados.");
    } finally {
      setCarregando(false);
    }
  };

  // ====== FUNÇÃO NOVA: EXCLUIR MOVIMENTAÇÃO ======
  const handleExcluir = async (id, nomeItem) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir a movimentação de "${nomeItem}"? O saldo atual será recalculado.`);
    
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert("Movimentação excluída com sucesso!");
      buscarEstoque(); // Atualiza a lista e recalcula o saldo automaticamente
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      alert("Erro ao excluir o registro do banco de dados.");
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

      {/* ... (O restante do formulário continua igual) ... */}
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
          <input type="text" name="tipo_movimentacao" placeholder="Ex: Entrada ou Saída" value={form.tipo_movimentacao} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Item *</label>
          <input type="text" name="item" placeholder="Ex: Tilápia, Cerveja..." value={form.item} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Fornecedor</label>
          <input type="text" name="fornecedor" placeholder="Nome da empresa" value={form.fornecedor} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Quantidade *</label>
          <input type="number" name="quantidade" value={form.quantidade} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Unidade</label>
          <input type="text" name="unidade" placeholder="ex: kg, litros, fardos" value={form.unidade} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Custo Total R$</label>
          <input type="number" name="custo" value={form.custo} onChange={handleChange} />
        </div>
      </div>

      <button className="btn-adicionar verde" onClick={handleAdicionar} disabled={carregando}>
        {carregando ? 'Salvando...' : 'Adicionar Movimentação'}
      </button>

      {/* TABELA DE SALDO CONSOLIDADO REAL */}
      <h3 className="tabela-titulo" style={{ marginTop: '30px', color: '#2d6a2d' }}>📋 Saldo Atual em Estoque Real</h3>
      <table className="painel-tabela" style={{ marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Saldo Atual Disponível</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(saldosAtuais).length === 0 ? (
            <tr><td colSpan="3" style={{textAlign: 'center', padding: '15px'}}>Nenhum produto em estoque.</td></tr>
          ) : (
            Object.values(saldosAtuais).map((prod, idx) => {
              const IsCritico = prod.quantidade <= 5;
              return (
                <tr key={idx} style={IsCritico ? { backgroundColor: '#fff5f5' } : {}}>
                  <td style={{ fontWeight: '600' }}>{prod.nome}</td>
                  <td style={IsCritico ? { color: '#c0392b', fontWeight: 'bold' } : { color: '#2d6a2d', fontWeight: 'bold' }}>
                    {prod.quantidade} {prod.unidade || 'unid.'}
                  </td>
                  <td>
                    {IsCritico ? (
                      <span style={{ color: '#c0392b', fontWeight: 'bold' }}>⚠️ ESTOQUE CRÍTICO (REPOR)</span>
                    ) : (
                      <span style={{ color: '#2d6a2d' }}> Ok</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* TABELA DE HISTÓRICO - AGORA COM COLUNA DE EXCLUIR */}
      <h3 className="tabela-titulo">Histórico de Movimentações (Entradas e Saídas)</h3>
      <table className="painel-tabela">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Item</th>
            <th>Qtd Lançada</th>
            <th>Custo Total</th>
            <th>Fornecedor</th>
            <th style={{ textAlign: 'center' }}>Ações</th> {/* Nova coluna */}
          </tr>
        </thead>
        <tbody>
          {movimentacoes.length === 0 ? (
            <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Nenhum registro.</td></tr>
          ) : (
            movimentacoes.map((e) => (
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
                {/* Botão da Lixeira */}
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleExcluir(e.id, e.item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      padding: '5px',
                      transition: 'transform 0.2s'
                    }}
                    title="Excluir movimentação"
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EstoqueAlimenticio;