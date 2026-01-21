# 📚 Documentação - Sistema de Pontuação e IA

Bem-vindo! Esta pasta contém documentação completa do sistema de scoring e análise por IA do teste vocacional OAB.

---

## 📖 Arquivos de Documentação

### 1. **SCORING_SUMMARY.md** ⭐ LEIA PRIMEIRO
**Resumo visual rápido** do sistema de scoring.
- Tabela visual dos 9 componentes do teste
- Exemplo prático passo-a-passo
- Tabela rápida de pontuação
- Fluxo de dados simplificado
- **Melhor para**: Entender rapidamente como tudo funciona

---

### 2. **SCORING_SYSTEM.md** 📊 GUIA TÉCNICO COMPLETO
Documentação detalhada do sistema de pontuação.
- Explicação linha por linha de cada pergunta
- Exatamente quantos pontos cada resposta vale
- Exemplos práticos de cálculo
- Intervalo de scores por área
- Princípios de design do sistema
- **Melhor para**: Entender exatamente como cada ponto é calculado

---

### 3. **COMPLETE_FLOW.md** 🔄 PASSO-A-PASSO COMPLETO
Fluxo completo de dados do início ao fim.
- Cada pergunta do quiz e o que acontece com a resposta
- Cálculos de score linha por linha em código TypeScript
- Preparação de dados para enviar à IA
- Prompt exato que é enviado para ChatGPT
- Parsing da resposta da IA
- Salvamento no Firestore
- Exibição no resultado
- **Melhor para**: Rastrear um dado específico de entrada até saída

---

### 4. **AI_ANALYSIS_GUIDE.md** 🤖 COMO A IA FUNCIONA
Como a IA analisa os dados e faz a recomendação.
- O que a IA recebe (dados estruturados + textuais + contexto)
- Passo-a-passo de como a IA analisa
- Exemplo completo de análise
- Feedback que a IA fornece
- Regras de ouro da IA
- **Melhor para**: Entender a lógica de recomendação da IA

---

### 5. **IMAGES_SETUP.md** 🖼️ COMO ADICIONAR IMAGENS
Guia para adicionar as 14 imagens de notícias.
- Estrutura de pastas necessária
- 4 opções diferentes de adicionar imagens
- Dimensões e tamanho recomendados
- Como testar se as imagens estão funcionando
- Solução de problemas
- **Melhor para**: Colocar as imagens nas notícias

---

### 6. **NEWS_VOTING_SYSTEM.md** 📰 (já criado anteriormente)
Sistema de votação em notícias detalhado.
- Estrutura de dados das notícias
- Como a votação funciona
- Integração com scoring e IA
- **Melhor para**: Entender especificamente a votação em notícias

---

## 🎯 Como Usar Esta Documentação

### Primeiro Contato?
1. Leia **SCORING_SUMMARY.md** (5 min)
2. Ande pela parte visual dos 9 componentes
3. Veja o exemplo prático de João

### Quer Implementar?
1. Leia **SCORING_SYSTEM.md** (detalhado)
2. Veja exatamente quantos pontos cada coisa vale
3. Imagens: **IMAGES_SETUP.md**

### Debugando um Problema?
1. **COMPLETE_FLOW.md** - rastreie dados de entrada até saída
2. Verifique qual etapa está falhando
3. Confira a integração no código

### Entendendo IA?
1. **AI_ANALYSIS_GUIDE.md** - como ChatGPT processa
2. **COMPLETE_FLOW.md** seção 4-5 - veja o prompt exato
3. Veja exemplos de análise

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────┐
│ QUIZ (src/pages/Quiz.tsx)                           │
│ 9 Perguntas com diferentes tipos de input           │
└────────────────┬────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────┐
│ calculateScores() em Quiz.tsx                       │
│ Calcula pontos automáticos por área                 │
│ Cria objeto: { Adm: 2, Civil: 8, ... }             │
└────────────────┬────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────┐
│ calculateAndSubmit() em Quiz.tsx                    │
│ Monta testResponse com:                             │
│ - Todas as respostas                                │
│ - Scores calculados                                 │
│ - Prepara dados para IA                             │
└────────────────┬────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────┐
│ ChatGPT API (openai.chat.completions)              │
│ Recebe: prompt com mitos/verdades + dados           │
│ Retorna: ranking das 7 áreas                        │
└────────────────┬────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────┐
│ Firestore save (tests/{userId})                     │
│ Persiste testResponse com aiRanking                 │
└────────────────┬────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────┐
│ Result Page (src/pages/Result.tsx)                  │
│ Exibe: 🥇🥈🥉 com top 3 + explicações              │
└─────────────────────────────────────────────────────┘
```

---

## 💻 Arquivos de Código Relevantes

### Principal
- **src/pages/Quiz.tsx** - Toda a lógica do quiz
  - `calculateScores()` - função de cálculo de pontos
  - `calculateAndSubmit()` - integração com IA
  - `renderQuestion()` - renderização de cada tipo de pergunta
  - Styled components para UI

- **src/types/index.ts** - Interface `TestResponse`
  - Estrutura de dados salva no Firestore

- **src/data/news.ts** - Dados das 14 notícias
  - Array com NewsItem para cada notícia

### Suportando
- **src/firebase.ts** - Configuração Firebase
- **src/openai.ts** - Configuração OpenAI
- **src/components/Layout.tsx** - Layout com navbar/sidebar

---

## 🔢 Números Chave

| Métrica | Valor |
|---------|-------|
| Perguntas no Quiz | 9 |
| Áreas avaliadas | 7 |
| Notícias totais | 14 (2 por área) |
| Score mínimo | -5 |
| Score máximo | +15 |
| Intervalo prático | -2 a +10 |

---

## 🎓 7 Áreas da OAB

1. **Administrativo**
2. **Civil**
3. **Constitucional**
4. **Empresarial**
5. **Penal**
6. **Trabalho**
7. **Tributário**

---

## ✅ Checklist de Implementação

- [x] Estrutura de scoring definida
- [x] Código de cálculo implementado em Quiz.tsx
- [x] Prompt da IA com mitos/verdades
- [x] Integração ChatGPT
- [x] Salvamento em Firestore
- [ ] Adicionar 14 imagens em /public/noticias/
- [ ] Deploy Firebase rules
- [ ] Testar fluxo completo
- [ ] Refinar prompts conforme necessário

---

## 🚀 Próximas Etapas

### 1. Imagens (Crítico)
```bash
# Crie a pasta se não existir
mkdir -p public/noticias/

# Adicione as 14 imagens com estes nomes:
admin_1.jpg, admin_2.jpg
civil_1.jpg, civil_2.jpg
constitucional_1.jpg, constitucional_2.jpg
empresarial_1.jpg, empresarial_2.jpg
penal_1.jpg, penal_2.jpg
trabalho_1.jpg, trabalho_2.jpg
tributario_1.jpg, tributario_2.jpg
```
→ Veja **IMAGES_SETUP.md** para opções

### 2. Deploy Firebase Rules
```bash
cd teste-vocacional-mc  # (raiz do projeto)
firebase deploy --only firestore:rules
```

### 3. Testar
1. Registre novo usuário
2. Complete PreTest
3. Responda Quiz completo
4. Veja resultado com 🥇🥈🥉

---

## 📞 Suporte

Se tiver dúvidas sobre:
- **Como funciona a pontuação?** → SCORING_SYSTEM.md
- **Onde meu dado vai?** → COMPLETE_FLOW.md
- **Como a IA decide?** → AI_ANALYSIS_GUIDE.md
- **Imagens não aparecem?** → IMAGES_SETUP.md
- **Prompt exato para IA?** → COMPLETE_FLOW.md seção 4

---

## 🎉 Conclusão

O sistema está **100% implementado** e pronto para:
1. Adicionar imagens (cosmético)
2. Deploy Firebase (essencial)
3. Testar end-to-end (validação)

Boa sorte com o teste vocacional OAB! 🎓

