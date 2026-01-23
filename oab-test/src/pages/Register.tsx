import React, { useState } from 'react';
import styled from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 3rem 2rem;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
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

const Logo = styled.h1`
  color: #4CAF50;
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #999;
  font-size: 0.95rem;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
`;

const Label = styled.label`
  color: #333;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
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
  
  &::placeholder {
    color: #bbb;
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
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LinkWrapper = styled.p`
  color: #666;
  text-align: center;
  margin: 1.5rem 0 0 0;
  font-size: 0.95rem;
`;

const Link = styled.a`
  color: #4CAF50;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  
  &:hover {
    color: #45a049;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  border: 2px solid #fcc;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
`;

const CheckboxInput = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #4CAF50;
  min-width: 20px;
`;

const CheckboxLabel = styled.label`
  color: #333;
  font-size: 0.85rem;
  cursor: pointer;
  line-height: 1.4;
  
  a {
    color: #4CAF50;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate LGPD acceptance
    if (!lgpdAccepted) {
      setError('Você precisa aceitar a Política de Privacidade (LGPD) para continuar.');
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = {
        id: userCredential.user.uid,
        name,
        cpf,
        whatsapp,
        email,
        lgpdAccepted: true,
        lgpdAcceptedAt: new Date(),
        graduationStatus: 'Não',
        examEdition: '45',
        studyHours: '',
        difficulties: '',
      };
      try {
        await setDoc(doc(db, 'users', user.id), user);
        navigate('/pretest');
      } catch (firestoreErr: any) {
        console.error('Erro ao salvar no Firestore:', firestoreErr);
        if (firestoreErr.code === 'permission-denied') {
          setError('❌ Erro de permissão no Firestore. As regras de segurança precisam ser ativadas. Veja as instruções em SETUP.md');
        } else {
          setError('Erro ao salvar dados: ' + (firestoreErr.message || 'Tente novamente'));
        }
        // Delete the auth user if Firestore save failed
        try {
          await userCredential.user.delete();
        } catch (deleteErr) {
          console.error('Erro ao deletar usuário:', deleteErr);
        }
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado. Tente fazer login!');
      } else if (err.code === 'auth/weak-password') {
        setError('Senha muito fraca. Use pelo menos 6 caracteres!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique e tente novamente!');
      } else {
        setError('Erro ao cadastrar: ' + (err.message || 'Tente novamente'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Cadastro">
      <Container>
        <Card>
          <Logo>🎓 MeuCurso</Logo>
          <Subtitle>Criar Conta</Subtitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <div>
              <Label>Nome Completo</Label>
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>CPF</Label>
              <Input
              type="text"
              placeholder="123.456.789-10"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input
              type="text"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <CheckboxWrapper>
            <CheckboxInput
              type="checkbox"
              id="lgpd"
              checked={lgpdAccepted}
              onChange={(e) => setLgpdAccepted(e.target.checked)}
            />
            <CheckboxLabel htmlFor="lgpd">
              ✅ Concordo com a <a href="https://meucurso.com.br/politica-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> e a <a href="https://meucurso.com.br/lgpd" target="_blank" rel="noopener noreferrer">Proteção de Dados (LGPD)</a>
            </CheckboxLabel>
          </CheckboxWrapper>
          <Button type="submit" disabled={loading || !lgpdAccepted}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
        </Form>
        <LinkWrapper>
          Já tem conta? <Link onClick={() => navigate('/login')}>Entrar</Link>
        </LinkWrapper>
      </Card>
      </Container>
    </Layout>
  );
};

export default Register;