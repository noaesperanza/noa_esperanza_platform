import React, { useState } from 'react';

const Chat = () => {
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarMensagem = async () => {
    setCarregando(true);
    setResposta('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'teste123',
          mensagem: mensagem,
        }),
      });

      const data = await response.json();
      setResposta(data.resposta || '⚠️ Erro: resposta vazia');
    } catch (erro) {
      setResposta('❌ Erro ao se comunicar com a Nôa.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Conversa com Nôa Esperanza</h1>
      <textarea
        rows={4}
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua pergunta..."
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <button onClick={enviarMensagem} disabled={carregando}>
        {carregando ? 'Enviando...' : 'Enviar'}
      </button>
      <div style={{ marginTop: '2rem', background: '#f1f1f1', padding: '1rem', borderRadius: '8px' }}>
        <strong>Resposta:</strong>
        <p>{resposta}</p>
      </div>
    </div>
  );
};

export default Chat;
