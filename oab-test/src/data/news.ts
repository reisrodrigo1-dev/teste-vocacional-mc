export interface NewsItem {
  id: string;
  area: string;
  image: string;
  interest?: boolean; // true = 👍, false = 👎, undefined = não respondido
}

export const newsData: NewsItem[] = [
  // Civil
  {
    id: 'civil_1',
    area: 'Civil',
    image: '1-civil.jpeg'
  },
  {
    id: 'civil_2',
    area: 'Civil',
    image: '12-civil.jpeg'
  },

  // Trabalho
  {
    id: 'trabalho_1',
    area: 'Trabalho',
    image: '10-trabalho.jpeg'
  },
  {
    id: 'trabalho_3',
    area: 'Trabalho',
    image: '8-trabalho.jpeg'
  },

  // Administrativo
  {
    id: 'administrativo_1',
    area: 'Administrativo',
    image: '11-administrativo.jpeg'
  },
  {
    id: 'administrativo_2',
    area: 'Administrativo',
    image: '9-administrativo.jpeg'
  },

  // Constitucional
  {
    id: 'constitucional_1',
    area: 'Constitucional',
    image: '13-constitucional.jpeg'
  },
  {
    id: 'constitucional_2',
    area: 'Constitucional',
    image: '5-consitucional.jpeg'
  },

  // Penal
  {
    id: 'penal_1',
    area: 'Penal',
    image: '3-penal.jpeg'
  },
  {
    id: 'penal_2',
    area: 'Penal',
    image: '4-penal.jpeg'
  },

  // Tributário
  {
    id: 'tributario_1',
    area: 'Tributário',
    image: '2-tributario.jpeg'
  },
  {
    id: 'tributario_2',
    area: 'Tributário',
    image: '7-tributário.jpeg'
  },

  // Empresarial
  {
    id: 'empresarial_1',
    area: 'Empresarial',
    image: '6-empresarial.jpeg'
  },
  {
    id: 'empresarial_2',
    area: 'Empresarial',
    image: '14-empresarial.jpeg'
  },
];
