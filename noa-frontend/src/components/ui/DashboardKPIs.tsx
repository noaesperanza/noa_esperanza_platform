// src/components/ui/DashboardKPIs.tsx

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

type LogKPI = {
  id_simulacao: number;
  tempo_resposta: number;
  coerencia: number;
  ritmo: number;
};

export default function DashboardKPIs() {
  const [dados, setDados] = useState<LogKPI[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:10000/api/kpis/simulacoes/")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar KPIs de simulação");
        return res.json();
      })
      .then(setDados)
      .catch((e) => setErro("Erro ao carregar dados de KPIs: " + e.message));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        🎧 Painel de Escuta Validada por Simulação
      </h2>

      {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id_simulacao" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="tempo_resposta"
            stroke="#7c3aed"
            strokeWidth={2}
            name="⏱ Tempo de Resposta"
          />
          <Line
            type="monotone"
            dataKey="coerencia"
            stroke="#10b981"
            strokeWidth={2}
            name="🧠 Coerência"
          />
          <Line
            type="monotone"
            dataKey="ritmo"
            stroke="#f59e0b"
            strokeWidth={2}
            name="🎵 Ritmo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
