# 💰 AppControleFinanceiro

Aplicativo de Controle Financeiro pessoal construído com **React Native + Expo**.

## 🚀 Tecnologias

| Tecnologia | Finalidade |
|---|---|
| Expo SDK 52 | Framework mobile |
| Expo Router 4 | Navegação por sistema de arquivos |
| Zustand | Gerenciamento de estado global |
| Axios | Requisições HTTP / integração com back-end |
| TypeScript | Tipagem estática |
| expo-secure-store | Armazenamento seguro do token JWT |
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
│   └── api.ts           # Axios + interceptors JWT
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

1. **Configure a URL do back-end** em `src/constants/index.ts`:
   ```ts
   export const API_BASE_URL = 'https://SUA-API.com/api';
   ```

2. **Instale as dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Rode o app:**
   ```bash
   npx expo start
   ```

## 🔗 Back-end esperado (endpoints)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Registro |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Usuário autenticado |
| GET | `/transactions` | Lista (params: month, year, type) |
| GET | `/transactions/:id` | Detalhe |
| POST | `/transactions` | Criar |
| PUT | `/transactions/:id` | Editar |
| DELETE | `/transactions/:id` | Excluir |
| GET | `/categories` | Listar categorias |
| GET | `/summary` | Resumo financeiro (params: month, year) |

