import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1>Um refúgio de paz e natureza</h1>
        <p>
          Viva momentos inesquecíveis com sua família em meio à natureza. 
          Pesca esportiva, gastronomia de primeira e espaços para celebrar seus melhores momentos.
        </p>
        <button className="btn-reserva">Fazer Reserva</button>
      </div>
    </section>
  );
}

export default Hero;