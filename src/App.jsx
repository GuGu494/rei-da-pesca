import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Servicos from './components/Servicos'; // Importe aqui!

function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Servicos /> {/* Coloque a tag aqui! */}
    </div>
  );
}

export default App;