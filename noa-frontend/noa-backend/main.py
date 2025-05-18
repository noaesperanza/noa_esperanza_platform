from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from datetime import datetime
import openai
import psycopg2
import os
from dotenv import load_dotenv

# Importação dos routers
from logs import router as logs_router
from documentos import router as documentos_router
from kpis import router as kpi_router
from logs import salvar_log  # Função de logging GPT

# Carrega variáveis do .env
load_dotenv()

# Inicializa o app
app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variáveis de ambiente
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
GPT_MODEL = os.getenv("GPT_AVALIACAO_MODEL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

# Criação de tabelas ao iniciar o app
@app.on_event("startup")
def criar_tabelas():
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
        CREATE TABLE IF NOT EXISTS public.conversas_noa (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            mensagem TEXT,
            resposta TEXT,
            criado_em TIMESTAMP
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS public.logs_gpt (
            id SERIAL PRIMARY KEY,
            endpoint TEXT,
            user_id TEXT,
            mensagem TEXT,
            resposta TEXT,
            status_code INT,
            criado_em TIMESTAMP
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS public.kpi_simulacoes (
            id_simulacao SERIAL PRIMARY KEY,
            tempo_resposta FLOAT,
            coerencia FLOAT,
            ritmo FLOAT
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS public.documentos_testes (
            id UUID PRIMARY KEY,
            user_id TEXT NOT NULL,
            titulo TEXT,
            caminho TEXT,
            criado_em TIMESTAMP
        );
    """)

    conn.commit()
    cur.close()
    conn.close()

# Estrutura da requisição
class EntradaChat(BaseModel):
    user_id: str
    mensagem: str

# Endpoint principal da conversa com a Nôa
@app.post("/api/chat/")
def conversar(dados: EntradaChat):
    try:
        resposta = openai.ChatCompletion.create(
            model=GPT_MODEL,
            messages=[{"role": "user", "content": dados.mensagem}]
        )
        conteudo = resposta['choices'][0]['message']['content']

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
            INSERT INTO public.conversas_noa (user_id, mensagem, resposta, criado_em)
            VALUES (%s, %s, %s, %s)
        """, (dados.user_id, dados.mensagem, conteudo, datetime.utcnow()))
        conn.commit()
        cur.close()
        conn.close()

        salvar_log(
            endpoint="/api/chat/",
            user_id=dados.user_id,
            mensagem=dados.mensagem,
            resposta=conteudo,
            status_code=200
        )

        return {"resposta": conteudo}

    except Exception as e:
        return {"erro": str(e)}

# Define domínio externo para o GPT Builder
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Nôa Esperanza API",
        version="1.0.0",
        description="API pública da Nôa Esperanza para integração GPT.",
        routes=app.routes,
    )
    openapi_schema["servers"] = [
        {"url": "https://4b0e-2804-18-4849-d67c-c0a6-2e74-3cfe-3983.ngrok-free.app"}
    ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Inclui os routers externos
app.include_router(logs_router)
app.include_router(documentos_router)
app.include_router(kpi_router)
