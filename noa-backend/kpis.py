# noa-backend/kpis.py

from fastapi import APIRouter
from fastapi.responses import JSONResponse
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

@router.get("/api/kpis/simulacoes/")
def listar_kpis_simulados():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            options='-c client_encoding=UTF8'
        )
        cur = conn.cursor()

        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.kpi_simulacoes (
                id_simulacao SERIAL PRIMARY KEY,
                tempo_resposta FLOAT,
                coerencia FLOAT,
                ritmo FLOAT
            );
        """)
        conn.commit()

        # Simulação para testes locais se a tabela estiver vazia
        cur.execute("SELECT COUNT(*) FROM public.kpi_simulacoes;")
        count = cur.fetchone()[0]
        if count == 0:
            cur.executemany("""
                INSERT INTO public.kpi_simulacoes (tempo_resposta, coerencia, ritmo)
                VALUES (%s, %s, %s)
            """, [
                (3.2, 8.5, 7.1),
                (2.9, 7.8, 6.7),
                (3.5, 9.1, 7.3)
            ])
            conn.commit()

        cur.execute("""
            SELECT id_simulacao, tempo_resposta, coerencia, ritmo
            FROM public.kpi_simulacoes
            ORDER BY id_simulacao ASC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        resultados = [
            {
                "id_simulacao": r[0],
                "tempo_resposta": r[1],
                "coerencia": r[2],
                "ritmo": r[3]
            }
            for r in rows
        ]
        return JSONResponse(content=resultados)

    except Exception as e:
        return JSONResponse(content={"erro": str(e)}, status_code=500)
