import { useEffect, useState } from 'react';
import { collection, query, getDocs, collectionGroup } from 'firebase/firestore';
import { db } from '../firebase';
import type { User, TestResponse, Area } from '../types/index';
import * as XLSX from 'xlsx';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Header = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 28px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #5568d3;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }

  th {
    padding: 15px;
    text-align: left;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
    color: #555;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
`;

const LoadingState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #667eea;
  font-size: 16px;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    margin: 0 0 10px 0;
    color: #999;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  div {
    font-size: 28px;
    color: #667eea;
    font-weight: bold;
  }
`;

interface StudentData extends User {
  testResponses?: TestResponse[];
  bestAreas?: Area[];
}

export default function Admin() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData: { [key: string]: StudentData } = {};

        usersSnapshot.forEach((doc) => {
          const userData = doc.data() as User;
          usersData[doc.id] = {
            id: doc.id,
            name: userData.name || '',
            email: userData.email || '',
            cpf: userData.cpf || '',
            whatsapp: userData.whatsapp || '',
            graduationStatus: userData.graduationStatus || 'Não',
            examEdition: userData.examEdition || '45',
            studyHours: userData.studyHours || '',
            difficulties: userData.difficulties || '',
            period: userData.period,
            testResponses: [],
          } as StudentData;
        });

        // Fetch test responses from all attempts subcollections
        const attempsQuery = query(collectionGroup(db, 'attempts'));
        const attemptsSnapshot = await getDocs(attempsQuery);
        
        console.log('Total de testes encontrados em attempts:', attemptsSnapshot.docs.length);
        
        // Agrupar testes por userId
        attemptsSnapshot.forEach((doc) => {
          const testData = doc.data() as TestResponse;
          const userId = testData.userId;
          
          if (userId && usersData[userId]) {
            usersData[userId].testResponses!.push(testData);
          } else if (userId) {
            // Criar usuário se não existir
            usersData[userId] = {
              id: userId,
              name: `Usuário ${userId}`,
              email: '',
              cpf: '',
              whatsapp: '',
              graduationStatus: 'Não',
              examEdition: '45',
              studyHours: '',
              difficulties: '',
              testResponses: [testData],
            };
          }
        });
        
        // Atualizar bestAreas para cada usuário
        Object.values(usersData).forEach(user => {
          if (user.testResponses && user.testResponses.length > 0) {
            const sortedTests = user.testResponses.sort((a, b) => {
              const aTime = a.timestamp || (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
              const bTime = b.timestamp || (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
              return bTime - aTime;
            });
            
            if (sortedTests[0].aiRanking && sortedTests[0].aiRanking.length > 0) {
              user.bestAreas = sortedTests[0].aiRanking.slice(0, 3);
            }
          }
        });

        const studentsArray = Object.values(usersData)
          .filter(student => student.name)
          .sort((a, b) => a.name.localeCompare(b.name));

        setStudents(studentsArray);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportToExcel = async () => {
    try {
      // Buscar dados novamente para garantir que estão atualizados
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData: { [key: string]: StudentData } = {};

      usersSnapshot.forEach((doc) => {
        const userData = doc.data() as User;
        usersData[doc.id] = {
          id: doc.id,
          name: userData.name || '',
          email: userData.email || '',
          cpf: userData.cpf || '',
          whatsapp: userData.whatsapp || '',
          graduationStatus: userData.graduationStatus || 'Não',
          examEdition: userData.examEdition || '45',
          studyHours: userData.studyHours || '',
          difficulties: userData.difficulties || '',
          period: userData.period,
          testResponses: [],
        } as StudentData;
      });

      // Fetch test responses from all attempts subcollections
      const attempsQuery = query(collectionGroup(db, 'attempts'));
      const attemptsSnapshot = await getDocs(attempsQuery);
      
      // Agrupar testes por userId
      attemptsSnapshot.forEach((doc) => {
        const testData = doc.data() as TestResponse;
        const userId = testData.userId;
        
        if (userId && usersData[userId]) {
          usersData[userId].testResponses!.push(testData);
        } else if (userId) {
          // Criar usuário se não existir
          usersData[userId] = {
            id: userId,
            name: `Usuário ${userId}`,
            email: '',
            cpf: '',
            whatsapp: '',
            graduationStatus: 'Não',
            examEdition: '45',
            studyHours: '',
            difficulties: '',
            testResponses: [testData],
          };
        }
      });
      
      // Atualizar bestAreas para cada usuário
      Object.values(usersData).forEach(user => {
        if (user.testResponses && user.testResponses.length > 0) {
          const sortedTests = user.testResponses.sort((a, b) => {
            const aTime = a.timestamp || (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
            const bTime = b.timestamp || (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
            return bTime - aTime;
          });
          
          if (sortedTests[0].aiRanking && sortedTests[0].aiRanking.length > 0) {
            user.bestAreas = sortedTests[0].aiRanking.slice(0, 3);
          }
        }
      });

      const studentsArray = Object.values(usersData)
        .filter(student => student.name)
        .sort((a, b) => a.name.localeCompare(b.name));

      const exportData = studentsArray.map((student) => ({
        'Nome': student.name,
        'Email': student.email,
        'CPF': student.cpf,
        'WhatsApp': student.whatsapp,
        'Status de Formação': student.graduationStatus,
        'Período': student.period || 'Formado',
        'Edição Exame': student.examEdition,
        'Horas de Estudo': student.studyHours,
        'Dificuldades': student.difficulties,
        'Testes Realizados': student.testResponses?.length || 0,
        'Top 1 - Área': student.bestAreas?.[0] || '-',
        'Top 2 - Área': student.bestAreas?.[1] || '-',
        'Top 3 - Área': student.bestAreas?.[2] || '-',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Alunos');

      // Ajustar largura das colunas
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      XLSX.writeFile(workbook, `alunos_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  const stats = {
    totalStudents: students.length,
    withTests: students.filter((s) => s.testResponses && s.testResponses.length > 0).length,
    graduated: students.filter((s) => s.graduationStatus === 'Sim').length,
  };

  return (
    <Container>
      <Header>
        <Title>Painel de Administração</Title>
        <ButtonGroup>
          <Button onClick={handleExportToExcel} disabled={students.length === 0}>
            📊 Exportar para Excel
          </Button>
        </ButtonGroup>
      </Header>

      <Stats>
        <StatCard>
          <h3>Total de Alunos</h3>
          <div>{stats.totalStudents}</div>
        </StatCard>
        <StatCard>
          <h3>Com Testes</h3>
          <div>{stats.withTests}</div>
        </StatCard>
        <StatCard>
          <h3>Formados</h3>
          <div>{stats.graduated}</div>
        </StatCard>
      </Stats>

      {loading ? (
        <LoadingState>Carregando dados...</LoadingState>
      ) : students.length === 0 ? (
        <EmptyState>Nenhum aluno cadastrado</EmptyState>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>WhatsApp</th>
                <th>Formação</th>
                <th>Período</th>
                <th>Edição</th>
                <th>Horas Estudo</th>
                <th>Testes</th>
                <th>Top 1</th>
                <th>Top 2</th>
                <th>Top 3</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.cpf}</td>
                  <td>{student.whatsapp}</td>
                  <td>{student.graduationStatus}</td>
                  <td>{student.period || 'Formado'}</td>
                  <td>{student.examEdition}</td>
                  <td>{student.studyHours}</td>
                  <td>{student.testResponses?.length || 0}</td>
                  <td>{student.bestAreas?.[0] || '-'}</td>
                  <td>{student.bestAreas?.[1] || '-'}</td>
                  <td>{student.bestAreas?.[2] || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
