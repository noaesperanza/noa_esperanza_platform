from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
import os

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota simples para teste
@app.get("/status")
def obter_status():
    return {"status": "API da Nôa online"}

# Rota principal para conversa
@app.post("/api/chat")
async def conversar_com_noa(request: Request):
    try:
        body = await request.json()
        mensagem = body.get("mensagem", "")
        user_id = body.get("user_id", "anonimo")

        if not mensagem:
            return JSONResponse(status_code=422, content={"erro": "mensagem ausente"})

        # Aqui é onde o GPT Builder intercepta e responde, não o OpenAI direto
        resposta_simulada = f"[Simulado] Nôa responde a '{mensagem}' para o usuário {user_id}."

        return {"resposta": resposta_simulada}

    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": f"Erro: {str(e)}"})

# Customiza OpenAPI para exibir /api/chat no Swagger

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Nôa Esperanza API",
        version="1.0.0",
        description="Rota unificada para integração via GPT Builder.",
        routes=app.routes,
    )
    openapi_schema["servers"] = [
        {"url": "https://plataforma-noa-backend.onrender.com"}
    ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
