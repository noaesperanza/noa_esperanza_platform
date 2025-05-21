from fastapi import APIRouter, UploadFile, File, Form 
from fastapi.responses import JSONResponse
from datetime import datetime
import shutil, os, uuid, psycopg2
from dotenv import load_dotenv
from logs import salvar_log

load_dotenv()

router = APIRouter()

# Variáveis do .env
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

UPLOAD_DIR = "/mnt/data/documentos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-documento/")
def upload_documento(
    user_id: str = Form(...),
    titulo: str = Form(...),
    arquivo: UploadFile = File(...)
):
    doc_id = str(uuid.uuid4())
    filename = f"{user_id}_{doc_id}_{arquivo.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)

        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            options='-c client_encoding=UTF8'
        )
        cur = conn.cursor()

        # Cria tabela se não existir
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.documentos_testes (
                id UUID PRIMARY KEY,
                user_id TEXT NOT NULL,
                titulo TEXT,
                caminho TEXT,
                criado_em TIMESTAMP
            );
        """)

        # Insere documento
        cur.execute("""
            INSERT INTO public.documentos_testes (id, user_id, titulo, caminho, criado_em)
            VALUES (%s, %s, %s, %s, %s)
        """, (doc_id, user_id, titulo, filepath, datetime.utcnow()))
        conn.commit()

        # Busca lista atualizada
        cur.execute("""
            SELECT titulo, caminho
            FROM public.documentos_testes
            WHERE user_id = %s
            ORDER BY criado_em DESC
        """, (user_id,))
        documentos = [{"titulo": row[0], "caminho": row[1]} for row in cur.fetchall()]

        cur.close()
        conn.close()

        salvar_log("/api/upload-documento/", user_id, titulo, "UPLOAD OK", 200)

        return JSONResponse(content={
            "status": "ok",
            "documentos": documentos
        })

    except Exception as e:
        salvar_log("/api/upload-documento/", user_id, titulo, "ERRO", 500)
        return JSONResponse(content={"erro": str(e)}, status_code=500)
