from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime
import psycopg2
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Inicializa o router
router = APIRouter()

# Configurações do banco
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# ✅ Função para salvar logs no banco
def salvar_log(endpoint: str, user_id: str, mensagem: str, resposta: str, status_code: int = 200):
    conn = None
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
            INSERT INTO public.logs_gpt (
                endpoint, user_id, mensagem, resposta, status_code, criado_em
            ) VALUES (%s, %s, %s, %s, %s, %s)
        """, (endpoint, user_id, mensagem, resposta, status_code, datetime.utcnow()))
        conn.commit()
        cur.close()
        print(f"[LOG ✅] {endpoint} | {user_id} | status {status_code}")
    except Exception as e:
        print(f"[LOG ❌ ERRO]: {e}")
    finally:
        if conn:
            conn.close()

# ✅ Endpoint para listar logs recentes
@router.get("/api/logs/")
def listar_logs():
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
            SELECT id, endpoint, user_id, mensagem, resposta, status_code, criado_em
            FROM public.logs_gpt
            ORDER BY criado_em DESC
            LIMIT 100;
        """)
        colunas = [desc[0] for desc in cur.description]
        dados = [dict(zip(colunas, linha)) for linha in cur.fetchall()]
        cur.close()
        conn.close()
        return JSONResponse(content=dados)

    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": str(e)})
