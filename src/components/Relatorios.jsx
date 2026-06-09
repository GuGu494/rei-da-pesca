import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './PainelSecao.css'; // Utilizando o CSS padrão do sistema

function Relatorios() {
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [gerando, setGerando] = useState(false);

  const gerarRelatorio = async () => {
    if (!mes || !ano) {
      alert("Por favor, informe o Mês e o Ano.");
      return;
    }
    
    setGerando(true);
    try {
      const mesFormatado = mes.padStart(2, '0');
      const prefixoData = `${ano}-${mesFormatado}`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataInicio = `${prefixoData}-01`;
      const dataFim = `${prefixoData}-${ultimoDia.toString().padStart(2, '0')}`;

      // 1. Busca de Dados
      const { data: vendas, error: errVendas } = await supabase.from('vendas').select('*').gte('data_venda', dataInicio).lte('data_venda', dataFim);
      const { data: gastos, error: errGastos } = await supabase.from('gastos').select('*').gte('data_gasto', dataInicio).lte('data_gasto', dataFim);
      const { data: estoque, error: errEstoque } = await supabase.from('estoque').select('*').gte('data_movimentacao', dataInicio).lte('data_movimentacao', dataFim);

      if (errVendas || errGastos || errEstoque) {
        console.error("Supabase Error:", errVendas || errGastos || errEstoque);
      }

      const vendasFiltradas = vendas || [];
      const gastosFiltrados = gastos || [];
      const estoqueFiltrado = estoque || [];

      // 2. Matemática Financeira (Baseada na regra do Dashboard)
      const totalReceitas = vendasFiltradas.reduce((acc, curr) => acc + Number(curr.valor_total || 0), 0);
      
      const despesasDiretas = gastosFiltrados.reduce((acc, curr) => acc + Number(curr.valor_total || 0), 0);
      const despesasEstoque = estoqueFiltrado
        .filter(e => e.tipo_movimentacao.toLowerCase().trim() === 'entrada')
        .reduce((acc, curr) => acc + Number(curr.custo_total || 0), 0);
      
      const totalDespesas = despesasDiretas + despesasEstoque;
      const lucroLiquidoReal = totalReceitas - totalDespesas;

      // 3. Geração do PDF
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.setTextColor(26, 26, 46); // Cor base do sistema
      doc.text("Relatório de Fechamento - Rei da Pesca", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(85, 85, 85);
      doc.text(`Período de Referência: ${mesFormatado}/${ano}`, 14, 30);
      
      // Resumo Financeiro
      doc.setFontSize(13);
      doc.setTextColor(45, 106, 45); // Verde do projeto
      doc.text("Resumo Financeiro", 14, 45);
      
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      doc.text(`Total de Receitas: R$ ${totalReceitas.toFixed(2)}`, 14, 52);
      doc.text(`Total de Despesas: R$ ${totalDespesas.toFixed(2)}`, 14, 58);
      
      // Destaque Lucro
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      if (lucroLiquidoReal >= 0) {
        doc.setTextColor(45, 106, 45); // Verde
      } else {
        doc.setTextColor(192, 57, 43); // Vermelho
      }
      doc.text(`Lucro Líquido Real: R$ ${lucroLiquidoReal.toFixed(2)}`, 14, 66);
      
      doc.setFont(undefined, 'normal');

      // Tabela de Vendas (Receitas)
      const vendasRows = vendasFiltradas.map(v => {
        const textoDescricao = v.descricao ? `${v.servico} - ${v.descricao}` : (v.servico || 'Venda/Ingresso');
        return [
          v.data_venda,
          textoDescricao,
          v.quantidade_pessoas || 1,
          `R$ ${Number(v.valor_total).toFixed(2)}`
        ];
      });

      autoTable(doc, {
        startY: 76,
        head: [['Data', 'Descrição', 'Qtd. Pessoas', 'Valor Total']],
        body: vendasRows,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [45, 106, 45] }, // Verde do projeto
        didDrawPage: function (data) {
          doc.setFontSize(11);
          doc.setTextColor(26, 26, 46);
          doc.text("Extrato de Vendas (Receitas)", 14, data.settings.startY - 4);
        }
      });

      // Tabela de Despesas/Compras
      const gastosRows = gastosFiltrados.map(g => {
        const textoDescricao = g.descricao ? `${g.categoria} - ${g.descricao}` : (g.categoria || 'Despesa Geral');
        return [
          g.data_gasto,
          textoDescricao,
          `R$ ${Number(g.valor_total).toFixed(2)}`
        ];
      });
      
      const estoqueRows = estoqueFiltrado
        .filter(e => e.tipo_movimentacao.toLowerCase().trim() === 'entrada')
        .map(e => [
          e.data_movimentacao,
          `Compra Estoque: ${e.item}`,
          `R$ ${Number(e.custo_total).toFixed(2)}`
        ]);

      // Unir as duas fontes de despesas e ordenar por data
      const despesasRows = [...gastosRows, ...estoqueRows].sort((a, b) => a[0].localeCompare(b[0]));

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        head: [['Data', 'Descrição', 'Valor Total']],
        body: despesasRows,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [192, 57, 43] }, // Vermelho
        didDrawPage: function (data) {
          doc.setFontSize(11);
          doc.setTextColor(26, 26, 46);
          doc.text("Extrato de Despesas e Compras de Estoque", 14, data.settings.startY - 4);
        }
      });

      doc.save(`Relatorio_Fechamento_${prefixoData}.pdf`);

    } catch (error) {
      console.error("Erro na geração do relatório:", error);
      alert("Ocorreu um erro ao gerar o relatório. Verifique o console.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="secao-card">
      <div className="secao-titulo">
        <span style={{ fontSize: '1.6rem' }}>📄</span>
        <h2>Exportação Financeira</h2>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Mês</label>
          <select value={mes} onChange={(e) => setMes(e.target.value)}>
            <option value="">Selecione o Mês</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>
        <div className="form-group">
          <label>Ano</label>
          <input 
            type="number" 
            value={ano} 
            onChange={(e) => setAno(e.target.value)} 
            placeholder="Ex: 2026" 
          />
        </div>
        
        <div className="form-group span-full" style={{ marginTop: '10px' }}>
          <button 
            className="btn-adicionar verde" 
            onClick={gerarRelatorio} 
            disabled={gerando}
            style={{ width: 'auto', padding: '14px 28px', alignSelf: 'flex-start' }}
          >
            {gerando ? "Processando e Gerando PDF..." : "Gerar Relatório em PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
