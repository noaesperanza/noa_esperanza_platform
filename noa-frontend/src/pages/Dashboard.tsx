import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useState } from 'react';

const dataBar = [
  { name: 'Semana 1', valor: 14 },
  { name: 'Semana 2', valor: 9 },
  { name: 'Semana 3', valor: 13 },
  { name: 'Semana 4', valor: 17 },
];

const dataPie = [
  { name: 'Ensino', value: 60 },
  { name: 'Pesquisa', value: 40 },
];

const COLORS = ['#C026D3', '#3B82F6'];

export default function Dashboard() {
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');

  const enviarParaNoa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensagem.trim()) {
      setResposta("⚠️ Por favor, digite uma pergunta.");
      return;
    }

    setResposta("⏳ Nôa está pensando...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "dashboard_demo",
          mensagem,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data?.resposta) {
        setResposta("🧠 Nôa: " + data.resposta);
      } else {
        setResposta("⚠️ Nôa não conseguiu responder. Tente mais tarde.");
      }

      setMensagem('');
    } catch (err) {
      console.error(err);
      setResposta("❌ Erro ao contatar Nôa.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white flex">
        {/* Painel central com gráficos */}
        <div className="flex-1 p-8 space-y-8">
          <h1 className="text-3xl font-bold text-white">Painel Figital – Nôa Esperanza</h1>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-4 text-black shadow">
              <h2 className="text-lg font-semibold mb-2">NFTs Emitidos por Semana</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataBar}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#C026D3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-4 text-black shadow">
              <h2 className="text-lg font-semibold mb-2">Distribuição</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataPie}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {dataPie.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar com avatar da Nôa e botões */}
        <div className="w-64 bg-zinc-900 flex flex-col items-center justify-center space-y-6 p-6 border-l border-zinc-700">
          <img
            src="/noa-symbol.png"
            alt="Nôa"
            className="w-24 h-24 rounded-full border-2 border-white"
          />

          <button className="w-full border border-white text-white py-2 rounded hover:bg-white hover:text-black transition">
            Ensino
          </button>

          <button className="w-full border border-white text-white py-2 rounded hover:bg-white hover:text-black transition">
            Pesquisa
          </button>
        </div>
      </div>

      {/* Escuta com a Nôa – fixo na base */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-4 border-t border-zinc-700 flex flex-col items-center space-y-2">
        <form
          className="w-full max-w-3xl flex space-x-2"
          onSubmit={enviarParaNoa}
        >
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua pergunta para Nôa..."
            className="flex-1 p-2 rounded bg-zinc-800 text-white border border-zinc-600"
          />
          <button
            type="submit"
            className="bg-fuchsia-700 text-white px-4 py-2 rounded hover:bg-fuchsia-800 transition"
          >
            Enviar
          </button>
        </form>
        <div className="text-white text-sm max-w-3xl text-center">{resposta}</div>
      </div>
    </>
  );
}
