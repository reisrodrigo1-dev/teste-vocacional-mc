import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { TestResponse, Area } from '../types';
import { Layout } from '../components/Layout';
import openai from '../openai';
import { newsData } from '../data/news';

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
  gap: 0.8rem;
  perspective: 1000px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Place = styled.div<{ position: 'first' | 'second' | 'third'; height: number; color: string }>`
  width: 100px;
  height: ${props => props.height}px;
  background: linear-gradient(180deg, ${props => props.color}dd, ${props => props.color});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
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
    width: 80px;
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
  margin-bottom: 0.3rem;
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const PlaceNumber = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 0.2rem;
  font-weight: bold;
`;

const AreaName = styled.div`
  font-size: 0.9rem;
  text-align: center;
  padding: 0 0.25rem;
  line-height: 1.3;
  word-break: break-word;
  max-width: 100px;
`;

const Message = styled.p`
  font-size: 1.1rem;
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
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #333;
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
    color: #666;
    line-height: 1.5;
  }
`;

const TestSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const TestTab = styled.button<{ active: boolean }>`
  padding: 0.65rem 1.2rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #4CAF50, #45a049)' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.95rem;

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

const Result: React.FC = () => {
  const [tests, setTests] = useState<Array<{ id: string; data: TestResponse }>>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoadingResults(true);
      if (auth.currentUser) {
        try {
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
        } catch (error) {
          console.error('Erro ao buscar testes:', error);
        }
      }
      setIsLoadingResults(false);
    };
    fetchResults();
  }, []);

  const test = tests[currentTestIndex]?.data || null;

  const handleRefreshAnalysis = async () => {
    if (!test) return;
    
    setLoading(true);
    try {
      const areas: Area[] = ['Administrativo', 'Civil', 'Constitucional', 'Empresarial', 'Penal', 'Trabalho', 'Tributário'];
      
      // Recalculate scores
      const scores: { [key in Area]: number } = {
        Administrativo: 0,
        Civil: 0,
        Constitucional: 0,
        Empresarial: 0,
        Penal: 0,
        Trabalho: 0,
        Tributário: 0,
      };

      // Experience
      test.experience?.forEach(area => { scores[area]++; });
      test.tcc?.forEach(area => { scores[area]++; });

      // Processualista
      const processMap = {
        'Processo Civil': ['Civil', 'Empresarial'],
        'Processo Penal': ['Penal'],
        'Processo do Trabalho': ['Trabalho'],
      };
      processMap[test.processualist]?.forEach(a => { scores[a as Area]++; });

      // News votes
      Object.entries(test.newsVotes || {}).forEach(([newsId, liked]) => {
        const newsItem = newsData.find(n => n.id === newsId);
        if (newsItem && liked === true) {
          scores[newsItem.area as Area] += 1;
        } else if (newsItem && liked === false) {
          scores[newsItem.area as Area] -= 1;
        }
      });

      // Affinity
      if (test.affinityFirst) scores[test.affinityFirst] += 2;
      if (test.affinitySecond) scores[test.affinitySecond]++;

      // Procedural pieces
      const piecesMap: { [key: string]: Area[] } = {
        'Petição inicial de indenização (civil)': ['Civil'],
        'Mandado de segurança (tributário, constitucional, adm)': ['Tributário', 'Constitucional', 'Administrativo'],
        'Reclamação trabalhista (trabalho)': ['Trabalho'],
        'Pedido de falência (empresarial)': ['Empresarial'],
        'Apelação criminal (penal)': ['Penal'],
        'Ação popular (constitucional e administrativo)': ['Constitucional', 'Administrativo'],
        'Agravo de instrumento (civil e empresarial)': ['Civil', 'Empresarial'],
        'Contestação em ação trabalhista (trabalho)': ['Trabalho'],
        'Alegações finais em processo penal (penal)': ['Penal'],
      };
      test.proceduralPieces?.forEach(piece => {
        piecesMap[piece]?.forEach(a => { scores[a]++; });
      });

      // Never do
      if (test.neverDoFirst) scores[test.neverDoFirst] -= 2;
      if (test.neverDoSecond) scores[test.neverDoSecond]--;

      // Demotivated
      test.demotivated?.forEach(area => { scores[area]--; });

      const prompt = `Você é um consultor vocacional especializado em OAB. Baseado nas respostas e scores de um candidato, ranqueie as 7 áreas de direito.

IMPORTANTE - MITOS A DESMENTIR:
❌ Mito 1: Existe área com menor número de peças processuais
  Verdade: O número de peças é muito parecido entre TODAS as áreas

❌ Mito 2: Existem áreas com provas mais extensas e outras menos extensas  
  Verdade: O tamanho da prova é EXATAMENTE IGUAL para todas as áreas

❌ Mito 3: Penal e Trabalho são áreas mais fáceis que as outras
  Verdade: Todas as áreas possuem provas com o MESMO grau de dificuldade

DADOS REAIS - ÍNDICES DE APROVAÇÃO:
📊 Áreas com MAIOR aprovação:
  - Constitucional: 33% de aprovação
  - Civil: 27% de aprovação

📊 Áreas com MENOR aprovação:
  - Penal: ~16% de aprovação
  - Trabalho: ~16% de aprovação

VERDADES FUNDAMENTAIS (use como base para recomendação):
✅ Verdade 1: AFINIDADE é o PRIMEIRO critério de escolha
✅ Verdade 2: A prova de 2ª fase é PRÁTICA e CONSULTÁVEL
✅ Verdade 3: Quando há AFINIDADE, os temas tornam-se intuitivos ao procurar a resposta na legislação

Com base em AFINIDADE como critério primário, nos dados reais de aprovação, 
desmistificando os mitos, e considerando que a prova é consultável (tornando a afinidade intuitiva),
ranqueie as 7 áreas de forma DECRESCENTE de recomendação.

PARA AS EXPLICAÇÕES: Seja ESPECÍFICO e PESSOAL. Cite APENAS dados compreensíveis e diretos das respostas do usuário:
- Afinidades que ele declarou
- Experiência prática que possui
- Peças processuais que o interessaram
- Processualista em que tem facilidade
Explique POR QUE cada área faz sentido para ESTE usuário. NÃO mencione scores, pontos ou cálculos - use linguagem acessível.

RETORNE OBRIGATORIAMENTE um JSON neste EXATO formato (sem markdown, sem explicações extras):
{
  "ranking": ["Área1", "Área2", "Área3", "Área4", "Área5", "Área6", "Área7"],
  "explanations": {
    "Área1": "Explicação personalizada (2-3 linhas) clara e acessível. Cite o que o usuário respondeu e por que faz sentido.",
    "Área2": "Explicação personalizada (2-3 linhas) clara e acessível",
    "Área3": "Explicação personalizada (2-3 linhas) clara e acessível"
  }
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = completion.choices[0].message.content || '';
      
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const updatedTest = { ...test };
          updatedTest.aiRanking = parsed.ranking || areas;
          updatedTest.aiExplanations = parsed.explanations || {};
          updatedTest.scores = scores;
          
          await setDoc(doc(db, 'tests', auth.currentUser!.uid, 'attempts', tests[currentTestIndex].id), updatedTest);
          const newTests = [...tests];
          newTests[currentTestIndex] = { ...newTests[currentTestIndex], data: updatedTest };
          setTests(newTests);
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
      }
    } catch (error) {
      console.error('Error refreshing analysis:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <Title>🎉 Parabéns!</Title>
          <Subtitle>Confira seu resultado</Subtitle>
          
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
                    Teste {tests.length - idx} • {dateStr}
                  </TestTab>
                );
              })}
            </TestSelector>
          )}
          
          <Podium>
            {podiumOrder.map((item) => (
              <Place key={item.area} position={item.position} height={item.height} color={item.color}>
                <Medal>{item.medal}</Medal>
                <PlaceNumber>{item.place}</PlaceNumber>
                <AreaName>{item.area}</AreaName>
              </Place>
            ))}
          </Podium>

          <ExplanationSection>
            {explanationOrder.map((item, rankNum) => (
              <ExplanationCard key={item.area} rank={rankNum + 1}>
                <h4>
                  {item.medal} {item.place} Lugar - {item.area}
                </h4>
                <p>
                  {test.aiExplanations?.[item.area] || 'Esta área se destaca em seu perfil de afinidade e aptidão.'}
                </p>
              </ExplanationCard>
            ))}
          </ExplanationSection>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Message>✨ Sua área de maior afinidade é <strong>{ranking[0]}</strong>!</Message>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6', wordBreak: 'break-word' }}>
              Com base em suas respostas, você mostrou maior afinidade com esta área. Comece seus estudos e boa sorte na prova!
            </p>
            <ButtonGroup>
              <SecondaryButton onClick={handleRefreshAnalysis} disabled={loading}>
                {loading ? '⏳ Refazendo análise...' : '🔄 Refazer Análise'}
              </SecondaryButton>
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