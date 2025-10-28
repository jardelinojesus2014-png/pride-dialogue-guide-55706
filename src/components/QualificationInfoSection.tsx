import { Info } from 'lucide-react';

interface QualificationInfoSectionProps {
  darkMode: boolean;
}

export const QualificationInfoSection = ({ darkMode }: QualificationInfoSectionProps) => {
  return (
    <section className="bg-card rounded-lg shadow-xl p-6 sm:p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary rounded-full p-3 shadow-lg">
          <Info className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-primary">
          Informações Necessárias na Qualificação
        </h2>
      </div>

      <div className="space-y-6">
        {/* QUALIFICAÇÃO DO PLANO */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-black text-accent mb-4">
            QUALIFICAÇÃO DO PLANO (informações)
          </h3>
          
          <div className="space-y-3 text-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Nome da Empresa/ Cliente</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Nome do responsável (pela empresa/ contrato)</span>
            </div>

            <div className="mt-4 mb-2 font-bold text-accent">
              Informações do contato:
            </div>
            <div className="flex items-start gap-2 ml-4">
              <span className="text-primary font-bold">•</span>
              <span>Telefone</span>
            </div>
            <div className="flex items-start gap-2 ml-4">
              <span className="text-primary font-bold">•</span>
              <span>E-mail</span>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <span className="text-primary font-bold">•</span>
              <span>Possui CNPJ ativo?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Tipo de CNPJ</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Localidade do CNPJ (Cidade/ Estado)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>CNPJ (Números)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Formação Acadêmica</span>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <span className="text-primary font-bold">•</span>
              <span>Possui plano de saúde ativo?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Plano Atual (Operadora)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Categoria</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Valor Plano atual (ou que deseja investir)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Quantidade de Vidas</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Todos os sócios entrarão no plano?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Vínculo/ Idade (de todos os beneficiários)</span>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <span className="text-primary font-bold">•</span>
              <span>Tempo de Plano atual</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Acomodação</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Coparticipação</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Mês de reajuste (aniversário do Plano)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Dia do Vencimento do Boleto</span>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <span className="text-primary font-bold">•</span>
              <span>Bairro / Zona onde reside</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Hospitais e Laboratórios que mais utiliza (rede São Paulo)</span>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <span className="text-primary font-bold">•</span>
              <span>Observações:</span>
            </div>
          </div>
        </div>

        {/* DADOS DA UTILIZAÇÃO */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-black text-accent mb-4">
            DADOS DA UTILIZAÇÃO
          </h3>
          
          <div className="space-y-3 text-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Tem alguém fazendo tratamento ou com doença pré-existente? (especifique)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Alguma gestante no grupo? (especifique)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Alguém fazendo terapia? (especifique)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Teve alguma dificuldade com o plano atual?</span>
            </div>
          </div>
        </div>

        {/* AGENDAMENTO DO ATENDIMENTO DA OPORTUNIDADE */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-black text-accent mb-4">
            AGENDAMENTO DO ATENDIMENTO DA OPORTUNIDADE
          </h3>
          
          <div className="space-y-3 text-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Quem paga/ quem decide?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Reunião Agendada</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Retorno Programado com o cliente para Apresentação (Data/hora)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
