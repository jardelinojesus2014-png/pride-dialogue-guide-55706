export interface CadenciaItemData {
  id: string;
  label: string;
  script: string;
  note?: string;
  tip?: string;
  collect?: string[];
}

export interface CadenciaDay {
  id: string;
  title: string;
  subtitle: string;
  colorClass: string;
  items: CadenciaItemData[];
}

export const cadenciaData: CadenciaDay[] = [
  {
    id: 'dia1',
    title: 'DIA 1',
    subtitle: 'Primeiro contato - Apresentação e qualificação inicial',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'ligacoes_dia1',
        label: '📞 Ligações',
        script: 'A ligação é prioridade (sempre ligar do Bitrix e do Callix) - mesmo se enviarmos mensagem pelo WhatsApp',
        collect: [
          'Ligar pelo menos 3x seguidas',
          '3 vezes no dia em horários diferentes',
          'Ligações em turnos diferentes (manhã, tarde, noite)'
        ],
        tip: '⚠️ PRIORIDADE: As ligações devem ser feitas SEMPRE, mesmo que envie mensagens por outros canais'
      },
      {
        id: 'whatsapp_dia1',
        label: '💬 WhatsApp - Mensagem de Abertura',
        script: '"Boa tarde, [Fulano]. Tudo bem? (enviar áudio conduzindo para chamada)"',
        note: '📎 Enviar ÁUDIO MODELO anexado (puxando para ligação)',
        tip: 'O objetivo da mensagem é conduzir o cliente para uma ligação'
      },
      {
        id: 'email_dia1',
        label: '📧 E-mail - Mensagem de Abertura',
        script: 'ASSUNTO: Apresentação da Pride Consultoria e Solicitação de Informações para Cotação de Plano de Saúde\n\nBom dia [Fulano], como vai?\n\nEu me chamo [seu nome], sou do setor de qualificação da Pride Corretora e Consultoria, que é uma empresa líder no segmento de Gestão de Planos de Saúde e Seguros.\n\nConforme vai conseguir analisar no nosso material anexo, prestamos uma consultoria e suporte de excelência, visando sempre o melhor custo-benefício para o beneficiário. Além de prestar um suporte continuado com intuito de permitir maior segurança e tranquilidade junto às Seguradoras e Operadoras de Plano de Saúde.\n\nRecebemos sua solicitação para uma cotação de Plano de Saúde, porém considerando que a elaboração dos custos é 100% personalizada e as propostas validadas serão apresentadas de acordo com a realidade do grupo, preciso entender um pouco mais do seu cenário atual (supondo que tenha plano) e suas principais demandas, sendo que assim conseguiremos formular os estudos com as cotações para te apresentar.\n\nQual um número e horário que consigo te ligar pra conversamos sobre?\n\nAguardo retorno.\nAtenciosamente',
        note: '⚠️ IMPORTANTE: Enviar com CÓPIA para avila@pridecorretora.com.br\n📎 ANEXAR: PDF Institucional da Pride',
        tip: 'O e-mail deve conduzir o cliente para agendar uma ligação'
      },
    ],
  },
  {
    id: 'dia2',
    title: 'DIA 2',
    subtitle: 'Follow-up - Reforço com vídeo institucional',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'ligacoes_dia2',
        label: '📞 Ligações',
        script: 'Continuar tentativas de contato por ligação',
        collect: [
          'Ligar pelo menos 3x seguidas',
          '3 vezes no dia em horários diferentes',
          'Ligações em turnos diferentes (manhã, tarde, noite)'
        ],
        tip: 'Mantenha a persistência nas ligações em horários variados'
      },
      {
        id: 'whatsapp_dia2',
        label: '💬 WhatsApp - Vídeo Institucional',
        script: 'Enviar mensagem com apresentação da empresa através do vídeo institucional',
        note: '🎥 Link do vídeo: https://youtu.be/H5b8j4nqOUI?si=PBswnn-ng9Qk6XYk',
        tip: 'Apresente a empresa de forma visual para gerar mais interesse'
      },
    ],
  },
  {
    id: 'dia3',
    title: 'DIA 3',
    subtitle: 'Reengajamento - Credibilidade com avaliações',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'ligacoes_dia3',
        label: '📞 Ligações',
        script: 'Continuar tentativas de contato por ligação',
        collect: [
          'Ligar pelo menos 3x seguidas',
          '3 vezes no dia em horários diferentes',
          'Ligações em turnos diferentes (manhã, tarde, noite)'
        ],
        tip: 'Persistência é fundamental. Varie os horários de tentativa'
      },
      {
        id: 'whatsapp_dia3',
        label: '💬 WhatsApp - Arte das Avaliações',
        script: 'Enviar mensagem com a arte das avaliações Google (corretora 5 estrelas mais bem avaliada do Brasil)',
        note: '⭐ ARTE: Avaliações Google - Corretora 5 estrelas\n📎 Arte será anexada quando estiver pronta',
        tip: 'Reforce a credibilidade mostrando as avaliações de outros clientes'
      },
    ],
  },
  {
    id: 'dia4',
    title: 'DIA 4',
    subtitle: 'Encerramento - Última tentativa e disponibilização',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'ligacoes_dia4',
        label: '📞 Ligações - Última Tentativa',
        script: 'Última rodada de tentativas de contato',
        collect: [
          'Ligar pelo menos 3x seguidas',
          '3 vezes no dia em horários diferentes',
          'Ligações em turnos diferentes (manhã, tarde, noite)'
        ],
        tip: 'Esta é a última tentativa intensiva de contato'
      },
      {
        id: 'whatsapp_dia4',
        label: '💬 WhatsApp - Mensagem de Encerramento',
        script: '"Boa tarde [Fulano], tudo bem? Tentei falar com você nestes dias (tanto por ligação, e-mail, como aqui pelo WhatsApp) sobre a sua solicitação de cotações do plano de saúde, mas não consegui contato. O objetivo não é ser inconveniente, então quando conseguir dar seguimento no assunto só me sinaliza que retorno a ligação pra darmos andamento. Sucesso!"',
        tip: 'Seja educado e deixe a porta aberta para contato futuro'
      },
      {
        id: 'email_dia4',
        label: '📧 E-mail - Mensagem de Encerramento',
        script: '"Boa tarde [Fulano], tudo bem? Tentei falar com você nestes dias (tanto por ligação, WhatsApp, como aqui pelo e-mail) sobre a sua solicitação de cotações do plano de saúde, mas não consegui contato. O objetivo não é ser inconveniente, então quando conseguir dar seguimento no assunto só me sinaliza que retorno a ligação pra darmos andamento. Sucesso!\n\nAtenciosamente"',
        note: '⚠️ IMPORTANTE: RESPONDER o e-mail enviado no DIA 01\n📎 ANEXAR: Arte das avaliações Google',
        tip: 'Mantenha-se disponível e profissional. Deixe claro que está à disposição'
      },
    ],
  },
];
