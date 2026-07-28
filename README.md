# GSB Avicultura: Raça e Raízes

# Prompt para o Claude — Site + Painel Administrativo "Galinha GSB"

## Contexto do projeto

Estou recriando o site **Galinha GSB (Galinha Sertanejo Balão)**, uma plataforma de vendas
e intermediação da raça de galinha Sertanejo Balão — ovos férteis, pintinhos, matrizes e
reprodutores GSB.

Quero manter a **essência do site original**: visual orgânico, rústico, ligado ao universo
rural/sertanejo, com identidade de criador/avicultura. Porém quero uma versão **mais moderna**,
com melhor hierarquia visual, tipografia atual e um layout mais limpo — sem perder o
tom acolhedor e "de fazenda".

Preciso que o Claude gere:
1. O site público (institucional + catálogo + blog)
2. Um **painel administrativo** para gerenciar o conteúdo
3. Toda a estrutura pronta para deploy na **Vercel**, com banco de dados no **TiDB Cloud**

---

## Stack técnica (obrigatória)

- **Framework:** Next.js (App Router), TypeScript
- **Hospedagem:** Vercel
- **Banco de dados:** TiDB Cloud (MySQL-compatible, serverless)
  - Usar **Prisma ORM** com o driver `mysql2` ou o **Kysely** com o adaptador oficial da TiDB Cloud
  - Configurar connection pooling adequado para ambiente serverless da Vercel (TiDB Cloud Serverless já suporta isso nativamente — usar a connection string com SSL habilitado)
  - Variáveis de ambiente: `DATABASE_URL` (não commitar, usar `.env.local` e Vercel Environment Variables)
- **Estilização:** Tailwind CSS
- **Autenticação do admin:** NextAuth.js (Credentials Provider) ou solução simples de login com sessão via cookie assinado — sem cadastro público, só um (ou poucos) usuário(s) administrador(es) fixos no banco
- **Upload de imagens:** usar um serviço externo compatível com Vercel (ex: Vercel Blob, Cloudflare R2 ou UploadThing) — evitar salvar arquivos localmente, pois a Vercel é serverless/efêmera
- **Formulários:** React Hook Form + Zod para validação

---

## Identidade visual (manter orgânico, mas modernizar)

Baseado no site original (referência visual anexada):

- **Paleta principal:** verde como cor dominante (verde escuro no header, banners e footer;
  verde médio em elementos de destaque), combinado com branco/cinza-claro neutro nos cards
  de conteúdo, e toques de laranja/amarelo em cards de categoria/destaque para dar contraste
  quente. Evitar tom "corporativo frio" — usar gradientes suaves de verde para manter o clima
  orgânico
- **Bordas bem arredondadas** (cards, botões, banners) — esse é um traço forte da identidade
  original e deve ser mantido
- Tipografia: uma fonte com leve personalidade para títulos (transmitindo tradição/organicidade)
  + uma sans-serif limpa para textos (transmitindo modernidade)
- Elementos orgânicos: texturas suaves, ilustrações/ícones de galinha, ovo, pena — usados com
  moderação, sem poluir
- Fotos em destaque (aves, ovos, plantel) com bom espaçamento, cards com sombra suave
- Layout responsivo mobile-first (público-alvo provavelmente acessa muito pelo celular)

### Estrutura de seções da Home (referência do site original, modernizada)

1. **Header** — logo + menu de navegação + CTA (ex: "Fale conosco" / WhatsApp), fundo verde
2. **Hero** — título de impacto (ex: "Conheça a importância da raça GSB"), texto de apoio,
   botão CTA, e foto de destaque de uma ave (pessoa segurando um exemplar) à direita
3. **Fileira de 3 cards brancos** — diferenciais/recursos (ex: "Procedência garantida",
   "Suporte ao criador", "Entrega segura" — adaptar aos diferenciais reais do negócio)
4. **Fileira de 3 cards de categoria** (cores contrastantes: verde escuro, laranja, amarelo/
   gradiente) — atalho para as categorias do catálogo: Ovos férteis / Pintinhos / Matrizes /
   Reprodutores
5. **Banner CTA grande** — bloco verde arredondado de destaque, com texto forte + botão de ação
   (ex: convite para conhecer o catálogo completo ou entrar em contato)
6. **Linha de ícones com texto curto** — passos/diferenciais rápidos (4 a 5 itens, tipo "como
   funciona" ou "por que escolher a GSB")
7. **Footer** — fundo verde escuro, logo, colunas de links (site, categorias, contato, redes
   sociais)

---

## Imagens e conteúdo inicial (placeholders)

Como ainda não tenho todas as fotos reais do plantel, o projeto deve nascer com
**imagens genéricas/placeholder** (de banco de imagens livre de direitos — ex: Unsplash,
via URL direta, ou ilustrações simples em SVG) em todos os pontos que normalmente teriam
foto: hero, cards de categoria, cards de post/anúncio, blog, footer/logo.

Regras importantes:
- Toda imagem placeholder deve estar associada a um campo editável no banco (nunca
  "hardcoded" sem opção de troca)
- No **painel admin**, cada post/anúncio, cada categoria em destaque e as imagens principais
  do site (hero, banners) devem ter um campo de **upload/troca de imagem** — o administrador
  precisa conseguir substituir qualquer imagem genérica por uma foto real a qualquer momento,
  sem precisar mexer em código
- Ao criar um novo post/produto sem foto, o sistema deve aplicar automaticamente uma imagem
  placeholder padrão (por categoria, se possível — ex: placeholder diferente para "ovos",
  "pintinhos", "matrizes", "reprodutores") até que o admin envie a foto real
- Interface de upload deve suportar múltiplas imagens por post, com preview antes de salvar,
  reordenação (drag and drop, se possível) e opção de remover/trocar imagem individualmente

---

## Site público — páginas

1. **Home**
   - Hero com imagem/vídeo de destaque e chamada principal
   - Seção "sobre a raça GSB" (breve)
   - Destaques do catálogo (últimos posts/anúncios)
   - Seção de credibilidade (depoimentos, tempo de criação, etc. — se aplicável)
   - Contato/CTA (WhatsApp, Instagram, etc.)

2. **Catálogo / Anúncios** (alimentado pelos posts do admin)
   - Filtro por categoria: Ovos férteis / Pintinhos / Matrizes / Reprodutores
   - Cada item: fotos, título, descrição, preço (opcional), status (disponível/vendido/reservado)
   - Página de detalhe do anúncio

3. **Sobre**
   - História do criador/plantel, informações sobre a raça

4. **Contato**
   - Formulário simples + links diretos (WhatsApp, Instagram, e-mail)

5. **Blog** (opcional, se o site original tiver — cuidados com a raça, dicas de criação, novidades do plantel)

> Os posts do catálogo e do blog são criados **manualmente** pelo administrador — não há
> integração automática com redes sociais nem importação de dados externos.

---

## Painel administrativo (`/admin`)

### Autenticação
- Tela de login (`/admin/login`) protegida — apenas usuários cadastrados no banco (seed manual)
- Middleware do Next.js protegendo todas as rotas `/admin/*`

### Dashboard (`/admin`)
- Visão geral: quantidade de anúncios ativos, últimos posts publicados, atalhos rápidos

### Gerenciar Posts/Anúncios (`/admin/posts`)
- Listagem com busca e filtro por categoria/status
- Criar novo post: título, categoria (ovos/pintinhos/matrizes/reprodutores), descrição
  (editor de texto simples, tipo rich text ou markdown), preço (opcional), status
  (rascunho/publicado/vendido), múltiplas fotos (upload com preview e reordenação)
- Editar / excluir post
- Publicar/despublicar (toggle de status)

### Gerenciar Blog (`/admin/blog`) — se aplicável
- Mesma lógica de CRUD: título, conteúdo, capa, data de publicação, status

### Configurações gerais (`/admin/settings`)
- Editar informações de contato exibidas no site (WhatsApp, Instagram, e-mail, endereço)
- Editar textos institucionais (seção "sobre")

---

## Modelo de dados sugerido (Prisma schema — ponto de partida)

```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hash (bcrypt)
  createdAt DateTime @default(now())
}

model Post {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  category    Category
  description String     @db.Text
  price       Decimal?   @db.Decimal(10, 2)
  status      PostStatus @default(DRAFT)
  images      Image[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Image {
  id     String @id @default(cuid())
  url    String
  order  Int    @default(0)
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String
}

model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  coverImage  String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Category {
  OVOS_FERTEIS
  PINTINHOS
  MATRIZES
  REPRODUTORES
}

enum PostStatus {
  DRAFT
  PUBLISHED
  SOLD
}

// Configurações gerais editáveis pelo admin (contato, textos institucionais)
model SiteSettings {
  id            String   @id @default("main") // registro único
  whatsapp      String?
  instagram     String?
  email         String?
  aboutText     String?  @db.Text
  heroImage     String?  // URL da imagem do hero, com placeholder padrão no seed
  updatedAt     DateTime @updatedAt
}

// Imagem placeholder padrão por categoria, usada quando um post é criado sem foto
model CategoryPlaceholder {
  category     Category @id
  imageUrl     String
}
```

---

## Instruções finais para o Claude

- Gerar o projeto Next.js completo, com estrutura de pastas organizada (`app/`, `components/`,
  `lib/`, `prisma/`)
- Incluir `schema.prisma` configurado para TiDB Cloud (provider `mysql`, com `relationMode = "prisma"`
  se necessário, já que TiDB Serverless tem particularidades com foreign keys)
- Incluir instruções de setup no `README.md`: variáveis de ambiente, comando de migração
  (`prisma migrate deploy` ou `db push`), seed do usuário admin, e passos de deploy na Vercel
- Componentizar bem o design system (cores, tipografia, espaçamentos) para manter consistência
  entre site público e admin, mas o admin pode ter uma interface mais neutra/funcional (não
  precisa do mesmo "clima orgânico" do site público — foco em usabilidade)
- Priorizar performance (Server Components onde fizer sentido, imagens otimizadas via
  `next/image`)
- Código limpo, tipado, comentado nos pontos-chave de integração com TiDB Cloud

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://galinha-gsb-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/22283bae-4360-4524-8b15-cf24a08446a5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
