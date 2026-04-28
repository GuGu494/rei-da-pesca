import React, { useState } from 'react';
import './Eventos.css';
import { supabase } from '../services/supabase';

function Eventos() {
  // Estados para capturar os dados do formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [duracao, setDuracao] = useState('');
  const [pessoas, setPessoas] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  // Estado para controlar o botão de loading
  const [carregando, setCarregando] = useState(false);

  // Função disparada ao clicar em "Fazer reserva"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // Inserindo os dados na tabela 'reservas'
      const { error } = await supabase
        .from('reservas')
        .insert([
          {
            nome_responsavel: nome,
            telefone: telefone,
            data_reserva: data,
            horario_reserva: horario,
            duracao: duracao,
            numero_pessoas: Number(pessoas),
            observacoes: observacoes,
            status: 'Pendente' // Define o status inicial
          }
        ]);

      if (error) {
        console.error("Erro ao salvar:", error);
        alert('Erro ao enviar a solicitação. Tente novamente.');
      } else {
        alert('Reserva solicitada com sucesso! Em breve entraremos em contato.');
        // Limpa os campos do formulário após o sucesso
        setNome('');
        setTelefone('');
        setData('');
        setHorario('');
        setDuracao('');
        setPessoas('');
        setObservacoes('');
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert('Ocorreu um erro no sistema.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section id="eventos" className="eventos-section">
      
      <div className="eventos-header">
        <h2>Reservas de Eventos</h2>
        <p>Para fazer eventos em nosso espaço, preencha o formulário abaixo</p>
      </div>

      <div className="form-container">
        {/* Adicionado o evento onSubmit no form */}
        <form className="reserva-form" onSubmit={handleSubmit}>
          
          <div className="form-grid">
            {/* Linha 1 */}
            <div className="input-group">
              <label>Nome Responsável *</label>
              <input 
                type="text" 
                placeholder="Seu nome completo" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required 
              />
            </div>
            <div className="input-group">
              <label>Telefone *</label>
              <input 
                type="tel" 
                placeholder="(00)0000-0000" 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required 
              />
            </div>

            {/* Linha 2 */}
            <div className="input-group">
              <label>Data da reserva *</label>
              <input 
                type="date" 
                value={data}
                onChange={(e) => setData(e.target.value)}
                required 
              />
            </div>
            <div className="input-group">
              <label>Horário da reserva *</label>
              <input 
                type="time" 
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required 
              />
            </div>

            {/* Linha 3 */}
            <div className="input-group">
              <label>Duração do Evento *</label>
              <input 
                type="text" 
                placeholder="Ex: 4 horas" 
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                required 
              />
            </div>
            <div className="input-group">
              <label>Número de Pessoas *</label>
              <input 
                type="number" 
                placeholder="Quantidade de Pessoas" 
                value={pessoas}
                onChange={(e) => setPessoas(e.target.value)}
                required 
              />
            </div>

            {/* Linha 4 */}
            <div className="input-group full-width">
              <label>Observações </label>
              <textarea 
                placeholder="Detalhes do evento" 
                rows="4" 
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn-submit-reserva" disabled={carregando}>
            {carregando ? 'Enviando...' : 'Fazer reserva'}
          </button>

        </form>
      </div>

    </section>
  );
}

export default Eventos;