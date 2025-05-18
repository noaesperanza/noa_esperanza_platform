import { useEffect, useState } from 'react'
import type { AvaliacaoData } from '../storage/AvaliacaoStorage'
import { LocalStorageStorage } from '../storage/LocalStorageStorage'

const storage = new LocalStorageStorage()

export function useAvaliacao() {
  const [dados, setDados] = useState<AvaliacaoData>({})

  useEffect(() => {
    setDados(storage.get())
  }, [])

  const atualizar = (novos: Partial<AvaliacaoData>) => {
    storage.set(novos)
    setDados(storage.get())
  }

  const resetar = () => {
    storage.clear()
    setDados({})
  }

  return { dados, atualizar, resetar }
}
