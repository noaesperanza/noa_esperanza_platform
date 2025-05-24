from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import openai
import psycopg2
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Chave da API OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Liberação de CORS para frontend (Vercel ou localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, use domínio específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de payload para o chat
class MensagemRequest(BaseModel):
    user_id: str
    mensagem: str

# Endpoint de conversa com Nôa (GPT)
@app.post("/api/chat")
async def conversar_com_noa(payload: MensagemRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é a Nôa Esperanza, uma assistente de saúde e educação."},
                {"role": "user", "content": payload.mensagem}
            ],
            user=payload.user_id
        )
        resposta_gpt = response['choices'][0]['message']['content'].strip()
        return {"resposta": resposta_gpt}
    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": f"Erro ao conectar com GPT: {str(e)}"})

# Endpoint de teste com KPIs simulados
@app.get("/api/kpis/barras/")
async def get_kpis_barras():
    dados = [
        {"id_simulacao": 1, "escutas": 12, "empatia": 7.5, "tempo": 18},
        {"id_simulacao": 2, "escutas": 10, "empatia": 8.2, "tempo": 22},
        {"id_simulacao": 3, "escutas": 15, "empatia": 6.8, "tempo": 16},
        {"id_simulacao": 4, "escutas": 9,  "empatia": 7.9, "tempo": 20}
    ]
    return JSONResponse(content=dados)

# Novo endpoint: entrevistas clínicas reais do banco noa_db
@app.get("/entrevistas")
async def get_entrevistas():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        cur = conn.cursor()
        cur.execute("SELECT id, eixo, topico, conteudo FROM public.entrevista_clinica LIMIT 100")
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        data = [dict(zip(colnames, row)) for row in rows]
        cur.close()
        conn.close()
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# Execução local
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
