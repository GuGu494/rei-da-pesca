import React from 'react';
import './Eventos.css';

function Eventos() {
  return (
    <section id="eventos" className="eventos-section">
      
      <div className="eventos-header">
        <h2>Reservas de Eventos</h2>
        <p>Para fazer eventos em nosso espaço, Preencha o formulário abaixo</p>
      </div>

      <div className="form-container">
        {/* Usamos a tag <form> que é a correta para formulários */}
        <form className="reserva-form">
          
          <div className="form-grid">
            {/* Linha 1 */}
            <div className="input-group">
              <label>Nome Responsável *</label>
              <input type="text" placeholder="Seu nome completo" required />
            </div>
            <div className="input-group">
              <label>Telefone *</label>
              <input type="tel" placeholder="(00)0000-0000" required />
            </div>

            {/* Linha 2 */}
            <div className="input-group">
              <label>Data da reserva *</label>
              <input type="date" required />
            </div>
            <div className="input-group">
              <label>Horário da reserva *</label>
              <input type="time" required />
            </div>

            {/* Linha 3 */}
            <div className="input-group">
              <label>Duração do Evento *</label>
              <input type="text" placeholder="Tempo de duração" required />
            </div>
            <div className="input-group">
              <label>Número de Pessoas *</label>
              <input type="number" placeholder="Quantidade de Pessoas" required />
            </div>

            {/* Linha 4 (Ocupa as duas colunas) */}
            <div className="input-group full-width">
              <label>Observações </label>
              <textarea placeholder="Detalhes do evento" rows="4" required></textarea>
            </div>
          </div>

          <button type="submit" className="btn-submit-reserva">Fazer reserva</button>

        </form>
      </div>

    </section>
  );
}

export default Eventos;