import React, { useState } from 'react';
import styled from 'styled-components';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import type { Area, TestResponse } from '../types';
import openai from '../openai';
import { Layout } from '../components/Layout';
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

const Header = styled.div`
  width: 100%;
  max-width: 500px;
  margin-bottom: 1.5rem;
  text-align: center;
  animation: slideDown 0.5s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepCounter = styled.p`
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.9;
  color: #333;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 500px;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #9C27B0);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const QuestionContainer = styled.div`
  background: white;
  color: #333;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.5s ease-out;
  
  &.news-container {
    max-width: 900px;
    padding: 2.5rem 3rem;
  }
  
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

const QuestionTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  flex: 1;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover:not(:has(input:disabled)) {
    border-color: #4CAF50;
    background: #f0f8f0;
  }
  
  input[type="checkbox"] {
    cursor: pointer;
    margin-right: 0.5rem;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  
  &:has(input:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:has(input:checked) {
    background: #e8f5e9;
    border-color: #4CAF50;
  }
`;

const SelectInput = styled.select`
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
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const ErrorText = styled.p`
  color: #c62828;
  margin-top: 1rem;
  font-weight: 600;
`;

const RankingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const RankingSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  label {
    font-weight: 600;
    color: #333;
    min-width: 80px;
    font-size: 1rem;
  }
  
  select {
    flex: 1;
    padding: 0.85rem 1rem;
    border: 2px solid #e8e8e8;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
    background: white;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    
    &:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
    
    &:hover:not(:disabled) {
      border-color: #4CAF50;
    }
    
    option {
      padding: 0.5rem;
    }
  }
`;

const TextAreaSection = styled.div`
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
`;

const AreaBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4CAF50;
    background: #f0f8f0;
  }
  
  h4 {
    font-size: 1.1rem;
    color: #333;
    margin: 0;
  }
`;

const TextAreaRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextAreaInput = styled.textarea`
  padding: 0.85rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 400;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
  background: white;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
  
  &:hover {
    border-color: #4CAF50;
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const NewsCard = styled.div`
  border: none;
  border-radius: 12px;
  overflow: visible;
  transition: all 0.3s ease;
  background: transparent;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const NewsImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 25%;
  background: #e0e0e0;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: white;
  }
`;

const NewsVoteContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem;
  border-top: none;
  background: transparent;
  margin-top: 0.5rem;
`;

const VoteButton = styled.button<{ active?: boolean; type: 'like' | 'dislike' }>`
  background: none;
  border: 2px solid ${props => props.active ? (props.type === 'like' ? '#4CAF50' : '#FF6B6B') : '#ddd'};
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${props => props.type === 'like' ? '#4CAF50' : '#FF6B6B'};
    background: ${props => props.type === 'like' ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255, 107, 107, 0.05)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NewsImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4CAF50;
    transform: scale(1.05);
  }
`;

const Quiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [limitReached, setLimitReached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if user already has 3 tests
  React.useEffect(() => {
    const checkTestLimit = async () => {
      if (auth.currentUser) {
        try {
          const attemptsRef = collection(db, 'tests', auth.currentUser.uid, 'attempts');
          const querySnapshot = await getDocs(attemptsRef);
          if (querySnapshot.docs.length >= 3) {
            setLimitReached(true);
          }
        } catch (error) {
          console.error('Erro ao verificar limite de testes:', error);
        }
      }
    };
    checkTestLimit();
  }, []);

  // Helper function to extract text before parentheses
  const getDisplayText = (text: string) => {
    return text.split('(')[0].trim();
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const areas: Area[] = ['Administrativo', 'Civil', 'Constitucional', 'Empresarial', 'Penal', 'Trabalho', 'Tributário'];

  const questions = [
    {
      type: 'multiSelect',
      question: 'Em qual dessas áreas você tem experiência prática (como estágio, trabalho, etc).',
      options: areas,
      key: 'experience',
      optional: true,
    },
    {
      type: 'multiSelect',
      question: 'Seu trabalho de conclusão de curso foi em alguma dessas áreas?',
      options: areas,
      key: 'tcc',
      optional: true,
    },
    {
      type: 'singleSelect',
      question: 'Qual processualista você tem maior facilidade de compreensão?',
      options: ['Processo Civil', 'Processo Penal', 'Processo do Trabalho'],
      key: 'processualist',
    },
    {
      type: 'newsVoting',
      question: 'Em relação a essas notícias... qual delas vc teria interesse em ler e se aprofundar no assunto?',
      key: 'newsVotes',
    },
    {
      type: 'ranking',
      question: 'Considerando afinidade, qual a área que vc faria?',
      options: areas,
      key: 'affinity',
    },
    {
      type: 'multiSelect',
      question: 'Quis dessas peças processuais você gostaria de fazer na OAB? (selecione até 3)',
      options: [
        'Petição inicial de indenização (civil)',
        'Mandado de segurança (tributário, constitucional, adm)',
        'Reclamação trabalhista (trabalho)',
        'Pedido de falência (empresarial)',
        'Apelação criminal (penal)',
        'Ação popular (constitucional e administrativo)',
        'Agravo de instrumento (civil e empresarial)',
        'Contestação em ação trabalhista (trabalho)',
        'Alegações finais em processo penal (penal)',
      ],
      key: 'proceduralPieces',
      max: 3,
    },
    {
      type: 'ranking',
      question: 'Considerando afinidade, qual a área que vc NUNCA faria?',
      options: areas,
      key: 'neverDo',
    },
    {
      type: 'multiSelect',
      question: 'Alguma área já fez repescagem por diversas vezes e sente desmotivação?',
      options: areas,
      key: 'demotivated',
    },
    {
      type: 'textAreas',
      question: 'Em poucas palavras, por que você escolheria ou não cada área?',
      areas: areas,
      key: 'reasons',
    },
  ];

  const totalSteps = questions.length;

  const validateStep = () => {
    const q = questions[step];
    if (!q) return true;

    if (q.type === 'multiSelect' || q.type === 'multiSelectImages') {
      const arr = responses[q.key] || [];
      // Se a pergunta é opcional (experience, tcc), aceita 0 seleções
      if (q.optional) {
        setValidationError(null);
        return true;
      }
      // Caso contrário, exige pelo menos uma opção
      if (!arr || arr.length === 0) {
        setValidationError('Selecione pelo menos uma opção.');
        return false;
      }
      setValidationError(null);
      return true;
    }

    if (q.type === 'singleSelect') {
      if (!responses[q.key]) {
        setValidationError('Selecione uma opção.');
        return false;
      }
      setValidationError(null);
      return true;
    }

    if (q.type === 'newsVoting') {
      const votes = responses[q.key] || {};
      if (Object.keys(votes).length !== newsData.length) {
        setValidationError('Vote em todas as notícias (Gosto / Não gosto).');
        return false;
      }
      setValidationError(null);
      return true;
    }

    if (q.type === 'ranking') {
      const first = responses[`${q.key}First`];
      const second = responses[`${q.key}Second`];
      if (!first || !second) {
        setValidationError('Preencha 1º e 2º lugar.');
        return false;
      }
      if (first === second) {
        setValidationError('1º e 2º lugar não podem ser iguais.');
        return false;
      }
      setValidationError(null);
      return true;
    }

    if (q.type === 'textAreas') {
      const areaVals = responses[q.key] || {};
      const missing = (q.areas || []).some((area: string) => {
        const a = areaVals[area] || {};
        return !(a.positive || a.negative);
      });
      if (missing) {
        setValidationError('Preencha pelo menos um comentário (positivo ou negativo) para cada área.');
        return false;
      }
      setValidationError(null);
      return true;
    }

    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Calculate scores and send to AI
      calculateAndSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const calculateScores = () => {
    const scores: { [key in Area]: number } = {
      Administrativo: 0,
      Civil: 0,
      Constitucional: 0,
      Empresarial: 0,
      Penal: 0,
      Trabalho: 0,
      Tributário: 0,
    };

    // Positive
    if (responses.experience) {
      responses.experience.forEach((area: Area) => scores[area] += 1);
    }
    if (responses.tcc) {
      responses.tcc.forEach((area: Area) => scores[area] += 1);
    }
    if (responses.processualist === 'Processo Civil') {
      scores.Civil += 2;
      scores.Administrativo += 1;
      scores.Constitucional += 1;
      scores.Empresarial += 1;
      scores.Tributário += 1;
    } else if (responses.processualist === 'Processo Penal') {
      scores.Penal += 1;
    } else {
      scores.Trabalho += 1;
    }
    // News interest: use new voting system
    if (responses.newsVotes) {
      Object.entries(responses.newsVotes).forEach(([newsId, liked]) => {
        const newsItem = newsData.find(n => n.id === newsId);
        if (newsItem && liked === true) {
          scores[newsItem.area as Area] += 1;
        } else if (newsItem && liked === false) {
          scores[newsItem.area as Area] -= 1;
        }
      });
    }
    if (responses.affinityFirst) scores[responses.affinityFirst as Area] += 2;
    if (responses.affinitySecond) scores[responses.affinitySecond as Area] += 1;
    if (responses.proceduralPieces) {
      responses.proceduralPieces.forEach((piece: string) => {
        if (piece.includes('civil')) scores.Civil += 1;
        if (piece.includes('tributário') || piece.includes('constitucional') || piece.includes('adm')) scores.Administrativo += 1;
        if (piece.includes('trabalho')) scores.Trabalho += 1;
        if (piece.includes('empresarial')) scores.Empresarial += 1;
        if (piece.includes('penal')) scores.Penal += 1;
        if (piece.includes('constitucional')) scores.Constitucional += 1;
      });
    }
    // Negative
    if (responses.neverDoFirst) scores[responses.neverDoFirst as Area] -= 2;
    if (responses.neverDoSecond) scores[responses.neverDoSecond as Area] -= 1;
    if (responses.demotivated) {
      responses.demotivated.forEach((area: Area) => scores[area] -= 1);
    }
    // Reasons: for now, not scored, but sent to AI

    return scores;
  };

  const calculateAndSubmit = async () => {
    if (!auth.currentUser) return;
    setIsSubmitting(true);
    try {
      const scores = calculateScores();
      const testResponse: TestResponse = {
        userId: auth.currentUser.uid,
        experience: responses.experience || [],
        tcc: responses.tcc || [],
        processualist: responses.processualist || 'Processo Civil',
        newsVotes: responses.newsVotes || {},
        affinityFirst: responses.affinityFirst || 'Civil',
        affinitySecond: responses.affinitySecond || 'Penal',
        proceduralPieces: responses.proceduralPieces || [],
      neverDoFirst: responses.neverDoFirst || 'Penal',
      neverDoSecond: responses.neverDoSecond || 'Trabalho',
      demotivated: responses.demotivated || [],
      reasons: responses.reasons || {} as any,
      scores,
      aiRanking: [],
      createdAt: new Date(),
    };

    // Prepare news summary for AI
    const newsLiked = Object.entries(responses.newsVotes || {})
      .filter(([, liked]) => liked === true)
      .map(([newsId]) => newsData.find(n => n.id === newsId)?.title)
      .join(', ');
    
    const newsDisliked = Object.entries(responses.newsVotes || {})
      .filter(([, liked]) => liked === false)
      .map(([newsId]) => newsData.find(n => n.id === newsId)?.title)
      .join(', ');

    // Send to AI with detailed scoring analysis
    const scoresSummary = Object.entries(testResponse.scores)
      .map(([area, score]) => `${area}: ${score}`)
      .join(', ');

    const prompt = `
TESTE VOCACIONAL OAB - 2ª FASE
Você é um especialista em escolha de área para a segunda fase do Exame de Ordem (OAB).

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

RESPOSTAS DO USUÁRIO:
- Experiência prática: ${testResponse.experience.join(', ') || 'nenhuma'}
- Trabalho de conclusão: ${testResponse.tcc.join(', ') || 'nenhum'}
- Processualista com maior facilidade: ${testResponse.processualist}
- Notícias que gostaria de ler: ${newsLiked || 'nenhuma selecionada'}
- Notícias que NÃO gostaria de ler: ${newsDisliked || 'nenhuma selecionada'}
- Afinidade (1º): ${testResponse.affinityFirst}
- Afinidade (2º): ${testResponse.affinitySecond}
- Peças processuais interessantes: ${testResponse.proceduralPieces.join(', ') || 'nenhuma'}
- Área que NUNCA faria (1º): ${testResponse.neverDoFirst}
- Área que NUNCA faria (2º): ${testResponse.neverDoSecond}
- Áreas com desmotivação/repescagem: ${testResponse.demotivated.join(', ') || 'nenhuma'}

RAZÕES DETALHADAS (análise textual):
${Object.entries(testResponse.reasons)
  .map(([area, entry]: [string, any]) => {
    const positivo = entry.positive || '(não respondido)';
    const negativo = entry.negative || '(não respondido)';
    return `- ${area}: [Positivo: "${positivo}"] [Negativo: "${negativo}"]`;
  })
  .join('\n')}

SCORES AUTOMÁTICOS POR ÁREA (0-15 escala):
${scoresSummary}

INSTRUÇÃO FINAL:
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

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.

Áreas a ranquear: Administrativo, Civil, Constitucional, Empresarial, Penal, Trabalho, Tributário
    `;
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      const responseText = completion.choices[0].message.content || '';
      
      // Parse JSON response
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          testResponse.aiRanking = parsed.ranking || areas;
          testResponse.aiExplanations = parsed.explanations || {};
        } else {
          // Fallback to array parsing if JSON not found
          const ranking = responseText.split(',').map(s => s.trim() as Area) || areas;
          testResponse.aiRanking = ranking;
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        testResponse.aiRanking = areas; // fallback
      }
    } catch (error) {
      console.error(error);
      testResponse.aiRanking = areas; // fallback
    }

    // Salvar como novo documento em subcoleção com timestamp como ID
    const testId = `test_${Date.now()}`;
    testResponse.timestamp = Date.now();
    await setDoc(doc(db, 'tests', auth.currentUser.uid, 'attempts', testId), testResponse);
    navigate('/result');
    } catch (error) {
      console.error('Erro ao enviar teste:', error);
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const q = questions[step];
    switch (q.type) {
      case 'multiSelect':
        return (
          <div>
            {q.optional && (
              <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '1rem', fontStyle: 'italic' }}>
                (Opcional - você pode deixar em branco)
              </p>
            )}
            <CheckboxGroup>
              {q.options!.map((option) => {
                const current = responses[q.key] || [];
                const isChecked = current.includes(option);
                const isDisabled = !isChecked && current.length >= (q.max || 3);
                return (
                  <CheckboxLabel key={option}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateResponse(q.key, [...current, option]);
                        } else {
                          updateResponse(q.key, current.filter((o: string) => o !== option));
                        }
                      }}
                    />
                    {getDisplayText(option)}
                  </CheckboxLabel>
                );
              })}
            </CheckboxGroup>
          </div>
        );
      case 'singleSelect':
        return (
          <div>
            <SelectInput
              value={responses[q.key] || ''}
              onChange={(e) => updateResponse(q.key, e.target.value)}
            >
              <option value="">Selecione uma opção</option>
              {q.options!.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </SelectInput>
          </div>
        );
      case 'newsVoting':
        return (
          <div>
            <NewsGrid>
              {newsData.map((news) => {
                const votes = responses[q.key] || {};
                const liked = votes[news.id];
                return (
                  <NewsCard key={news.id}>
                    <NewsImageContainer>
                      <img 
                        src={`/noticias/${news.image}`} 
                        alt={news.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.jpg';
                        }}
                      />
                    </NewsImageContainer>
                    <NewsVoteContainer>
                      <VoteButton
                        type="like"
                        active={liked === true}
                        onClick={() => {
                          const votes = responses[q.key] || {};
                          if (liked === true) {
                            const newVotes = { ...votes };
                            delete newVotes[news.id];
                            updateResponse(q.key, newVotes);
                          } else {
                            updateResponse(q.key, { ...votes, [news.id]: true });
                          }
                        }}
                      >
                        👍 Gosto
                      </VoteButton>
                      <VoteButton
                        type="dislike"
                        active={liked === false}
                        onClick={() => {
                          const votes = responses[q.key] || {};
                          if (liked === false) {
                            const newVotes = { ...votes };
                            delete newVotes[news.id];
                            updateResponse(q.key, newVotes);
                          } else {
                            updateResponse(q.key, { ...votes, [news.id]: false });
                          }
                        }}
                      >
                        👎 Não Gosto
                      </VoteButton>
                    </NewsVoteContainer>
                  </NewsCard>
                );
              })}
            </NewsGrid>
          </div>
        );
      case 'multiSelectImages':
        return (
          <div>
            <CheckboxGroup>
              {q.options!.map((img) => (
                <div key={img}>
                  <NewsImage src={`/noticias/${img}`} alt={img} />
                  <input
                    type="checkbox"
                    checked={(responses[q.key] || []).includes(img)}
                    onChange={(e) => {
                      const current = responses[q.key] || [];
                      if (e.target.checked) {
                        updateResponse(q.key, [...current, img]);
                      } else {
                        updateResponse(q.key, current.filter((i: string) => i !== img));
                      }
                    }}
                  />
                </div>
              ))}
            </CheckboxGroup>
          </div>
        );
      case 'ranking':
        return (
          <div>
            <RankingContainer>
              <RankingSelect>
                <label>1º lugar:</label>
                <select
                  value={responses[`${q.key}First`] || ''}
                  onChange={(e) => updateResponse(`${q.key}First`, e.target.value)}
                >
                  <option value="">Selecione</option>
                  {q.options!.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </RankingSelect>
              <RankingSelect>
                <label>2º lugar:</label>
                <select
                  value={responses[`${q.key}Second`] || ''}
                  onChange={(e) => updateResponse(`${q.key}Second`, e.target.value)}
                >
                  <option value="">Selecione</option>
                  {q.options!.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </RankingSelect>
            </RankingContainer>
          </div>
        );
      case 'textAreas':
        return (
          <TextAreaSection>
            {q.areas!.map((area) => (
              <AreaBlock key={area}>
                <h4>{area}</h4>
                <TextAreaRow>
                  <TextAreaInput
                    placeholder="Pontos positivos"
                    value={responses[q.key]?.[area]?.positive || ''}
                    onChange={(e) => updateResponse(q.key, { ...responses[q.key], [area]: { ...responses[q.key]?.[area], positive: e.target.value.slice(0, 100) } })}
                    maxLength={100}
                  />
                  <TextAreaInput
                    placeholder="Pontos negativos"
                    value={responses[q.key]?.[area]?.negative || ''}
                    onChange={(e) => updateResponse(q.key, { ...responses[q.key], [area]: { ...responses[q.key]?.[area], negative: e.target.value.slice(0, 100) } })}
                    maxLength={100}
                  />
                </TextAreaRow>
              </AreaBlock>
            ))}
          </TextAreaSection>
        );
      default:
        return <div>Question type not supported</div>;
    }
  };

  return (
    <Layout title="📝 Quiz - Teste Vocacional">
      <Container>
        {limitReached ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ color: '#c62828', fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ Limite de Testes Atingido</h2>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
              Você já realizou o máximo de 3 testes permitidos. Confira seus resultados anteriores e bom estudo!
            </p>
            <button 
              onClick={() => navigate('/result')}
              style={{
                padding: '0.9rem 2rem',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
              }}
            >
              Ver Resultados
            </button>
          </div>
        ) : (
          <>
        <Header>
          <StepCounter>Pergunta {step + 1} de {totalSteps}</StepCounter>
        </Header>
        <ProgressBar>
          <ProgressFill percentage={(step + 1) / totalSteps * 100} />
        </ProgressBar>
        <QuestionContainer className={questions[step]?.type === 'newsVoting' ? 'news-container' : ''}>
          <div>
            <QuestionTitle>{questions[step]?.question || 'Carregando...'}</QuestionTitle>
            {renderQuestion()}
            {validationError && <ErrorText>{validationError}</ErrorText>}
          </div>
          <ButtonGroup>
            {step > 0 && <Button onClick={handlePrev} disabled={isSubmitting}>← Anterior</Button>}
            <Button 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Enviando...' : (step === totalSteps - 1 ? 'Finalizar 🎉' : 'Próximo →')}
            </Button>
          </ButtonGroup>
        </QuestionContainer>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Quiz;