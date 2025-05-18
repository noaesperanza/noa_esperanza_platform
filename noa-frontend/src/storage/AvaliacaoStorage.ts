export interface AvaliacaoData {
  nome?: string
  queixas?: string[]
  queixaPrincipal?: string

  desenvolvimento?: {
    onde: string
    quando: string
    como: string
    oqueMais: string
    melhora: string
    piora: string
  }

  pregressa?: string[]

  familiar?: {
    mae: string[]
    pai: string[]
  }

  habitos?: string[]

  alergias?: string
  regulares?: string
  esporadicas?: string
}
