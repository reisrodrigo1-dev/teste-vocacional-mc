# 📊 Resumo Visual - Sistema de Scoring OAB

## 🎯 Os 9 Componentes do Teste

```
┌─────────────────────────────────────────────────────────────┐
│ TESTE VOCACIONAL OAB - 2ª FASE                              │
│ 9 Perguntas → Scores Automáticos → Análise IA → Ranking    │
└─────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q1: Experiência Prática (+1)                               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Em qual dessas áreas você tem experiência?"               ┃
┃                                                             ┃
┃ [ ] Civil          [ ] Penal                                ┃
┃ [ ] Administrativo [ ] Trabalho                             ┃
┃ [ ] Constitucional [ ] Empresarial [ ] Tributário          ┃
┃                                                             ┃
┃ Scoring: Cada área selecionada = +1 ponto                  ┃
┃ Máximo: 1 ponto por área                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q2: TCC (+1)                                               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Seu trabalho de conclusão foi em alguma dessas áreas?"    ┃
┃                                                             ┃
┃ [ ] Civil    [ ] Penal    [ ] Nenhuma/Outro               ┃
┃ [ ] Administrativo [ ] Trabalho                            ┃
┃                                                             ┃
┃ Scoring: Cada área selecionada = +1 ponto                  ┃
┃ Máximo: 1 ponto por área                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q3: Processualista (+2 ou +1)                              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Qual processualista tem maior facilidade de compreensão?" ┃
┃                                                             ┃
┃ ◯ Processo Civil → Civil +2, Admin +1, Const +1,         ┃
┃                   Emp +1, Trib +1                          ┃
┃ ◯ Processo Penal → Penal +1                               ┃
┃ ◯ Processo do Trabalho → Trabalho +1                      ┃
┃                                                             ┃
┃ Scoring: Processo Civil mais impactante (toca múltiplas)   ┃
┃ Máximo: 2 pontos por área                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q4: Notícias (±1)                                          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Qual dessas notícias vc teria interesse em ler?"          ┃
┃                                                             ┃
┃ [📰 ADMINISTRATIVO]  [📰 CIVIL]                            ┃
┃ 👍  👎               👍  👎                                ┃
┃ [📰 CONSTITUCIONAL]  [📰 EMPRESARIAL]                      ┃
┃ 👍  👎               👍  👎                                ┃
┃ ... (14 notícias, 2 por área)                              ┃
┃                                                             ┃
┃ Scoring:                                                    ┃
┃   👍 (gosto) = +1 ponto para a área                        ┃
┃   👎 (não gosto) = -1 ponto para a área                    ┃
┃   Não vota = 0 pontos                                      ┃
┃ Máximo: ±2 pontos por área (2 notícias)                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q5: Afinidade (Ranking) (+2 ou +1)                         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Qual área você faria? (Ranking)"                          ┃
┃                                                             ┃
┃ 1. [ ] Civil                    → +2 pontos                ┃
┃ 2. [ ] Administrativo            → +1 ponto                ┃
┃ 3. [ ] Constitucional            → 0 pontos                ┃
┃ 4-7. Demais...                                             ┃
┃                                                             ┃
┃ Scoring: Afinidade é CRITÉRIO PRIMÁRIO                     ┃
┃ Máximo: 2 pontos por área                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q6: Peças Processuais (+1 cada)                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Quais peças você gostaria de fazer?" (máx 3)             ┃
┃                                                             ┃
┃ [ ] Petição inicial indenização (Civil) → Civil +1        ┃
┃ [ ] Mandado de segurança (Trib, Const, Adm)              ┃
┃     → Tributário +1, Constitucional +1, Adm +1            ┃
┃ [ ] Reclamação trabalhista (Trabalho) → Trabalho +1      ┃
┃ [ ] Pedido de falência (Empresarial) → Empresarial +1    ┃
┃ [ ] Apelação criminal (Penal) → Penal +1                 ┃
┃ [ ] Ação popular (Const, Adm) → ambas +1                 ┃
┃ [ ] Agravo de instrumento (Civil, Emp) → ambas +1        ┃
┃ [ ] Contestação trabalhista (Trabalho) → Trabalho +1     ┃
┃ [ ] Alegações finais penal (Penal) → Penal +1            ┃
┃                                                             ┃
┃ Scoring: Cada peça = +1 para área(s) relacionada(s)       ┃
┃ Máximo: 3 pontos por área (até 3 peças)                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q7: Nunca Faria (Ranking) (-2 ou -1)                       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Qual área você NUNCA faria?" (Ranking)                    ┃
┃                                                             ┃
┃ 1. [ ] Penal           → -2 pontos (forte aversão)        ┃
┃ 2. [ ] Trabalho        → -1 ponto (média aversão)          ┃
┃ 3-7. Demais...         → 0 pontos                          ┃
┃                                                             ┃
┃ Scoring: Aversão penaliza fortemente                       ┃
┃ Máximo: -2 pontos por área                                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q8: Desmotivação/Repescagem (-1)                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Alguma área teve repescagem/desmotivação?"                ┃
┃                                                             ┃
┃ [ ] Civil           [ ] Penal                              ┃
┃ [ ] Administrativo  [ ] Trabalho                           ┃
┃ [ ] Constitucional  [ ] Empresarial [ ] Tributário        ┃
┃                                                             ┃
┃ Scoring: Cada área selecionada = -1 ponto                  ┃
┃ Máximo: -1 ponto por área                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Q9: Razões Textuais (Análise IA)                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ "Por que escolheria/não cada área?"                        ┃
┃                                                             ┃
┃ Civil:                                                      ┃
┃ Gosto: "________________"  Não gosto: "________________"   ┃
┃                                                             ┃
┃ Penal:                                                      ┃
┃ Gosto: "________________"  Não gosto: "________________"   ┃
┃                                                             ┃
┃ ... (7 áreas)                                              ┃
┃                                                             ┃
┃ Scoring: ❌ Não pontuado diretamente                       ┃
┃ Uso: Enviado para IA analisar contexto e nuances          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 📊 Tabela de Scoring Rápida

| Pergunta | Tipo | Pontos | Exemplo |
|----------|------|--------|---------|
| Experiência | MultiSelect | +1 | Civil marca = +1 |
| TCC | MultiSelect | +1 | Administrativo marca = +1 |
| Processualista | SingleSelect | +2 ou +1 | Processo Civil = Civil +2 |
| Notícias | Voting | ±1 | 👍 = +1, 👎 = -1 |
| Afinidade | Ranking | +2 ou +1 | 1º = +2, 2º = +1 |
| Peças | MultiSelect (max 3) | +1 | Cada peça = +1 |
| Nunca Faria | Ranking | -2 ou -1 | 1º = -2, 2º = -1 |
| Desmotivado | MultiSelect | -1 | Cada marcada = -1 |
| Razões | TextAreas | IA | Análise qualitativa |
| **TOTAL** | | **±15** | Intervalo teórico |

---

## 📈 Exemplo Rápido - João

```
RESPOSTAS:
├─ Experiência: Civil ✓
├─ TCC: Civil ✓
├─ Processualista: Processo Civil ✓
├─ Notícias: Civil 👍👍 Penal 👎👎
├─ Afinidade: 1º Civil, 2º Admin
├─ Peças: Petição Civil, Mandado
├─ Nunca: 1º Penal, 2º Trabalho
├─ Desmotivado: -
└─ Razões: Civil positivo, Penal negativo

SCORING:
├─ Civil:        1 + 1 + 2 + 1 + 2 + 1 = 8 ✅
├─ Administrativo: 0 + 0 + 1 + 0 + 1 + 1 = 3 ✅
├─ Constitucional: 0 + 0 + 1 + 0 + 0 + 0 = 1
├─ Empresarial:   0 + 0 + 1 + 0 + 0 + 0 = 1
├─ Penal:         0 + 0 + 0 - 2 - 2 + 0 = -4 ❌
├─ Trabalho:      0 + 0 + 0 + 0 + 0 - 1 = -1
└─ Tributário:    0 + 0 + 1 + 0 + 0 + 0 = 1

RANKING IA:
1. Civil (8 pontos, afinidade comprovada)
2. Administrativo (3 pontos, secundária viável)
3. Constitucional (1 ponto, taxa aprovação boa)
4. Empresarial (1 ponto)
5. Tributário (1 ponto)
6. Trabalho (-1, sem sinal positivo)
7. Penal (-4, aversão clara)
```

---

## 🤖 Como IA Refina Resultado

```
Dados Automáticos:
  Administrativo: 2, Civil: 8, Penal: 1, ...
  
Dados Textuais:
  Civil: Positivo = "Experiência prática", Negativo = "Código extenso"
  Penal: Positivo = "", Negativo = "Não me interessa"

Contexto OAB:
  ✅ Civil: 27% aprovação
  ❌ Penal: 16% aprovação
  ✅ Afinidade é critério #1
  
Resultado IA:
  "Civil é recomendação forte. 
   Você tem experiência prática, TCC, e afinidade.
   Taxa de aprovação é competitiva (27%).
   Sua afinidade torna os temas intuitivos na prova consultável."
```

---

## 🎓 Fluxo de Dados Resumido

```
Quiz (9 Q) 
   ↓
calculateScores() 
   {Adm: 2, Civil: 8, ...}
   ↓
testResponse {
   experience, tcc, processualist,
   newsVotes, affinity, peças,
   nunca, desmotivado, razões,
   scores, aiRanking (vazio)
}
   ↓
ChatGPT + Prompt
(Scores + Mitos/Verdades + Razões)
   ↓
IA retorna: [Civil, Admin, Const, ...]
   ↓
testResponse.aiRanking = [...]
   ↓
Firestore save
   ↓
Result page: 🥇Civil 🥈Admin 🥉Const
```

---

## 💡 Princípios Chave

```
1. AFINIDADE É PRIMÁRIA
   └─ Vale +2 (ranking), refletida em múltiplas respostas

2. PONTOS POSITIVOS (Experiência, TCC, Interesse)
   └─ Agregam (+1, +2, ±1)

3. PONTOS NEGATIVOS (Aversão, Desmotivação)
   └─ Penalizam (-2, -1)

4. ANÁLISE IA
   └─ Reconcilia números com contexto e realidade OAB

5. PROVA CONSULTÁVEL
   └─ Afinidade torna busca em legislação intuitiva
```

---

## 📱 No App (Visualmente)

```
┌─────────────────────────────────┐
│ TESTE VOCACIONAL OAB            │
│                                 │
│ Q4 de 9                         │
│ ████████░░░░░░░░░░░░ 44%        │
│                                 │
│ Qual dessas notícias você       │
│ teria interesse em ler?         │
│                                 │
│ [📰 Lei de Licitações]          │
│ 👍                👎            │
│                                 │
│ [📰 Novo Código Civil]          │
│ 👍                👎            │
│                                 │
│ ... (mais 12 notícias)          │
│                                 │
│     [← Anterior] [Próximo →]    │
└─────────────────────────────────┘
```

---

**PRONTO!** Sistema completo de scoring + análise IA integrado! 🚀

