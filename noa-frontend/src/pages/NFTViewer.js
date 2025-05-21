import { useState } from 'react';

export default function NFTViewer() {
  const [alunoId, setAlunoId] = useState('');
  const [nfts, setNfts] = useState([]);
  const [novoNFT, setNovoNFT] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscar = async () => {
    setCarregando(true);
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/verificar-nft/${alunoId}`);
    const data = await resp.json();
    setNfts(data.etapas || []);
    setCarregando(false);
  };

  const refazerEtapa = async (etapa, registroAluno, registroNoa) => {
    setCarregando(true);
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/emitir-nft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aluno_id: alunoId,
        etapa: etapa + ' (Revisado)',
        registro_aluno: registroAluno,
        registro_noa: registroNoa
      })
    });
    const data = await resp.json();
    setNovoNFT(data);
    setCarregando(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">🧬 NFT Viewer da Jornada Clínica</h2>

      <div className="space-x-2">
        <input
          type="text"
          placeholder="ID do aluno"
          value={alunoId}
          onChange={(e) => setAlunoId(e.target.value)}
          className="border p-2"
        />
        <button onClick={buscar} className="bg-indigo-700 text-white px-4 py-2 rounded">
          Buscar NFTs
        </button>
      </div>

      {carregando && <p>🔄 Carregando...</p>}

      {nfts.length > 0 && (
        <div className="space-y-4">
          {nfts.map((nft, index) => (
            <div key={index} className="border p-4 rounded bg-white shadow">
              <p><strong>Etapa:</strong> {nft.etapa}</p>
              <p><strong>Hash:</strong> {nft.hash}</p>
              <p><strong>Data:</strong> {new Date(nft.data_emissao).toLocaleString('pt-BR')}</p>
              {/* Link futuro para Zora */}
              <a
                href={`https://zora.co/collect/${nft.hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Ver na Zora
              </a>
              <br />
              <button
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
                onClick={() => refazerEtapa(nft.etapa, 'Texto do aluno revisado...', 'Texto IA revisado...')}
              >
                Refazer Etapa
              </button>
            </div>
          ))}
        </div>
      )}

      {novoNFT && (
        <div className="mt-6 bg-green-100 p-4 rounded">
          <h3 className="font-semibold">✅ Novo NFT emitido</h3>
          <p><strong>Etapa:</strong> {novoNFT.hash}</p>
          <p><strong>Score:</strong> {Math.round(novoNFT.score * 100)}%</p>
        </div>
      )}
    </div>
  );
}
