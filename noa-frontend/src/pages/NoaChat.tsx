import { useState } from 'react';

export default function NoaChat() {
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');
  const [status, setStatus] = useState<'idle' | 'carregando' | 'erro'>('idle');

  const enviar = async () => {
    if (!mensagem.trim()) return;
    setStatus('carregando');
    setResposta('');

    try {
      const respostaServidor = await fetch(`https://plataforma-noa-backend.onrender.com/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'ricardo_valenca_fundador',
          mensagem: mensagem.trim(),
        }),
      });

      const dados = await respostaServidor.json();
      if (dados?.resposta) {
        setResposta(dados.resposta);
      } else {
        setResposta('❌ Resposta vazia.');
      }
    } catch (err) {
      setResposta('⚠️ Erro ao conectar com a Nôa.');
    } finally {
      setStatus('idle');
      setMensagem('');
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🧠 Chat com Nôa Esperanza</h1>

      <textarea
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua pergunta para a Nôa..."
        className="w-full max-w-xl h-28 p-4 border border-zinc-700 rounded bg-zinc-900 text-white mb-4"
      />

      <button
        onClick={enviar}
        disabled={status === 'carregando'}
        className="bg-fuchsia-700 px-6 py-2 rounded text-white hover:bg-fuchsia-800 disabled:opacity-50"
      >
        {status === 'carregando' ? 'Enviando...' : 'Falar com a Nôa'}
      </button>

      {resposta && (
        <div className="mt-6 max-w-xl p-4 bg-zinc-800 text-white rounded shadow">
          <strong>Resposta:</strong>
          <p className="mt-2 whitespace-pre-wrap">{resposta}</p>
        </div>
      )}
    </div>
  );
}
