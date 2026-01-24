import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { reload } from 'firebase/auth';
import type { TestResponse } from '../types';
import { Layout } from '../components/Layout';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
  overflow-y: auto;
`;

const Card = styled.div`
  background: white;
  color: #333;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  color: #666;
`;

const Podium = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: 2rem 0;
  gap: 0.5rem;
  perspective: 1000px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

const Place = styled.div<{ position: 'first' | 'second' | 'third'; height: number; color: string }>`
  width: 120px;
  height: ${props => props.height}px;
  background: linear-gradient(180deg, ${props => props.color}dd, ${props => props.color});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  border-radius: 15px 15px 0 0;
  color: white;
  font-weight: bold;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transform: ${props => {
    if (props.position === 'first') return 'scale(1.08) translateY(0)';
    if (props.position === 'second') return 'scale(0.98)';
    return 'scale(0.92)';
  }};
  transition: all 0.3s ease;
  animation: ${props => {
    if (props.position === 'first') return 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s';
    if (props.position === 'second') return 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0s';
    return 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.4s';
  }} both;
  
  @media (max-width: 768px) {
    width: 100px;
  }
  
  @media (max-width: 600px) {
    width: 85px;
  }
  
  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.3) translateY(40px);
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
`;

const Medal = styled.div`
  font-size: 2.2rem;
  margin-bottom: 0rem;
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const PlaceNumber = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0rem;
  margin-top: 0.5rem;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const AreaName = styled.div`
  font-size: 0.85rem;
  text-align: center;
  padding: 0 0.25rem;
  line-height: 1.2;
  word-break: break-word;
  max-width: 110px;
  margin-bottom: 0rem;
  @media (max-width: 768px) {
    font-size: 0.8rem;
    max-width: 90px;
  }
  @media (max-width: 600px) {
    font-size: 0.75rem;
    max-width: 75px;
  }
`;

const Message = styled.p`
  font-size: 1.4rem;
  margin: 2rem 0 1.5rem 0;
  font-weight: 600;
  color: #4CAF50;
  line-height: 1.5;
  word-break: break-word;
`;

const ExplanationSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid #e8e8e8;
`;

const ExplanationCard = styled.div<{ rank: number }>`
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid ${props => {
    if (props.rank === 1) return '#FFD700';
    if (props.rank === 2) return '#C0C0C0';
    if (props.rank === 3) return '#CD7F32';
    return '#4CAF50';
  }};
  background: ${props => {
    if (props.rank === 1) return '#FFFEF0';
    if (props.rank === 2) return '#F8F8F8';
    if (props.rank === 3) return '#FEF5E7';
    return '#f0f8f0';
  }};
  
  h4 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: #333;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
    color: #555;
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    font-size: 0.95rem;
    color: #555;
    line-height: 1.8;
  }
  
  li {
    margin: 0.5rem 0;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  
  img {
    max-height: 50px;
    object-fit: contain;
  }
`;

const TestSelector = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0.8rem;
  background: #f9f9f9;
  border-radius: 8px;
`;

const TestTab = styled.button<{ active: boolean }>`
  padding: 0.4rem 0.8rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #4CAF50, #45a049)' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#999'};
  border: 1px solid ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.8rem;

  &:hover {
    border-color: #4CAF50;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.95rem 1rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, #2196F3, #1976D2);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  }
`;

const ShareSection = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid #e9ecef;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1.5rem 0;
  }
`;

const ShareTitle = styled.h3`
  color: #333;
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const ShareButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
  }

  &.instagram {
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    color: white;
    box-shadow: 0 4px 12px rgba(188, 24, 136, 0.3);

    &:hover {
      box-shadow: 0 6px 20px rgba(188, 24, 136, 0.4);
    }
  }

  &.whatsapp {
    background: #25d366;
    color: white;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);

    &:hover {
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    }
  }

  &.platform {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);

    &:hover {
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    }
  }
`;

const ShareDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const EbookButton = styled.button`
  padding: 1.25rem 2rem;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.5);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    max-width: 500px;
  }
`;

const SimuladoButton = styled.button`
  padding: 1.25rem 2rem;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    max-width: 500px;
  }
`;

const Result: React.FC = () => {
  const [tests, setTests] = useState<Array<{ id: string; data: TestResponse }>>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoadingResults(true);
      try {
        if (auth.currentUser) {
          // Reload user to get latest data
          await reload(auth.currentUser);
          
          // Get user's first name from displayName
          let firstName = auth.currentUser?.displayName?.split(' ')[0] || '';
          console.log('Display Name:', auth.currentUser?.displayName);
          console.log('First Name:', firstName);
          
          // If displayName is empty, try to get from Firestore
          if (!firstName) {
            try {
              const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
              if (userDoc.exists() && userDoc.data()?.name) {
                firstName = userDoc.data().name.split(' ')[0];
                console.log('Name from Firestore:', firstName);
              }
            } catch (firestoreErr) {
              console.error('Erro ao buscar nome do Firestore:', firestoreErr);
            }
          }
          
          setUserName(firstName);
          
          const attemptsRef = collection(db, 'tests', auth.currentUser.uid, 'attempts');
          const q = query(attemptsRef, orderBy('timestamp', 'desc'));
          const querySnapshot = await getDocs(q);
          const fetchedTests = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data() as TestResponse,
          }));
          
          // Remover duplicatas baseado no ID
          const uniqueTests = Array.from(new Map(fetchedTests.map(t => [t.id, t])).values());
          setTests(uniqueTests);
          
          // Verificar se há um teste selecionado no localStorage (vindo de /history)
          const selectedTestId = localStorage.getItem('selectedTestId');
          if (selectedTestId) {
            const selectedIndex = uniqueTests.findIndex(t => t.id === selectedTestId);
            if (selectedIndex !== -1) {
              setCurrentTestIndex(selectedIndex);
            }
            localStorage.removeItem('selectedTestId');
          } else {
            setCurrentTestIndex(0);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar testes:', error);
      } finally {
        setIsLoadingResults(false);
      }
    };
    fetchResults();
  }, []);

  const shareOnWhatsApp = () => {
    const url = window.location.origin;
    const text = `🎯 Descobri minha área de afinidade na OAB!\n\n✨ Meu resultado: *${test?.aiRanking?.[0] || 'Área recomendada'}*\n\nFaça o seu teste também: ${url}\n\n📚 Via MeuCurso Educacional`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateImageForSocial = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1100;

    // Background cinza bem claro
    ctx.fillStyle = '#F5F0E8';
    ctx.fillRect(0, 0, 1080, 1500);

    // Load and draw logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    
    const drawContent = () => {
      // Background cinza bem claro
      ctx.fillStyle = '#F5F0E8';
      ctx.fillRect(0, 0, 1080, 1100);

      // Header background branco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1080, 120);
      
      // Logo (maintain aspect ratio)
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const logoHeight = 40;
        const logoWidth = (logoImg.naturalWidth / logoImg.naturalHeight) * logoHeight;
        ctx.drawImage(logoImg, 40, 15, logoWidth, logoHeight);
      }

      // Header title - TESTE VOCACIONAL
      ctx.fillStyle = '#333333';
      ctx.font = '16px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TESTE VOCACIONAL DA ÁREA DE 2ª FASE OAB', 540, 100);

      // Emojis de pessoas
      ctx.font = '48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('😊😊😊😊', 540, 160);

      // Saudação
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 40px Arial, sans-serif';
      ctx.textAlign = 'center';
      const userName = auth.currentUser?.displayName?.split(' ')[0] || 'você';
      ctx.fillText(`Parabéns, ${userName}!`, 540, 220);

      // "Sua área de maior afinidade é"
      ctx.fillStyle = '#E8A740';
      ctx.font = '24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Sua área de maior afinidade é', 540, 270);

      // Pódio
      const ranking = test?.aiRanking?.slice(0, 3) || [];
      const podiumColors = ['#E8D4A0', '#FFE066', '#D5915B']; // Cinza, Ouro, Bronze
      const podiumShadows = ['#D4C090', '#E6C700', '#B8754A'];
      const medals = ['🥇', '🥈', '🥉'];
      const podiumHeights = [140, 180, 100];
      const podiumPositions = [150, 440, 730]; // 2º, 1º (centro), 3º
      const podiumOrder = [1, 0, 2]; // Silver, Gold, Bronze

      podiumOrder.forEach((rankIndex, boxIndex) => {
        const x = podiumPositions[boxIndex];
        const height = podiumHeights[rankIndex];
        const y = 480 - height;

        // Podium box com cantos arredondados
        ctx.fillStyle = podiumColors[rankIndex];
        ctx.beginPath();
        ctx.moveTo(x + 12, y);
        ctx.lineTo(x + 158, y);
        ctx.quadraticCurveTo(x + 170, y, x + 170, y + 12);
        ctx.lineTo(x + 170, y + height - 12);
        ctx.quadraticCurveTo(x + 170, y + height, x + 158, y + height);
        ctx.lineTo(x + 12, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - 12);
        ctx.lineTo(x, y + 12);
        ctx.quadraticCurveTo(x, y, x + 12, y);
        ctx.fill();

        // Inner shadow bottom
        ctx.fillStyle = podiumShadows[rankIndex];
        ctx.fillRect(x + 3, y + height - 10, 164, 10);

        // Medal emoji
        ctx.font = 'bold 40px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(medals[rankIndex], x + 85, y + 50);

        // Area name
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 18px Arial, sans-serif';
        const areaName = ranking[rankIndex] || '';
        ctx.fillText(areaName, x + 85, y + height - 12);
      });

      // Footer background
      ctx.fillStyle = '#F5F0E8';
      ctx.fillRect(0, 480, 1080, 620);

      // Footer white section
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 620, 1080, 480);

      // Footer logo
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const footerLogoHeight = 45;
        const footerLogoWidth = (logoImg.naturalWidth / logoImg.naturalHeight) * footerLogoHeight;
        ctx.drawImage(logoImg, 540 - footerLogoWidth/2, 680, footerLogoWidth, footerLogoHeight);
      }

      // Footer text
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MeuCurso', 540, 780);
      ctx.fillText('EDUCACIONAL', 540, 805);

      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#999999';
      ctx.fillText('meucurso.com.br/teste-vocacional', 540, 840);

      // Download image
      const link = document.createElement('a');
      link.download = 'meu-resultado-oab.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };

    // Try to load logo, but proceed even if it fails
    logoImg.onload = drawContent;
    logoImg.onerror = drawContent;
    logoImg.src = 'https://meucurso.com.br/_next/image?url=%2Flogos%2Fmeu_curso.webp&w=256&q=75';
  };

  const goToPlatform = () => {
    window.open('https://meucurso.com.br', '_blank');
  };

  const test = tests[currentTestIndex]?.data || null;

  if (!test) return <Container>Carregando...</Container>;

  const ranking = test.aiRanking.slice(0, 3); // top 3
  const podiumOrder = [
    { area: ranking[1], position: 'second' as const, height: 200, color: '#C0C0C0', medal: '🥈', place: '2º' },
    { area: ranking[0], position: 'first' as const, height: 280, color: '#FFD700', medal: '🥇', place: '1º' },
    { area: ranking[2], position: 'third' as const, height: 140, color: '#CD7F32', medal: '🥉', place: '3º' },
  ];

  // Order for explanations: 1º, 2º, 3º (sequential)
  const explanationOrder = [
    { area: ranking[0], medal: '🥇', place: '1º' },
    { area: ranking[1], medal: '🥈', place: '2º' },
    { area: ranking[2], medal: '🥉', place: '3º' },
  ];

  return (
    <Layout title="🏆 Resultados - Teste Vocacional">
      <Container>
        <Card>
          {isLoadingResults ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '1rem', color: '#666' }}>⏳ Carregando resultados...</p>
            </div>
          ) : tests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '1rem' }}>📋 Nenhum resultado encontrado</h2>
              <p style={{ color: '#999', fontSize: '1rem', marginBottom: '2rem' }}>
                Você ainda não realizou nenhum teste. Faça seu primeiro teste para ver os resultados!
              </p>
              <ButtonGroup>
                <SecondaryButton onClick={() => window.location.href = '/quiz'} style={{ background: 'linear-gradient(135deg, #4CAF50, #45a049)', boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)' }}>
                  ✍️ Fazer Teste
                </SecondaryButton>
                <Button onClick={() => window.location.href = '/'}>Voltar ao Menu</Button>
              </ButtonGroup>
            </div>
          ) : (
            <>
          {tests.length > 0 && (
            <TestSelector>
              {tests.map((t, idx) => {
                const date = new Date(parseInt(t.id.replace('test_', '')));
                const dateStr = date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return (
                  <TestTab 
                    key={t.id}
                    active={currentTestIndex === idx}
                    onClick={() => setCurrentTestIndex(idx)}
                  >
                    {tests.length - idx} • {dateStr}
                  </TestTab>
                );
              })}
            </TestSelector>
          )}
          
          <Title>🎉 Parabéns{userName ? `, ${userName}` : ''}!</Title>
          <Subtitle>Confira seu resultado</Subtitle>
          
          <LogoContainer>
            <img src="https://meucurso.com.br/_next/image?url=%2Flogos%2Fmeu_curso.webp&w=256&q=75" alt="MeuCurso" />
          </LogoContainer>
          
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <Message>✨ Sua área de 2ª Fase é <strong>{ranking[0]}</strong>!</Message>
          </div>
          
          <Podium>
            {podiumOrder.map((item) => (
              <Place key={item.area} position={item.position} height={item.height} color={item.color}>
                <Medal>{item.medal}</Medal>
                <AreaName>{item.area}</AreaName>
                <PlaceNumber>{item.place}</PlaceNumber>
              </Place>
            ))}
          </Podium>

          <ExplanationSection>
            {explanationOrder.map((item, rankNum) => {
              const explanation = test.aiExplanations?.[item.area] || 'Esta área se destaca em seu perfil de afinidade e aptidão.';
              const isFormattedList = explanation.includes('\n- ');
              
              return (
                <ExplanationCard key={item.area} rank={rankNum + 1}>
                  <h4>
                    {item.medal} {item.place} Lugar - {item.area}
                  </h4>
                  {isFormattedList ? (
                    <ul>
                      {explanation.split('\n').map((line, idx) => {
                        const cleanLine = line.replace(/^- /, '');
                        return cleanLine ? <li key={idx}>{cleanLine}</li> : null;
                      })}
                    </ul>
                  ) : (
                    <p>{explanation}</p>
                  )}
                </ExplanationCard>
              );
            })}
          </ExplanationSection>
          
          <div style={{ backgroundColor: '#f0f8f0', border: '2px solid #4CAF50', borderRadius: '12px', padding: '1.5rem', margin: '2rem 0', textAlign: 'center' }}>
            <p style={{ color: '#333', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>
              <strong>ℹ️ Observação importante:</strong> Este teste tem caráter apenas orientativo para a escolha da área da segunda fase. Recomenda-se também considerar o desempenho nas questões objetivas.
            </p>
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6', wordBreak: 'break-word' }}>
              Com base em suas respostas, você mostrou maior afinidade com esta área. Comece seus estudos e boa sorte na prova!
            </p>
            
            <EbookButton disabled>
              📚 Baixe o e-book e conheça as áreas do seu pódium (<strong>EM BREVE</strong>)
            </EbookButton>
            
            <SimuladoButton onClick={() => window.open('https://aluno.meucurso.com.br/StudyRoute/Degustate/31c3976d-f85c-4c6d-bf9e-2783ba3a709e?l=true', '_blank')}>
              📝 Clique para fazer o Simulado Objetivo
            </SimuladoButton>
            
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5', textAlign: 'center', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Você será redirecionado para a rota Jornada OAB 46 na área do aluno MeuCurso. O simulado estará disponível na sua rota.
            </p>
            
            <ShareSection>
              <ShareTitle>📤 Compartilhar Resultado</ShareTitle>
              <ShareDescription>
                Mostre para seus amigos e colegas qual sua área de afinidade na OAB!
              </ShareDescription>
              <ShareButtons>
                <ShareButton className="whatsapp" onClick={shareOnWhatsApp}>
                  💬 WhatsApp
                </ShareButton>
                <ShareButton className="instagram" onClick={generateImageForSocial}>
                  📷 Criar Imagem
                </ShareButton>
                <ShareButton className="platform" onClick={goToPlatform}>
                  🎓 Ir para MeuCurso
                </ShareButton>
              </ShareButtons>
            </ShareSection>
            
            <ButtonGroup>
              {tests.length < 3 && (
                <SecondaryButton onClick={() => window.location.href = '/quiz'} style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)', boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)' }}>
                  ➕ Fazer Novo Teste
                </SecondaryButton>
              )}
              <Button onClick={() => window.location.href = '/'}>Voltar ao Menu</Button>
            </ButtonGroup>
            {tests.length === 3 && (
              <p style={{ color: '#c62828', fontSize: '0.9rem', marginTop: '1rem', fontWeight: '600' }}>
                ⚠️ Você atingiu o limite de 3 testes
              </p>
            )}
          </div>
            </>
          )}
        </Card>
      </Container>
    </Layout>
  );
};

export default Result;