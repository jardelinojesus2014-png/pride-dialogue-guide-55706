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
        id: 'contato_inicial',
        label: 'Contato Inicial',
        script: 'Faça o primeiro contato seguindo o roteiro de prospecção completo.',
        tip: 'Este é o momento mais importante. Siga todas as etapas do roteiro de prospecção para garantir uma qualificação completa.',
      },
    ],
  },
  {
    id: 'dia2',
    title: 'DIA 2',
    subtitle: 'Follow-up - Reforço e confirmação',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'followup_dia2',
        label: 'Follow-up Dia 2',
        script: 'Realize o acompanhamento do contato anterior.',
        tip: 'Verifique se o cliente recebeu as informações e se há dúvidas.',
      },
    ],
  },
  {
    id: 'dia3',
    title: 'DIA 3',
    subtitle: 'Reengajamento - Manter interesse',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'reengajamento',
        label: 'Reengajamento',
        script: 'Reforce o valor da proposta e mantenha o interesse do cliente.',
        tip: 'Foque nos benefícios e na solução que você pode oferecer.',
      },
    ],
  },
  {
    id: 'dia4',
    title: 'DIA 4',
    subtitle: 'Fechamento - Última tentativa',
    colorClass: 'bg-accent/10',
    items: [
      {
        id: 'fechamento',
        label: 'Fechamento',
        script: 'Faça a última tentativa de agendamento ou fechamento.',
        tip: 'Seja direto e objetivo. Ofereça facilidades se necessário.',
      },
    ],
  },
];
