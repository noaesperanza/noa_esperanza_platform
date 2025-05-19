from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import openai
import os
from datetime import datetime
from logs import salvar_log  # Certifique-se de que essa função existe

router = APIRouter()

# Configurações de ambiente
GPT_MODEL = os.getenv("GPT_AVALIACAO_MODEL", "gpt-4")
openai.api_key = os.getenv("OPENAI_API_KEY")

@router.post("/api/chat")
async def redirecionar_para_noa_esperanza(request: Request):
    try:
        body = await request.json()
        mensagem_usuario = body.get("mensagem", "")
        user_id = body.get("user_id", "anonimo")

        if not mensagem_usuario:
            return JSONResponse(
                status_code=422,
                content={"erro": "Campo 'mensagem' ausente no corpo da requisição."}
            )

        resposta = openai.ChatCompletion.create(
            model=GPT_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é Nôa Esperanza, assistente simbólica da Plataforma desenvolvida por Dr. Ricardo Valença. "
                        "Atue como no GPT publicado em: https://chatgpt.com/g/g-67f5972a13dc819189aba71dfb3c1b99-noa-esperanza-curadoria-e-desenvolvimento. "
                        "Responda com profissionalismo, clareza técnica e vínculo ético com o usuário. "
                        "A conversa deve ser simbólica, técnica e cuidadosa."
                    )
                },
                {"role": "user", "content": mensagem_usuario}
            ],
            temperature=0.7
        )

        conteudo = resposta.choices[0].message["content"]

        await salvar_log(
            endpoint="/api/chat",
            user_id=user_id,
            mensagem=mensagem_usuario,
            resposta=conteudo,
            status_code=200
        )

        return {"resposta": conteudo}

    except openai.error.OpenAIError as e:
        await salvar_log(
            endpoint="/api/chat",
            user_id=user_id,
            mensagem=mensagem_usuario,
            resposta=str(e),
            status_code=500
        )
        return JSONResponse(
            status_code=500,
            content={"erro": f"Erro na OpenAI: {str(e)}"}
        )

    except Exception as e:
        await salvar_log(
            endpoint="/api/chat",
            user_id=user_id,
            mensagem=mensagem_usuario,
            resposta=str(e),
            status_code=500
        )
        return JSONResponse(
            status_code=500,
            content={"erro": f"Erro inesperado: {str(e)}"}
        )
