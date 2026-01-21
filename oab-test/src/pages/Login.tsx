import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
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
  max-width: 400px;
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

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const LogoImage = styled.img`
  height: 60px;
  margin-bottom: 0.5rem;
  object-fit: contain;
`;

const Logo = styled.h1`
  color: #4CAF50;
  font-size: 1.8rem;
  margin: 0;
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
  gap: 1rem;
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/pretest');
    } catch (err: any) {
      console.error('Erro de login:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Crie uma conta!');
      } else if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique e tente novamente!');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde!');
      } else {
        setError('Erro ao fazer login: ' + (err.message || 'Tente novamente'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login">
      <Container>
        <Card>
          <LogoContainer>
            <LogoImage src="https://meucurso.com.br/_next/image?url=%2Flogos%2Fmeu_curso.webp&w=256&q=75" alt="Meu Curso" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
            <Logo>Teste Vocacional</Logo>
          </LogoContainer>
          <Subtitle>Veja qual sua área de 2ª fase</Subtitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
          </Form>
          <LinkWrapper>
            Não tem conta? <Link onClick={() => navigate('/register')}>Cadastrar</Link>
          </LinkWrapper>
        </Card>
      </Container>
    </Layout>
  );
};

export default Login;