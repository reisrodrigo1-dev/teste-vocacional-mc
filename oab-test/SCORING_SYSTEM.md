# 📊 Sistema de Pontuação - Teste Vocacional OAB

## 🎯 Visão Geral

O teste vocacional utiliza um sistema de **scoring multiponto** que:
1. Atribui pontos para cada área baseado em respostas
2. Calcula score numérico por área
3. Envia scores + respostas escritas para IA analisar
4. IA retorna ranking considerando mitos/verdades sobre a OAB

---

## 📈 Estrutura de Pontuação

### Áreas Avaliadas (7 total)
- Administrativo
- Civil
- Constitucional
- Empresarial
- Penal
- Trabalho
- Tributário

---

## 🔢 Sistema de Scoring Detalhado

### 1️⃣ **Experiência Prática** (+1 ponto cada)
- **Pergunta**: "Em qual dessas áreas você tem experiência prática?"
- **Sistema**: MultiSelect
- **Scoring**: 
  - Cada área selecionada = +1 ponto
  - Exemplo: Se usuário marca "Civil" e "Administrativo" → Civil +1, Admin +1

```
Scores Máximos Por Área: 1 ponto
```

---

### 2️⃣ **Trabalho de Conclusão (TCC)** (+1 ponto cada)
- **Pergunta**: "Seu TCC foi em alguma dessas áreas?"
- **Sistema**: MultiSelect
- **Scoring**:
  - Cada área selecionada = +1 ponto

```
Scores Máximos Por Área: 1 ponto
```

---

### 3️⃣ **Processualista** (+2 a +1 ponto)
- **Pergunta**: "Qual processualista você tem maior facilidade?"
- **Sistema**: SingleSelect (Processo Civil / Processo Penal / Processo do Trabalho)
- **Scoring**:
  - **Processo Civil**: Civil +2, Adm +1, Const +1, Emp +1, Trib +1
  - **Processo Penal**: Penal +1
  - **Processo do Trabalho**: Trabalho +1

```
Scores Máximos Por Área: 2 pontos
Justificativa: Processo Civil toca múltiplas áreas
```

---

### 4️⃣ **Votação em Notícias** (+1 / -1 ponto cada)
- **Pergunta**: "Qual dessas notícias vc teria interesse em ler?"
- **Sistema**: 14 notícias (2 por área), votos 👍 (like) / 👎 (dislike)
- **Scoring**:
  - Clica 👍 (gosto) = +1 ponto para área
  - Clica 👎 (não gosto) = -1 ponto para área
  - Não vota = 0 pontos

```
Scores Máximos Por Área: +2 a -2 (2 notícias)
Justificativa: Votação expressa afinidade/desinteresse real
```

**Exemplo**:
```
Administrativo_1 → 👍 = +1
Administrativo_2 → 👎 = -1
Resultado: Administrativo = 0 pontos
```

---

### 5️⃣ **Afinidade (Ranking)** (+2 / +1 ponto)
- **Pergunta**: "Considerando afinidade, qual a área que vc faria?"
- **Sistema**: Ranking das 7 áreas
- **Scoring**:
  - 1º lugar = +2 pontos
  - 2º lugar = +1 ponto
  - Demais = 0 pontos

```
Scores Máximos Por Área: 2 pontos
Justificativa: Afinidade é critério primário (verdade #6)
```

---

### 6️⃣ **Peças Processuais** (+1 ponto cada)
- **Pergunta**: "Quais dessas peças processuais você gostaria de fazer?" (máx 3)
- **Sistema**: MultiSelect com limite de 3
- **Opções**:
  - Petição inicial de indenização (Civil)
  - Mandado de segurança (Tributário, Constitucional, Adm)
  - Reclamação trabalhista (Trabalho)
  - Pedido de falência (Empresarial)
  - Apelação criminal (Penal)
  - Ação popular (Constitucional, Administrativo)
  - Agravo de instrumento (Civil, Empresarial)
  - Contestação trabalhista (Trabalho)
  - Alegações finais criminais (Penal)

- **Scoring**:
  - Cada peça selecionada = +1 ponto para área(s) relacionada(s)
  - Peças com múltiplas áreas = +1 para CADA área

```
Scores Máximos Por Área: 3 pontos (se todas 3 peças tocarem a área)
Justificativa: Indica interesse prático em trabalhar com a área
```

**Exemplo**:
```
Selecionadas: "Petição civil" + "Mandado" + "Apelação criminal"
Resultado:
- Civil: +1 (petição)
- Tributário: +1 (mandado)
- Constitucional: +1 (mandado)
- Administrativo: +1 (mandado)
- Penal: +1 (apelação)
```

---

### 7️⃣ **Aversão/Nunca Faria** (-2 / -1 ponto)
- **Pergunta**: "Qual a área que vc NUNCA faria?" (Ranking)
- **Sistema**: Ranking das 7 áreas
- **Scoring**:
  - 1º lugar (nunca faria) = -2 pontos
  - 2º lugar (nunca faria) = -1 ponto
  - Demais = 0 pontos

```
Scores Máximos Por Área: -2 pontos
Justificativa: Aversão deve ser fortemente considerada
```

---

### 8️⃣ **Desmotivação/Repescagem** (-1 ponto)
- **Pergunta**: "Alguma área já fez repescagem e sente desmotivação?"
- **Sistema**: MultiSelect
- **Scoring**:
  - Cada área selecionada = -1 ponto

```
Scores Máximos Por Área: -1 ponto
Justificativa: Indica frustração anterior com a área
```

---

### 9️⃣ **Razões Escritas** (Análise IA)
- **Pergunta**: "Em poucas palavras, por que você escolheria ou não cada área?"
- **Sistema**: TextAreas (uma por área)
- **Scoring**: ❌ Não pontuado diretamente
- **Uso**: 
  - Enviado para ChatGPT analisar
  - IA considera nuances nas respostas
  - Pode influenciar ranking final

```
Estrutura: { [area]: { positive: string; negative: string } }
Exemplo:
{
  "Civil": {
    "positive": "Gosto de resolver conflitos práticos",
    "negative": "Código muito extenso, difícil decorar"
  },
  "Penal": {
    "positive": "Casos fascinantes",
    "negative": ""
  }
}
```

---

## 📊 Tabela de Scoring Resumida

| Fonte | Tipo | Máx/Área | Exemplo |
|-------|------|----------|---------|
| Experiência | +1 | 1 | Civil marcado = +1 |
| TCC | +1 | 1 | Administrativo marcado = +1 |
| Processualista | +1 a +2 | 2 | Processo Civil = +2 Civil |
| Notícias | +1 ou -1 | ±2 | 👍 Notícia Civil = +1 |
| Afinidade | +2 ou +1 | 2 | 1º lugar = +2 |
| Peças | +1 | 3 | Cada peça selecionada = +1 |
| Nunca Faria | -2 ou -1 | -2 | 1º lugar = -2 |
| Desmotivado | -1 | -1 | Área marcada = -1 |
| **TOTAL TEÓRICO** | | **±15** | |

---

## 🧠 Exemplo Completo de Scoring

**Usuário: João**

```
Respostas:
- Experiência: Civil, Administrativo → Civil +1, Admin +1
- TCC: Civil → Civil +1
- Processualista: Processo Civil → Civil +2, Admin +1, Const +1, Emp +1, Trib +1
- Notícias: 
  - Civil_1 👍 = +1
  - Civil_2 👎 = -1
  - Penal_1 👍 = +1
- Afinidade 1º: Civil, 2º: Penal → Civil +2, Penal +1
- Peças: "Petição civil", "Apelação criminal" → Civil +1, Penal +1
- Nunca Faria 1º: Penal, 2º: Trabalho → Penal -2, Trabalho -1
- Desmotivado: Administrativo → Admin -1

SCORES FINAIS:
- Civil: 1 + 1 + 2 + 1 + 2 + 1 = 8 pontos
- Administrativo: 1 + 1 + 1 - 1 = 2 pontos
- Constitucional: 1 = 1 ponto
- Empresarial: 1 = 1 ponto
- Penal: 1 + 1 + 1 - 2 = 1 ponto
- Trabalho: 0 - 1 = -1 pontos
- Tributário: 1 = 1 ponto

RANKING POR SCORE:
1. Civil (8)
2. Administrativo (2)
3. Constitucional (1)
3. Empresarial (1)
3. Penal (1)
5. Tributário (1)
6. Trabalho (-1)
```

---

## 🤖 Análise por IA (ChatGPT)

Após calcular scores, o sistema:

1. **Coleta dados**:
   - Scores numéricos de cada área
   - Respostas textuais (razões, notícias, experiências)
   - Histórico de preferências

2. **Envia para ChatGPT com instruções especiais**:
   - Mitos a DESMENTIR (áreas com menos peças, provas diferentes, dificuldades variáveis)
   - Verdades a CONSIDERAR (aprovação Civil 27%, Const 33%, Penal/Trabalho 16%)
   - **Critério primário: AFINIDADE** (verdade #6)
   - Contexto prático: prova é consultável, afinidade facilita resolução (verdade #7)

3. **IA retorna**:
   - Ranking refinado das 7 áreas
   - Considerações sobre por que fez essa recomendação
   - Alertas sobre mitos vs. realidade

---

## 💡 Princípios de Design do Sistema

### 1. **Afinidade como Primária** 
Conforme verdade #6, afinidade deve ser o primeiro critério. Sistema reflate isso:
- Pergunta direta de afinidade vale +2
- Notícias (proxy de interesse) valem ±1
- Experiência vale +1

### 2. **Penalidades Fortes para Aversão**
Não fazer uma prova é ruim (verdade #7 - falta afinidade):
- Nunca faria: -2
- Desmotivação: -1

### 3. **Nuance via Texto**
Não apenas números, mas contexto:
- Razões escritas analisadas por IA
- Permite considerar dúvidas, limitações, objetivos pessoais

### 4. **Realismo da OAB**
Scores não determinam destino, IA considera:
- Dados reais de aprovação (Civil 27%, Const 33% vs Penal/Trab 16%)
- Desmistificação (todas têm mesmas peças, mesma prova, mesma dificuldade)
- Contexto prático (prova consultável, afinidade intuitiva)

---

## 📋 Integração no Fluxo

```
Usuário Responde Quiz
        ↓
calculateScores() calcula pontos/área
        ↓
testResponse.scores = { Adm: X, Civil: Y, ... }
        ↓
AI Prompt com:
  - Scores numéricos
  - Respostas textuais
  - Mitos/Verdades sobre OAB
        ↓
ChatGPT retorna ranking
        ↓
testResponse.aiRanking = [Civil, Adm, Penal, ...]
        ↓
Resultado exibido com top 3 no pódio
```

---

## 🎓 Estrutura Final no Firestore

```typescript
TestResponse {
  userId: string
  experience: Area[]
  tcc: Area[]
  processualist: string
  newsVotes: { [newsId: string]: boolean }
  affinityFirst: Area
  affinitySecond: Area
  proceduralPieces: string[]
  neverDoFirst: Area
  neverDoSecond: Area
  demotivated: Area[]
  reasons: { [area]: { positive: string; negative: string } }
  
  scores: {                    // ← Novo destaque
    "Administrativo": 2,
    "Civil": 8,
    "Constitucional": 1,
    "Empresarial": 1,
    "Penal": 1,
    "Trabalho": -1,
    "Tributário": 1
  }
  
  aiRanking: Area[]           // ← Do ChatGPT
  createdAt: Date
}
```

---

## 🚀 Próximas Melhorias

1. **Weights customizáveis**: Ajustar importância de cada fonte
2. **Histórico de usuário**: Comparar scores entre tentativas
3. **Dashboard**: Visualizar distribuição de scores
4. **Análise de coorte**: Quais perguntas melhor predizem sucesso
5. **Feedback personalizado**: Por que Civil ficou em 1º

