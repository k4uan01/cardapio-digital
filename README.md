# Cardápio Digital

Sistema de cardápio digital web, onde empresas criam seus produtos e os clientes conseguem visualizar.

## 🚀 Stack Tecnológica

### Frontend
- **TypeScript** - Tipagem e lógica
- **Next.js** - Framework React (roteamento, SSR, otimizações)
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes prontos
- **React Query/TanStack Query** - Gerenciar cache e chamadas de API
- **Zod** - Validação de dados backend e frontend

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework para criar API REST

### Banco de Dados
- **Supabase** - PostgreSQL + Auth + Storage + Realtime

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento do Next.js
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run server` - Inicia o servidor Express backend

## 📁 Estrutura do Projeto

```
cardapio-digital/
├── app/              # App Router do Next.js
│   ├── layout.tsx    # Layout principal
│   ├── page.tsx      # Página inicial
│   ├── providers.tsx # Providers (React Query)
│   └── globals.css   # Estilos globais
├── components/       # Componentes React
├── lib/              # Utilitários e configurações
│   ├── supabase/     # Cliente Supabase
│   └── utils.ts      # Funções utilitárias
├── server/           # Backend Express
│   └── index.js      # Servidor Express
└── public/           # Arquivos estáticos
```

## 🎨 Shadcn/ui

O projeto está configurado para usar Shadcn/ui. Para adicionar novos componentes:

```bash
npx shadcn-ui@latest add [component-name]
```

## 🔐 Supabase

O cliente Supabase está configurado em `lib/supabase/client.ts`. Certifique-se de ter as variáveis de ambiente configuradas corretamente.

## 🚀 Deploy na Vercel

O projeto está pronto para deploy na Vercel! Siga os passos abaixo:

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Projeto configurado no Supabase

### Passos para Deploy

1. **Conecte seu repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Conecte seu repositório do GitHub/GitLab/Bitbucket

2. **Configure as variáveis de ambiente:**
   Na Vercel, adicione as seguintes variáveis de ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy automático:**
   - A Vercel detectará automaticamente que é um projeto Next.js
   - O build será executado automaticamente
   - Após o deploy, seu projeto estará online!

### Notas Importantes

- ⚠️ O servidor Express (`server/index.js`) não é necessário na Vercel, pois o Next.js já possui API Routes
- ✅ O projeto já está configurado para usar Next.js API Routes (ex: `app/api/test-supabase/route.ts`)
- ✅ O build foi testado e está funcionando corretamente

## 📝 Próximos Passos

1. Configure seu projeto no Supabase
2. Adicione as variáveis de ambiente no arquivo `.env` (desenvolvimento) ou na Vercel (produção)
3. Faça o deploy na Vercel
4. Comece a desenvolver suas funcionalidades!

