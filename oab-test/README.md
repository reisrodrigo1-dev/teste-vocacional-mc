# 🎓 Teste Vocacional MeuCurso

Aplicação de teste vocacional para a OAB (Ordem dos Advogados do Brasil) com análise por IA.

## 📋 Requisitos

- Node.js 18+
- npm ou yarn
- Firebase CLI (para deploy das regras de segurança)

## 🚀 Instalação & Setup

### 1. Instalar Dependências
```bash
cd oab-test
npm install
```

### 2. Variáveis de Ambiente
O arquivo `.env` já contém a chave da API OpenAI. A configuração do Firebase está no arquivo `firebase.ts`.

### 3. Deploy das Regras de Segurança (IMPORTANTE!)

Para que o sistema funcione corretamente, você precisa fazer o deploy das regras de segurança do Firestore:

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Fazer login no Firebase
firebase login

# Deploy das regras
firebase deploy --only firestore:rules
```

**Ou configure manualmente no Console Firebase:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `teste-vocacional-mc`
3. Vá para Firestore Database → Regras
4. Copie e cole o conteúdo do arquivo `firestore.rules`

### 4. Iniciar o Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
oab-test/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── PreTest.tsx
│   │   ├── Quiz.tsx
│   │   └── Result.tsx
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── types/
│   │   └── index.ts
│   ├── firebase.ts
│   ├── openai.ts
│   ├── App.tsx
│   └── index.css
├── public/
│   └── noticias/         ← Coloque imagens das notícias aqui
├── firestore.rules       ← Regras de segurança (fazer deploy!)
├── firebase.json
└── .env                  ← Chaves e configurações
```

## 🔑 Fluxo da Aplicação

1. **Login/Register** - Autenticação com Firebase
2. **PreTest** - Coleta informações sobre o usuário
3. **Quiz** - Teste com 11 questões sobre afinidade com áreas do direito
4. **Análise IA** - ChatGPT analisa respostas e ranqueia áreas
5. **Resultado** - Exibe pódio com top 3 áreas

## 📸 Imagens das Notícias

Coloque as imagens na pasta `public/noticias/` seguindo o padrão:
- `1_administrativo.jpg`
- `2_civil.jpg`
- `3_constitucional.jpg`
- etc...

## 🔐 Segurança

- Senhas criptografadas com Firebase Auth
- Firestore com regras de acesso (apenas usuário pode ver seus dados)
- CPF e WhatsApp armazenados seguramente
- OpenAI API key protegida em variável de ambiente

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 💻 Desktop (1920x1080+)
- 💻 Laptop (1366x768+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## 🎨 Design

Inspirado em Duolingo com:
- Gradiente verde (#4CAF50) para roxo (#9C27B0)
- Animações suaves
- Cards com sombras
- Tipografia clara

## 🐛 Troubleshooting

### Erro 403 - Permissão Insuficiente
**Solução:** Fazer o deploy das regras de segurança (veja seção acima)

### Imagens das Notícias não carregam
**Solução:** Coloque as imagens em `public/noticias/` com nomes começando em números (ex: `1_administrativo.jpg`)

### OpenAI não funciona
**Solução:** Verifique se a chave API está correta no arquivo `.env`

## 📝 Licença

Desenvolvido para MeuCurso.com.br
