from fastapi import APIRouter
from pydantic import BaseModel
from database.connect_postgres import connect
from backend.zora_integration import emitir_nft_zora
import datetime

router = APIRouter()

class ReemissaoRequest(BaseModel):
    aluno_id: str
    etapa_anterior: str
    novo_registro_aluno: str
    novo_registro_noa: str
    hash_substituido: str

@router.post("/refazer-etapa")
def refazer_etapa(req: ReemissaoRequest):
    score = comparar_textos(req.novo_registro_aluno, req.novo_registro_noa)
    resultado = score >= 0.75
    resposta_zora = emitir_nft_zora(req.aluno_id, req.etapa_anterior + " (Revisado)", score)
    novo_hash = resposta_zora["hash"]

    conn = connect()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO nfts_emitidos (aluno_id, etapa, criterio_avaliacao, comparacao_json, resultado, hash_zora, data_emissao, substitui_hash)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            req.aluno_id,
            req.etapa_anterior + " (Revisado)",
            '{"min_75%":"comparação textual"}',
            f'{{"score": {score:.2f}}}',
            resultado,
            novo_hash,
            datetime.datetime.now(),
            req.hash_substituido
        )
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        "mensagem": "Nova versão da etapa emitida.",
        "hash_novo": novo_hash,
        "score": score
    }

def comparar_textos(a, b):
    set1 = set(a.lower().split())
    set2 = set(b.lower().split())
    return len(set1.intersection(set2)) / max(len(set2), 1)
