import { useState } from 'react';

export default function EmitirNFT() {
  const [alunoId, setAlunoId] = useState('');
  const [etapa, setEtapa] = useState('Teste de Nivelamento');
  const [registroAluno, setRegistroAluno] = useState('');
  const [registroNoa, setRegistroNoa] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const emitir = async () => {
    setCarregando(true);
    setResultado(null);

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/emitir-nft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aluno_id: alunoId,
          etapa: etapa,
          registro_aluno: registroAluno,
          registro_noa: registroNoa
        })
      });

      const data = await resp.json();
      setResultado(data);
    } catch (erro) {
      setResultado({ erro: 'Erro ao emitir NFT.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700">🎓 Emitir NFT por Desempenho Clínico</h2>

      <input
        type="text"
        placeholder="ID do Aluno"
        value={alunoId}
        onChange={(e) => setAlunoId(e.target.value)}
        className="w-full border p-2"
      />

      <textarea
        placeholder="Registro do Aluno"
        value={registroAluno}
        onChange={(e) => setRegistroAluno(e.target.value)}
        className="w-full border p-2 h-28"
      />

      <textarea
        placeholder="Registro da Nôa"
        value={registroNoa}
        onChange={(e) => setRegistroNoa(e.target.value)}
        className="w-full border p-2 h-28"
      />

      <button
        onClick={emitir}
        disabled={carregando}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {carregando ? 'Emitindo NFT...' : 'Emitir NFT'}
      </button>

      {resultado && (
        <div className="bg-gray-100 p-4 rounded shadow mt-4">
          {resultado.erro ? (
            <p className="text-red-600">{resultado.erro}</p>
          ) : (
            <>
              <p><strong>Resultado:</strong> {resultado.resultado ? '✅ Sucesso' : '❌ Não aprovado'}</p>
              <p><strong>Score:</strong> {Math.round(resultado.score * 100)}%</p>
              <p><strong>Hash NFT:</strong> {resultado.hash}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
