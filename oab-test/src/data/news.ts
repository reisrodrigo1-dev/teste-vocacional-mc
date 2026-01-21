export interface NewsItem {
  id: string;
  area: string;
  title: string;
  text: string;
  image: string;
  interest?: boolean; // true = 👍, false = 👎, undefined = não respondido
}

export const newsData: NewsItem[] = [
  // Civil (1, 2, 6, 7, 10, 14, 19, 21)
  {
    id: 'civil_1',
    area: 'Civil',
    title: 'Justiça manda homem devolver dinheiro de Pix recebido por engano',
    text: '2º JEC de Águas Claras/DF afirmou que retenção do dinheiro não tinha justificativa legal.',
    image: '1-civil.png'
  },
  {
    id: 'civil_2',
    area: 'Civil',
    title: 'Análise: Influencers podem usar segredo de Justiça para blindar imagem?',
    text: 'Caso envolvendo influenciadora Virgínia expôs dilema entre vida privada e interesse público.',
    image: '2-civil.png'
  },
  {
    id: 'civil_6',
    area: 'Civil',
    title: 'Por vazar dados, camping indenizará homem ameaçado por suposto atropelamento',
    text: 'Juiz fixou indenização de R$ 15 mil após entender que falha na proteção de dados expôs cliente a ameaças e acusações falsas.',
    image: '6-civil.png'
  },
  {
    id: 'civil_7',
    area: 'Civil',
    title: 'Análise: Influencers podem usar segredo de Justiça para blindar imagem?',
    text: 'Caso envolvendo influenciadora Virgínia expôs dilema entre vida privada e interesse público.',
    image: '7-civil.png'
  },
  {
    id: 'civil_10',
    area: 'Civil',
    title: 'TJ/MT valida dano moral a cliente que se arrependeu de empréstimo online',
    text: 'Colegiado decidiu manter a condenação de uma instituição financeira ao pagamento de R$ 6,6 mil em indenização.',
    image: '10-civil.png'
  },
  {
    id: 'civil_14',
    area: 'Civil',
    title: 'Facebook e empresa de hospedagem indenizarão por site e perfil falsos',
    text: 'Juiz reconheceu a omissão das plataformas em coibir a fraude, mesmo após notificações, e as condenou ao pagamento de indenização e à remoção dos conteúdos fraudulentos.',
    image: '14-civil.png'
  },
  {
    id: 'civil_19',
    area: 'Civil',
    title: 'Suzane Richthofen pode herdar milhões de tio falecido? Advogadas explicam',
    text: 'Falecimento de médico sem filhos ou testamento levanta dúvidas sobre destino de herança de, aproximadamente, R$ 5 milhões.',
    image: '19-civil.png'
  },
  {
    id: 'civil_21',
    area: 'Civil',
    title: 'TJ/SP: Bens no exterior ficam fora da partilha em inventário no Brasil',
    text: 'Tribunal seguiu entendimento do STJ e reafirma que a lei brasileira não rege sucessão de patrimônio localizado fora do país.',
    image: '21-civil.png'
  },

  // Trabalho (3, 4, 11, 13, 20, 41, 46)
  {
    id: 'trabalho_3',
    area: 'Trabalho',
    title: 'TRT-15: USP responderá por verbas trabalhistas de vigilante terceirizado',
    text: 'Colegiado também majorou indenização por danos morais de R$ 1.845,56 para R$ 5 mil.',
    image: '3-trabalho.png'
  },
  {
    id: 'trabalho_4',
    area: 'Trabalho',
    title: 'TRT-3 reconhece justa causa de motorista embriagado em serviço',
    text: 'Turma reformou sentença e afastou verbas rescisórias de motorista dispensado após denúncias de consumo de álcool no trabalho.',
    image: '4-trabalho.png'
  },
  {
    id: 'trabalho_11',
    area: 'Trabalho',
    title: 'TRT-15: USP responderá por verbas trabalhistas de vigilante terceirizado',
    text: 'Colegiado também majorou indenização por danos morais de R$ 1.845,56 para R$ 5 mil.',
    image: '11-trabalho.png'
  },
  {
    id: 'trabalho_13',
    area: 'Trabalho',
    title: 'Enfermeira será indenizada por ter contratação cancelada ao informar gravidez',
    text: 'Antes de candidata informar gravidez, contratação estava pendente apenas da conclusão de exame admissional e da assinatura da carteira de trabalho.',
    image: '13-trabalho.png'
  },
  {
    id: 'trabalho_20',
    area: 'Trabalho',
    title: 'TRT-2 reconhece rescisão indireta após transferência de gestante',
    text: 'Tribunal considerou discriminatória a mudança unilateral de posto e de jornada durante a gravidez, à luz do julgamento com perspectiva de gênero.',
    image: '20-trabalho.png'
  },
  {
    id: 'trabalho_41',
    area: 'Trabalho',
    title: 'TST: Técnico que ficou paraplégico em queda de helicóptero terá pensão vitalícia',
    text: 'Colegiado determinou adaptações na moradia e elevou pensão de 85% para 100% da remuneração.',
    image: '41-trabalho.png'
  },
  {
    id: 'trabalho_46',
    area: 'Trabalho',
    title: 'Mantida justa causa de zelador por ameaças anônimas a moradores',
    text: 'Zelador enviou mensagens intimidatórias a moradores por meio do aplicativo WhatsApp.',
    image: '46-trabalho.png'
  },

  // Administrativo (5, 8, 12, 23, 33, 44)
  {
    id: 'administrativo_5',
    area: 'Administrativo',
    title: 'Candidato convocado por edital e excluído de concurso será reintegrado',
    text: 'Juiz apontou falha da Administração ao não notificar candidato de maneira pessoal e eficaz.',
    image: '5-administrativo-constitucional.png'
  },
  {
    id: 'administrativo_8',
    area: 'Administrativo',
    title: 'Juíza manda reintegrar professor com bipolaridade que pediu exoneração',
    text: 'Magistrada concluiu que o pedido foi feito pelo profissional sem discernimento pleno.',
    image: '8-administrativo.png'
  },
  {
    id: 'administrativo_12',
    area: 'Administrativo',
    title: 'AGU cria grupo para apurar apagões em SP e atuação da Enel',
    text: 'Portaria publicada no DOU prevê relatório em 30 dias, com análise dos casos e possíveis medidas jurídicas e institucionais.',
    image: '12-administrativo.png'
  },
  {
    id: 'administrativo_23',
    area: 'Administrativo',
    title: 'STF julga incidência do teto na pensão por morte de servidores públicos',
    text: 'Corte discute se limite constitucional deve incidir antes ou depois do cálculo do benefício.',
    image: '23-administrativo.png'
  },
  {
    id: 'administrativo_33',
    area: 'Administrativo',
    title: 'Convocação para curso garante nomeação a candidato aprovado fora das vagas',
    text: 'TJ/PB entendeu que convocação para etapa final do concurso dá direito à nomeação e afasta inclusão em cadastro de reserva.',
    image: '33-administrativo.png'
  },
  {
    id: 'administrativo_44',
    area: 'Administrativo',
    title: 'Médica gestante tem cargo mantido após suspensão de nomeação em concurso',
    text: 'Decisão considerou que eventual afastamento dependerá da prévia instauração de processo administrativo que assegure o contraditório e a ampla defesa.',
    image: '44-administrativo.png'
  },

  // Tributário (9, 16, 22, 27, 42)
  {
    id: 'tributario_9',
    area: 'Tributário',
    title: 'Empresa que subavaliou imóveis em R$ 57 mi pagará ITBI sobre excedente',
    text: 'Imóveis de R$ 54,8 milhões e R$ 3,5 milhões foram declarados por R$ 690 mil e R$ 232 mil para integralização ao capital social.',
    image: '9-tributario.png'
  },
  {
    id: 'tributario_16',
    area: 'Tributário',
    title: 'Entenda como a reforma tributária impacta escritórios de advocacia',
    text: 'Implementação do IBS e da CBS exige adaptação operacional das bancas.',
    image: '16-tributario.png'
  },
  {
    id: 'tributario_22',
    area: 'Tributário',
    title: 'Declaração do IRPF vai além da formalidade, alerta tributarista',
    text: 'Bruno Medeiros Durão, do Bruno Durão Advocacia, orienta contribuintes sobre quem deve declarar o IR em 2026.',
    image: '22-tributário.png'
  },
  {
    id: 'tributario_27',
    area: 'Tributário',
    title: 'Para juíza, veículos de 2006 já estão isentos de IPVA em 2026',
    text: 'Segundo o Fisco, o fato gerador do IPVA ocorre em 1º de janeiro, de forma que automóveis fabricados em 2006 somente estariam abrangidos a partir de 2027.',
    image: '27-tributario.png'
  },
  {
    id: 'tributario_42',
    area: 'Tributário',
    title: 'Câmara aprova projeto da reforma tributária; texto vai à sanção',
    text: 'Proposta aprovada tratou de gestão do novo imposto, benefícios fiscais e alíquotas específicas para setores como saúde, esportes e finanças.',
    image: '42-tributario.png'
  },

  // Constitucional (17, 26, 28, 30, 34, 35, 37, 39)
  {
    id: 'constitucional_17',
    area: 'Constitucional',
    title: 'Dino proíbe emendas a ONGs ligadas a familiares de parlamentares',
    text: 'Repasses a ONGs alcançaram R$ 1,7 bilhão em 2025, 10 vezes mais do que em 2019.',
    image: '17-constitucional.png'
  },
  {
    id: 'constitucional_26',
    area: 'Constitucional',
    title: 'Governo reconhece anistia política a filhos de Vladimir Herzog',
    text: 'Portarias do ministério de Direitos Humanos também previram indenização de R$ 100 mil a cada um.',
    image: '26-constitucional.png'
  },
  {
    id: 'constitucional_28',
    area: 'Constitucional',
    title: 'União fornecerá medicamento de alto custo para tratamento de câncer',
    text: 'Medicamento Mitotano será fornecido a pacientes com carcinoma adrenocortical, câncer raro que se origina na região do córtex.',
    image: '28-constitucional.png'
  },
  {
    id: 'constitucional_30',
    area: 'Constitucional',
    title: 'STF irá definir competência para julgar crimes contra espécies ameaçadas',
    text: 'Tema tem repercussão geral e busca uniformizar divergência sobre competência da Justiça Federal em crimes ambientais sem caráter transnacional.',
    image: '30-constitucional.png'
  },
  {
    id: 'constitucional_34',
    area: 'Constitucional',
    title: 'STF suspende análise de lei que proíbe máscaras em protestos',
    text: 'Placar conta com 5 votos a 1 pela constitucionalidade da norma.',
    image: '34-constitucional.png'
  },
  {
    id: 'constitucional_35',
    area: 'Constitucional',
    title: 'Por unanimidade, STF derruba lei que fixa idade mínima para magistratura',
    text: 'Colegiado seguiu voto do relator, ministro Nunes Marques, segundo o qual o requisito exige lei complementar de iniciativa do STF.',
    image: '35-constitucional.png'
  },
  {
    id: 'constitucional_37',
    area: 'Constitucional',
    title: 'Deputados acionam STF contra PL da dosimetria',
    text: 'Mandado de segurança aponta vícios formais na tramitação de projeto de lei que pode beneficiar réus da trama golpista.',
    image: '37-constitucional.png'
  },
  {
    id: 'constitucional_39',
    area: 'Constitucional',
    title: 'Justiça proíbe "exorcismo" contra vizinha espírita por morador de condomínio',
    text: 'Sentença aponta que a liberdade religiosa não é absoluta e deve respeitar o direito de vizinhança em áreas comuns.',
    image: '39-constitucional-civil.png'
  },

  // Empresarial (15, 18, 45, 47)
  {
    id: 'empresarial_15',
    area: 'Empresarial',
    title: 'Justiça anula indeferimento e libera marca "Germano Bar & Botequim"',
    text: 'Juíza concluiu que conjunto visual das marcas é distinto e determinou que o INPI conceda o registro na classe de serviços de alimentação.',
    image: '15-empresarial.png'
  },
  {
    id: 'empresarial_18',
    area: 'Empresarial',
    title: 'Após falência da Posco, credores alertam para dívida milionária no CE',
    text: 'Passivo declarado é de R$ 644 milhões, mas credores dizem que valor pode se aproximar de R$ 1 bilhão.',
    image: '18-empresarial.png'
  },
  {
    id: 'empresarial_45',
    area: 'Empresarial',
    title: 'STJ: Ministro manda TJ/PR reavaliar uso indevido da marca "Positivo"',
    text: 'Relator, ministro Humberto Martins, reafirmou que o dano moral por violação de marca é presumido e determinou o retorno dos autos ao tribunal de origem para reanálise da indenização.',
    image: '45-empresarial.png'
  },
  {
    id: 'empresarial_47',
    area: 'Empresarial',
    title: 'Cade aprova fusão Petz-Cobasi e impõe desinvestimento de ativos',
    text: 'Conselho também exigiu obrigações comportamentais como condição para a união das redes.',
    image: '47-empresarial.png'
  },

  // Penal (25, 29, 31, 36, 38, 43)
  {
    id: 'penal_25',
    area: 'Penal',
    title: 'Homem é solto após ser preso no lugar do irmão condenado por roubo',
    text: 'A decisão foi tomada após audiência que evidenciou o erro na identificação. Juiz determinou correção dos registros e soltura imediata.',
    image: '25-penal.png'
  },
  {
    id: 'penal_29',
    area: 'Penal',
    title: 'Bolsonaro pede a Moraes para integrar programa de remição de pena por leitura',
    text: 'Remição por leitura pode reduzir até quatro dias de pena por livro.',
    image: '29-penal.png'
  },
  {
    id: 'penal_31',
    area: 'Penal',
    title: 'MP/RJ pede prisão preventiva de ex-CEO da Hurb após violar cautelares',
    text: 'Em liberdade provisória por furto qualificado, João Ricardo Rangel Mendes foi detido com documento falso e tornozeleira descarregada.',
    image: '31-penal.png'
  },
  {
    id: 'penal_36',
    area: 'Penal',
    title: 'Ex-sócio da Boate Kiss condenado a 12 anos vai para regime aberto',
    text: 'Laudos social e psicológico e conduta carcerária embasaram a medida.',
    image: '36-penal.png'
  },
  {
    id: 'penal_38',
    area: 'Penal',
    title: 'Juíza extingue punibilidade de passageiro que quebrou televisor em voo',
    text: 'Punibilidade foi extinta mediante celebração de acordo de não persecução penal.',
    image: '38-penal.png'
  },
  {
    id: 'penal_43',
    area: 'Penal',
    title: 'STJ afasta dolo e absolve homem acusado de postagem racista',
    text: '6ª turma entendeu que publicação em rede social ocorreu com animus jocandi e não caracterizou incitação à discriminação racial prevista na Lei 7.716/89.',
    image: '43-penal.png'
  },

  // Mistas
  {
    id: 'mista_24',
    area: 'Constitucional',
    title: 'Lula veta trechos da regulamentação da reforma tributária; veja pontos',
    text: 'Benefícios sobre venda de jogadores e regras de fidelidade estão entre os pontos vetados.',
    image: '24-constitucional-tributario.png'
  },
  {
    id: 'mista_32',
    area: 'Constitucional',
    title: 'STF julga dupla responsabilização por crime eleitoral e improbidade',
    text: 'Até o momento, há quatro votos pela possibilidade da dupla punição.',
    image: '32-constitucional-administrativo.png'
  },
  {
    id: 'mista_40',
    area: 'Tributário',
    title: 'STF julga aumento do ICMS sobre energia elétrica e comunicação',
    text: 'Corte analisa lei do Estado do Rio de Janeiro que previu aumento de 2% no tributo.',
    image: '40-tributário-constitucional.png'
  },
];
