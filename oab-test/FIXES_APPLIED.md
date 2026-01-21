# ✅ Correções Aplicadas - Erro "No document to update"

## 🐛 Problema Original
Quando o usuário tentava enviar o formulário de Teste Vocacional (PreTest), aparecia o erro:
```
No document to update: projects/teste-vocacional-mc/databases/(default)/documents/users/{userId}
```

## 🔍 Causa Raiz
1. Em `Register.tsx`, usávamos `setDoc` para criar o documento do usuário
2. Em `PreTest.tsx`, usávamos `updateDoc` para atualizar esse documento
3. **O problema**: `updateDoc` só funciona em documentos que **já existem**
4. Se o documento não foi criado (ou a criação falhou), `updateDoc` falha com "No document to update"

## ✨ Soluções Implementadas

### 1. **PreTest.tsx** - Substituir `updateDoc` por `setDoc`
**Antes:**
```typescript
await updateDoc(doc(db, 'users', auth.currentUser.uid), updatedUser);
```

**Depois:**
```typescript
await setDoc(doc(db, 'users', auth.currentUser.uid), updatedUser, { merge: true });
```

**Por quê?** 
- `setDoc` com `merge: true` **cria** o documento se não existir, ou **atualiza** se existir
- `updateDoc` só **atualiza** documentos já existentes
- Agora, mesmo se Register falhar em criar o doc, PreTest consegue criar/atualizar

### 2. **Register.tsx** - Melhorar Tratamento de Erros
**Adicionado:**
- Try/catch separado para a operação Firestore (`setDoc`)
- Mensagem de erro específica para `permission-denied` (regras não ativadas)
- Se Firestore falhar, deleta o usuário da Auth para não deixar usuário "perdido"
- Logs melhorados para debug

**Novo fluxo:**
```
1. Criar usuário em Auth ✓
2. Tentar salvar em Firestore
   ├─ Sucesso? → Ir para PreTest ✓
   └─ Erro? → Mostrar erro + deletar usuário da Auth + permanecer em Register
```

### 3. **Novo Arquivo** - `FIRESTORE_RULES_SETUP.md`
Guia rápido para ativar as regras do Firestore, que é o bloqueador atual.

## 📋 Checklist Próximos Passos

- [ ] Ativar regras do Firestore (ver `FIRESTORE_RULES_SETUP.md`)
- [ ] Tentar registrar novo usuário
- [ ] Verificar em Firestore que o documento foi criado
- [ ] Preencher e enviar PreTest
- [ ] Completar Quiz
- [ ] Ver resultados

## 🧪 Como Testar

1. Abra http://localhost:5173
2. Vá para "Criar Conta"
3. Preencha:
   - Nome: `Test User`
   - CPF: `123.456.789-00`
   - WhatsApp: `(11) 99999-9999`
   - Email: `test123@test.com`
   - Senha: `teste123456` (mín 6 caracteres)
4. Clique em "Criar Conta"
5. **Se der erro de permissão**: Ative as regras (ver `FIRESTORE_RULES_SETUP.md`)
6. **Se redirecionar para PreTest**: ✅ Funcionou!
7. Preencha PreTest e continue no Quiz

## 🔧 Mudanças Técnicas Resumidas

| Arquivo | Mudança | Motivo |
|---------|---------|--------|
| `PreTest.tsx` | `updateDoc` → `setDoc(merge)` | Criar doc se não existir |
| `Register.tsx` | Melhorado try/catch Firestore | Detectar e tratar erros |
| `FIRESTORE_RULES_SETUP.md` | Novo arquivo | Guia de ativação de regras |

## ⚠️ Bloqueador Atual
**As regras do Firestore ainda NÃO estão ativadas!**

Isso causa `permission-denied` quando tenta salvar documentos. Para resolver:
1. Abra Firebase Console → teste-vocacional-mc → Firestore → Rules
2. Cole as regras de [FIRESTORE_RULES_SETUP.md](FIRESTORE_RULES_SETUP.md)
3. Clique "Publish"
4. Tente registrar novamente

Depois disso, tudo deve funcionar! 🚀

