import React from 'react';
import './Header.css';
import { FaWhatsapp } from 'react-icons/fa';

function Header() {
  return (
    <header className="header-container">
      <div className="logo">
        <svg width="60" height="40" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 25 C55 10, 20 5, 5 25 C20 45, 55 40, 70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
          <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
        </svg>
        <span className="logo-text">Rei da Pesca</span>
      </div>
      
      <nav className="nav-links">
        <a href="#servicos">Serviços</a>
        <a href="#eventos">Eventos</a>
        <a href="#localizacao">Localização</a>
      </nav>
      
      <div className="whatsapp-btn-container">
        {/* Usamos a tag <a> para fazer o link abrir */}
        <a 
          href="https://wa.me/5561999999999?text=Olá!%20Estava%20no%20site%20do%20Rei%20da%20Pesca%20e%20gostaria%20de%20mais%20informações." 
          className="btn-whatsapp"
          target="_blank" // Abre em nova aba
          rel="noopener noreferrer" // Segurança extra para links externos
        >
          {/* 2. COLOCAMOS O ÍCONE AQUI */}
          <FaWhatsapp className="whatsapp-icon" />
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}

export default Header;