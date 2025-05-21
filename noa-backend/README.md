# Plataforma Nôa Esperanza – Backend NFT

## Funções Atuais
- Processa input clínico do aluno e da IA
- Compara registros para avaliar fidelidade e continuidade
- Emite NFT se critério ≥ 75% de coincidência entre falas
- Salva logs em PostgreSQL na tabela `nfts_emitidos`

## Instalação

```bash
pip install -r requirements.txt
uvicorn main:app --reload
