-- Create table for cadencia items (editable by admins)
CREATE TABLE public.cadencia_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  label TEXT NOT NULL,
  script TEXT NOT NULL,
  note TEXT,
  tip TEXT,
  collect TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(day_id, item_id)
);

-- Enable RLS
ALTER TABLE public.cadencia_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view cadencia items"
  ON public.cadencia_items
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert cadencia items"
  ON public.cadencia_items
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update cadencia items"
  ON public.cadencia_items
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete cadencia items"
  ON public.cadencia_items
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cadencia_items_updated_at
  BEFORE UPDATE ON public.cadencia_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data from cadenciaData
INSERT INTO public.cadencia_items (day_id, item_id, label, script, note, tip, collect, display_order) VALUES
('dia1', 'ligacoes_dia1', '📞 Ligações', 'A ligação é prioridade (sempre ligar do Bitrix e do Callix) - mesmo se enviarmos mensagem pelo WhatsApp', NULL, '⚠️ PRIORIDADE: As ligações devem ser feitas SEMPRE, mesmo que envie mensagens por outros canais', ARRAY['Ligar pelo menos 3x seguidas', '3 vezes no dia em horários diferentes', 'Ligações em turnos diferentes (manhã, tarde, noite)'], 1),
('dia1', 'whatsapp_dia1', '💬 WhatsApp - Mensagem de Abertura', '"Boa tarde, [Fulano]. Tudo bem? (enviar áudio conduzindo para chamada)"', '📎 Enviar ÁUDIO MODELO anexado (puxando para ligação)', 'O objetivo da mensagem é conduzir o cliente para uma ligação', NULL, 2),
('dia1', 'email_dia1', '📧 E-mail - Mensagem de Abertura', 'ASSUNTO: Apresentação da Pride Consultoria e Solicitação de Informações para Cotação de Plano de Saúde

Bom dia [Fulano], como vai?

Eu me chamo [seu nome], sou do setor de qualificação da Pride Corretora e Consultoria, que é uma empresa líder no segmento de Gestão de Planos de Saúde e Seguros.

Conforme vai conseguir analisar no nosso material anexo, prestamos uma consultoria e suporte de excelência, visando sempre o melhor custo-benefício para o beneficiário. Além de prestar um suporte continuado com intuito de permitir maior segurança e tranquilidade junto às Seguradoras e Operadoras de Plano de Saúde.

Recebemos sua solicitação para uma cotação de Plano de Saúde, porém considerando que a elaboração dos custos é 100% personalizada e as propostas validadas serão apresentadas de acordo com a realidade do grupo, preciso entender um pouco mais do seu cenário atual (supondo que tenha plano) e suas principais demandas, sendo que assim conseguiremos formular os estudos com as cotações para te apresentar.

Qual um número e horário que consigo te ligar pra conversamos sobre?

Aguardo retorno.
Atenciosamente', '⚠️ IMPORTANTE: Enviar com CÓPIA para avila@pridecorretora.com.br
📎 ANEXAR: PDF Institucional da Pride', 'O e-mail deve conduzir o cliente para agendar uma ligação', NULL, 3),
('dia2', 'ligacoes_dia2', '📞 Ligações', 'Continuar tentativas de contato por ligação', NULL, 'Mantenha a persistência nas ligações em horários variados', ARRAY['Ligar pelo menos 3x seguidas', '3 vezes no dia em horários diferentes', 'Ligações em turnos diferentes (manhã, tarde, noite)'], 1),
('dia2', 'whatsapp_dia2', '💬 WhatsApp - Vídeo Institucional', 'Enviar mensagem com apresentação da empresa através do vídeo institucional', '🎥 Link do vídeo: https://youtu.be/H5b8j4nqOUI?si=PBswnn-ng9Qk6XYk', 'Apresente a empresa de forma visual para gerar mais interesse', NULL, 2),
('dia3', 'ligacoes_dia3', '📞 Ligações', 'Continuar tentativas de contato por ligação', NULL, 'Persistência é fundamental. Varie os horários de tentativa', ARRAY['Ligar pelo menos 3x seguidas', '3 vezes no dia em horários diferentes', 'Ligações em turnos diferentes (manhã, tarde, noite)'], 1),
('dia3', 'whatsapp_dia3', '💬 WhatsApp - Arte das Avaliações', 'Enviar mensagem com a arte das avaliações Google (corretora 5 estrelas mais bem avaliada do Brasil)', '⭐ ARTE: Avaliações Google - Corretora 5 estrelas
📎 Arte será anexada quando estiver pronta', 'Reforce a credibilidade mostrando as avaliações de outros clientes', NULL, 2),
('dia4', 'ligacoes_dia4', '📞 Ligações - Última Tentativa', 'Última rodada de tentativas de contato', NULL, 'Esta é a última tentativa intensiva de contato', ARRAY['Ligar pelo menos 3x seguidas', '3 vezes no dia em horários diferentes', 'Ligações em turnos diferentes (manhã, tarde, noite)'], 1),
('dia4', 'whatsapp_dia4', '💬 WhatsApp - Mensagem de Encerramento', '"Boa tarde [Fulano], tudo bem? Tentei falar com você nestes dias (tanto por ligação, e-mail, como aqui pelo WhatsApp) sobre a sua solicitação de cotações do plano de saúde, mas não consegui contato. O objetivo não é ser inconveniente, então quando conseguir dar seguimento no assunto só me sinaliza que retorno a ligação pra darmos andamento. Sucesso!"', NULL, 'Seja educado e deixe a porta aberta para contato futuro', NULL, 2),
('dia4', 'email_dia4', '📧 E-mail - Mensagem de Encerramento', '"Boa tarde [Fulano], tudo bem? Tentei falar com você nestes dias (tanto por ligação, WhatsApp, como aqui pelo e-mail) sobre a sua solicitação de cotações do plano de saúde, mas não consegui contato. O objetivo não é ser inconveniente, então quando conseguir dar seguimento no assunto só me sinaliza que retorno a ligação pra darmos andamento. Sucesso!

Atenciosamente"', '⚠️ IMPORTANTE: RESPONDER o e-mail enviado no DIA 01
📎 ANEXAR: Arte das avaliações Google', 'Mantenha-se disponível e profissional. Deixe claro que está à disposição', NULL, 3);