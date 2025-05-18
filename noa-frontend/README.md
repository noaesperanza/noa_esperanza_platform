# 🌱 Nôa Esperanza – Plataforma Figital de Escuta Clínica, Aprendizagem e Cadeia de Valor

**GPT institucional com backend FastAPI e frontend React + Vite + TypeScript**  
**Base de dados PostgreSQL** | **Integração com OpenAI GPT-4 (fine-tuned)**  
**Cadeia simbólica com tokenização indiciária e registros rastreáveis (logs_gpt)**

---

## ✨ Visão

A Nôa Esperanza é uma plataforma que organiza dados primários sensíveis — como mensagens, escutas clínicas, arquivos e imagens — para gerar valor simbólico e rastreável em saúde, educação e ancestralidade. Tudo isso, com rastros registrados em `NFTs sociais`, armazenados via PostgreSQL e assistidos por modelos generativos fine-tunados.

---

## 📁 Estrutura do projeto

```
noa_esperanza_platform/
|
├— noa-frontend/             # Aplicação React + Vite
|   ├— public/               # Arquivos estáticos
|   ├— src/                  # Código-fonte
|   ├— noa-backend/          # FastAPI com integração OpenAI e PostgreSQL
|   └— package.json           # Dependências e scripts
|
├— .gitignore
├— README.md
└— requirements.txt        # Dependências do backend
```

---

## ⚙️ Como rodar localmente

### 🔧 Backend (FastAPI)

```bash
cd noa-frontend/noa-backend
python -m venv venv
venv\Scripts\activate      # ou source venv/bin/activate no Linux/macOS
pip install -r requirements.txt
uvicorn main:app --reload
```

### 💻 Frontend (React + Vite)

```bash
cd noa-frontend
npm install
npm run dev
```

### Acesse:

- Frontend: `http://localhost:5173`
- Backend docs (Swagger): `http://localhost:8000/docs`

---

## 🖐️ Endpoints API

| Método | Rota                   | Função                            |
|--------|------------------------|----------------------------------|
| POST   | /api/chat/             | Envia mensagem ao GPT            |
| POST   | /api/upload-documento/ | Upload de documento              |
| GET    | /api/logs              | Consulta logs de interações GPT |
| GET    | /api/kpis/simulacoes   | Lista KPIs simulados             |

Swagger: `http://localhost:8000/docs`

---

## 🛠️ Deploy via GitHub + Vercel

### 🔄 1. Subir para o GitHub

- Crie um repositório novo no GitHub
- Adicione os arquivos da pasta `noa_esperanza_platform` (com estrutura já limpa)
- Commit e push:

```bash
git init
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git add .
git commit -m "Deploy inicial da Nôa Esperanza"
git push -u origin main
```

### ✨ 2. Conectar ao Vercel

1. Acesse https://vercel.com/import/git
2. Conecte sua conta GitHub e escolha o repositório
3. Configure:
   - Framework = **Vite**
   - Diretório de output: `noa-frontend`
   - Variáveis de ambiente (se houver)
4. Clique em **Deploy**

---

## 📊 Etapas em andamento

- [x] Backend com FastAPI e PostgreSQL funcionando local
- [x] Conexão com GPT-4 (via OpenAI API)
- [x] API OpenAPI pronta para conexão com GPTs personalizados
- [ ] Deploy no Vercel com backend separado (em progresso)
- [ ] Integração com Zora e registro NFT social (planejado)

---

## 📖 Licença

Projeto experimental e educacional vinculado ao Dr. Ricardo Valença. Todos os direitos reservados – 2025.
