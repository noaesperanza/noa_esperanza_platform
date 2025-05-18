// src/components/PainelLogs.tsx

import { useEffect, useState } from "react";

type LogItem = {
  id: number;
  endpoint: string;
  user_id: string;
  mensagem: string;
  resposta: string;
  status_code: number;
  criado_em: string;
};

export default function PainelLogs() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:10000/api/logs/")
      .then((res) => {
        if (!res.ok) throw new Error("Erro na resposta do servidor");
        return res.json();
      })
      .then(setLogs)
      .catch((e) => setErro("Erro ao carregar logs: " + e.message));
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">🧠 Logs GPT</h2>
      {erro && <div className="text-red-600 mb-4 font-semibold">{erro}</div>}

      {logs.length === 0 && !erro && (
        <p className="text-gray-500 italic">Nenhum log encontrado.</p>
      )}

      {logs.length > 0 && (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-indigo-100 text-indigo-800 font-medium">
              <tr>
                <th className="px-3 py-2 border">ID</th>
                <th className="px-3 py-2 border">Usuário</th>
                <th className="px-3 py-2 border">Mensagem</th>
                <th className="px-3 py-2 border">Resposta</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-indigo-50">
                  <td className="border px-3 py-2 text-center">{log.id}</td>
                  <td className="border px-3 py-2">{log.user_id}</td>
                  <td className="border px-3 py-2">{log.mensagem}</td>
                  <td className="border px-3 py-2">{log.resposta}</td>
                  <td
                    className={`border px-3 py-2 text-center font-bold ${
                      log.status_code === 200
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {log.status_code}
                  </td>
                  <td className="border px-3 py-2 text-gray-500">
                    {new Date(log.criado_em).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
