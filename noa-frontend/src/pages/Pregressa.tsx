import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Pregressa() {
  const [evento, setEvento] = useState('')
  const [lista, setLista] = useState<string[]>([])
  const [encerrar, setEncerrar] = useState(false)

  const navigate = useNavigate()
  const { atualizar } = useAvaliacao()

  const adicionar = () => {
    if (evento.trim()) {
      setLista([...lista, evento.trim()])
      setEvento('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-100 via-amber-50 to-rose-100 text-gray-800">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700 text-center">
          Desde seu nascimento, quais as questões de saúde você já viveu?
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Vamos ordenar do mais antigo para o mais recente. O que veio primeiro?
        </p>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Ex: Internação por asma na infância..."
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            onClick={adicionar}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl shadow-md transition-all"
          >
            Adicionar
          </button>
        </div>

        {lista.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-rose-700 font-medium">O que mais?</h3>
            <ol className="list-decimal pl-6 text-gray-700 space-y-1">
              {lista.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>

            {!encerrar && (
              <div className="pt-4 space-y-2 text-center">
                <p className="text-sm">Deseja adicionar mais alguma questão?</p>
                <button
                  onClick={() => setEncerrar(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl shadow-md transition-all"
                >
                  Não, podemos seguir
                </button>
              </div>
            )}
          </div>
        )}

        {encerrar && (
          <div className="text-center pt-6">
            <button
              onClick={() => {
                atualizar({ pregressa: lista })
                navigate('/familiar')
              }}
              className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-xl shadow-md transition-all"
            >
              Continuar para História Familiar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
