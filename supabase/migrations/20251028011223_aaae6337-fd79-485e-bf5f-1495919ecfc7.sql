-- Create table for qualification info items
CREATE TABLE public.qualification_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  tip TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.qualification_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view qualification items"
ON public.qualification_items
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert qualification items"
ON public.qualification_items
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update qualification items"
ON public.qualification_items
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete qualification items"
ON public.qualification_items
FOR DELETE
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_qualification_items_updated_at
BEFORE UPDATE ON public.qualification_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data for qualification section
INSERT INTO public.qualification_items (category, content, display_order) VALUES
('qualificacao', 'Nome da Empresa/ Cliente', 1),
('qualificacao', 'Nome do responsável (pela empresa/ contrato)', 2),
('qualificacao_contato', 'Telefone', 3),
('qualificacao_contato', 'E-mail', 4),
('qualificacao', 'Possui CNPJ ativo?', 5),
('qualificacao', 'Tipo de CNPJ', 6),
('qualificacao', 'Localidade do CNPJ (Cidade/ Estado)', 7),
('qualificacao', 'CNPJ (Números)', 8),
('qualificacao', 'Formação Acadêmica', 9),
('qualificacao', 'Possui plano de saúde ativo?', 10),
('qualificacao', 'Plano Atual (Operadora)', 11),
('qualificacao', 'Categoria', 12),
('qualificacao', 'Valor Plano atual (ou que deseja investir)', 13),
('qualificacao', 'Quantidade de Vidas', 14),
('qualificacao', 'Todos os sócios entrarão no plano?', 15),
('qualificacao', 'Vínculo/ Idade (de todos os beneficiários)', 16),
('qualificacao', 'Tempo de Plano atual', 17),
('qualificacao', 'Acomodação', 18),
('qualificacao', 'Coparticipação', 19),
('qualificacao', 'Mês de reajuste (aniversário do Plano)', 20),
('qualificacao', 'Dia do Vencimento do Boleto', 21),
('qualificacao', 'Bairro / Zona onde reside', 22),
('qualificacao', 'Hospitais e Laboratórios que mais utiliza (rede São Paulo)', 23),
('qualificacao', 'Observações:', 24),
('utilizacao', 'Tem alguém fazendo tratamento ou com doença pré-existente? (especifique)', 25),
('utilizacao', 'Alguma gestante no grupo? (especifique)', 26),
('utilizacao', 'Alguém fazendo terapia? (especifique)', 27),
('utilizacao', 'Teve alguma dificuldade com o plano atual?', 28),
('agendamento', 'Quem paga/ quem decide?', 29),
('agendamento', 'Reunião Agendada', 30),
('agendamento', 'Retorno Programado com o cliente para Apresentação (Data/hora)', 31);