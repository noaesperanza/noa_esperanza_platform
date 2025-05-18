// src/pages/Habitos.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Habitos() {
  const [habito, setHabito] = useState('')
  const [lista, setLista] = useState<string[]>([])

  const navigate = useNavigate()
  const { atualizar } = useAvaliacao()

  const adicionar = () => {
    if (habito.trim()) {
      setLista([...lista, habito.trim()])
      setHabito('')
    }
  }

  const tudoPreenchido = lista.length > 0

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-amber-50 via-slate-100 to-rose-50 text-gray-800">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700 text-center">
          Agora vamos registrar seus hábitos de vida
        </h2>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Quais hábitos de vida você gostaria de registrar?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={habito}
              onChange={(e) => setHabito(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="button"
              onClick={adicionar}
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

        {tudoPreenchido && (
          <div className="text-center pt-6">
            <button
              onClick={() => {
                atualizar({ habitos: lista })
                navigate('/alergias')
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
