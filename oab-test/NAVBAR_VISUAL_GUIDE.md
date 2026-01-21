# 📱 Guia Visual - Navbar & Sidebar Duolingo

## Layout das Páginas Protegidas

```
┌─────────────────────────────────────────────────────────┐
│ 🎓 MeuCurso        📝 Teste Vocacional      👤 João | 🚪│ ← TopBar (sticky)
├──────────────────────────────────────────────────────────┤
│  🎯 │                                                    │
│  📝 │          Conteúdo da Página                       │
│  🏆 │          (PreTest, Quiz, Result, etc)             │
│  ──────────────────────────────────────────────────────  │
│ CONTA│         Scrollável Independente                  │
│  👤 │                                                    │
│  📊 │          ↓                                         │
│     │          ↓                                         │
│  🚪 │          ↓                                         │
└──────────────────────────────────────────────────────────┘
  ↑
 Sidebar
 (Fixed)
```

## Componentes da TopBar

```
┌────────────────────────────────────────────────────────────┐
│ 🎓 MeuCurso    📝 Teste Vocacional - Informações  João 👤 │
└────────────────────────────────────────────────────────────┘
                                              ↑ Clique aqui
                                    ┌─────────────────┐
                                    │ 👤 Perfil       │
                                    │ 📊 Meus Testes  │
                                    │ 🚪 Sair         │
                                    └─────────────────┘
                                      (Menu Dropdown)
```

## Componentes da Sidebar

```
┌──────────────────┐
│ 🎓 OAB Test      │
├──────────────────┤
│ 🎯 Início        │  ← Vai para PreTest
│ 📝 Teste         │  ← Vai para Quiz
│ 🏆 Resultados    │  ← Vai para Result
├──────────────────┤
│ CONTA            │  (Seção)
│ 👤 Perfil        │  ← Vai para Profile
│ 📊 Histórico     │  ← Vai para History
├──────────────────┤
│  🚪 Deslogar     │  ← Logout
└──────────────────┘
```

## Estados da Interface

### 1️⃣ Usuário Logado - Está na PreTest
```
TopBar mostra: "📝 Teste Vocacional - Informações"
Avatar mostra: Primeira letra do nome (ex: "J" para João)
Sidebar atual: Item "🎯 Início" destacado em verde
```

### 2️⃣ Usuário Navegou para Quiz
```
TopBar mostra: "📝 Quiz - Teste Vocacional"
Sidebar atual: Item "📝 Teste" destacado em verde
11 perguntas aparecem no conteúdo
```

### 3️⃣ Usuário Viu Resultado
```
TopBar mostra: "🏆 Resultados - Teste Vocacional"
Sidebar atual: Item "🏆 Resultados" destacado em verde
Podium com 3 áreas aparece
```

### 4️⃣ Clicou no Avatar - Menu Aberto
```
┌────────────────────────────┐
│ ... João 👤                │  ← Avatar clicável
│       ┌──────────────────┐ │
│       │ 👤 Perfil        │ │
│       │ 📊 Meus Testes   │ │
│       │ 🚪 Sair          │ │
│       └──────────────────┘ │
└────────────────────────────┘
```

## Navegação Flow

```
Login
  ↓
Register → Cria usuário no Firebase
  ↓
PreTest (com navbar/sidebar) ← Primeira página protegida
  ├→ Sidebar: Clica "📝 Teste"
  │   ↓
  │ Quiz (com navbar/sidebar)
  │   └→ Responde 11 questões
  │       ↓
  │       Clica "Finalizar 🎉"
  │       ↓
  │   Result (com navbar/sidebar)
  │       ├→ Sidebar: Clica "🏆 Resultados"
  │       │   (já está aqui)
  │       └→ Avatar: Clica menu
  │           ├→ "👤 Perfil" → Profile
  │           ├→ "📊 Meus Testes" → History  
  │           └→ "🚪 Sair" → Logout → Login
  │
  └→ Sidebar: Clica "👤 Perfil"
      ↓
    Profile (com navbar/sidebar - placeholder)
```

## Responsividade

### Desktop (> 768px)
```
┌────────────────────────────────────────┐
│ TopBar                                 │
├──────────┬──────────────────────────────┤
│ Sidebar  │ Conteúdo                     │
│ Fixed    │ (scrollável)                 │
│ 260px    │                              │
└──────────┴──────────────────────────────┘
```

### Mobile (< 768px)
```
Sidebar fica oculta por padrão (-260px)
Pode aparecer com swipe/toggle quando implementado

┌──────────────────────────┐
│ TopBar                   │
├──────────────────────────┤
│ Conteúdo (full width)    │
│ (scrollável)             │
└──────────────────────────┘
```

## Cores e Estilo

### Gradient Principal
```
┌────────────────────────┐
│  Verde → Roxo          │
│  #4CAF50 → #9C27B0    │
│  (Duolingo inspired)   │
└────────────────────────┘
```

### Sidebar Item Ativo
```
┌─────────────────┐
│ 🎯 Início       │  ← Barra verde na esquerda
│ |████ Título    │  ← Texto verde
│ • Logo em baixo │
└─────────────────┘
```

## Funcionalidades

✅ **Navegação** - Clique em qualquer item do sidebar  
✅ **Menu Dropdown** - Clique no avatar para opções  
✅ **Logout Seguro** - Clique em "Sair" para deslogar  
✅ **Responsivo** - Adapta para mobile (estrutura pronta)  
✅ **Animações** - Smooth transitions em todos elementos  
✅ **Persistência** - Dados salvam no Firebase normalmente  

---

**Pronto para usar!** Basta ativar as regras do Firebase e começar a registrar usuários.
