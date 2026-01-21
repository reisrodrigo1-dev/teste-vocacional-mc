export type Area = 'Administrativo' | 'Civil' | 'Constitucional' | 'Empresarial' | 'Penal' | 'Trabalho' | 'Tributário' | 'Consumidor' | 'Humanos' | 'Ambiental' | 'Internacional' | 'Criança e Adolescente' | 'Outra área';

export interface User {
  id: string;
  name: string;
  cpf: string;
  whatsapp: string;
  email: string;
  graduationStatus: 'Sim' | 'Não';
  period?: string; // if not graduated
  examEdition: '45' | '46' | '47' | '48';
  studyHours: string;
  difficulties: string;
}

export interface TestResponse {
  userId: string;
  // Pre-test already in user
  // Positive aspects
  experience: Area[]; // multiple
  tcc: Area[]; // multiple
  processualist: 'Processo Civil' | 'Processo Penal' | 'Processo do Trabalho';
  newsVotes: { [newsId: string]: boolean }; // true = like, false = dislike
  affinityFirst: Area;
  affinitySecond: Area;
  proceduralPieces: string[]; // up to 3
  // Negative
  neverDoFirst: Area;
  neverDoSecond: Area;
  demotivated: Area[]; // multiple
  reasons: { [key in Area]: { positive: string; negative: string } };
  // Scores will be calculated
  scores: { [key in Area]: number };
  aiRanking: Area[]; // from AI
  aiExplanations?: { [key: string]: string }; // explanations from AI
  createdAt: Date;
  timestamp?: number; // for sorting multiple tests
}