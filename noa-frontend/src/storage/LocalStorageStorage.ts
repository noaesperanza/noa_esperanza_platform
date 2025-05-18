import type { AvaliacaoData } from './AvaliacaoStorage'

const STORAGE_KEY = 'avaliacao_noa'

export class LocalStorageStorage {
  get(): AvaliacaoData {
    const json = localStorage.getItem(STORAGE_KEY)
    return json ? JSON.parse(json) : {}
  }

  set(data: Partial<AvaliacaoData>) {
    const atual = this.get()
    const novo = { ...atual, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novo))
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY)
  }
}
