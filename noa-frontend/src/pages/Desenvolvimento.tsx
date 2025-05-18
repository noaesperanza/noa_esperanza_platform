import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Desenvolvimento() {
  const [respostas, setRespostas] = useState({
    onde: '',
    quando: '',
    como: '',
    oqueMais: '',
    melhora: '',
    piora: ''
  })

  const navigate = useNavigate()
  const { atualizar } = useAvaliacao()

  const handleChange = (campo: string, valor: string) => {
    setRespostas({ ...respostas, [campo]: valor })
  }

  const tudoPreenchido = Object.values(respostas).every((v) => v.trim() !== '')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-amber-50 via-slate-100 to-rose-50 text-gray-800">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700 text-center">
          Vamos explorar sua queixa principal mais detalhadamente
        </h2>

        <div className="space-y-4">
          <CampoPergunta
            label="Onde você sente a queixa?"
            valor={respostas.onde}
            onChange={(v) => handleChange('onde', v)}
          />
          <CampoPergunta
            label="Quando começou?"
            valor={respostas.quando}
            onChange={(v) => handleChange('quando', v)}
          />
          <CampoPergunta
            label="Como é essa queixa?"
            valor={respostas.como}
            onChange={(v) => handleChange('como', v)}
          />
          <CampoPergunta
            label="O que mais você sente junto com essa queixa?"
            valor={respostas.oqueMais}
            onChange={(v) => handleChange('oqueMais', v)}
          />
          <CampoPergunta
            label="O que parece melhorar essa queixa?"
            valor={respostas.melhora}
            onChange={(v) => handleChange('melhora', v)}
          />
          <CampoPergunta
            label="O que parece piorar essa queixa?"
            valor={respostas.piora}
            onChange={(v) => handleChange('piora', v)}
          />
        </div>

        {tudoPreenchido && (
          <div className="text-center pt-6">
            <button
              onClick={() => {
                atualizar({ desenvolvimento: respostas })
                navigate('/pregressa')
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-xl shadow-md transition-all"
            >
              Continuar Avaliação
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CampoPergunta({
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
