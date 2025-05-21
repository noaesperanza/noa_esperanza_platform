from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import openai
import os

# Configure sua chave da OpenAI via variável de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MensagemRequest(BaseModel):
    user_id: str
    mensagem: str

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

        resposta_gpt = response.choices[0].message.content.strip()
        return {"resposta": resposta_gpt}

    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": f"Erro ao conectar com GPT: {str(e)}"})
