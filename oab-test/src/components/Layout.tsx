import React, { useState } from 'react';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background: white;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarWrapper = styled.div<{ isOpen?: boolean }>`
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 60px;
    width: 100%;
    height: calc(100vh - 60px);
    z-index: 50;
    display: ${props => props.isOpen ? 'block' : 'none'};
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TopBarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #f9f9f9;

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

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = 'Teste Vocacional OAB' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      <SidebarWrapper isOpen={sidebarOpen}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </SidebarWrapper>
      
      <MainContent>
        <TopBarWrapper>
          <TopBar title={title} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </TopBarWrapper>
        
        <ContentWrapper onClick={() => setSidebarOpen(false)}>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};
