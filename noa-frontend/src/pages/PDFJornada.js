import { useState } from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export default function PDFJornada() {
  const [alunoId, setAlunoId] = useState('');
  const [status, setStatus] = useState('');

  const gerarPDF = async () => {
    setStatus('🔄 Buscando dados...');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/verificar-nft/${alunoId}`);
    const data = await res.json();

    if (!data.possui_nft || data.etapas.length === 0) {
      setStatus('❌ Nenhum NFT encontrado para esse ID.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("🧬 Jornada Clínica – Nôa Esperanza", 20, 20);
    doc.setFontSize(12);
    doc.text(`ID do Aluno: ${alunoId}`, 20, 30);
    doc.text(`Data de emissão: ${new Date().toLocaleString('pt-BR')}`, 20, 38);

    let y = 50;

    for (const etapa of data.etapas) {
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
        doc.text(`Substitui NFT anterior: ${etapa.substitui_hash}`, 20, y);
        doc.setTextColor(0);
        y += 8;
      }

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`jornada_${alunoId}.pdf`);
    setStatus('✅ PDF gerado e salvo!');
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-green-700">📄 Exportar PDF da Jornada</h2>
      <input
        type="text"
        placeholder="ID do aluno"
        value={alunoId}
        onChange={(e) => setAlunoId(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        onClick={gerarPDF}
        className="bg-green-700 text-white px-4 py-2 rounded"
      >
        Gerar PDF
      </button>
      {status && <p className="mt-2 text-gray-700">{status}</p>}
    </div>
  );
}
