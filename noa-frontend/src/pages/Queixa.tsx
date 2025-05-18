import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Queixa() {
  const [input, setInput] = useState('')
  const [lista, setLista] = useState<string[]>([])
  const [escolhida, setEscolhida] = useState('')
  const navigate = useNavigate()
  const { atualizar } = useAvaliacao()

  const adicionarItem = () => {
    if (input.trim()) {
      setLista([...lista, input.trim()])
      setInput('')
    }
  }

  const handleContinuar = () => {
    atualizar({ queixas: lista, queixaPrincipal: escolhida })
    navigate('/desenvolvimento')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-100 via-rose-50 to-amber-100 text-gray-800">
      <div className="max-w-xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700 text-center">
          O que trouxe você à nossa avaliação hoje?
        </h2>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Digite uma questão..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            onClick={adicionarItem}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl shadow-md transition-all"
          >
            Adicionar
          </button>
        </div>

        {lista.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-rose-700 font-medium">O que mais?</h3>
            <ul className="list-disc pl-6 text-gray-700">
              {lista.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-2">
                De todas essas questões, qual mais o(a) incomoda?
              </h4>
              <select
                value={escolhida}
                onChange={(e) => setEscolhida(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
              >
                <option value="">Selecione...</option>
                {lista.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <button
                disabled={!escolhida}
                onClick={handleContinuar}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                Continuar Avaliação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
