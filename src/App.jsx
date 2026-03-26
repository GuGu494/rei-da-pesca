import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Servicos from './components/Servicos';
import Eventos from './components/Eventos'; 
import Localizacao from './components/Localizacao';

function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Servicos />
      <Eventos /> 
      <Localizacao /> 
    </div>
  );
}

export default App;