import React from 'react';
import { useState, useEffect } from 'react';
import PainelDocumentos from './PainelDocumentos';

export default function PainelRicardo(): React.JSX.Element {
  const [mensagem, setMensagem] = useState<string>('');
  const [resposta, setResposta] = useState<string>('');
  const [imagem, setImagem] = useState<string | null>(null);

  const enviarMensagem = async () => {
    const res = await fetch('/api/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'ricardo.valenca', mensagem }),
    });
    const data = await res.json();
    setResposta(data.resposta);
  };

  useEffect(() => {
    fetch('/api/imagens/ricardo.valenca')
      .then(res => res.json())
      .then(data => {
        if (data.imagens && data.imagens.length > 0) {
          setImagem(data.imagens[0]);
        }
      });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-6 min-h-screen bg-gray-50">
      <div className="col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">Painel de Conversa com a Nôa</h1>
        <textarea
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          className="w-full h-32 p-4 border rounded"
          placeholder="Digite sua mensagem para análise"
        />
        <button
          onClick={enviarMensagem}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Enviar
        </button>
        {resposta && (
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Resposta gerada:</h2>
            <p>{resposta}</p>
          </div>
        )}

        {/* Painel de Documentos Enviados */}
        <PainelDocumentos userId="ricardo.valenca" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Slide gerado</h2>
        {imagem ? (
          <img src={imagem} alt="Slide" className="rounded shadow" />
        ) : (
          <p>Nenhuma imagem carregada ainda.</p>
        )}
      </div>
    </div>
  );
}
