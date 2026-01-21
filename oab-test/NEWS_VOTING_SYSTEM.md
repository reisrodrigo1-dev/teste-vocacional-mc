# 📰 Sistema de Votação de Notícias - Implementação Completa

## ✅ O Que Foi Feito

Transformei a pergunta sobre notícias em um **sistema interativo de votação com imagens**, onde o usuário vota "gosto" 👍 ou "não gosto" 👎 em cada notícia, e esses dados são analisados pela IA para refinar a recomendação.

## 🎯 Nova Pergunta de Notícias

**Antes**: Tipo `multiSelectImages` com simples checkbox  
**Depois**: Tipo `newsVoting` com cards visuais e botões de votação

### Visual da Nova Pergunta

```
┌──────────────────────────────────────┐
│ Em relação a essas notícias...       │
│ qual delas vc teria interesse em ler │
│ e se aprofundar no assunto?          │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   [IMAGEM]   │  │   [IMAGEM]   │ │
│  │  Lei de      │  │  Novo CPC    │ │
│  │  Licitações  │  │  Inovações   │ │
│  │              │  │              │ │
│  │ [👍] [👎]   │  │ [👍] [👎]   │ │
│  └──────────────┘  └──────────────┘ │
│                                      │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   [IMAGEM]   │  │   [IMAGEM]   │ │
│  │ Direitos     │  │ Controle de  │ │
│  │ Fundamentais │  │ Constituç... │ │
│  │              │  │              │ │
│  │ [👍] [👎]   │  │ [👍] [👎]   │ │
│  └──────────────┘  └──────────────┘ │
│                                      │
│         ... (mais 10 notícias)       │
│                                      │
└──────────────────────────────────────┘
```

## 📋 Estrutura de Notícias

**14 notícias total (2 por área)**

- **Administrativo**: Lei de Licitações, Servidores Públicos
- **Civil**: CPC, Contratos e Obrigações
- **Constitucional**: Direitos Fundamentais, STF
- **Empresarial**: Sociedades Anônimas, Falências
- **Penal**: Crimes e Penas, Processo Penal
- **Trabalho**: Relação de Emprego, Reclamação
- **Tributário**: Sistema Tributário, Impostos

## 🛠️ Arquivos Criados

### `src/data/news.ts` (Novo)
```typescript
export interface NewsItem {
  id: string;
  area: string;
  title: string;
  image: string;
  interest?: boolean;
}

export const newsData: NewsItem[] = [
  // 14 notícias definidas
];
```

## 📝 Alterações nos Arquivos

### 1. **Quiz.tsx**
- ✅ Importa `newsData` do novo arquivo
- ✅ Adicionou novo tipo de pergunta: `newsVoting`
- ✅ Adicionou estilos para cards, imagens, botões
- ✅ Removeu pergunta antiga de "newsNoInterest"
- ✅ Atualiza `calculateScores()` para processar votos
- ✅ Passa informações para ChatGPT com títulos legíveis

### 2. **types/index.ts**
- ✅ Mudou `newsInterest: string[]` para `newsVotes: { [newsId: string]: boolean }`
- ✅ Removeu `newsNoInterest: string[]`
- ✅ Agora armazena: `true` (gosto), `false` (não gosto), `undefined` (não respondido)

### 3. **src/data/news.ts** (Novo arquivo)
- Define interface `NewsItem`
- Define array `newsData` com 14 notícias
- Cada notícia tem ID único, área, título e arquivo de imagem

## 🎨 Componentes Visuais Criados

### NewsCard
- Border com hover effect
- Imagem responsiva (aspect ratio 16:9)
- Título legível
- Buttons de votação

### NewsImageContainer
- Altura proporcional à largura (66.67% = 3:2)
- Imagem com fallback para `/placeholder.jpg`
- Object-fit: cover

### VoteButton (👍 e 👎)
- Verde com border para "Like"
- Vermelho com border para "Dislike"
- Estado ativo com cor sólida
- Hover e active effects

### NewsGrid
- Grid 2 colunas (responsivo: 1 coluna em mobile)
- Gap entre cards

## 💾 Como os Dados São Salvos

```typescript
responses.newsVotes = {
  'admin_1': true,    // Gostou desta notícia
  'civil_2': false,   // Não gostou
  'penal_1': true,
  // ... mais votos
}
```

**No Firestore**:
```json
{
  "newsVotes": {
    "admin_1": true,
    "civil_2": false,
    "penal_1": true
  }
}
```

## 🧠 Como a IA Analisa

O prompt enviado para ChatGPT agora inclui:

```
- Notícias de interesse: Lei de Licitações, Direitos Fundamentais, ...
- Notícias sem interesse: Novo CPC, Contratos e Obrigações, ...
```

Com base nisso, a IA:
1. ✅ Identifica quais áreas o usuário tem afinidade
2. ✅ Detecta áreas que não geram interesse
3. ✅ Combina com outras respostas (experiência, TCC, etc)
4. ✅ Ranqueia as 7 áreas por afinidade

## 📊 Sistema de Pontos Atualizado

```typescript
// Se votou "gosto" em notícia de Administrativo
scores['Administrativo'] += 1

// Se votou "não gosto" em notícia de Penal
scores['Penal'] -= 1
```

## 🎯 Fluxo Completo

1. Usuário vê 14 notícias em cards bonitos
2. Clica 👍 ou 👎 para cada uma
3. Seus votos são guardados em `newsVotes`
4. Ao clicar "Finalizar", vai pro Result
5. Quiz calcula scores incluindo votos
6. ChatGPT recebe análise de votos
7. IA retorna ranking das 7 áreas

## 🖼️ Imagens

As imagens devem estar em:
```
public/noticias/
├── admin_1.jpg
├── admin_2.jpg
├── civil_1.jpg
├── civil_2.jpg
├── constitucional_1.jpg
├── constitucional_2.jpg
├── empresarial_1.jpg
├── empresarial_2.jpg
├── penal_1.jpg
├── penal_2.jpg
├── trabalho_1.jpg
├── trabalho_2.jpg
├── tributario_1.jpg
└── tributario_2.jpg
```

Se a imagem não existir, mostra `/placeholder.jpg`

## ✨ Recursos Adicionais

✅ **Responsivo**: Grid 2 colunas em desktop, 1 coluna em mobile  
✅ **Hover Effects**: Cards crescem ao passar o mouse  
✅ **Feedback Visual**: Botões mostram estado selecionado  
✅ **Fallback**: Se imagem falhar, mostra placeholder  
✅ **Sem Duplicatas**: Cada pergunta criada apenas uma vez  
✅ **IA Inteligente**: ChatGPT analisa votos para ranking  

## 🔄 Alterações na Lógica

### Antes
- 2 perguntas sobre notícias (interesse e desinteresse)
- Apenas checkboxes
- Sem imagens visíveis
- Análise pela parse de nomes de arquivo

### Depois
- 1 pergunta sobre notícias
- Botões 👍 e 👎 interativos
- Imagens grandes e visíveis
- Análise pelos títulos das notícias
- Dados estruturados no Firestore

## 📱 Próximos Passos (Opcional)

- [ ] Carregar notícias de uma API externa
- [ ] Permitir adicionar notícias personalizadas
- [ ] Histórico de votos por usuário
- [ ] Análise de tendências de votação
- [ ] Filtrar notícias por período

---

**Status**: ✅ Completo e Pronto  
**Teste**: Rode o app e vá até a pergunta 4 (notícias)  
**Nota**: Coloque as imagens em `public/noticias/` para funcionarem

