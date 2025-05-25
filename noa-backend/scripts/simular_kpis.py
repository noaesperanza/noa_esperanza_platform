import os
import psycopg2
import requests
import random
import time
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

DB_NAME = os.getenv("PGDATABASE", "oauth-para-noa-esperanza")
DB_USER = os.getenv("PGUSER", "postgres")
DB_PASSWORD = os.getenv("PGPASSWORD", "sua_senha")
DB_HOST = os.getenv("PGHOST", "localhost")
DB_PORT = os.getenv("PGPORT", "5432")
GPT_API_URL = "http://localhost:8000/api/chat"
USER_ID = "simulador_kpis"

# Conexão com o banco
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cursor = conn.cursor()

# Coleta entrevistas clínicas
cursor.execute("SELECT id, conteudo FROM public.entrevista_clinica ORDER BY id ASC LIMIT 50")
entrevistas = cursor.fetchall()

for idx, (id_registro, conteudo) in enumerate(entrevistas, start=1):
    print(f"[Simulando {idx}] Entrada: {conteudo[:60]}...")

    # Envia para API da Nôa
    try:
        response = requests.post(GPT_API_URL, json={
            "user_id": USER_ID,
            "mensagem": conteudo
        })
        resposta = response.json().get("resposta", "")
        print(f"Resposta: {resposta[:60]}...")
    except Exception as e:
        print(f"Erro ao conectar com GPT: {e}")
        continue

    # Simula KPIs (substitua se quiser regras reais)
    tempo = random.randint(10, 20)
    coerencia = round(random.uniform(6.0, 8.0), 2)
    ritmo = round(random.uniform(3.0, 6.0), 2)

    # Insere no banco
    cursor.execute("""
        INSERT INTO public.kpi_simulacoes (id_simulacao, tempo_resposta, coerencia, ritmo)
        VALUES (%s, %s, %s, %s)
    """, (idx, tempo, coerencia, ritmo))

    conn.commit()
    time.sleep(1.5)  # Evita sobrecarregar a API

print("\n✅ Simulação finalizada com sucesso!")
cursor.close()
conn.close()
