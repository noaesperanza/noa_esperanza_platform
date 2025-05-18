#!/bin/bash

# Caminho do projeto frontend
FRONTEND_DIR="./noa-frontend"
BACKUP_DIR="./noa_legado"

# Cria a pasta noa_legado se ainda não existir
mkdir -p "$BACKUP_DIR"

echo "📦 Iniciando reorganização de arquivos do projeto..."

# Lista segura de arquivos e pastas que devem permanecer no noa-frontend
KEEP_ITEMS=(
  "node_modules"
  "public"
  "src"
  "index.html"
  "vite.config.ts"
  "tailwind.config.js"
  "tsconfig.json"
  "tsconfig.app.json"
  "tsconfig.node.json"
  ".gitignore"
  "postcss.config.js"
  "package.json"
  "package-lock.json"
  "README.md"
  "eslint.config.js"
)

cd "$FRONTEND_DIR" || { echo "❌ Diretório $FRONTEND_DIR não encontrado"; exit 1; }

# Move tudo para noa_legado, exceto os arquivos da lista KEEP_ITEMS
for ITEM in * .*; do
  SKIP=false
  for KEEP in "${KEEP_ITEMS[@]}"; do
    if [[ "$ITEM" == "$KEEP" ]]; then
      SKIP=true
      break
    fi
  done
  if [ "$SKIP" = false ] && [ "$ITEM" != "." ] && [ "$ITEM" != ".." ]; then
    echo "🛑 Movendo $ITEM para $BACKUP_DIR"
    mv "$ITEM" "$BACKUP_DIR/" 2>/dev/null
  fi
done

echo "✅ Reorganização concluída com sucesso!"
