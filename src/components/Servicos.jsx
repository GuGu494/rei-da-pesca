import React from 'react';
import './Servicos.css';

// Importando as imagens (verifique se os nomes batem com os que você salvou)
import imgRestaurante from '../assets/img-restaurante.jpg';
import imgEspaco from '../assets/img-espaco.jpg';
import imgPesca from '../assets/img-pesca.jpg';

function Servicos() {
  return (
    <section id="servicos" className="servicos-section">
      
      <div className="servicos-header">
        <h2>Nossos Serviços</h2>
        <p>Descubra tudo que preparamos para tornar sua experiência única</p>
      </div>

      <div className="cards-container">
        
        {/* Cartão 1: Restaurante */}
        <div className="card">
          <img src={imgRestaurante} alt="Restaurante" />
          <div className="card-content">
            <h3>Restaurante</h3>
            <p>Saboreie o melhor da culinária com peixes frescos pescados no dia. Cardápio variado com pratos preparados por chefs especializados.</p>
            <ul>
              <li>Tilápia assada e frita</li>
              <li>Pacu na brasa</li>
              <li>Pratos executivos</li>
            </ul>
          </div>
        </div>

        {/* Cartão 2: Locação e Espaço */}
        <div className="card">
          <img src={imgEspaco} alt="Locação e Espaço" />
          <div className="card-content">
            <h3>Locação e Espaço</h3>
            <p>Espaços amplos e acolhedores para seus eventos especiais. Aniversários, confraternizações e encontros inesquecíveis.</p>
            <ul>
              <li>Festas de aniversário</li>
              <li>Eventos corporativos</li>
              <li>Confraternizações</li>
            </ul>
          </div>
        </div>

        {/* Cartão 3: Lazer e Pesca */}
        <div className="card">
          <img src={imgPesca} alt="Lazer e Pesca" />
          <div className="card-content">
            <h3>Lazer e Pesca</h3>
            <p>Pesque e relaxe em um ambiente natural preservado. Equipamentos disponíveis e assistência para iniciantes.</p>
            <ul>
              <li>Lagos bem cuidados</li>
              <li>Aluguel de equipamentos</li>
              <li>Área de lazer para crianças</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Servicos;