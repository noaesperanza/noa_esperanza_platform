import requests
import uuid
import json
from datetime import datetime

# Esta função gera o JSON de metadados do NFT
def gerar_metadata_nft(aluno_id, etapa, score):
    return {
        "name": f"Nôa Esperanza – Etapa: {etapa}",
        "description": f"Emitido após avaliação da escuta figital do aluno {aluno_id}.",
        "external_url": "https://plataforma-noa.vercel.app",
        "attributes": [
            {"trait_type": "Etapa", "value": etapa},
            {"trait_type": "Desempenho", "value": f"{round(score * 100)}%"},
            {"trait_type": "Data", "value": datetime.utcnow().isoformat() + "Z"}
        ],
        "image": "ipfs://bafkreid2koq3...(placeholder)"
    }

# Função que simula a mintagem na Zora (exemplo com API pública / mock)
def emitir_nft_zora(aluno_id, etapa, score):
    # Gerar UUID para hash simulado
    hash_zora = str(uuid.uuid4())

    # Gerar metadados
    metadata = gerar_metadata_nft(aluno_id, etapa, score)

    # Simulação de envio à API da Zora (a integração real usa wallet connect e SDK)
    print(f"NFT emitido para {aluno_id} na etapa '{etapa}' com score {score}")
    print("Metadados gerados:")
    print(json.dumps(metadata, indent=2))

    # Aqui seria a chamada para mintar via SDK da Zora ou thirdweb
    resposta_mock = {
        "status": "simulado",
        "hash": hash_zora,
        "metadata": metadata
    }

    return resposta_mock
