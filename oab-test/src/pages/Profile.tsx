import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { User } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f9f9f9;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 1rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e8e8e8;

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: #4CAF50;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
`;

const InfoGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ReadOnlyValue = styled.div`
  padding: 0.85rem 1rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-size: 0.95rem;
  word-break: break-word;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: #e8e8e8;
  color: #333;

  &:hover {
    background: #d8d8d8;
  }
`;

const SuccessMessage = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  border: 2px solid #c8e6c9;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  border: 2px solid #fcc;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedWhatsapp, setEditedWhatsapp] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            setEditedName(userData.name);
            setEditedWhatsapp(userData.whatsapp);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          setMessage({ type: 'error', text: 'Erro ao carregar perfil' });
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser || !user) return;

    if (!editedName.trim()) {
      setMessage({ type: 'error', text: 'Nome não pode estar vazio' });
      return;
    }

    if (!editedWhatsapp.trim()) {
      setMessage({ type: 'error', text: 'WhatsApp não pode estar vazio' });
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: editedName.trim(),
        whatsapp: editedWhatsapp.trim(),
      });
      setUser({ ...user, name: editedName, whatsapp: editedWhatsapp });
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar perfil. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedWhatsapp(user?.whatsapp || '');
    setIsEditing(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <Layout title="👤 Perfil">
        <Container>
          <Card>
            <p style={{ color: '#666', textAlign: 'center' }}>⏳ Carregando perfil...</p>
          </Card>
        </Container>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="👤 Perfil">
        <Container>
          <Card>
            <p style={{ color: '#999', textAlign: 'center' }}>Perfil não encontrado</p>
          </Card>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="👤 Perfil">
      <Container>
        <Card>
          <Title>👤 Meu Perfil</Title>
          <Subtitle>Visualize e edite suas informações</Subtitle>

          {message && (
            message.type === 'success' ? (
              <SuccessMessage>{message.text}</SuccessMessage>
            ) : (
              <ErrorMessage>{message.text}</ErrorMessage>
            )
          )}

          {/* Seção Pessoal - Editável */}
          <Section>
            <SectionTitle>📝 Informações Pessoais (Editáveis)</SectionTitle>
            <InfoGroup>
              <InfoField>
                <Label>Nome</Label>
                <Input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Seu nome completo"
                />
              </InfoField>
              <InfoField>
                <Label>WhatsApp</Label>
                <Input
                  type="text"
                  value={editedWhatsapp}
                  onChange={(e) => setEditedWhatsapp(e.target.value)}
                  disabled={!isEditing}
                  placeholder="(11) 99999-9999"
                />
              </InfoField>
            </InfoGroup>
          </Section>

          {/* Seção Informações Básicas - Somente Leitura */}
          <Section>
            <SectionTitle>ℹ️ Informações Básicas</SectionTitle>
            <InfoGroup>
              <InfoField>
                <Label>Email</Label>
                <ReadOnlyValue>{user.email}</ReadOnlyValue>
              </InfoField>
              <InfoField>
                <Label>CPF</Label>
                <ReadOnlyValue>{user.cpf}</ReadOnlyValue>
              </InfoField>
            </InfoGroup>
          </Section>

          {/* Seção Formação - Somente Leitura */}
          <Section>
            <SectionTitle>🎓 Formação Acadêmica</SectionTitle>
            <InfoGroup>
              <InfoField>
                <Label>Status de Graduação</Label>
                <ReadOnlyValue>
                  {user.graduationStatus === 'Sim' ? '✅ Formado' : '⏳ Em curso'}
                </ReadOnlyValue>
              </InfoField>
              {user.graduationStatus === 'Não' && user.period && (
                <InfoField>
                  <Label>Período</Label>
                  <ReadOnlyValue>{user.period}</ReadOnlyValue>
                </InfoField>
              )}
            </InfoGroup>
          </Section>

          {/* Seção OAB - Somente Leitura */}
          <Section>
            <SectionTitle>📚 Preparação para OAB</SectionTitle>
            <InfoGroup>
              <InfoField>
                <Label>Edição do Exame</Label>
                <ReadOnlyValue>OAB {user.examEdition}</ReadOnlyValue>
              </InfoField>
              <InfoField>
                <Label>Horas de Estudo/Semana</Label>
                <ReadOnlyValue>{user.studyHours}</ReadOnlyValue>
              </InfoField>
            </InfoGroup>
            <InfoGroup>
              <InfoField>
                <Label>Principais Dificuldades</Label>
                <ReadOnlyValue>{user.difficulties}</ReadOnlyValue>
              </InfoField>
            </InfoGroup>
          </Section>

          {/* Botões de Ação */}
          <ButtonGroup>
            {isEditing ? (
              <>
                <SecondaryButton onClick={handleCancel} disabled={isSaving}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton onClick={handleSave} disabled={isSaving}>
                  {isSaving ? '💾 Salvando...' : '💾 Salvar Alterações'}
                </PrimaryButton>
              </>
            ) : (
              <PrimaryButton onClick={() => setIsEditing(true)}>
                ✏️ Editar Perfil
              </PrimaryButton>
            )}
          </ButtonGroup>
        </Card>
      </Container>
    </Layout>
  );
};

export default Profile;
