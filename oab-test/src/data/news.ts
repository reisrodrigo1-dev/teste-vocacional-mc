export interface NewsItem {
  id: string;
  area: string;
  title: string;
  image: string;
  interest?: boolean; // true = 👍, false = 👎, undefined = não respondido
}

export const newsData: NewsItem[] = [
  // Administrativo (2 notícias)
  {
    id: 'admin_1',
    area: 'Administrativo',
    title: 'Direito Administrativo',
    image: '12-administrativo.png'
  },
  {
    id: 'admin_2',
    area: 'Administrativo',
    title: 'Lei Administrativa',
    image: '23-administrativo.png'
  },

  // Civil (2 notícias)
  {
    id: 'civil_1',
    area: 'Civil',
    title: 'Direito Civil',
    image: '1-civil.png'
  },
  {
    id: 'civil_2',
    area: 'Civil',
    title: 'Contrato e Obrigações',
    image: '2-civil.png'
  },

  // Constitucional (2 notícias)
  {
    id: 'const_1',
    area: 'Constitucional',
    title: 'Direitos Constitucionais',
    image: '17-constitucional.png'
  },
  {
    id: 'const_2',
    area: 'Constitucional',
    title: 'Controle Constitucional',
    image: '26-constitucional.png'
  },

  // Empresarial (2 notícias)
  {
    id: 'emp_1',
    area: 'Empresarial',
    title: 'Direito Empresarial',
    image: '15-empresarial.png'
  },
  {
    id: 'emp_2',
    area: 'Empresarial',
    title: 'Sociedade e Negócios',
    image: '18-empresarial.png'
  },

  // Penal (2 notícias)
  {
    id: 'penal_1',
    area: 'Penal',
    title: 'Direito Penal',
    image: '25-penal.png'
  },
  {
    id: 'penal_2',
    area: 'Penal',
    title: 'Crime e Punição',
    image: '29-penal.png'
  },

  // Trabalho (2 notícias)
  {
    id: 'trabalho_1',
    area: 'Trabalho',
    title: 'Direito Trabalhista',
    image: '11-trabalho.png'
  },
  {
    id: 'trabalho_2',
    area: 'Trabalho',
    title: 'Relação de Emprego',
    image: '13-trabalho.png'
  },

  // Tributário (2 notícias)
  {
    id: 'tributario_1',
    area: 'Tributário',
    title: 'Direito Tributário',
    image: '16-tributario.png'
  },
  {
    id: 'tributario_2',
    area: 'Tributário',
    title: 'Impostos e Contribuições',
    image: '27-tributario.png'
  },
];

/**
 * Retorna 2 notícias aleatórias de cada área
 * Mantém sempre 2 de cada uma das 7 áreas
 */
export function getRandomNews(): NewsItem[] {
  const areas = ['Administrativo', 'Civil', 'Constitucional', 'Empresarial', 'Penal', 'Trabalho', 'Tributário'];
  const result: NewsItem[] = [];

  // Para cada área, seleciona aleatoriamente 2 notícias
  areas.forEach(area => {
    const areaNews = newsData.filter(news => news.area === area);
    
    if (areaNews.length >= 2) {
      // Shuffle e pega os primeiros 2
      const shuffled = areaNews.sort(() => Math.random() - 0.5);
      result.push(...shuffled.slice(0, 2));
    }
  });

  // Shuffle final para ordem aleatória
  return result.sort(() => Math.random() - 0.5);
}
