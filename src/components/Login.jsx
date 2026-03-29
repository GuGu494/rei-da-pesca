import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
 
function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
 
  const handleLogin = (e) => {
    e.preventDefault();
    // Credenciais simples — troque conforme necessário
    if (usuario === 'admin' && senha === 'admin123') {
      navigate('/dashboard');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };
 
  return (
    <div className="login-page">
      <div className="login-logo">
        {/* Ícone de peixe SVG inline */}
        <svg width="60" height="40" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 25 C55 10, 20 5, 5 25 C20 45, 55 40, 70 25Z" stroke="#2d6a2d" strokeWidth="3" fill="none"/>
          <path d="M70 25 L80 15 M70 25 L80 35" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="22" r="2.5" fill="#2d6a2d"/>
        </svg>
        <h1>Rei da Pesca</h1>
        <p>Painel Administrativo</p>
      </div>
 
      <div className="login-card">
        <h2>Fazer Login</h2>
 
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label htmlFor="usuario">Usuário</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="usuario"
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
          </div>
 
          <div className="login-field">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>
 
          {erro && <p className="login-erro">{erro}</p>}
 
          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
 
      <button className="voltar-site" onClick={() => navigate('/')}>
        ← Voltar ao site
      </button>
    </div>
  );
}
 
export default Login;