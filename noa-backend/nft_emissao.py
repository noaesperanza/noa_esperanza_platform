from fastapi import APIRouter
from pydantic import BaseModel
from database.connect_postgres import connect
from backend.zora_integration import emitir_nft_zora
import datetime

router = APIRouter()

class NFTRequest(BaseModel):
    aluno_id: str
    etapa: str
    registro_aluno: str
    registro_noa: str

@router.post("/emitir-nft")
def emitir_nft(req: NFTRequest):
    # Avaliação básica: fidelidade por tamanho e presença de palavras-chave
    score = comparar_textos(req.registro_aluno, req.registro_noa)
    resultado = score >= 0.75

    # Emissão real ou simulada na Zora
    resposta_zora = emitir_nft_zora(req.aluno_id, req.etapa, score)
    nft_hash = resposta_zora["hash"]

    # Salvar no PostgreSQL
    conn = connect()
    cur = conn.cursor()
    cur.execute(
        '''
        INSERT INTO nfts_emitidos (aluno_id, etapa, criterio_avaliacao, comparacao_json, resultado, hash_zora, data_emissao)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ''',
        (
            req.aluno_id,
            req.etapa,
            '{"min_75%":"texto coincidente"}',
            f'{{"score": {score:.2f}}}',
            resultado,
            nft_hash,
            datetime.datetime.now()
        )
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        "mensagem": "NFT processado com sucesso.",
        "resultado": resultado,
        "hash": nft_hash,
        "score": score
    }

def comparar_textos(texto1, texto2):
    palavras1 = set(texto1.lower().split())
    palavras2 = set(texto2.lower().split())
    intersecao = palavras1.intersection(palavras2)
    return len(intersecao) / max(len(palavras2), 1)
