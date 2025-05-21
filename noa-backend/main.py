from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
import os

# Rotas personalizadas
from backend import nft_emissao
from backend import verificar_nft
from backend import verificar_nft_onchain
from backend import refazer_etapa  # ← Rota de reemissão NFT

app = FastAPI()

# Inclui os roteadores
app.include_router(nft_emissao.router)
app.include_router(verificar_nft.router)
app.include_router(verificar_nft_onchain.router)
app.include_router(refazer_etapa.router)

# Middleware CORS para liberar requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Pode especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota simples de verificação
@app.get("/status")
def obter_status():
    return {"status": "API da Nôa online"}

# 🧠 Rota principal de conversação com Nôa (GPT Builder)
@app.post("/api/chat")
async def conversar_com_noa(request: Request):
    try:
        body = await request.json()
        mensagem = body.get("mensagem", "")
        user_id = body.get("user_id", "anonimo")

        if not mensagem:
            return JSONResponse(status_code=422, content={"erro": "mensagem ausente"})

        # Simulação de resposta da Nôa (substituir por chamada real futura)
        resposta_simulada = f"🌱 Olá, {user_id}. Você disse: '{mensagem}'"

        return JSONResponse(content={"resposta": resposta_simulada})

    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": f"Erro interno: {str(e)}"})

# Customização do OpenAPI
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Nôa Esperanza API",
        version="1.0.0",
        description="Rota unificada para integração via GPT Builder, emissão e reemissão de NFTs clínicos.",
        routes=app.routes,
    )
    openapi_schema["servers"] = [
        {"url": "https://plataforma-noa-backend.onrender.com"}
    ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
