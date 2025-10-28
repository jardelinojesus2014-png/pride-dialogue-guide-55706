-- Create script_items table for editable script content
CREATE TABLE public.script_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  label TEXT NOT NULL,
  script TEXT NOT NULL,
  alternatives TEXT[],
  tips TEXT[],
  warnings TEXT[],
  collect TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section_id, item_id)
);

-- Enable RLS
ALTER TABLE public.script_items ENABLE ROW LEVEL SECURITY;

-- Everyone can view script items
CREATE POLICY "Everyone can view script items"
ON public.script_items
FOR SELECT
USING (true);

-- Admins can insert script items
CREATE POLICY "Admins can insert script items"
ON public.script_items
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Admins can update script items
CREATE POLICY "Admins can update script items"
ON public.script_items
FOR UPDATE
USING (is_admin(auth.uid()));

-- Admins can delete script items
CREATE POLICY "Admins can delete script items"
ON public.script_items
FOR DELETE
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_script_items_updated_at
BEFORE UPDATE ON public.script_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Populate table with initial data from sectionsData
INSERT INTO public.script_items (section_id, item_id, label, script, alternatives, collect, display_order) VALUES
-- APRESENTAÇÃO
('apresentacao', 'saudacao', 'Saudação', '"[Nome]? (aguardar) Bom dia/tarde/noite, tudo bem? (aguardar) Tá podendo falar rapidinho?"', NULL, NULL, 1),
('apresentacao', 'identificacao', 'Identificação (Apresentação Pessoal)', '"Sthefany aqui... Nós conversamos um tempo atrás, não sei se vai se lembrar... Sou da Pride Consultoria..."', ARRAY['"Sthefany aqui... Você não me conhece ainda... Sou da Pride Consultoria..."'], NULL, 2),
('apresentacao', 'empresa', 'Apresentação da Pride', '"Que é uma empresa especializada na reavaliação de assistência médica... a gestão de plano de saúde"', NULL, NULL, 3),
('apresentacao', 'motivo', 'Motivo da Ligação', '"Chegamos a falar um tempo atrás sobre o seu plano, na época você estava com o plano da [operadora] se não me engano... e fiquei de retomar mais pra frente pra entender como está seu cenário, se continua sendo a melhor opção..."', ARRAY['"Estou ligando por conta do seu plano de saúde da [operadora]"'], NULL, 4),

-- CONEXÃO
('conexao', 'fit', 'Validar o Fit + Pergunta Link', '"Você já chegou a realizar algum comparativo do seu plano recentemente?" (aguardar)', ARRAY['"O seu plano de saúde ainda é o [Operadora X]?" (aguardar)'], NULL, 1),
('conexao', 'transicao', 'Transição', '"Ah, maravilha... liguei na hora certa então..."', ARRAY['"Entendi... então faz sentido retomarmos..."'], NULL, 2),

-- QUALIFICAÇÃO
('qualificacao', 'plano_composicao', '📊 SITUAÇÃO: Plano Atual + Composição', '"Você disse que seu plano ainda é o [operadora], ele é pra quantas vidas? (aguardar) E quem são e as idades? (aguardar) Você com x anos... e [fulano]...? (aguardar) Qual a categoria dele? (aguardar) Ele é enfermaria ou apartamento? (aguardar) Tem coparticipação? (aguardar) Quanto tempo estão neste plano?"', NULL, ARRAY['Plano Atual (Operadora)', 'Quantidade de Vidas', 'Vínculo/Idade (todos os beneficiários)', 'Categoria', 'Acomodação', 'Coparticipação', 'Tempo de Plano atual'], 1),
('qualificacao', 'investimento', '📊 SITUAÇÃO: Investimento', '"E quanto vocês tão investindo hoje no plano para as x vidas?"', ARRAY['"Qual o valor que pretende investir no plano pras x vidas?" (quando não possuir plano de saúde ativo)'], ARRAY['Valor Plano atual (ou que deseja investir)'], 2),
('qualificacao', 'cnpj', '📊 SITUAÇÃO: CNPJ', '"E me explica uma coisa, esse plano de vocês é pelo CNPJ? (aguardar) MEI ou LTDA? (aguardar) Esse CNPJ é São Paulo capital mesmo ou interior? (aguardar) Todos os sócios vão entrar no plano?"', NULL, ARRAY['Possui CNPJ ativo?', 'Tipo de CNPJ', 'Localidade do CNPJ', 'Todos os sócios entrarão no plano?', 'CNPJ (Números) - se o cliente souber'], 3),
('qualificacao', 'formacao', '📊 SITUAÇÃO: Formação', '"Qual sua formação acadêmica?"', NULL, ARRAY['Formação Acadêmica'], 4),
('qualificacao', 'caracteristicas', '📊 SITUAÇÃO: Características', '"E me lembra quando é o mês de reajuste do plano, quando ele faz aniversário? (aguardar) E o boleto dele vence em qual dia do mês?"', NULL, ARRAY['Mês de reajuste', 'Dia do Vencimento'], 5),
('qualificacao', 'localizacao_rede', '📊 SITUAÇÃO: Localização e Rede', '"Você mora em qual região, qual bairro? (aguardar) E me diz uma coisa importante: quais hospitais e laboratórios vocês costumam usar? Até pra eu conseguir passar aqui pro especialista incluir essas opções no cenário"', NULL, ARRAY['Bairro/Zona', 'Hospitais e Laboratórios (rede SP)'], 6),
('qualificacao', 'saude', '⚠️ PROBLEMA: Utilização e Saúde', '"Tem alguém que tá fazendo algum tratamento, tomando alguma medicação de alto custo... com alguma doença? (aguardar) Alguém grávida? (aguardar) Alguém está fazendo terapia?"', NULL, ARRAY['Tratamento/doença pré-existente', 'Gestante no grupo?', 'Fazendo terapia?'], 7),
('qualificacao', 'dores', '⚠️ PROBLEMA: Dores com Plano Atual', '"E me conta, vocês tiveram algum problema com esse plano atual?"', NULL, ARRAY['Dificuldade com o plano atual'], 8),
('qualificacao', 'observacoes', '📝 Observações', '"Tem mais alguma coisa específica que é importante pra você? Alguma preferência ou necessidade que eu preciso considerar aqui?"', NULL, ARRAY['Observações'], 9),

-- AGENDAMENTO
('agendamento', 'proximo_passo', 'Conduzir ao Próximo Passo', '"Perfeito, [Nome]! Já tenho aqui as informações pra passar pro especialista considerar pra formular os cenários pra entender as opções que fazem sentido pra você, baseado em tudo que me falou já conseguimos entender melhor e te direcionar..."', NULL, NULL, 1),
('agendamento', 'decisor', 'Validar Decisor', '"Mas me fala uma coisa, sobre o plano de saúde, é tudo com você mesmo ou você depende aí de uma opinião ou ajuda de alguém pra definir?"', NULL, ARRAY['Quem paga/quem decide?'], 2),
('agendamento', 'horario', 'Definir Data e Horário', '"Como está sua agenda entre hoje e amanhã pra realizarmos uma reunião e o especialista já te direcionar em relação aos cenários? Qual horário que funciona bem pra você?"', NULL, ARRAY['Retorno Programado (Data/hora)'], 3),

-- ASSENTAMENTO
('assentamento', 'compromisso', 'Firmar Compromisso', '"Então combinado, nossa reunião fica pra: [dia] às [hora]. E assim [fulano], só pra deixar claro aqui, o fato de agendarmos a reunião não te obriga a ter que mudar de plano (ou contratar um plano novo), mesmo porque, como eu disse, o nosso foco aqui é justamente entender se temos uma opção que faça mais sentido pra você ou se o seu plano continua sendo a melhor opção. Agora... o que eu preciso é do seu compromisso em relação a reunião [dia] às [hora]. Funciona 100% pra você né? Não corre o risco de você esquecer não né?"', NULL, ARRAY['Reunião Agendada'], 1),
('assentamento', 'logistica', '📊 SITUAÇÃO: Confirmar Logística + Confirmação dos Dados', '"Vou te mandar o link da reunião por e-mail, até pra você já dar o aceite e travar a sua agenda... mas mando pelo WhatsApp também, pra facilitar. Só me dê um ok lá quando receber pra eu saber que foi certinho. (aguardar) Só me confirma, qual o seu e-mail? (aguardar) E esse nº que estamos falando é whatsapp também?"', NULL, ARRAY['Telefone', 'E-mail'], 2),

-- ENCERRAMENTO
('encerramento', 'despedida', 'Despedida', '"Maravilha então... Já te mando o invite. Prazer falar com você [Nome], e até [dia]! Abraço!"', NULL, NULL, 1);