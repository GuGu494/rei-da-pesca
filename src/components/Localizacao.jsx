import React from 'react';
import { Link } from 'react-router-dom';
import './Localizacao.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram } from 'react-icons/fa';
 
function Localizacao() {
  return (
    <section id="localizacao" className="localizacao-section">
      <div className="localizacao-grid">
 
        {/* Coluna da Esquerda: Informações */}
        <div className="info-col">
          <h2>Rei da Pesca</h2>
 
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <strong>Endereço</strong>
              <p>Núcleo Rural - Pte. Alta Norte (Gama)</p>
              <p>Brasília - DF, 72427-010</p>
            </div>
          </div>
 
          <div className="info-item">
            <FaPhoneAlt className="info-icon" />
            <div>
              <strong>Telefone</strong>
              <p>(61) 99206-1381</p>
            </div>
          </div>
 
          <div className="info-item">
            <FaInstagram className="info-icon" />
            <div>
              <strong>Instagram</strong>
              <p>@pesquepagueflamboyant</p>
            </div>
          </div>
 
          <div className="horario-funcionamento">
            <strong>Em pleno funcionamento desde 1998</strong>
            <strong>Horário de Funcionamento:</strong>
            <p>Sábados, Domingos e Feriados - 9:00 às 17:00h</p>
          </div>
 
          {/* ✅ Link para a tela de login */}
          <Link to="/login" className="link-admin">Acesso administrativo</Link>
        </div>
 
        {/* Coluna da Direita: Mapa */}
        <div className="map-col">
          <h3>Localização</h3>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.653585915223!2d-48.08345552403108!3d-15.979456884687146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935bd52b2e854319%3A0x939775f4d82d399!2sCentro%20de%20Lazer%20Flamboyant%20Pesque%20Pague!5e0!3m2!1spt-BR!2sbr!4v1774554918489!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Localização"
            ></iframe>
          </div>
        </div>
 
      </div>
 
      <div className="footer-bottom">
        <p>© 2026 Rei da Pesca. Todos os direitos reservados.</p>
      </div>
    </section>
  );
}
 
export default Localizacao;