import React from 'react';
import './Header.css';
// Supondo que você exportou a logo do Figma e salvou na pasta assets
import logo from '../assets/logo.jpg'; 

function Header() {
  return (
    <header className="header-container">
      <div className="logo">
        <img src={logo} alt="Rei da Pesca" />
      </div>
      
      <nav className="nav-links">
        <a href="#servicos">Serviços</a>
        <a href="#eventos">Eventos</a>
        <a href="#localizacao">Localização</a>
      </nav>
      
      <div className="whatsapp-btn-container">
        <button className="btn-whatsapp">
          {/* Aqui você pode usar um ícone do react-icons depois */}
          Falar no WhatsApp
        </button>
      </div>
    </header>
  );
}

export default Header;