# ⚙️ Customização - Navbar & Sidebar

## Como Modificar a NavBar

### Mudança 1: Título da Página

Cada página passa um título diferente para o `<Layout>`:

```tsx
// PreTest.tsx
<Layout title="📝 Teste Vocacional - Informações">
  {...}
</Layout>

// Quiz.tsx
<Layout title="📝 Quiz - Teste Vocacional">
  {...}
</Layout>

// Result.tsx
<Layout title="🏆 Resultados - Teste Vocacional">
  {...}
</Layout>
```

**Para mudar**: Edite a string `title` em cada página.

---

## Como Modificar o Sidebar

### Mudança 1: Adicionar Novo Item

**Em `src/components/Sidebar.tsx`:**

```tsx
<NavGroup>
  <NavItem 
    isActive={isActive('/pretest')}
    onClick={() => {
      navigate('/pretest');
      onClose();
    }}
  >
    <span>🎯</span> Início
  </NavItem>

  <NavItem 
    isActive={isActive('/quiz')}
    onClick={() => {
      navigate('/quiz');
      onClose();
    }}
  >
    <span>📝</span> Teste
  </NavItem>

  {/* NOVO ITEM AQUI */}
  <NavItem 
    isActive={isActive('/minhapage')}
    onClick={() => {
      navigate('/minhapage');
      onClose();
    }}
  >
    <span>✨</span> Minha Página
  </NavItem>
</NavGroup>
```

**Depois em `App.tsx`, adicione a rota:**
```tsx
<Route path="/minhapage" element={<ProtectedRoute><MinhaPage /></ProtectedRoute>} />
```

### Mudança 2: Mudar a Cor do Item Ativo

**Em `src/components/Sidebar.tsx`:**

```tsx
const NavItem = styled.button<{ isActive: boolean }>`
  // ... outras propriedades ...
  color: ${props => props.isActive ? '#4CAF50' : '#666'};  // ← VERDE
  
  // Mude #4CAF50 para outra cor:
  // #FF6B6B (vermelho)
  // #4ECDC4 (turquesa)
  // #FFE66D (amarelo)
`;
```

### Mudança 3: Remover um Item do Sidebar

Simplesmente delete o `<NavItem>` correspondente.

---

## Como Modificar o TopBar

### Mudança 1: Trocar Logo "MeuCurso"

**Em `src/components/TopBar.tsx`:**

```tsx
<LogoSection>
  🎓 MeuCurso  {/* ← Mude isto */}
</LogoSection>
```

Mude para:
```tsx
<LogoSection>
  📚 OAB Test
</LogoSection>
```

### Mudança 2: Adicionar mais opções no Menu Dropdown

**Em `src/components/TopBar.tsx`:**

```tsx
<Menu isOpen={menuOpen}>
  <MenuItem onClick={handleProfile}>
    👤 Perfil
  </MenuItem>
  <MenuItem onClick={handleHistory}>
    📊 Meus Testes
  </MenuItem>
  
  {/* NOVO ITEM AQUI */}
  <MenuItem onClick={() => {
    navigate('/settings');
    setMenuOpen(false);
  }}>
    ⚙️ Configurações
  </MenuItem>
  
  <MenuItem className="logout" onClick={handleLogout}>
    🚪 Sair
  </MenuItem>
</Menu>
```

### Mudança 3: Mudar Posição do Menu

**Em `src/components/TopBar.tsx`:**

```tsx
const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 60px;      {/* ← Distância do topo */}
  right: 2rem;    {/* ← Lado direito. Mude para 'left' para lado esquerdo */}
```

---

## Como Modificar Cores Globais

### Gradient Duolingo

**Em qualquer arquivo styled-components:**

```tsx
background: linear-gradient(135deg, #4CAF50, #9C27B0);
//                                    VERDE    ROXO
```

Mude para:
```tsx
// Azul-Cyan
background: linear-gradient(135deg, #0066FF, #00D4FF);

// Pink-Purple
background: linear-gradient(135deg, #FF006B, #B200FF);

// Green-Blue
background: linear-gradient(135deg, #00D968, #0099E8);
```

### Cor de Destaque

Procure por `#4CAF50` (verde) em todos os arquivos e mude.

---

## Como Adicionar Avatar com Foto

**Em `src/components/TopBar.tsx`:**

```tsx
interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Teste Vocacional OAB' }) => {
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState(''); // ← NOVO
  
  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const name = userDoc.data().name || 'Usuário';
          setUserName(name);
          setUserImage(userDoc.data().imageUrl || ''); // ← NOVO
        }
      }
    };
    fetchUserName();
  }, []);

  // No return, mude Avatar para:
  <Avatar onClick={() => setMenuOpen(!menuOpen)}>
    {userImage ? (
      <img src={userImage} alt={userName} style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover'
      }} />
    ) : (
      userInitial
    )}
  </Avatar>
```

---

## Como Adicionar Notificações

**Em qualquer página, adicione:**

```tsx
import { useState } from 'react';

const [notification, setNotification] = useState<{
  message: string;
  type: 'success' | 'error';
} | null>(null);

// Depois de salvar dados:
setNotification({
  message: '✅ Dados salvos com sucesso!',
  type: 'success'
});

// Remover após 3 segundos:
setTimeout(() => setNotification(null), 3000);
```

---

## Como Fazer Sidebar Responsivo (Mobile)

**Em `src/components/Layout.tsx`:**

```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);

return (
  <LayoutContainer>
    <SidebarWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </SidebarWrapper>
    
    <MainContent>
      {/* Adicione botão para mobile */}
      <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </MobileMenuButton>
      {/* ... resto ... */}
    </MainContent>
  </LayoutContainer>
);
```

**Estilo:**
```tsx
const MobileMenuButton = styled.button`
  display: none;
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;
```

---

## Como Desabilitar Items do Sidebar

**Em `src/components/Sidebar.tsx`:**

```tsx
<NavItem 
  isActive={isActive('/history')}
  onClick={() => {
    navigate('/history');
    onClose();
  }}
  disabled={true}  {/* ← ADICIONE ISTO */}
>
  <span>📊</span> Histórico (Em Breve)
</NavItem>
```

**E no estilo NavItem:**
```tsx
const NavItem = styled.button<{ isActive: boolean; disabled?: boolean }>`
  // ... estilos ...
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:disabled {
    pointer-events: none;
  }
`;
```

---

## Dúvidas Frequentes

**P: Como mudar o tamanho do Sidebar?**  
R: Em `src/components/Sidebar.tsx`, mude `width: 260px;` para outro valor.

**P: Como remover animações?**  
R: Delete as propriedades `animation:` nos styled-components.

**P: Como fazer logout mais rápido?**  
R: Remova o `console.error()` em `handleLogout`.

**P: Posso usar ícones SVG ao invés de emojis?**  
R: Sim! Use bibliotecas como `react-icons` ou `lucide-react`.

---

**Precisa de mais ajuda?** Veja os arquivos comentados em `src/components/`.
