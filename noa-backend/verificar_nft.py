from fastapi import APIRouter
from database.connect_postgres import connect

router = APIRouter()

@router.get("/verificar-nft/{aluno_id}")
def verificar_nft(aluno_id: str):
    conn = connect()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT etapa, hash_zora, data_emissao
        FROM nfts_emitidos
        WHERE aluno_id = %s
        ORDER BY data_emissao DESC
        """,
        (aluno_id,)
    )

    resultados = cur.fetchall()
    cur.close()
    conn.close()

    if not resultados:
        return {"possui_nft": False, "etapas": []}

    etapas = [
        {
            "etapa": r[0],
            "hash": r[1],
            "data_emissao": r[2].isoformat()
        }
        for r in resultados
    ]

    return {"possui_nft": True, "etapas": etapas}
