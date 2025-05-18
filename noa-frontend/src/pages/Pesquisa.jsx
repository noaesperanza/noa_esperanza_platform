import { useState, useEffect } from "react";

export default function Pesquisa() {
  const [codigo, setCodigo] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [kpis, setKpis] = useState([]);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");

  const buscarKPIs = async () => {
    const res = await fetch("http://localhost:8000/kpis");
    const data = await res.json();
    setKpis(data.kpis);
  };

  const perguntarGPT = async () => {
    const res = await fetch("http://localhost:8000/teste_ia/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fala: pergunta })
    });
    const data = await res.json();
    setResposta(data.resposta_ia);
  };

  useEffect(() => {
    if (confirmado) buscarKPIs();
  }, [confirmado]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-rose-600">GPT de Pesquisa</h2>

      {!confirmado && (
        <div className="space-x-2">
          <input
            type="text"
            placeholder="Digite seu código NFT"
            className="border p-2"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button onClick={() => setConfirmado(true)} className="bg-rose-600 text-white px-4 py-2">
            Confirmar
          </button>
        </div>
      )}

      {confirmado && (
        <>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">📊 Indicadores da sua base</h3>
            <ul>
              {kpis.map((k, i) => (
                <li key={i}>Eixo: {k.eixo} — Total: {k.total}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">💬 Pergunte ao GPT de Pesquisa</h3>
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              className="w-full border p-2 mb-2"
              placeholder="Ex: Qual é o eixo com mais entradas?"
            />
            <button onClick={perguntarGPT} className="bg-green-700 text-white px-4 py-2">
              Perguntar
            </button>
            {resposta && (
              <div className="mt-4 bg-gray-100 p-2 rounded">
                <strong>Nôa:</strong> {resposta}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
