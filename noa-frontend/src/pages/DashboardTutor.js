import { useState } from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export default function DashboardTutor() {
  const [alunoId, setAlunoId] = useState('');
  const [nfts, setNfts] = useState([]);
  const [novo, setNovo] = useState(null);
  const [erro, setErro] = useState(null);

  const buscar = async () => {
    setErro(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/verificar-nft/${alunoId}`);
      const data = await res.json();
      setNfts(data.etapas || []);
    } catch {
      setErro("Erro ao buscar NFTs.");
    }
  };

  const refazer = async (etapa, hashOriginal) => {
    const alunoTexto = prompt("Novo registro do aluno:");
    const noaTexto = prompt("Novo registro da Nôa:");

    if (!alunoTexto || !noaTexto) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/refazer-etapa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aluno_id: alunoId,
        etapa_anterior: etapa,
        novo_registro_aluno: alunoTexto,
        novo_registro_noa: noaTexto,
        hash_substituido: hashOriginal
      })
    });

    const data = await res.json();
    setNovo(data);
  };

  const gerarPDF = async () => {
    if (!alunoId || nfts.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("📋 Jornada Clínica – Nôa Esperanza", 20, 20);
    doc.setFontSize(12);
    doc.text(`Aluno: ${alunoId}`, 20, 30);
    doc.text(`Emitido em: ${new Date().toLocaleString('pt-BR')}`, 20, 38);

    let y = 50;

    for (const etapa of nfts) {
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-orange-700">📋 Painel do Tutor Clínico</h2>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="ID do aluno"
          value={alunoId}
          onChange={(e) => setAlunoId(e.target.value)}
          className="border p-2 flex-1"
        />
        <button onClick={buscar} className="bg-orange-700 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

      {nfts.length > 0 && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border-b pb-2">
              <p><strong>Etapa:</strong> {nft.etapa}</p>
              <p><strong>Hash:</strong> {nft.hash}</p>
              <p><strong>Data:</strong> {new Date(nft.data_emissao).toLocaleString()}</p>
              {nft.substitui_hash && (
                <p className="text-sm text-gray-500">↪️ Substitui: {nft.substitui_hash}</p>
              )}
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => refazer(nft.etapa, nft.hash)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Refazer Etapa
                </button>
                <button
                  onClick={gerarPDF}
                  className="bg-green-700 text-white px-3 py-1 rounded"
                >
                  📄 PDF da Jornada
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {novo && (
        <div className="mt-6 bg-green-100 p-4 rounded">
          <p><strong>✅ Nova Etapa Emitida:</strong></p>
          <p><strong>Hash:</strong> {novo.hash_novo}</p>
          <p><strong>Score:</strong> {Math.round(novo.score * 100)}%</p>
        </div>
      )}
    </div>
  );
}
