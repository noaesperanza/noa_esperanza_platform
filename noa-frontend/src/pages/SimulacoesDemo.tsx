import { useState } from 'react';

const escutas = [
  {
    aluno_id: 'aluno001',
    etapa: 'Simulação 1',
    registro_aluno: 'Paciente relatou dor abdominal há 3 dias...',
    registro_noa: 'Paciente com dor abdominal crônica há 3 dias...',
  },
  {
    aluno_id: 'aluno002',
    etapa: 'Simulação 2',
    registro_aluno: 'Paciente refere tontura ao levantar.',
    registro_noa: 'Relato de hipotensão postural com episódios de tontura.',
  },
  {
    aluno_id: 'aluno003',
    etapa: 'Simulação 3',
    registro_aluno: 'Dor nas costas, principalmente à noite.',
    registro_noa: 'Dor lombar noturna associada a rigidez matinal.',
  },
];

export default function SimulacoesDemo() {
  const [mensagem, setMensagem] = useState<string>('');

  const emitirNFT = async (aluno: any) => {
    setMensagem('Processando emissão...');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/emitir-nft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
      });

      const data = await res.json();
      setMensagem(`✅ NFT emitido! Hash: ${data.hash} | Score: ${Math.round(data.score * 100)}%`);
    } catch (err) {
      setMensagem('❌ Erro ao emitir NFT.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-rose-700">Simulações – Emissão NFT (DEMO)</h2>
      {escutas.map((esc, i) => (
        <div key={i} className="border rounded-lg p-4 bg-white text-black shadow">
          <p><strong>Aluno ID:</strong> {esc.aluno_id}</p>
          <p><strong>Etapa:</strong> {esc.etapa}</p>
          <p><strong>Registro do Aluno:</strong> {esc.registro_aluno}</p>
          <p><strong>Registro da Nôa:</strong> {esc.registro_noa}</p>
          <button
            onClick={() => emitirNFT(esc)}
            className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            Emitir NFT (demo)
          </button>
        </div>
      ))}

      {mensagem && <p className="text-green-600 font-semibold mt-4">{mensagem}</p>}
    </div>
  );
}
