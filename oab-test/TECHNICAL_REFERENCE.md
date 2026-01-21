# 🏗️ Estrutura Técnica - Detalhes de Implementação

## 📦 Estrutura de Arquivos

```
oab-test/
├── src/
│   ├── pages/
│   │   ├── Quiz.tsx ⭐ PRINCIPAL
│   │   │   ├── questions[] array (9 perguntas)
│   │   │   ├── calculateScores() função
│   │   │   ├── calculateAndSubmit() integração IA
│   │   │   ├── renderQuestion() renderização
│   │   │   └── Styled components (NewsGrid, NewsCard, etc)
│   │   ├── Result.tsx (mostra resultado)
│   │   └── ... outras páginas
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── TopBar.tsx
│   │   └── Sidebar.tsx
│   ├── data/
│   │   └── news.ts ⭐ 14 NOTÍCIAS
│   ├── types/
│   │   └── index.ts ⭐ TestResponse INTERFACE
│   ├── firebase.ts (config + db)
│   ├── openai.ts (config + client)
│   └── App.tsx (routing)
├── public/
│   └── noticias/ ⭐ IMAGENS (a adicionar)
│       ├── admin_1.jpg
│       ├── admin_2.jpg
│       ├── ... (14 total)
│       └── placeholder.jpg (opcional)
├── firestore.rules ⭐ DEPLOY
├── SCORING_SYSTEM.md
├── COMPLETE_FLOW.md
├── AI_ANALYSIS_GUIDE.md
├── IMAGES_SETUP.md
├── SCORING_SUMMARY.md
└── DOCUMENTATION_INDEX.md
```

---

## 🔧 Tecnologias Usadas

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Styled-Components**: CSS-in-JS styling
- **React Router**: Routing entre páginas

### Backend
- **Firebase Firestore**: Banco de dados NoSQL
- **Firebase Auth**: Autenticação de usuários
- **Firebase Hosting**: Deploy

### IA
- **OpenAI API**: ChatGPT gpt-3.5-turbo
- **Prompt Engineering**: Mitos/verdades sobre OAB

---

## 📝 Types/Interfaces Principais

### `Area`
```typescript
type Area = 'Administrativo' 
          | 'Civil' 
          | 'Constitucional' 
          | 'Empresarial' 
          | 'Penal' 
          | 'Trabalho' 
          | 'Tributário';
```

### `TestResponse` (Firestore Document)
```typescript
interface TestResponse {
  // Identificação
  userId: string;
  createdAt: Date;
  
  // Respostas das 9 perguntas
  experience: Area[];                      // Q1
  tcc: Area[];                             // Q2
  processualist: 'Processo Civil' | 'Processo Penal' | 'Processo do Trabalho';  // Q3
  newsVotes: { [newsId: string]: boolean }; // Q4 (true=like, false=dislike)
  affinityFirst: Area;                     // Q5 (1º lugar ranking)
  affinitySecond: Area;                    // Q5 (2º lugar ranking)
  proceduralPieces: string[];              // Q6 (até 3)
  neverDoFirst: Area;                      // Q7 (1º lugar ranking)
  neverDoSecond: Area;                     // Q7 (2º lugar ranking)
  demotivated: Area[];                     // Q8
  reasons: {                               // Q9 (7 áreas)
    [key in Area]: {
      positive: string;
      negative: string;
    }
  };
  
  // Calculado pelo sistema
  scores: {                                // calculateScores()
    [key in Area]: number;
  };
  
  // Do ChatGPT
  aiRanking: Area[];                       // Array ordenado por IA
}
```

### `NewsItem`
```typescript
interface NewsItem {
  id: string;              // 'admin_1', 'civil_1', etc
  area: Area;              // A qual área pertence
  title: string;           // Título da notícia
  image: string;           // Nome arquivo: 'admin_1.jpg'
  interest?: string;       // Descrição opcional
}
```

---

## 🧮 Função calculateScores() - Pseudo-código

```typescript
function calculateScores(): { [key in Area]: number } {
  // Inicializar com zeros
  const scores = {
    Administrativo: 0,
    Civil: 0,
    Constitucional: 0,
    Empresarial: 0,
    Penal: 0,
    Trabalho: 0,
    Tributário: 0
  };
  
  // Q1: Experiência (+1 cada)
  responses.experience?.forEach(area => {
    scores[area] += 1;
  });
  
  // Q2: TCC (+1 cada)
  responses.tcc?.forEach(area => {
    scores[area] += 1;
  });
  
  // Q3: Processualista (+2 ou +1)
  if (responses.processualist === 'Processo Civil') {
    scores.Civil += 2;
    scores.Administrativo += 1;
    scores.Constitucional += 1;
    scores.Empresarial += 1;
    scores.Tributário += 1;
  } else if (responses.processualist === 'Processo Penal') {
    scores.Penal += 1;
  } else {
    scores.Trabalho += 1;
  }
  
  // Q4: Notícias (±1 cada)
  Object.entries(responses.newsVotes || {}).forEach(([newsId, liked]) => {
    const news = newsData.find(n => n.id === newsId);
    if (news) {
      if (liked === true) scores[news.area] += 1;
      if (liked === false) scores[news.area] -= 1;
    }
  });
  
  // Q5: Afinidade (+2 ou +1)
  if (responses.affinityFirst) {
    scores[responses.affinityFirst] += 2;
  }
  if (responses.affinitySecond) {
    scores[responses.affinitySecond] += 1;
  }
  
  // Q6: Peças (+1 cada)
  responses.proceduralPieces?.forEach(piece => {
    if (piece.includes('civil')) scores.Civil += 1;
    if (piece.includes('tributário')) scores.Tributário += 1;
    // ... etc para todas as peças
  });
  
  // Q7: Nunca Faria (-2 ou -1)
  if (responses.neverDoFirst) {
    scores[responses.neverDoFirst] -= 2;
  }
  if (responses.neverDoSecond) {
    scores[responses.neverDoSecond] -= 1;
  }
  
  // Q8: Desmotivado (-1 cada)
  responses.demotivated?.forEach(area => {
    scores[area] -= 1;
  });
  
  // Q9: Razões (não pontuado, vai direto para IA)
  
  return scores;
}
```

---

## 🤖 Prompt para ChatGPT - Estrutura

```typescript
const prompt = `
TESTE VOCACIONAL OAB - 2ª FASE
Contexto e instruções...

[SEÇÃO 1] MITOS A DESMENTIR
❌ Mito 1: Áreas com diferentes números de peças
✅ Verdade: Número similar entre todas

[SEÇÃO 2] DADOS REAIS
📊 Constitucional: 33% aprovação
📊 Civil: 27%
📊 Penal/Trabalho: 16%

[SEÇÃO 3] VERDADES FUNDAMENTAIS
✅ Afinidade é critério primário
✅ Prova é consultável
✅ Afinidade torna intuitivo

[SEÇÃO 4] RESPOSTAS DO USUÁRIO
Experiência: ${Array.join(', ')}
TCC: ${Array.join(', ')}
Processualista: ${String}
Notícias de interesse: ${String}
... etc

[SEÇÃO 5] SCORES AUTOMÁTICOS
Administrativo: X
Civil: Y
... (todas 7)

[SEÇÃO 6] RAZÕES TEXTUAIS
Civil: Positivo: "..." Negativo: "..."
... (todas 7)

[SEÇÃO 7] INSTRUÇÃO FINAL
Ranqueie as 7 áreas em formato:
[Área1, Área2, Área3, Área4, Área5, Área6, Área7]

Formato esperado: [Civil, Administrativo, Constitucional, ...]
`;
```

---

## 🔄 Fluxo de Execução no Quiz.tsx

```
┌─────────────────────────────────────────┐
│ Quiz Component monta                    │
├─────────────────────────────────────────┤
│ useState(step = 0)                      │
│ useState(responses = {})                │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Renderizar questão atual (step)         │
│ renderQuestion() baseado em              │
│ questions[step].type                    │
├─────────────────────────────────────────┤
│ types: 'multiSelect'                    │
│        'singleSelect'                   │
│        'newsVoting'                     │
│        'ranking'                        │
│        'textAreas'                      │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Usuário interage com componente         │
│ updateResponse(key, value) called       │
│ responses[key] = value                  │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Usuário clica Próximo (handleNext)      │
├─────────────────────────────────────────┤
│ if (step < totalSteps - 1)              │
│   setStep(step + 1)                     │
│ else                                    │
│   calculateAndSubmit()                  │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ calculateAndSubmit() rodando            │
├─────────────────────────────────────────┤
│ 1. scores = calculateScores()           │
│                                         │
│ 2. testResponse = {                     │
│      userId, experience, tcc, ...       │
│      scores,                            │
│      aiRanking: []  ← ainda vazio       │
│    }                                    │
│                                         │
│ 3. newsLiked = filtrar newsVotes       │
│    newsDisliked = filtrar newsVotes    │
│                                         │
│ 4. prompt = montar string com dados    │
│                                         │
│ 5. completion = await openai.chat...   │
│    → envia prompt                       │
│    ← recebe resposta da IA             │
│                                         │
│ 6. ranking = parse(completion.text)    │
│    testResponse.aiRanking = ranking    │
│                                         │
│ 7. await setDoc(Firestore)             │
│    salva testResponse completo         │
│                                         │
│ 8. navigate('/result')                 │
└─────────────────────────────────────────┘
```

---

## 💾 Estrutura no Firestore

```
firestore
└── tests/
    └── {userId}/
        ├── userId: "abc123"
        ├── experience: ["Civil", "Administrativo"]
        ├── tcc: ["Civil"]
        ├── processualist: "Processo Civil"
        ├── newsVotes: {
        │   "civil_1": true,
        │   "civil_2": false,
        │   "admin_1": true,
        │   ...
        │ }
        ├── affinityFirst: "Civil"
        ├── affinitySecond: "Administrativo"
        ├── proceduralPieces: [...]
        ├── neverDoFirst: "Penal"
        ├── neverDoSecond: "Trabalho"
        ├── demotivated: []
        ├── reasons: {
        │   "Administrativo": {
        │     "positive": "...",
        │     "negative": "..."
        │   },
        │   ...
        │ }
        ├── scores: {
        │   "Administrativo": 2,
        │   "Civil": 8,
        │   "Constitucional": 1,
        │   "Empresarial": 1,
        │   "Penal": 1,
        │   "Trabalho": -1,
        │   "Tributário": 1
        │ }
        ├── aiRanking: ["Civil", "Administrativo", ...]
        └── createdAt: timestamp
```

---

## 🎨 Componentes Styled (Quiz.tsx)

```typescript
// Perguntas em grid 2 colunas (notícias)
const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// Card de notícia
const NewsCard = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4CAF50;
    transform: translateY(-4px);
  }
`;

// Container da imagem (aspect ratio 3:2)
const NewsImageContainer = styled.div`
  width: 100%;
  padding-top: 66.67%; /* 3:2 aspect ratio */
  position: relative;
  background: #f0f0f0;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Botão de votação
const VoteButton = styled.button<{ type: 'like' | 'dislike'; active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  
  background-color: ${props => 
    props.type === 'like' 
      ? props.active ? '#4CAF50' : '#e8f5e9'
      : props.active ? '#f44336' : '#ffebee'
  };
  
  color: ${props => 
    props.type === 'like'
      ? props.active ? 'white' : '#4CAF50'
      : props.active ? 'white' : '#f44336'
  };
  
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;
```

---

## 🔐 Firestore Rules

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow create: if request.auth.uid == request.resource.data.id;
    }
    
    // Testes
    match /tests/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 Deploy Checklist

```
Before Go-Live:
  [ ] Adicionar 14 imagens em public/noticias/
  [ ] Deploy firestore.rules via Firebase CLI
  [ ] Testar fluxo completo (registro → quiz → resultado)
  [ ] Verificar ChatGPT chamadas têm rate limit ok
  [ ] Testar em diferentes navegadores/dispositivos
  [ ] Validar scores calculados estão corretos
  [ ] Verificar IA retorna ranking válido
  [ ] Testar Firestore persistence
  [ ] Deploy frontend via Firebase Hosting
  
Production:
  [ ] Monitorar API ChatGPT usage/costs
  [ ] Coletar feedback de usuários
  [ ] Monitorar erros/crashes
  [ ] Validar dados salvos em Firestore
  [ ] Refinar prompts conforme necessário
```

---

## 📊 Métricas de Implementação

| Item | Status | Arquivo |
|------|--------|---------|
| Estrutura de perguntas | ✅ | Quiz.tsx:286 |
| Função calculateScores | ✅ | Quiz.tsx:374 |
| Integração IA | ✅ | Quiz.tsx:474-502 |
| Tipos TypeScript | ✅ | types/index.ts |
| Dados de notícias | ✅ | data/news.ts |
| Styled components | ✅ | Quiz.tsx:100-250 |
| Firestore save | ✅ | Quiz.tsx:505 |
| Imagens | ⏳ | public/noticias/ |
| Firestore rules | ⏳ | firestore.rules |

---

## 🔗 Referências Rápidas

**Número de linhas principais**:
- Quiz.tsx: ~717 linhas
  - calculateScores: linhas 374-434
  - calculateAndSubmit: linhas 437-508
  - renderQuestion: linhas 512-700

**Constantes importantes**:
- 7 áreas (Area type)
- 9 perguntas (questions array)
- 14 notícias (newsData array)
- ±15 intervalo de score teórico

**Funções principais**:
- `calculateScores()`: Calcula pontos
- `calculateAndSubmit()`: Integração IA + Firestore
- `renderQuestion()`: Renderiza cada tipo pergunta
- `updateResponse()`: Atualiza estado responses
- `handleNext()`: Avança para próxima pergunta

---

Este documento serve como referência técnica para entender a implementação completa! 🎓

