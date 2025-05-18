import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import NoaSymbol from '@/components/NoaSymbol'

export default function Home() {
  const [codigo, setCodigo] = useState('')
  const navigate = useNavigate()

  const gerarURL = () => {
    if (!codigo.trim()) return null

    const base = 'https://chat.openai.com/g/g-DLWVYVzuI-noa-esperanza-versao-admin'
    const encoded = encodeURIComponent(codigo.trim())
    return `${base}?codigo=${encoded}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-100 to-slate-100 text-gray-800 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <NoaSymbol className="w-24 h-24 mx-auto animate-fade-in" />

        <h1 className="text-3xl font-bold tracking-tight text-rose-700">
          Plataforma Nôa Esperanza
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Cuidar é criar presença. Escolha uma entrada para continuar.
        </p>

        <div className="space-y-4">
          <Button className="w-full" onClick={() => navigate('/avaliacao')}>
            Entrar pela Avaliação Inicial
          </Button>

          <div className="text-sm text-gray-600">ou</div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Entrada simbólica pela escuta com Nôa:
            </p>
            <input
              type="text"
              placeholder="Ex: Olá, Nôa. Dr. Fernando, aqui."
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            {gerarURL() && (
              <a
                href={gerarURL()!}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full mt-2">
                  Acessar Escuta com Nôa
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
