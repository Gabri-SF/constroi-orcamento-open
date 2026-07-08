# Constrói Orçamento (Open) — Contexto do Projeto

## Propósito
Ferramenta local, open-source, para criação, gestão e exportação de orçamentos de construção civil. É um template genérico — a marca e os dados de empresa de exemplo (`src/config/company.ts`) devem ser substituídos pelos de cada utilizador. Os orçamentos são guardados localmente (não existe backend em nuvem).

## Stack Técnica
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui (Radix UI)
- **Drag-and-drop**: @dnd-kit (reordenação de linhas nas tabelas)
- **Backend (dev)**: Express.js (`server.js`) — serve ficheiros JSON da pasta `orcamentos/`
- **PDF**: `window.print()` com `@media print` CSS — solução WYSIWYG sem dependência extra

## Como Correr
```bash
# Terminal 1 — API local
npm run server

# Terminal 2 — Aplicação
npm run dev
```
Aceder em: http://localhost:8080

## Arquitetura de Ficheiros
```
/
├── orcamentos/              ← ficheiros JSON, um por orçamento (ignorado por git, ver .gitignore)
├── server.js                ← API REST Express (porta 3001)
├── src/
│   ├── config/company.ts    ← dados da empresa por defeito + texto do logo (DEFAULT_COMPANY, BRAND)
│   ├── types/budget.ts      ← tipos TypeScript (Budget, SavedBudget, BudgetListItem, etc.)
│   ├── hooks/
│   │   └── useBudgetStorage.ts  ← CRUD de orçamentos via API
│   ├── components/
│   │   ├── Logo.tsx          ← marca/logo partilhado (cabeçalho da app + cabeçalho/rodapé do PDF)
│   │   ├── BudgetList.tsx    ← lista de orçamentos guardados (view 'list')
│   │   ├── BudgetPreview.tsx ← pré-visualização A4 WYSIWYG (view 'preview')
│   │   ├── CategoryTable.tsx ← tabela de categorias + itens + DnD
│   │   ├── CompanyForm.tsx   ← formulário dados empresa
│   │   ├── ClientForm.tsx    ← formulário dados cliente
│   │   └── BudgetSummary.tsx ← totais, IVA, condições, local/data
│   └── pages/Index.tsx       ← orquestração das 3 views (list/edit/preview)
```

## Persistência
- Cada orçamento é guardado como `orcamentos/{id}.json` (um ficheiro por orçamento)
- A API tem os endpoints: `GET /api/budgets`, `GET /api/budgets/:id`, `POST /api/budgets`, `PUT /api/budgets/:id`, `DELETE /api/budgets/:id`
- A pasta `orcamentos/` está no `.gitignore` por defeito — guarda dados reais de clientes, não deve ser commitada

## Exportação PDF
A exportação para PDF usa `window.print()`. Quando o utilizador clica "Imprimir / PDF" na view de pré-visualização, o browser abre o diálogo de impressão. O utilizador seleciona "Guardar como PDF" (disponível em todos os browsers modernos).

**Porquê esta abordagem?**
- É WYSIWYG — o PDF é exatamente o que se vê na pré-visualização
- Produz PDF vetorial (não rasterizado como html2canvas)
- Não requer bibliotecas extra
- O CSS `@media print` em `index.css` garante a formatação correta (A4, 15mm de margens, apenas o documento é impresso)

## Decisões de Design
- **Cores**: Azul `hsl(217, 72%, 35%)` como cor primária, verde `hsl(142, 60%, 32%)` para totais/sucesso
- **Preview WYSIWYG**: O componente `BudgetPreview` usa estilos inline e classes `.document-paper`, `.doc-*` — **não** usa classes Tailwind — para garantir consistência entre browser e print
- **Sem react-query**: Removido por ser desnecessário para este caso de uso simples

## Personalização (marca/empresa)
- `src/config/company.ts` — `DEFAULT_COMPANY` (dados que pré-preenchem um orçamento novo) e `BRAND` (nome curto + tagline mostrados junto ao logo)
- `src/components/Logo.tsx` — marca gráfica (SVG inline, forma de telhado); substituir pelo logótipo próprio (ex.: um `<img>`) se necessário
- `public/favicon.svg` — ícone do separador do browser, usa a mesma marca; sem dependência de ferramentas externas (não usa `lovable-tagger` nem qualquer outra tooling específica de um gerador de projeto)
- Ver README.md para o guia de configuração completo
