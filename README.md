# Constrói Orçamento (Open)

Ferramenta local, open-source, para criar e gerir orçamentos de construção civil, com pré-visualização A4 fiel ao PDF e exportação por impressão.

Este repositório é a versão **open-source e genérica** de uma ferramenta que uso para o meu próprio negócio. Todos os dados de exemplo (empresa, cliente, logótipo) foram substituídos por dados fictícios — antes de usar a sério, personaliza a marca e os dados da tua empresa (ver secção [Personalização](#personalização) abaixo).

## Funcionalidades

- Criação de orçamentos com campos livres
- Categorias de trabalhos com itens (descrição, unidade, quantidade, preço unitário)
- Cálculo automático de subtotais, IVA e total
- Campos de condições, exclusões, local e data de emissão
- Reordenação de linhas por drag-and-drop
- Lista de orçamentos guardados com pesquisa
- Pré-visualização A4 fiel ao PDF
- Exportação para PDF via impressão (WYSIWYG, vetorial)
- Duplicar e eliminar orçamentos

## Instalação

```bash
npm install
```

## Utilização

São necessários **dois terminais**:

```bash
# Terminal 1 — Inicia a API local (guarda os orçamentos em /orcamentos)
npm run server

# Terminal 2 — Inicia a aplicação
npm run dev
```

Aceder em: **http://localhost:8080**

## Personalização

Este template vem pré-configurado com uma empresa fictícia ("ACME Construções, Lda") para que possas ver o layout completo — cabeçalho, rodapé e documento impresso — já formatados. Antes de usar com clientes reais, edita o seguinte:

### 1. Dados da empresa e nome/tagline da marca

Edita `src/config/company.ts`:

```ts
export const DEFAULT_COMPANY: CompanyData = {
  name: "A Tua Empresa, Lda",
  nif: "000000000",
  address: "A tua morada",
  postalCode: "0000-000",
  city: "A tua cidade",
  email: "geral@atuaempresa.pt",
  phone: "000000000",
};

export const BRAND = {
  shortName: "TUA",          // sigla/nome curto mostrado junto ao logo
  tagline: "O TEU RAMO",     // texto pequeno por baixo do nome
};
```

`DEFAULT_COMPANY` pré-preenche os dados de empresa sempre que crias um orçamento novo (continuam editáveis no formulário — não são fixos).

### 2. Logótipo

O logótipo (a marca em forma de telhado) está definido como SVG inline em `src/components/Logo.tsx`, e é partilhado entre o cabeçalho da aplicação e o cabeçalho/rodapé do documento impresso — editas num único sítio e atualiza em todo o lado.

- Para ajustar as cores ou a forma, edita o `<svg>` dentro de `Logo.tsx`.
- Para usar uma imagem/logótipo próprio em vez de um SVG desenhado, substitui o conteúdo de `Logo.tsx` por um `<img src="/o-teu-logo.png" ... />` (coloca o ficheiro de imagem em `public/`).

### 3. Cores

As cores principais (azul e verde) estão definidas como variáveis CSS em `src/index.css` (`--brand-blue`, `--brand-dark`, `--brand-green`) e no `tailwind.config.ts`. Ajusta os valores HSL aí para combinar com a tua marca.

## Estrutura de Dados

Os orçamentos são guardados na pasta `orcamentos/` como ficheiros JSON individuais (um por orçamento), servidos pela API local em `server.js`. Esta pasta está no `.gitignore` por defeito — **contém dados reais de clientes** e não deve ser commitada. Se precisares mesmo de versionar os teus próprios orçamentos, remove a linha `orcamentos/*` do `.gitignore`.

## Build para produção

```bash
npm run build
```

## Licença

MIT — ver [LICENSE](./LICENSE). Usa, adapta e reutiliza livremente.
