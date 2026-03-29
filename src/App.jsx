import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
 
// Páginas principais
import Header from './components/Header';
import Hero from './components/Hero';
import Servicos from './components/Servicos';
import Eventos from './components/Eventos';
import Localizacao from './components/Localizacao';
 
// Páginas do painel
import Login from './components/Login';
import Dashboard from './components/Dashboard';
 
// Página inicial (site público)
function Home() {
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
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;