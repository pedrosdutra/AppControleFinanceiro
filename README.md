# 💰 AppControleFinanceiro

Aplicativo de controle financeiro pessoal construído com **React Native + Expo**, usando **Supabase** para autenticação e banco de dados.

## 🚀 Tecnologias

| Tecnologia | Finalidade |
|---|---|
| Expo SDK 54 | Framework mobile |
| Expo Router 6 | Navegação por sistema de arquivos |
| Supabase | Auth, Postgres, RLS e persistência |
| Zustand | Gerenciamento de estado global |
| TypeScript | Tipagem estática |
| react-native-url-polyfill | Compatibilidade do client Supabase no Expo |
| @expo/vector-icons | Ícones (Ionicons) |

## 📱 Telas

| Rota | Tela | Descrição |
|---|---|---|
| `/(auth)/login` | Login | Autenticação com e-mail e senha |
| `/(auth)/register` | Cadastro | Criação de conta |
| `/(tabs)/home` | Início | Resumo financeiro do mês, ações rápidas, transações recentes |
| `/(tabs)/transactions` | Transações | Lista com filtro (todas/receitas/despesas) + exclusão |
| `/(tabs)/categories` | Categorias | Exibição das categorias do back-end |
| `/(tabs)/team` | Equipe | Perfil dos membros do time com links sociais |
| `/(tabs)/about` | Sobre | Descrição do app e stack tecnológico |
| `/transaction/new` | Nova Transação | Formulário completo (tipo, valor, categoria, data, notas) |
| `/transaction/[id]` | Detalhes | Visualização e exclusão de uma transação |

## 🏗️ Estrutura

```
app/
├── _layout.tsx          # Layout raiz + AuthGate (redireciona por autenticação)
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── home.tsx
│   ├── transactions.tsx
│   ├── categories.tsx
│   ├── team.tsx
│   └── about.tsx
└── transaction/
    ├── new.tsx
    └── [id].tsx
src/
├── store/
│   ├── authStore.ts     # Zustand: auth, login, logout, signup
│   └── financeStore.ts  # Zustand: transações, categorias, resumo
├── services/
│   ├── api.ts           # Camada de acesso ao Supabase
│   └── supabase.ts      # Client Supabase + persistência de sessão
├── types/
│   └── index.ts
├── constants/
│   └── index.ts
└── components/
    ├── ui/
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── Card.tsx
    ├── TransactionCard.tsx
    └── SummaryCard.tsx
```

## ⚙️ Configuração

1. **Crie seu arquivo `.env`** com base no `.env.example`:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Rode o app:**
   ```bash
   npx expo start --clear --lan --port 8082
   ```

4. **Aplique o schema no Supabase:**
   use o arquivo [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql) no SQL Editor ou via Supabase CLI.

## 🗄️ Modelo de dados no Supabase

| Tabela | Finalidade |
|---|---|---|
| `profiles` | Dados públicos do usuário autenticado |
| `categories` | Categorias padrão e categorias do usuário |
| `transactions` | Receitas e despesas vinculadas ao usuário |

O schema também inclui enums, trigger de `updated_at`, trigger para criação automática de perfil, categorias seed e políticas de RLS.

