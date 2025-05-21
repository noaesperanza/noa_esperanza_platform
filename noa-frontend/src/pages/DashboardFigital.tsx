import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = ['#C026D3', '#3B82F6', '#10B981'];

type KPI = {
  tipo: 'clinico' | 'ensino' | 'administrativo' | string;
};

type KPIAgrupado = Record<string, number>;

export default function DashboardFigital() {
  const [resposta, setResposta] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [kpis, setKpis] = useState<KPI[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/kpis/simulacoes`)
      .then(res => res.json())
      .then(data => setKpis(data.kpis || []));
  }, []);

  const enviarParaNoa = async (e: React.FormEvent) => {
    e.preventDefault();
    setResposta("⏳ Nôa está pensando...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'dashboard_demo', mensagem })
      });
      const data = await res.json();
      setResposta(data.resposta || 'Sem resposta.');
      setMensagem('');
    } catch (err) {
      setResposta('❌ Erro ao contatar Nôa.');
    }
  };

  const agrupados: KPIAgrupado = kpis.reduce((acc: KPIAgrupado, item: KPI) => {
    const tipo = item.tipo || 'Outro';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  const dataBar = Object.entries(agrupados).map(([name, total]) => ({ name, total }));

  const dataPie = [
    { name: 'Clínico', value: agrupados['clinico'] || 0 },
    { name: 'Ensino', value: agrupados['ensino'] || 0 },
    { name: 'Admin', value: agrupados['administrativo'] || 0 }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold">Painel Figital – Simulações Nôa</h1>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-xl text-black">
            <h2 className="font-semibold mb-2">KPIs por Tipo</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataBar}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#C026D3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl text-black">
            <h2 className="font-semibold mb-2">Distribuição</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={dataPie} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {dataPie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-64 bg-zinc-900 flex flex-col items-center justify-center p-6 space-y-4 border-l border-zinc-700">
        <img src="/noa-symbol.png" alt="Nôa" className="w-20 h-20 rounded-full border border-white" />

        <button
          className="w-full border border-white text-white py-2 rounded hover:bg-white hover:text-black"
          onClick={() => setMensagem('Quero aprender com a Nôa.')}
        >
          Ensino
        </button>

        <button
          className="w-full border border-white text-white py-2 rounded hover:bg-white hover:text-black"
          onClick={() => setMensagem('Quero pesquisar com a Nôa.')}
        >
          Pesquisa
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-4 border-t border-zinc-700 flex flex-col items-center space-y-2">
        <form className="w-full max-w-3xl flex space-x-2" onSubmit={enviarParaNoa}>
          <input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua pergunta para Nôa..."
            className="flex-1 p-2 rounded bg-zinc-800 text-white border border-zinc-600"
          />
          <button
            type="submit"
            className="bg-fuchsia-700 text-white px-4 py-2 rounded hover:bg-fuchsia-800"
          >
            Enviar
          </button>
        </form>
        {resposta && <div className="text-white text-sm max-w-3xl text-center">{resposta}</div>}
      </div>
    </div>
  );
}
