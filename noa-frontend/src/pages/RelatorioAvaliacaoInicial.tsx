import { useAvaliacao } from '../hooks/useAvaliacao'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import SHA256 from 'crypto-js/sha256'

export default function RelatorioAvaliacaoInicial() {
  const { dados } = useAvaliacao()
  const relatorioRef = useRef<HTMLDivElement>(null)

  const gerarPDF = useReactToPrint({
    content: () => relatorioRef.current,
    documentTitle: `Relatorio_Avaliacao_${dados.nome || 'Paciente'}`,
    removeAfterPrint: true
  } as any) // 👈 Cast necessário para evitar erro TS

  return (
    <div className="min-h-screen bg-white p-8 text-gray-800">
      <div className="max-w-4xl mx-auto" ref={relatorioRef}>
        <h1 className="text-3xl font-bold text-center text-rose-600 mb-8">
          Relatório da Avaliação Clínica Inicial
        </h1>

        <p className="mb-4"><strong>Nome:</strong> {dados.nome}</p>

        <h2 className="text-xl font-semibold text-rose-500 mt-6 mb-2">Queixas</h2>
        <p><strong>Queixas relatadas:</strong> {dados.queixas?.join(', ')}</p>
        <p><strong>Queixa principal:</strong> {dados.queixaPrincipal}</p>

        <h2 className="text-xl font-semibold text-rose-500 mt-6 mb-2">Desenvolvimento da queixa</h2>
        <p><strong>Onde sente:</strong> {dados.desenvolvimento?.onde}</p>
        <p><strong>Quando começou:</strong> {dados.desenvolvimento?.quando}</p>
        <p><strong>Como é:</strong> {dados.desenvolvimento?.como}</p>
        <p><strong>O que mais sente:</strong> {dados.desenvolvimento?.oqueMais}</p>
        <p><strong>Melhora com:</strong> {dados.desenvolvimento?.melhora}</p>
        <p><strong>Piora com:</strong> {dados.desenvolvimento?.piora}</p>

        <h2 className="text-xl font-semibold text-rose-500 mt-6 mb-2">História pregressa</h2>
        <p>{dados.pregressa?.join(', ')}</p>

        <h2 className="text-xl font-semibold text-rose-500 mt-6 mb-2">História familiar</h2>
        <p><strong>Mãe:</strong> {dados.familiar?.mae?.join(', ')}</p>
        <p><strong>Pai:</strong> {dados.familiar?.pai?.join(', ')}</p>

        <h2 className="text-xl font-semibold text-rose-500 mt-6 mb-2">Hábitos</h2>
        <p>{dados.habitos?.join(', ')}</p>

        <h2 className="text-xl font-semibold text-rose-500 mt-6 mb-2">Alergias e Medicações</h2>
        <p><strong>Alergias:</strong> {dados.alergias}</p>
        <p><strong>Medicações regulares:</strong> {dados.regulares}</p>
        <p><strong>Medicações esporádicas:</strong> {dados.esporadicas}</p>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Hash SHA-256 do relatório:</p>
          <code className="break-words">{SHA256(JSON.stringify(dados)).toString()}</code>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={gerarPDF}
          className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-xl shadow-md transition-all"
        >
          Baixar relatório PDF
        </button>
      </div>
    </div>
  )
}
