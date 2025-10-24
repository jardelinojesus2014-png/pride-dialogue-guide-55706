export interface ScriptItemData {
  id: string;
  label: string;
  script: string;
  note?: string;
  tip?: string;
  collect?: string[];
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  colorClass: string;
  items: ScriptItemData[];
}

export const sectionsData: Section[] = [
  {
    id: 'apresentacao',
    title: '1. APRESENTAÇÃO',
    subtitle: 'Apresentação pessoal, empresa e motivo da ligação',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'saudacao',
        label: 'Saudação',
        script: '"[Nome]? (aguardar) Bom dia/tarde/noite, tudo bem? (aguardar) Tá podendo falar rapidinho?"',
      },
      {
        id: 'identificacao',
        label: 'Identificação (Apresentação Pessoal)',
        script:
          '"Sthefany aqui... Nós conversamos um tempo atrás, não sei se vai se lembrar... Sou da Pride Consultoria..."',
        note: 'OU: "Sthefany aqui... Você não me conhece ainda... Sou da Pride Consultoria..."',
      },
      {
        id: 'empresa',
        label: 'Apresentação da Pride',
        script:
          '"Que é uma empresa especializada na reavaliação de assistência médica... a gestão de plano de saúde"',
      },
      {
        id: 'motivo',
        label: 'Motivo da Ligação',
        script:
          '"Chegamos a falar um tempo atrás sobre o seu plano, na época você estava com o plano da [operadora] se não me engano... e fiquei de retomar mais pra frente pra entender como está seu cenário, se continua sendo a melhor opção..."',
        note: 'OU: "Estou ligando por conta do seu plano de saúde da [operadora]"',
      },
    ],
  },
  {
    id: 'conexao',
    title: '2. CONEXÃO',
    subtitle: 'Entender se a consultoria faz sentido + pergunta "link" para qualificação',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'fit',
        label: 'Validar o Fit + Pergunta Link',
        script: '"Você já chegou a realizar algum comparativo do seu plano recentemente?" (aguardar)',
        note: 'OU: "O seu plano de saúde ainda é o [Operadora X]?" (aguardar)',
        tip: 'Escutar ativamente, demonstrar empatia/interesse e fazer silêncio após a pergunta',
      },
      {
        id: 'transicao',
        label: 'Transição',
        script: '"Ah, maravilha... liguei na hora certa então..."',
        note: 'OU: "Entendi... então faz sentido retomarmos..."',
        tip: '✅ Seguir com as perguntas (em forma de diálogo) para levantarmos as informações necessárias. A ideia é dar pessoalidade.',
      },
    ],
  },
  {
    id: 'qualificacao',
    title: '3. QUALIFICAÇÃO (SPIN: Situação + Problema)',
    subtitle: 'Coletar informações estratégicas focando em Situação e Problema - INVESTIGAÇÃO',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'plano_composicao',
        label: '📊 SITUAÇÃO: Plano Atual + Composição',
        script:
          '"Você disse que seu plano ainda é o [operadora], ele é pra quantas vidas? (aguardar) E quem são e as idades? (aguardar) Você com x anos... e [fulano]...? (aguardar) Qual a categoria dele? (aguardar) Ele é enfermaria ou apartamento? (aguardar) Tem coparticipação? (aguardar) Quanto tempo estão neste plano?"',
        collect: [
          'Plano Atual (Operadora)',
          'Quantidade de Vidas',
          'Vínculo/Idade (todos os beneficiários)',
          'Categoria',
          'Acomodação',
          'Coparticipação',
          'Tempo de Plano atual',
        ],
      },
      {
        id: 'investimento',
        label: '📊 SITUAÇÃO: Investimento',
        script: '"E quanto vocês tão investindo hoje no plano para as x vidas?"',
        note: 'OU: "Qual o valor que pretende investir no plano pras x vidas?" (quando não possuir plano de saúde ativo)',
        collect: ['Valor Plano atual (ou que deseja investir)'],
      },
      {
        id: 'cnpj',
        label: '📊 SITUAÇÃO: CNPJ',
        script:
          '"E me explica uma coisa, esse plano de vocês é pelo CNPJ? (aguardar) MEI ou LTDA? (aguardar) Esse CNPJ é São Paulo capital mesmo ou interior? (aguardar) Todos os sócios vão entrar no plano?"',
        collect: [
          'Possui CNPJ ativo?',
          'Tipo de CNPJ',
          'Localidade do CNPJ',
          'Todos os sócios entrarão no plano?',
          'CNPJ (Números) - se o cliente souber',
        ],
      },
      {
        id: 'formacao',
        label: '📊 SITUAÇÃO: Formação',
        script: '"Qual sua formação acadêmica?"',
        note: 'Se o cliente NÃO possuir CNPJ ativo, perguntar:',
        collect: ['Formação Acadêmica'],
      },
      {
        id: 'caracteristicas',
        label: '📊 SITUAÇÃO: Características',
        script:
          '"E me lembra quando é o mês de reajuste do plano, quando ele faz aniversário? (aguardar) E o boleto dele vence em qual dia do mês?"',
        collect: ['Mês de reajuste', 'Dia do Vencimento'],
      },
      {
        id: 'localizacao_rede',
        label: '📊 SITUAÇÃO: Localização e Rede',
        script:
          '"Você mora em qual região, qual bairro? (aguardar) E me diz uma coisa importante: quais hospitais e laboratórios vocês costumam usar? Até pra eu conseguir passar aqui pro especialista incluir essas opções no cenário"',
        collect: ['Bairro/Zona', 'Hospitais e Laboratórios (rede SP)'],
      },
      {
        id: 'saude',
        label: '⚠️ PROBLEMA: Utilização e Saúde',
        script:
          '"Tem alguém que tá fazendo algum tratamento, tomando alguma medicação de alto custo... com alguma doença? (aguardar) Alguém grávida? (aguardar) Alguém está fazendo terapia?"',
        collect: ['Tratamento/doença pré-existente', 'Gestante no grupo?', 'Fazendo terapia?'],
        tip: 'Seja objetivo e normalize as perguntas (não é um tema desconfortável, é necessário para que possamos direcionar o melhor cenário para o cliente). Entenda a situação das pessoas que entrarão no plano. Caso alguma das respostas seja "sim", entender a quem se refere e os detalhes da situação.',
      },
      {
        id: 'dores',
        label: '⚠️ PROBLEMA: Dores com Plano Atual',
        script: '"E me conta, vocês tiveram algum problema com esse plano atual?"',
        collect: ['Dificuldade com o plano atual'],
      },
      {
        id: 'observacoes',
        label: '📝 Observações',
        script:
          '"Tem mais alguma coisa específica que é importante pra você? Alguma preferência ou necessidade que eu preciso considerar aqui?"',
        collect: ['Observações'],
      },
    ],
  },
  {
    id: 'agendamento',
    title: '4. AGENDAMENTO DA REUNIÃO',
    subtitle: 'DIRECIONAR/CONDUZIR o agendamento da reunião via Google Meet',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'proximo_passo',
        label: 'Conduzir ao Próximo Passo',
        script:
          '"Perfeito, [Nome]! Já tenho aqui as informações pra passar pro especialista considerar pra formular os cenários pra entender as opções que fazem sentido pra você, baseado em tudo que me falou já conseguimos entender melhor e te direcionar..."',
      },
      {
        id: 'decisor',
        label: 'Validar Decisor',
        script:
          '"Mas me fala uma coisa, sobre o plano de saúde, é tudo com você mesmo ou você depende aí de uma opinião ou ajuda de alguém pra definir?"',
        collect: ['Quem paga/quem decide?'],
      },
      {
        id: 'horario',
        label: 'Definir Data e Horário',
        script:
          '"Como está sua agenda entre hoje e amanhã pra realizarmos uma reunião e o especialista já te direcionar em relação aos cenários? Qual horário que funciona bem pra você?"',
        collect: ['Retorno Programado (Data/hora)'],
      },
    ],
  },
  {
    id: 'assentamento',
    title: '5. ASSENTAMENTO DA REUNIÃO',
    subtitle: 'Garantir o compromisso do cliente',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'compromisso',
        label: 'Firmar Compromisso',
        script:
          '"Então combinado, nossa reunião fica pra: [dia] às [hora]. E assim [fulano], só pra deixar claro aqui, o fato de agendarmos a reunião não te obriga a ter que mudar de plano (ou contratar um plano novo), mesmo porque, como eu disse, o nosso foco aqui é justamente entender se temos uma opção que faça mais sentido pra você ou se o seu plano continua sendo a melhor opção. Agora... o que eu preciso é do seu compromisso em relação a reunião [dia] às [hora]. Funciona 100% pra você né? Não corre o risco de você esquecer não né?"',
        collect: ['Reunião Agendada'],
      },
      {
        id: 'logistica',
        label: '📊 SITUAÇÃO: Confirmar Logística + Confirmação dos Dados',
        script:
          '"Vou te mandar o link da reunião por e-mail, até pra você já dar o aceite e travar a sua agenda... mas mando pelo WhatsApp também, pra facilitar. Só me dê um ok lá quando receber pra eu saber que foi certinho. (aguardar) Só me confirma, qual o seu e-mail? (aguardar) E esse nº que estamos falando é whatsapp também?"',
        collect: ['Telefone', 'E-mail'],
      },
    ],
  },
  {
    id: 'encerramento',
    title: '6. ENCERRAMENTO',
    subtitle: 'Finalizar com profissionalismo e próximos passos',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'despedida',
        label: 'Despedida',
        script: '"Maravilha então... Já te mando o invite. Prazer falar com você [Nome], e até [dia]! Abraço!"',
      },
    ],
  },
];
