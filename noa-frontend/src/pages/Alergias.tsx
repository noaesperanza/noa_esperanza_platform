import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Alergias() {
  const [alergias, setAlergias] = useState('')
  const [regulares, setRegulares] = useState('')
  const [esporadicas, setEsporadicas] = useState('')
  const [finalizar, setFinalizar] = useState(false)

  const navigate = useNavigate()
  const { atualizar } = useAvaliacao()

  const tudoPreenchido = alergias && regulares && esporadicas

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-100 via-rose-50 to-amber-100 text-gray-800">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700 text-center">
          Alergias e Medicações
        </h2>

        <Campo
          label="Você tem alguma alergia?"
          valor={alergias}
          onChange={setAlergias}
        />
        <Campo
          label="Quais medicações você usa regularmente?"
          valor={regulares}
          onChange={setRegulares}
        />
        <Campo
          label="Quais usa de vez em quando, e por quê?"
          valor={esporadicas}
          onChange={setEsporadicas}
        />

        {tudoPreenchido && !finalizar && (
          <div className="text-center pt-6">
            <button
              onClick={() => setFinalizar(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-xl shadow-md transition-all"
            >
              Finalizar Avaliação Inicial
            </button>
          </div>
        )}

        {finalizar && (
          <div className="text-center space-y-4 pt-6">
            <p className="text-green-700 font-medium">
              ✅ Avaliação finalizada. Pronto para gerar o relatório?
            </p>
            <button
              onClick={() => {
                atualizar({ alergias, regulares, esporadicas })
                navigate('/relatorio')
              }}
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-xl shadow-md transition-all"
            >
              Gerar Relatório
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Campo({
  label,
  valor,
  onChange
}: {
  label: string
  valor: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
    </div>
  )
}
