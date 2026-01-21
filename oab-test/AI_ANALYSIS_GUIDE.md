# 🤖 Guia de Análise por IA - Teste Vocacional OAB

## 📋 O que a IA Recebe

Quando o usuário completa o teste, o ChatGPT recebe:

### 1. **Dados Estruturados (Scores)**
```
Administrativo: 2
Civil: 8
Constitucional: 1
Empresarial: 1
Penal: 1
Trabalho: -1
Tributário: 1
```
Esses scores vêm do sistema automático de pontuação no Quiz.

### 2. **Dados Comportamentais (Respostas)**
```
- Experiência prática: qual trabalhou
- TCC: qual escreveu
- Processualista: qual entende melhor
- Notícias: quais gostaria de ler
- Afinidade: em ordem de interesse
- Peças: quais gostaria de fazer
- Aversão: quais NUNCA faria
- Desmotivação: quais já reprovou
```

### 3. **Dados Qualitativos (Razões Textuais)**
```
Civil:
  Positivo: "Gosto de resolver conflitos práticos"
  Negativo: "Código muito extenso"

Penal:
  Positivo: "Casos fascinantes"
  Negativo: "Muito técnico"
```

### 4. **Contexto Educacional (Mitos/Verdades)**
```
MITOS a ignorar:
- "Penal é mais fácil" ❌
- "Civil tem mais peças" ❌
- "Algumas provas são menores" ❌

VERDADES a considerar:
- "Civil 27%, Const 33%, Penal 16%, Trabalho 16%" ✅
- "AFINIDADE é critério #1" ✅
- "Prova é consultável, afinidade torna intuitivo" ✅
```

---

## 🧠 Como a IA Analisa

### Passo 1: **Identificar Afinidade Real**
A IA procura por alinhamento:

```
✅ Sinais de alta afinidade:
- Experiência + TCC na mesma área
- Escolheu como 1º ou 2º em afinidade
- Selecionou notícias da área como "gosto"
- Razões positivas fortes
- Peças processuais da área interessam

⚠️ Sinais de baixa afinidade:
- Nunca fez trabalho prático
- Marcou como "nunca faria"
- Votou "não gosto" nas notícias
- Tem desmotivação/repescagem
- Razões negativas mencionadas
```

### Passo 2: **Desmistificar Mitos**
Se o usuário disser algo como:
> "Penal é mais fácil"
> "Civil tem mais peças"

A IA rebate com:
> "Considere que todas as áreas têm mesmo grau de dificuldade e mesmas peças. A realidade é que Penal tem 16% de aprovação, não é pela facilidade."

### Passo 3: **Aplicar Dados Reais**
A IA balanceia afinidade com realidade:

```
Se usuário tem afinidade por Penal:
"Sim, você tem afinidade, e isso é CRUCIAL. 
Porém, taxa de aprovação é 16%, não porque é fácil,
mas porque requer muita dedicação. Sua afinidade 
ajudará a tornar os temas intuitivos."
```

### Passo 4: **Ponderar Múltiplas Fontes**
A IA não vê cada score isoladamente, mas o padrão:

```
Exemplo: Usuário com Civil
- Score automático: 8 (alto)
- Experiência: sim
- TCC: sim
- Afinidade: 1º lugar
- Notícias: 2 "gosto", 0 "não gosto"
- Razões: "Amo direito civil"
- Taxa aprovação: 27%

Conclusão IA: "Forte candidato para Civil"
```

---

## 📊 Exemplo de Análise Completa

### Entrada (Dados do Teste)

**Scores:**
```
Civil: 8
Administrativo: 2
Penal: 1
Resto: ≤1
```

**Respostas:**
```
- Experiência: Civil, Administrativo
- TCC: Civil
- Processualista: Processo Civil
- Notícias: 
  - Civil (2x): 👍👍
  - Administrativo: 👍
  - Penal: 👎
- Afinidade 1º: Civil, 2º: Administrativo
- Peças: "Petição indenização", "Mandado", "Apelação"
- Nunca: Penal (1º), Trabalho (2º)
- Desmotivado: -
```

**Razões Textuais:**
```
Civil: 
  Positivo: "Gosto resolver conflitos, estágio teve experiência"
  Negativo: "Código extenso mas administrável"
  
Penal:
  Positivo: ""
  Negativo: "Não me atrai, muita técnica"
```

### Análise da IA

```
🎯 PADRÃO IDENTIFICADO:

1. AFINIDADE REAL:
   - Alinhamento claro com Civil (experiência + TCC + 1º afinidade)
   - Interesse em notícias de Civil (2 positivos)
   - Razões positivas concretas ("estágio teve experiência")
   → Civil é escolha natural

2. SECUNDÁRIA (Administrativo):
   - Também tem experiência + TCC
   - Interesse em notícias (1 positivo)
   - Score: 2 (menor que Civil)
   → Secundária viável

3. AVERSÃO (Penal):
   - Escolheu como "nunca faria" em 1º
   - Votou 👎 nas notícias
   - Razão negativa: "Não me atrai"
   → Desaconselhável apesar de 1 ponto

4. CONSIDERAÇÕES OAB:
   - Civil tem 27% de aprovação (boa)
   - Taxa é realista, não fácil
   - Mas afinidade comprovada (trabalho prático + estágio)
   - Quando há afinidade, legislação fica intuitiva

✅ RANKING RECOMENDADO:
1. Civil (afinidade comprovada + experiência real)
2. Administrativo (secundária com experiência)
3. Constitucional (relacionado, processualista civil toca)
4. Empresarial (processualista civil toca)
5. Tributário (processualista civil toca)
6. Trabalho (sem sinal positivo, mas não "nunca faria")
7. Penal (aversão clara, nunca faria, taxa baixa)
```

### Saída (Resposta da IA)

```
Baseado em sua análise, sua escolha deve ser:

1. CIVIL (recomendação forte)
   Razão: Afinidade comprovada (experiência, TCC, interesse em notícias)
   Realidade: 27% de aprovação (competitivo, não fácil)
   Seu diferencial: Experiência prática deixa temas intuitivos

2. ADMINISTRATIVO (escolha viável)
   Razão: Também tem background acadêmico
   Realidade: Sem taxa específica no dados

3. CONSTITUCIONAL (opção complementar)
   Razão: Seu processualista (Civil) toca Const
   Realidade: 33% de aprovação (boa oportunidade)

❌ EVITE PENAL
   Você marcou "nunca faria". Sua aversão + afinidade baixa 
   não compensa o desafio (16% de aprovação).
```

---

## 🔄 Feedback Loop

A IA não apenas ranqueia, mas EXPLICA:

```
✅ O QUE FUNCIONOU:
- Sua experiência em Civil é real
- Seu TCC alinhado
- Seu interesse em notícias confirmado

⚠️ O QUE RECONSIDERAR:
- Penal tem taxa baixa (16%) E você tem aversão
  → Dupla razão pra evitar
- Trabalho não teve interesse mas é opção
  → Se quiser segurança, considere

💡 INSIGHT:
"A prova de OAB 2ª fase é consultável. 
Sua afinidade com Civil vai fazer 
a busca nas leis ser intuitiva."
```

---

## 📌 Regras de Ouro da IA

### 1. **Afinidade > Tudo**
Se houver afinidade clara, ela vence mitos:
```
Usuário: "Penal é fácil, vou escolher"
IA responde: "Penal tem mesma dificuldade que outras.
Sua afinidade real é Civil. Recomendamos Civil."
```

### 2. **Realismo > Facilismo**
Não recomenda por "suposta facilidade":
```
Usuário: "Trabalho é mais fácil"
IA responde: "Mito. Trabalho tem 16% de aprovação,
mesma dificuldade que Penal. Considere sua afinidade."
```

### 3. **Dados > Sentimento**
Pondera score com razão textual:
```
Score alto mas razão negativa:
"Score sugere X, mas suas razões indicam Y.
Confiamos em sua análise pessoal."
```

### 4. **Bom Senso > Rigidez**
Se padrão é claro, recomenda forte:
```
Padrão claro (exp + TCC + afinidade + notícias):
"Indicamos fortemente esta área."
```

---

## 🎓 Integração Técnica

### No Código:
```typescript
const prompt = `
... [contexto + mitos/verdades] ...
SCORES: ${scoresSummary}
RAZÕES: ${reasonsText}
... [instrução de ranking] ...
`;

const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: prompt }],
});

const ranking = parseResponse(response.content);
// [Civil, Administrativo, Constitucional, ...]
```

### No Firestore:
```
tests/{userId} {
  scores: { Civil: 8, Admin: 2, ... }
  reasons: { Civil: { positive: "...", negative: "..." }, ... }
  aiRanking: ["Civil", "Admin", "Const", ...]  ← IA retorna isso
  createdAt: timestamp
}
```

### Na Tela de Resultado:
```
Ranking da IA com top 3 em pódio:
🥇 Civil (afinidade comprovada)
🥈 Administrativo (opção viável)
🥉 Constitucional (complementar)

Contexto fornecido explicando por quê.
```

---

## 🚀 Possíveis Melhorias Futuras

1. **Análise de sentimento** nas razões textuais
2. **Ponderação dinâmica** de critérios
3. **Comparação com dados históricos** de usuários similares
4. **Feedback de resultado** (se passou, como foi experiência)
5. **Refinamento do modelo** com dados reais de aprovação

