import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: white;
  color: #333;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.5s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
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
  font-size: 1.05rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PreTest: React.FC = () => {
  const [graduationStatus, setGraduationStatus] = useState<'Sim' | 'Não'>('Não');
  const [period, setPeriod] = useState('');
  const [examEdition, setExamEdition] = useState<'45' | '46' | '47' | '48'>('45');
  const [studyHours, setStudyHours] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setGraduationStatus(data.graduationStatus);
          setPeriod(data.period || '');
          setExamEdition(data.examEdition);
          setStudyHours(data.studyHours);
          setDifficulties(data.difficulties);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      const updatedUser: any = {
        graduationStatus,
        examEdition,
        studyHours,
        difficulties,
      };
      
      // Apenas adicionar period se o usuário não for formado
      if (graduationStatus === 'Não') {
        updatedUser.period = period;
      }
      
      // Use setDoc with merge to create or update the document
      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedUser, { merge: true });
      navigate('/quiz');
    } catch (error: any) {
      console.error('Erro ao atualizar dados:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    }
  };

  return (
    <Layout title="📝 Teste Vocacional - Informações">
      <Container>
        <Card>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>✅ Você já é formado?</Label>
              <Select value={graduationStatus} onChange={(e) => setGraduationStatus(e.target.value as 'Sim' | 'Não')}>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </Select>
            </FormGroup>

            {graduationStatus === 'Não' && (
              <FormGroup>
                <Label>📚 Em qual período você está?</Label>
                <Input
                  type="text"
                  placeholder="Ex: 6º período"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                />
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>📋 Qual prova prestará?</Label>
              <Select value={examEdition} onChange={(e) => setExamEdition(e.target.value as '46' | '47' | '48')}>
                <option value="46">46ª</option>
                <option value="47">47ª</option>
                <option value="48">48ª</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>🔄 Quantas vezes já prestou a 2ª fase?</Label>
              <Input
                type="text"
                placeholder="Ex: 2 vezes"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>😕 Qual sua maior dificuldade nos estudos?</Label>
              <TextArea
                placeholder="Descreva sua maior dificuldade..."
                value={difficulties}
                onChange={(e) => setDifficulties(e.target.value)}
                required
              />
            </FormGroup>
            
            <Button type="submit">Iniciar Teste 🚀</Button>
          </Form>
        </Card>
      </Container>
    </Layout>
  );
};

export default PreTest;