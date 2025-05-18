import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Avaliacao() {
  const [nome, setNome] = useState('')
  const [apresentado, setApresentado] = useState(false)
  const navigate = useNavigate()
  const { atualizar } = useAvaliacao()

  const confirmarApresentacao = () => {
    atualizar({ nome })
    setApresentado(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-50 via-amber-100 to-rose-50 text-gray-800">
      <div className="max-w-xl w-full text-center space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700">
          Olá! Eu sou Nôa Esperanza.
        </h2>
        <p className="text-gray-600">
          Por favor, apresente-se também e vamos iniciar a sua avaliação inicial
          para consultas com Dr. Ricardo Valença.
        </p>

        {!apresentado ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Digite seu nome simbólico ou civil..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              onClick={confirmarApresentacao}
              disabled={!nome.trim()}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-6 rounded-2xl shadow-md transition-all"
            >
              Confirmar Apresentação
            </button>
          </div>
        ) : (
          <>
            <div className="text-green-700 font-medium">
              Seja bem-vindo(a), {nome}! Vamos seguir com sua escuta...
            </div>

            <button
              onClick={() => navigate('/queixa')}
              className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-xl shadow-md transition-all"
            >
              Continuar para a Escuta
            </button>
          </>
        )}
      </div>
    </div>
  )
}
