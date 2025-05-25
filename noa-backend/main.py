from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import openai
import psycopg2
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv(dotenv_path="C:/Escute-se/Plataforma_Noa_Esperanza_2.0/adk.env")

openai_api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = openai_api_key

app = FastAPI()

# Liberação de CORS para frontend (Vercel ou localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de payload para o chat
class MensagemRequest(BaseModel):
    user_id: str
    mensagem: str

# Modelo de comando administrativo
class ComandoAdminRequest(BaseModel):
    user_id: str
    comando: str

# Endpoint de conversa com Nôa (GPT)
@app.post("/api/chat")
async def conversar_com_noa(payload: MensagemRequest):
    try:
        if payload.user_id == "bozza.fernando@gmail.com":
            return {
                "resposta": (
                    "Olá, Dr. Fernando. Você acaba de entrar na instância da plataforma Nôa Esperanza vinculada à nossa organização oficial.\n\n"
                    "📘 Seu documento de apresentação está pronto e disponível na lousa digital.\n\n"
                    "Deseja visualizá-lo agora?"
                )
            }
        elif payload.user_id == "iaianoaesperanza@gmail.com":
            return {
                "resposta": (
                    "Olá, Dr. Ricardo. Acesso administrativo liberado.\n\n"
                    "Deseja revisar o banco de dados, iniciar triagens ou autorizar novos profissionais?"
                )
            }

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

# Endpoint de comando administrativo
@app.post("/api/admin/comando")
async def executar_comando_admin(payload: ComandoAdminRequest):
    return JSONResponse(content={
        "mensagem": f"Comando '{payload.comando}' executado com sucesso.",
        "executado_por": payload.user_id,
        "timestamp": datetime.now().isoformat()
    })

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

# Endpoint: entrevistas clínicas reais do banco noa_db
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
