from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from datetime import datetime
import psycopg2
import os
from dotenv import load_dotenv
import logging

# === Configuração Inicial ===
load_dotenv()
logging.basicConfig(level=logging.INFO)

# === Inicializa o app FastAPI ===
app = FastAPI()

# === Middleware CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restringir domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Variáveis de ambiente ===
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# === Importação dos Routers ===
from logs import router as logs_router
from documentos import router as documentos_router
from kpis import router as kpi_router
from chat import router as chat_router
from logs import salvar_log  # Para rastreamento

# === Criação de Tabelas no PostgreSQL ===
@app.on_event("startup")
def criar_tabelas():
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
            CREATE TABLE IF NOT EXISTS public.conversas_noa (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                mensagem TEXT,
                resposta TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        conn.commit()
        cur.close()
        conn.close()
        logging.info("✅ Tabelas verificadas/criadas com sucesso.")
    except Exception as e:
        logging.error(f"❌ Erro ao conectar e criar tabelas no PostgreSQL: {e}")

# === Customização da documentação Swagger ===
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Nôa Esperanza API",
        version="1.0.0",
        description="API pública da Nôa Esperanza para integração com GPT Builder.",
        routes=app.routes,
    )
    openapi_schema["servers"] = [
        {"url": "https://plataforma-noa-backend.onrender.com"}  # 🔗 URL do Render para Swagger
    ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# === Registro dos Routers ===
app.include_router(logs_router)
app.include_router(documentos_router)
app.include_router(kpi_router)
app.include_router(chat_router)  # ✅ Chat conectado ao GPT Builder
