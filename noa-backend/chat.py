from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import httpx
import os
from logs import salvar_log

router = APIRouter()

GPT_BUILDER_URL = os.getenv("GPT_BUILDER_URL")

@router.post("/api/chat")
async def redirecionar_para_noa_esperanza(request: Request):
    try:
        body = await request.json()
        mensagem = body.get("mensagem", "")
        user_id = body.get("user_id", "anonimo")

        if not mensagem:
            return JSONResponse(
                status_code=422,
                content={"erro": "Campo 'mensagem' ausente no corpo da requisição."}
            )

        async with httpx.AsyncClient() as client:
            resposta = await client.post(
                GPT_BUILDER_URL,
                json={"user_id": user_id, "mensagem": mensagem},
                timeout=30
            )

        conteudo = resposta.json().get("resposta", "[resposta vazia]")

        await salvar_log(
            endpoint="/api/chat",
            user_id=user_id,
            mensagem=mensagem,
            resposta=conteudo,
            status_code=resposta.status_code
        )

        return {"resposta": conteudo}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"erro": f"Erro ao redirecionar: {str(e)}"}
        )
