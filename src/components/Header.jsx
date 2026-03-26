import React from 'react';
import './Header.css';
import logo from '../assets/logo.jpg'; 

// 1. IMPORTANTE: Importamos o ícone aqui
import { FaWhatsapp } from 'react-icons/fa';

function Header() {
  return (
    <header className="header-container">
      <div className="logo">
        <img src={logo} alt="Rei da Pesca" />
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