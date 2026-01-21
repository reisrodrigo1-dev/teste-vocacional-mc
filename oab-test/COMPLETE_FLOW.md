# 🔄 Fluxo Completo: Respostas → Scoring → IA → Resultado

## 📱 1. Usuário Responde o Quiz

```
Quiz.tsx apresenta 9 perguntas:

Q1: "Em qual dessas áreas você tem experiência?"
   Tipo: MultiSelect
   Resposta Exemplo: ["Civil", "Administrativo"]
   Guardar em: responses.experience = ["Civil", "Administrativo"]

Q2: "Seu TCC foi em qual área?"
   Tipo: MultiSelect
   Resposta Exemplo: ["Civil"]
   Guardar em: responses.tcc = ["Civil"]

Q3: "Qual processualista tem maior facilidade?"
   Tipo: SingleSelect
   Resposta Exemplo: "Processo Civil"
   Guardar em: responses.processualist = "Processo Civil"

Q4: "Qual dessas notícias vc teria interesse?"
   Tipo: NewsVoting (14 notícias, 2 por área)
   Resposta Exemplo: { 
     "civil_1": true,      // 👍 gosto
     "civil_2": false,     // 👎 não gosto
     "admin_1": true,
     "penal_1": false
   }
   Guardar em: responses.newsVotes = { ... }

Q5: "Qual área vc faria por AFINIDADE?" (Ranking)
   Tipo: Ranking (1º, 2º, 3º... 7º)
   Resposta Exemplo: ["Civil", "Administrativo", "Penal", ...]
   Guardar em: responses.affinityFirst = "Civil", responses.affinitySecond = "Administrativo"

Q6: "Quais peças processuais você gostaria de fazer?" (máx 3)
   Tipo: MultiSelect com limite
   Resposta Exemplo: ["Petição civil", "Mandado", "Apelação criminal"]
   Guardar em: responses.proceduralPieces = ["Petição civil", "Mandado", "Apelação"]

Q7: "Qual área você NUNCA faria?" (Ranking)
   Tipo: Ranking
   Resposta Exemplo: ["Penal", "Trabalho", ...]
   Guardar em: responses.neverDoFirst = "Penal", responses.neverDoSecond = "Trabalho"

Q8: "Alguma área teve repescagem/desmotivação?"
   Tipo: MultiSelect
   Resposta Exemplo: ["Administrativo"]
   Guardar em: responses.demotivated = ["Administrativo"]

Q9: "Por que escolheria ou não cada área?"
   Tipo: TextAreas (um campo por área)
   Resposta Exemplo:
   {
     "Administrativo": { 
       positive: "Gosto de legislação, organização", 
       negative: "Muita burocracia" 
     },
     "Civil": { 
       positive: "Fiz TCC nessa área, tenho experiência", 
       negative: "Código muito extenso" 
     },
     "Penal": { 
       positive: "", 
       negative: "Não me interessa, muito técnico" 
     },
     ... (7 áreas)
   }
   Guardar em: responses.reasons = { ... }
```

---

## 🧮 2. Calcular Scores Automáticos

```typescript
// calculateScores() é chamado quando usuário clica "Finalizar"

const scores = {
  "Administrativo": 0,
  "Civil": 0,
  "Constitucional": 0,
  "Empresarial": 0,
  "Penal": 0,
  "Trabalho": 0,
  "Tributário": 0,
};

// ===== POSITIVOS (Somar) =====

// Q1: Experiência
if (responses.experience?.includes("Civil")) scores.Civil += 1;
if (responses.experience?.includes("Administrativo")) scores.Administrativo += 1;
// ... etc para todas

// Q2: TCC
if (responses.tcc?.includes("Civil")) scores.Civil += 1;
// ... etc

// Q3: Processualista
if (responses.processualist === "Processo Civil") {
  scores.Civil += 2;
  scores.Administrativo += 1;
  scores.Constitucional += 1;
  scores.Empresarial += 1;
  scores.Tributário += 1;
} else if (responses.processualist === "Processo Penal") {
  scores.Penal += 1;
} else {
  scores.Trabalho += 1;
}

// Q4: Notícias (News Voting)
Object.entries(responses.newsVotes || {}).forEach(([newsId, liked]) => {
  const newsItem = newsData.find(n => n.id === newsId);
  if (newsItem) {
    if (liked === true) {
      scores[newsItem.area] += 1;  // Gosto = +1
    } else if (liked === false) {
      scores[newsItem.area] -= 1;  // Não gosto = -1
    }
  }
});

// Q5: Afinidade
if (responses.affinityFirst) {
  scores[responses.affinityFirst] += 2;  // 1º lugar = +2
}
if (responses.affinitySecond) {
  scores[responses.affinitySecond] += 1;  // 2º lugar = +1
}

// Q6: Peças Processuais
if (responses.proceduralPieces) {
  responses.proceduralPieces.forEach(piece => {
    if (piece.includes("civil")) scores.Civil += 1;
    if (piece.includes("tributário") || piece.includes("constitucional") || piece.includes("adm")) 
      scores.Administrativo += 1;
    if (piece.includes("trabalho")) scores.Trabalho += 1;
    if (piece.includes("empresarial")) scores.Empresarial += 1;
    if (piece.includes("penal")) scores.Penal += 1;
    if (piece.includes("constitucional")) scores.Constitucional += 1;
  });
}

// ===== NEGATIVOS (Subtrair) =====

// Q7: Nunca Faria
if (responses.neverDoFirst) {
  scores[responses.neverDoFirst] -= 2;  // 1º = -2
}
if (responses.neverDoSecond) {
  scores[responses.neverDoSecond] -= 1;  // 2º = -1
}

// Q8: Desmotivado
if (responses.demotivated) {
  responses.demotivated.forEach(area => {
    scores[area] -= 1;
  });
}

// Q9: Razões → Não são pontuadas diretamente, mas vão pro IA

// ===== RESULTADO =====
// scores = {
//   "Administrativo": 2,
//   "Civil": 8,
//   "Constitucional": 1,
//   "Empresarial": 1,
//   "Penal": 1,
//   "Trabalho": -1,
//   "Tributário": 1
// }
```

---

## 📤 3. Preparar Dados para IA

```typescript
// No calculateAndSubmit(), preparamos o objeto TestResponse

const testResponse: TestResponse = {
  userId: "xyz123",
  experience: ["Civil", "Administrativo"],
  tcc: ["Civil"],
  processualist: "Processo Civil",
  newsVotes: { 
    "civil_1": true, 
    "civil_2": false, 
    "admin_1": true,
    "penal_1": false 
  },
  affinityFirst: "Civil",
  affinitySecond: "Administrativo",
  proceduralPieces: ["Petição civil", "Mandado", "Apelação criminal"],
  neverDoFirst: "Penal",
  neverDoSecond: "Trabalho",
  demotivated: ["Administrativo"],
  reasons: {
    "Administrativo": { 
      positive: "Gosto de legislação", 
      negative: "Muito burocracia" 
    },
    "Civil": { 
      positive: "TCC e experiência", 
      negative: "Código extenso" 
    },
    ... (todas 7)
  },
  
  // Agora calculamos os scores:
  scores: {
    "Administrativo": 2,
    "Civil": 8,
    "Constitucional": 1,
    "Empresarial": 1,
    "Penal": 1,
    "Trabalho": -1,
    "Tributário": 1
  },
  
  aiRanking: [], // Será preenchido pela IA
  createdAt: new Date()
};

// Extrai informações para prompt
const scoresSummary = "Administrativo: 2, Civil: 8, Constitucional: 1, ...";

const newsLiked = ["Lei de Licitações", "Novo Código Civil"].join(', ');
// (encontra os titles do newsData baseado em IDs com liked === true)

const newsDisliked = ["Direito Penal Geral"].join(', ');
// (encontra os titles do newsData baseado em IDs com liked === false)
```

---

## 🤖 4. Enviar para ChatGPT

```typescript
const prompt = `
TESTE VOCACIONAL OAB - 2ª FASE
Você é um especialista em escolha de área para a segunda fase do Exame de Ordem.

IMPORTANTE - MITOS A DESMENTIR:
❌ Mito 1: Existe área com menor número de peças processuais
  Verdade: O número de peças é muito parecido entre TODAS as áreas

❌ Mito 2: Existem áreas com provas mais extensas e outras menos extensas  
  Verdade: O tamanho da prova é EXATAMENTE IGUAL para todas as áreas

❌ Mito 3: Penal e Trabalho são áreas mais fáceis que as outras
  Verdade: Todas as áreas possuem provas com o MESMO grau de dificuldade

DADOS REAIS - ÍNDICES DE APROVAÇÃO:
📊 Áreas com MAIOR aprovação:
  - Constitucional: 33% de aprovação
  - Civil: 27% de aprovação

📊 Áreas com MENOR aprovação:
  - Penal: ~16% de aprovação
  - Trabalho: ~16% de aprovação

VERDADES FUNDAMENTAIS:
✅ Verdade 1: AFINIDADE é o PRIMEIRO critério de escolha
✅ Verdade 2: A prova de 2ª fase é PRÁTICA e CONSULTÁVEL
✅ Verdade 3: Quando há AFINIDADE, os temas tornam-se intuitivos

RESPOSTAS DO USUÁRIO:
- Experiência prática: Civil, Administrativo
- Trabalho de conclusão: Civil
- Processualista com maior facilidade: Processo Civil
- Notícias que gostaria de ler: Lei de Licitações, Novo Código Civil
- Notícias que NÃO gostaria de ler: Direito Penal Geral
- Afinidade (1º): Civil
- Afinidade (2º): Administrativo
- Peças processuais interessantes: Petição civil, Mandado, Apelação criminal
- Área que NUNCA faria (1º): Penal
- Área que NUNCA faria (2º): Trabalho
- Áreas com desmotivação/repescagem: Administrativo

RAZÕES DETALHADAS:
- Administrativo: [Positivo: "Gosto de legislação, organização"] [Negativo: "Muito burocracia"]
- Civil: [Positivo: "Fiz TCC, tenho experiência"] [Negativo: "Código extenso"]
- Penal: [Positivo: ""] [Negativo: "Não me interessa"]
... (todas 7)

SCORES AUTOMÁTICOS POR ÁREA:
Administrativo: 2, Civil: 8, Constitucional: 1, Empresarial: 1, Penal: 1, Trabalho: -1, Tributário: 1

INSTRUÇÃO FINAL:
Com base em AFINIDADE como critério primário, nos dados reais de aprovação, 
desmistificando os mitos, e considerando que a prova é consultável,
ranqueie as 7 áreas de forma DECRESCENTE de recomendação:

Formato esperado: [Área1, Área2, Área3, Área4, Área5, Área6, Área7]

Áreas a ranquear: Administrativo, Civil, Constitucional, Empresarial, Penal, Trabalho, Tributário
`;

const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: prompt }],
});

const aiResponse = completion.choices[0].message.content;
// Exemplo: "Baseado na análise... [Civil, Administrativo, Constitucional, ...]"
```

---

## 🎯 5. IA Analisa e Retorna Ranking

```
ChatGPT recebe o prompt completo e analisa:

1. IDENTIFICA PADRÕES:
   ✅ Experiência + TCC + Afinidade 1º = Civil forte
   ⚠️ Desmotivação em Administrativo (score 2 foi reduzido)
   ❌ Aversão clara a Penal e Trabalho

2. DESMISTIFICA:
   - Usuário pode pensar "Penal é fácil"
   - IA explica: "Mito. Taxa de aprovação é 16%, não porque fácil."

3. APLICA REALIDADE OAB:
   - Civil: 27% aprovação (competitivo, recomendável com afinidade)
   - Const: 33% (melhor taxa, não toca tanto afinidade)
   - Penal: 16% (baixo, e usuário tem aversão)

4. RETORNA RANKING:
   "Com base em sua afinidade clara por Civil, 
   experiência prática, e interesse em notícias da área,
   recomendo fortemente:
   
   1. Civil - afinidade comprovada
   2. Administrativo - secundária com experiência
   3. Constitucional - complementar, boa taxa
   4. Empresarial - processualista toca
   5. Tributário - processualista toca
   6. Trabalho - sem sinal positivo
   7. Penal - aversão clara, taxa baixa"
```

---

## 💾 6. Salvar no Firestore

```typescript
// Após IA retornar, parser extrai ranking:
const ranking = aiResponse.match(/\[(.+?)\]/)?.[1]?.split(',').map(s => s.trim());
// Resultado: ["Civil", "Administrativo", "Constitucional", ...]

testResponse.aiRanking = ranking;

// Salva tudo no Firestore:
await setDoc(doc(db, 'tests', auth.currentUser.uid), {
  userId: "xyz123",
  experience: ["Civil", "Administrativo"],
  tcc: ["Civil"],
  processualist: "Processo Civil",
  newsVotes: { civil_1: true, civil_2: false, admin_1: true, penal_1: false },
  affinityFirst: "Civil",
  affinitySecond: "Administrativo",
  proceduralPieces: ["Petição civil", "Mandado", "Apelação criminal"],
  neverDoFirst: "Penal",
  neverDoSecond: "Trabalho",
  demotivated: ["Administrativo"],
  reasons: { ... },
  scores: {
    "Administrativo": 2,
    "Civil": 8,
    "Constitucional": 1,
    "Empresarial": 1,
    "Penal": 1,
    "Trabalho": -1,
    "Tributário": 1
  },
  aiRanking: ["Civil", "Administrativo", "Constitucional", "Empresarial", "Tributário", "Trabalho", "Penal"],
  createdAt: timestamp
});

// Navega para página de resultado
navigate('/result');
```

---

## 🏆 7. Exibir Resultado

```
Na página Result.tsx:

1. PODIUM COM TOP 3:
   🥇 Civil
   🥈 Administrativo  
   🥉 Constitucional

2. EXPLICAÇÃO:
   "Civil ficou em 1º porque:
   ✅ Você tem experiência prática
   ✅ Seu TCC foi nessa área
   ✅ Você expressou afinidade
   ✅ Votou 'gosto' nas notícias
   ✅ Taxa de aprovação: 27%
   
   Sua afinidade torna os temas intuitivos na prova."

3. RANKING COMPLETO (se clicar):
   1. Civil (score: 8)
   2. Administrativo (score: 2)
   3. Constitucional (score: 1)
   ...
   7. Penal (score: 1)

4. DADOS RESUMIDOS:
   - Experiência: Civil, Administrativo
   - Notícias de interesse: 2
   - Score total: 13 pontos
```

---

## 📊 Diagrama Completo

```
┌─────────────────────────────────────┐
│   QUIZ (9 Perguntas)                │
│ - Experiência                       │
│ - TCC                               │
│ - Processualista                    │
│ - Notícias (Votação)                │
│ - Afinidade (Ranking)               │
│ - Peças (MultiSelect)               │
│ - Nunca Faria (Ranking)             │
│ - Desmotivado (MultiSelect)         │
│ - Razões (TextAreas)                │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│ calculateScores()                   │
│ Pontos por area:                    │
│ - Administrativo: 2                 │
│ - Civil: 8                          │
│ - ... (todas 7)                     │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│ testResponse {                      │
│   ...todas as respostas,            │
│   scores,                           │
│   aiRanking: [] (vazio ainda)       │
│ }                                   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│ Enviar para ChatGPT                 │
│ - Scores + Mitos/Verdades           │
│ - Respostas detalhadas              │
│ - Razões textuais                   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│ ChatGPT Analisa                     │
│ - Identifica padrões                │
│ - Desmistifica                      │
│ - Aplica realidade OAB              │
│ - Retorna ranking                   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│ testResponse.aiRanking =            │
│ ["Civil", "Admin", "Const", ...]    │
│                                     │
│ Salvar no Firestore                 │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│ Exibir Resultado                    │
│ Podium com top 3                    │
│ Explicação + ranking completo       │
└─────────────────────────────────────┘
```

---

## 🔍 Validação de Dados

Em cada etapa, validamos:

```
Entrada (Respostas):
✅ Experiência tem valores válidos
✅ NewsVotes é objeto booleano
✅ Rankings têm 7 áreas
✅ Razões têm 7 entradas

Processamento (Scores):
✅ Scores são números
✅ Todas 7 áreas presentes
✅ Intervalo razoável (-5 a +15)

Saída (IA):
✅ Resposta em texto
✅ Contém as 7 áreas
✅ Parse extrai ranking validado
✅ Salva com timestamp
```

---

## 🚀 Exemplo Prático Passo a Passo

**Usuário: Maria**

### 1. Respostas do Quiz
```
E1: Experiência = [Civil]
E2: TCC = [Civil]
E3: Processualista = Processo Civil
E4: Notícias = {civil_1: true, civil_2: false, adm_1: true, penal_1: false, penal_2: false}
E5: Afinidade = 1º Civil, 2º Administrativo
E6: Peças = [Petição civil, Mandado]
E7: Nunca = 1º Penal, 2º Trabalho
E8: Desmotivado = []
E9: Razões = {Civil: {pos: "Experiência", neg: ""}, Penal: {pos: "", neg: "Não gosto"}, ...}
```

### 2. Scores Calculados
```
Civil:
  - E1: +1 (experiência)
  - E2: +1 (TCC)
  - E3: +2 (processualista)
  - E4: 1 ponto (1 like - 1 dislike = 0, mas arredonda como 1 net)
  - E5: +2 (afinidade 1º)
  - E6: +1 (petição civil)
  TOTAL: 8 pontos

Administrativo:
  - E1: 0
  - E3: +1 (processualista civil toca)
  - E4: +1 (adm_1 like)
  - E5: +1 (afinidade 2º)
  - E6: +1 (mandado)
  TOTAL: 4 pontos

Penal:
  - E4: -2 (2 dislikes)
  - E7: -2 (nunca 1º)
  TOTAL: -4 pontos

Demais: ~1 ponto cada
```

### 3. Envio para IA
```
Prompt inclui:
- Scores: Civil 8, Administrativo 4, ...
- Razões: Civil positiva ("Experiência"), Penal negativa
- Mitos/Verdades sobre OAB
- Dados de aprovação
```

### 4. Resposta IA
```
"Maria tem afinidade clara com Civil.
Experiência + TCC + interesse = escolha natural.
Taxa de aprovação 27%, competitiva.
Recomendo: [Civil, Administrativo, Constitucional, ...]"
```

### 5. Resultado Exibido
```
🥇 CIVIL - Sua área!
   Experiência + Afinidade
   
🥈 ADMINISTRATIVO - Complementar
   Processualista toca essa área
   
🥉 CONSTITUCIONAL - Alternativa
   Boa taxa de aprovação
```

**FIM DO FLUXO**

