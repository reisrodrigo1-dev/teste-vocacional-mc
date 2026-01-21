import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.8rem 0.75rem;
    gap: 0.75rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #4CAF50;
  min-width: fit-content;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    gap: 0.5rem;
    min-width: auto;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #333;
  flex-shrink: 0;
  order: -1;

  @media (max-width: 768px) {
    display: block;
  }
`;

const TitleSection = styled.div`
  flex: 1;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  min-width: 0;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    flex: 0.8;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border-radius: 12px;

  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
  }
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #9C27B0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 60px;
  right: 1rem;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 200;
  display: ${(props) => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: 0.9rem 1.2rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f5f5f5;
    color: #4CAF50;
  }
  
  &.logout {
    color: #c33;
    
    &:hover {
      background: #fee;
    }
  }
`;

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Teste Vocacional OAB', onMenuClick }) => {
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const name = userDoc.data().name || 'Usuário';
          setUserName(name);
          setUserInitial(name.charAt(0).toUpperCase());
        }
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    setMenuOpen(false);
  };

  const handleHistory = () => {
    navigate('/history');
    setMenuOpen(false);
  };

  return (
    <TopBarContainer>
      <MenuButton onClick={onMenuClick}>☰</MenuButton>
      <LogoSection>
        
      </LogoSection>
      <TitleSection>{title}</TitleSection>
      <UserSection>
        <UserInfo>
          <UserName>{userName}</UserName>
          <Avatar onClick={() => setMenuOpen(!menuOpen)}>
            {userInitial}
          </Avatar>
        </UserInfo>
        <Menu isOpen={menuOpen}>
          <MenuItem onClick={handleProfile}>
            👤 Perfil
          </MenuItem>
          <MenuItem onClick={handleHistory}>
            📊 Meus Testes
          </MenuItem>
          <MenuItem className="logout" onClick={handleLogout}>
            🚪 Sair
          </MenuItem>
        </Menu>
      </UserSection>
    </TopBarContainer>
  );
};
