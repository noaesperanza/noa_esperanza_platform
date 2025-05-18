// src/pages/Familiar.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Familiar() {
  const [mae, setMae] = useState<string[]>([])
  const [pai, setPai] = useState<string[]>([])
  const [textoMae, setTextoMae] = useState('')
  const [textoPai, setTextoPai] = useState('')

  const navigate = useNavigate()
  const { atualizar } = useAvaliacao()

  const adicionar = (
    texto: string,
    setTexto: (v: string) => void,
    lista: string[],
    setLista: (v: string[]) => void
  ) => {
    if (texto.trim()) {
      setLista([...lista, texto.trim()])
      setTexto('')
    }
  }

  const tudoPreenchido = mae.length > 0 || pai.length > 0

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-amber-50 via-slate-100 to-rose-50 text-gray-800">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700 text-center">
          Agora vamos falar da sua história familiar
        </h2>

        <CampoLista
          label="Por parte de mãe, quais questões de saúde existem?"
          valor={textoMae}
          onChange={setTextoMae}
          lista={mae}
          onAdicionar={() => adicionar(textoMae, setTextoMae, mae, setMae)}
        />

        <CampoLista
          label="E por parte de pai?"
          valor={textoPai}
          onChange={setTextoPai}
          lista={pai}
          onAdicionar={() => adicionar(textoPai, setTextoPai, pai, setPai)}
        />

        {tudoPreenchido && (
          <div className="text-center pt-6">
            <button
              onClick={() => {
                atualizar({ familiar: { mae, pai } })
                navigate('/habitos')
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

function CampoLista({
  label,
  valor,
  onChange,
  onAdicionar,
  lista
}: {
  label: string
  valor: string
  onChange: (v: string) => void
  onAdicionar: () => void
  lista: string[]
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button
          type="button"
          onClick={onAdicionar}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>
      {lista.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {lista.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
