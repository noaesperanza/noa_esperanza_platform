# Changelog – Plataforma Nôa Esperanza

## [2.0.0-beta] – 2025-05-23

### Adicionado
- Componente `NFTViewer.tsx` criado para visualização simbólica de escuta com NFT
- Simulação de carregamento e imagem simbólica (`placeholder.com`) com estado e status

### Corrigido
- Importações erradas com `@/components/ui/...` substituídas por caminhos relativos corretos
- Ajuste de tipagem segura com `useState<... | null>` e verificação com `nftData && (...)`

### Removido
- `DashboardTutor.js` e `PDFJornada.js` removidos com validação simbólica e técnica
- Confirmado que os arquivos não estavam em uso em nenhuma rota ou fluxo ativo da plataforma

### Ambiente
- Projeto ajustado para TypeScript com suporte a módulos ES (`type: "module"` no package.json)
- Tipagens `@types/react` e `@types/react-dom` adicionadas para suporte pleno ao React 18

---

Próxima etapa: versão 2.1 com GPTs especializados por eixo, logging simbólico e deploy público com ativadores simbólicos por rota
