# 🔐 Configuração de Regras Firestore - Guia Rápido

## ⚠️ Problema Atual
As regras do Firestore não foram ativadas ainda. Sem elas, nenhum usuário consegue se registrar porque a escrita no banco é bloqueada por padrão.

## ✅ Solução Rápida (Recomendado)

### Opção 1: Atualizar Regras via Firebase Console (Mais Fácil)

1. Abra [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto **teste-vocacional-mc**
3. No menu esquerdo, vá para **Firestore Database**
4. Clique na aba **Rules** no topo
5. **Limpe o conteúdo existente** e cole isto:

```firestore_rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Coleção de usuários
    match /users/{userId} {
      // Usuário pode ler e escrever apenas seus próprios dados
      allow read, write: if request.auth.uid == userId;
      // Permitir criação de novo documento se o UID autenticado bate
      allow create: if request.auth.uid == userId;
    }
    
    // Coleção de testes
    match /tests/{testId} {
      // Estrutura: tests/{userId}/{testId}/responses
      allow read, write: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }
  }
}
```

6. Clique **Publish**
7. Pronto! Agora os usuários conseguem se registrar

---

### Opção 2: Deploy via CLI (Se preferir)

Se tiver Firebase CLI instalado:

```bash
cd c:\Users\Rodrigo Reis\Desktop\teste-vocacional-mc\oab-test
firebase deploy --only firestore:rules
```

⚠️ **Se der erro**, certifique-se de:
- Estar na pasta certa do projeto
- Ter executado `firebase init` antes
- Ter arquivo `.firebaserc` apontando para `teste-vocacional-mc`

---

## 🧪 Teste Após Ativar Regras

1. Abra o app em `http://localhost:5173`
2. Vá para **Criar Conta**
3. Preencha com dados de teste:
   - Nome: `Test User`
   - CPF: `123.456.789-00`
   - WhatsApp: `(11) 99999-9999`
   - Email: `test@example.com`
   - Senha: `teste123456`
4. Clique **Criar Conta**
5. Se redirecionar para o teste vocacional, funcionou! ✅

---

## 📊 Estrutura do Banco (Para Referência)

```
/users/{userId}
  ├─ id: string (UID do usuário)
  ├─ name: string
  ├─ cpf: string
  ├─ whatsapp: string
  ├─ email: string
  ├─ graduationStatus: string ("Sim" ou "Não")
  ├─ period: string (semestre - apenas se não formado)
  ├─ examEdition: string ("45", "46", etc)
  ├─ studyHours: string (hrs/semana)
  └─ difficulties: string (áreas com dificuldade)

/tests/{userId}/{testId}
  ├─ userId: string
  ├─ createdAt: timestamp
  ├─ responses: object (respostas do quiz)
  ├─ scores: object (pontuação por área)
  └─ aiRanking: array (ranking gerado por ChatGPT)
```

---

## ❌ Se Ainda Não Funcionar

1. **Verifique se Firebase Auth está funcionando**: Tente fazer login em um navegador anônimo
2. **Confirme o ID do projeto**: Em `src/firebase.ts`, o projectId deve ser `teste-vocacional-mc`
3. **Veja os logs do navegador**: F12 → Console para ver erros específicos do Firestore
4. **Teste direto no Console**: Tente adicionar um documento manualmente em Firestore

---

## 📞 Suporte Rápido

Se vir erro como `permission-denied`, quer dizer que as regras ainda não foram ativadas.
Siga a **Opção 1** acima (Firebase Console) - é a mais rápida!

