import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { TestResponse } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
`;

const Title = styled.h1`
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  thead {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  tbody tr {
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    th, td {
      padding: 0.75rem;
    }
  }
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #999;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
  }
`;

const Medal = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const History: React.FC = () => {
  const [tests, setTests] = useState<Array<{ id: string; data: TestResponse }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
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
        } catch (error) {
          console.error('Erro ao buscar testes:', error);
        }
      }
      setLoading(false);
    };
    fetchTests();
  }, []);

  const handleViewResult = (testId: string) => {
    // Armazenar qual teste visualizar e ir para resultado
    localStorage.setItem('selectedTestId', testId);
    window.location.href = '/result';
  };

  return (
    <Layout title="📊 Histórico de Testes">
      <Container>
        <Card>
          <Title>📊 Histórico de Testes</Title>
          <Subtitle>Veja todos os seus testes realizados</Subtitle>

          {loading ? (
            <EmptyState>
              <p>⏳ Carregando...</p>
            </EmptyState>
          ) : tests.length === 0 ? (
            <EmptyState>
              <h2>Nenhum teste realizado</h2>
              <p>Você ainda não realizou nenhum teste. Faça seu primeiro teste agora!</p>
              <Button 
                onClick={() => window.location.href = '/quiz'}
                style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #4CAF50, #45a049)' }}
              >
                ✍️ Fazer Teste
              </Button>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Teste</th>
                  <th>Data</th>
                  <th>1º Lugar</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, idx) => {
                  const date = new Date(test.data.timestamp || 0);
                  const dateStr = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const firstPlace = test.data.aiRanking?.[0] || 'N/A';
                  const medal = idx === 0 ? '⭐' : idx === 1 ? '📍' : '📌';

                  return (
                    <tr key={test.id}>
                      <td>{medal} Teste {tests.length - idx}</td>
                      <td>{dateStr}</td>
                      <td><Medal>🥇</Medal>{firstPlace}</td>
                      <td>
                        <Button onClick={() => handleViewResult(test.id)}>
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Button 
              onClick={() => window.location.href = '/'}
              style={{ background: 'linear-gradient(135deg, #757575, #616161)' }}
            >
              Voltar ao Menu
            </Button>
          </div>
        </Card>
      </Container>
    </Layout>
  );
};

export default History;
