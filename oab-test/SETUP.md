## ⚠️ SETUP OBRIGATÓRIO - FIRESTORE RULES

O erro **403 "Permissão Insuficiente"** ao cadastrar ocorre porque as regras de segurança do Firestore não foram deployadas.

### 🚀 SOLUÇÃO RÁPIDA (3 minutos)

#### Opção 1: Usar Firebase CLI (Recomendado)

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Fazer login
firebase login

# 3. Deployar as regras
firebase deploy --only firestore:rules
```

#### Opção 2: Configurar Manualmente no Console

1. Abra [Firebase Console](https://console.firebase.google.com/)
2. Clique no projeto `teste-vocacional-mc`
3. Vá para **Firestore Database** → **Regras**
4. Cole o código abaixo:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow create: if request.auth.uid == request.resource.data.id;
    }
    
    match /tests/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }
  }
}
```

5. Clique em **Publicar**

### ✅ Pronto!

Agora você pode:
- ✅ Criar conta
- ✅ Fazer login
- ✅ Fazer o teste
- ✅ Ver resultados

---

## 🆘 Outros Problemas?

**Imagens das notícias não aparecem?**
- Coloque as imagens em `public/noticias/` com nomes como:
  - `1_administrativo.jpg`
  - `2_civil.jpg`
  - `3_constitucional.jpg`
  - etc...

**OpenAI não funciona?**
- Verifique se a chave API no `.env` está correta

**Erro de permissão ao fazer login?**
- Certifique-se de que a regra do Firestore foi publishada
