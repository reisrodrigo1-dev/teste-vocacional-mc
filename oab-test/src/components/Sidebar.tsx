import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 260px;
  background: linear-gradient(180deg, #f8f8f8 0%, #ffffff 100%);
  border-right: 1px solid #e8e8e8;
  padding: 2rem 0;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 50;
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${(props) => props.isOpen ? '0' : '-260px'};
    transition: left 0.3s ease;
    box-shadow: ${(props) => props.isOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'};
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #888;
    }
  }
`;

const LogoContainer = styled.div`
  padding: 0 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LogoImage = styled.img`
  height: 50px;
  object-fit: contain;
`;

const Logo = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #4CAF50;
`;

const NavItem = styled.button<{ isActive: boolean }>`
  width: 100%;
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  color: ${props => props.isActive ? '#4CAF50' : '#666'};
  font-weight: ${props => props.isActive ? '600' : '500'};
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.isActive ? '#4CAF50' : 'transparent'};
    transition: all 0.2s ease;
  }

  &:hover {
    background: ${props => props.isActive ? 'rgba(76, 175, 80, 0.05)' : '#f0f0f0'};
    color: ${props => props.isActive ? '#4CAF50' : '#333'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const NavGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const NavGroupTitle = styled.div`
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const LogoutButton = styled.button`
  width: calc(100% - 3rem);
  margin: 2rem 1.5rem 0;
  padding: 0.9rem 1rem;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasTests, setHasTests] = useState(false);

  useEffect(() => {
    const checkTests = async () => {
      if (auth.currentUser) {
        try {
          const attemptsRef = collection(db, 'tests', auth.currentUser.uid, 'attempts');
          const querySnapshot = await getDocs(attemptsRef);
          setHasTests(querySnapshot.docs.length > 0);
        } catch (error) {
          console.error('Erro ao verificar testes:', error);
          setHasTests(false);
        }
      }
    };
    checkTests();
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <LogoContainer>
        <LogoImage src="https://meucurso.com.br/_next/image?url=%2Flogos%2Fmeu_curso.webp&w=256&q=75" alt="Meu Curso" onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }} />
        <Logo></Logo>
      </LogoContainer>

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

        {hasTests && (
          <NavItem 
            isActive={isActive('/result')}
            onClick={() => {
              navigate('/result');
              onClose();
            }}
          >
            <span>🏆</span> Resultados
          </NavItem>
        )}
      </NavGroup>

      <NavGroup>
        <NavGroupTitle>Conta</NavGroupTitle>
        <NavItem 
          isActive={isActive('/profile')}
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
        >
          <span>👤</span> Perfil
        </NavItem>

        {hasTests && (
          <NavItem 
            isActive={isActive('/history')}
            onClick={() => {
              navigate('/history');
              onClose();
            }}
          >
            <span>📊</span> Histórico
          </NavItem>
        )}
      </NavGroup>

      <LogoutButton onClick={handleLogout}>
        🚪 Deslogar
      </LogoutButton>
    </SidebarContainer>
  );
};
