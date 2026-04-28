import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import './GestaoReservas.css'; 

function GestaoReservas() {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // O useEffect faz o React buscar as reservas assim que o dono abre a tela
  useEffect(() => {
    buscarReservas();
  }, []);

  const buscarReservas = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .order('data_reserva', { ascending: true }); // Mostra as reservas mais próximas primeiro

    if (error) {
      console.error('Erro ao buscar reservas:', error);
    } else {
      setReservas(data);
    }
    setCarregando(false);
  };

  // Função para mudar o status no banco de dados
  const handleAprovar = async (id) => {
    const { error } = await supabase
      .from('reservas')
      .update({ status: 'Confirmada' })
      .eq('id', id);

    if (error) {
      alert('Erro ao aprovar reserva.');
    } else {
      alert('Reserva confirmada com sucesso!');
      buscarReservas(); // Atualiza a tabela automaticamente na tela
    }
  };

  // O "Botão Mágico" do WhatsApp
  const handleWhatsApp = (telefone, nome, data) => {
    // 1. Limpa o telefone, deixando só os números
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // 2. Monta a mensagem personalizada
    const mensagem = `Olá ${nome}, tudo bem? Vimos sua solicitação de reserva no Rei da Pesca para o dia ${data}. Podemos confirmar?`;
    
    // 3. Cria o link oficial da API do WhatsApp e abre em uma nova aba
    const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="gestao-reservas">
      <h2>Gestão de Reservas</h2>
      <p>Gerencie as solicitações dos seus clientes.</p>

      {carregando ? (
        <p>Carregando reservas...</p>
      ) : (
        <table className="tabela-reservas">
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Pessoas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                {/* Formatação simples da data (opcional, pode ser melhorada depois) */}
                <td>{reserva.data_reserva.split('-').reverse().join('/')}</td>
                <td>{reserva.horario_reserva}</td>
                <td>{reserva.nome_responsavel}</td>
                <td>{reserva.telefone}</td>
                <td>{reserva.numero_pessoas}</td>
                <td>
                  {/* Uma classe dinâmica para colorir o status no CSS */}
                  <span className={`status-badge ${reserva.status === 'Pendente' ? 'pendente' : 'confirmada'}`}>
                    {reserva.status}
                  </span>
                </td>
                <td className="acoes-botoes">
                  <button 
                    className="btn-whatsapp" 
                    onClick={() => handleWhatsApp(reserva.telefone, reserva.nome_responsavel, reserva.data_reserva)}
                  >
                    WhatsApp
                  </button>
                  
                  {/* Só mostra o botão de Aprovar se a reserva estiver Pendente */}
                  {reserva.status === 'Pendente' && (
                    <button 
                      className="btn-aprovar" 
                      onClick={() => handleAprovar(reserva.id)}
                    >
                      Aprovar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GestaoReservas;