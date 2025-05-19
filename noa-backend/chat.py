from fastapi import APIRouter, Request
import openai
import os

router = APIRouter()

@router.post("/api/chat")
async def redirecionar_para_noa_esperanza(request: Request):
    body = await request.json()
    mensagem_usuario = body.get("mensagem")

    resposta = openai.ChatCompletion.create(
        model="gpt-4",
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

    return {
        "resposta": resposta.choices[0].message["content"]
    }
