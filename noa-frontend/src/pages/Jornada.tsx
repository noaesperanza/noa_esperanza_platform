import { useNavigate } from 'react-router-dom'
import NoaSymbol from '../components/NoaSymbol'

export default function Jornada() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 space-y-6">
      <NoaSymbol className="w-16 h-16 animate-fade-in" />
      <h2 className="text-2xl font-semibold text-rose-700">Jornada Iniciada</h2>
      <p className="text-gray-600">
        Aqui começa sua escuta, sua história e o cuidado com presença.
      </p>
      <button
        onClick={() => navigate('/avaliacao')}
        className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-xl shadow-md transition-all"
      >
        Iniciar Avaliação Clínica
      </button>
    </div>
  )
}
    