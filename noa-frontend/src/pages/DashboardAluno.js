import { useState } from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export default function DashboardAluno() {
  const [alunoId, setAlunoId] = useState('');
  const [etapas, setEtapas] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarNFTs = async () => {
    setBuscado(false);
    setErro(null);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/verificar-nft/${alunoId}`);
      const dados = await resp.json();

      if (dados.possui_nft) {
        setEtapas(dados.etapas);
      } else {
        setEtapas([]);
      }

      setBuscado(true);
    } catch (e) {
      setErro('Erro ao buscar NFTs.');
    }
  };

  const gerarPDF = async () => {
    if (!alunoId || etapas.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("🧬 Jornada Clínica – Nôa Esperanza", 20, 20);
    doc.setFontSize(12);
    doc.text(`ID do Aluno: ${alunoId}`, 20, 30);
    doc.text(`Data de emissão: ${new Date().toLocaleString('pt-BR')}`, 20, 38);

    let y = 50;

    for (const etapa of etapas) {
      doc.setFont(undefined, 'bold');
      doc.text(`Etapa: ${etapa.etapa}`, 20, y);
      y += 8;
      doc.setFont(undefined, 'normal');
      doc.text(`Hash: ${etapa.hash}`, 20, y);
      y += 6;
      doc.text(`Data: ${new Date(etapa.data_emissao).toLocaleString('pt-BR')}`, 20, y);
      y += 6;

      const qrLink = `https://zora.co/collect/${etapa.hash}`;
      const qrDataUrl = await QRCode.toDataURL(qrLink);
      doc.addImage(qrDataUrl, 'PNG', 150, y - 18, 40, 40);
      y += 28;

      if (etapa.substitui_hash) {
        doc.setTextColor(150);
        doc.text(`↪️ Substitui: ${etapa.substitui_hash}`, 20, y);
        doc.setTextColor(0);
        y += 8;
      }

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`jornada_${alunoId}.pdf`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🎓 Painel do Aluno</h2>

      <div className="space-x-2 mb-4">
        <input
          type="text"
          placeholder="Digite seu ID de aluno"
          value={alunoId}
          onChange={(e) => setAlunoId(e.target.value)}
          className="border p-2"
        />
        <button onClick={buscarNFTs} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Buscar
        </button>
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

      {buscado && etapas.length === 0 && (
        <p className="text-gray-600">Nenhum NFT encontrado para este aluno.</p>
      )}

      {etapas.length > 0 && (
        <>
          <div className="bg-white shadow p-4 rounded space-y-3">
            {etapas.map((etapa, i) => (
              <div key={i} className="border-b pb-2">
                <p><strong>Etapa:</strong> {etapa.etapa}</p>
                <p><strong>Hash:</strong> {etapa.hash}</p>
                <p><strong>Data:</strong> {new Date(etapa.data_emissao).toLocaleString('pt-BR')}</p>
                {etapa.substitui_hash && (
                  <p className="text-sm text-gray-500">↪️ Substitui: {etapa.substitui_hash}</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={gerarPDF}
            className="mt-6 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            📄 Baixar PDF da Jornada
          </button>
        </>
      )}
    </div>
  );
}
