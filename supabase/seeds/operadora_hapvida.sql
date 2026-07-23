-- ============================================================
-- HAPVIDA (Hapvida NotreDame Intermédica / NDI / GNDI)
-- Rode no SQL editor da Lovable (View Backend > SQL editor > Run). Re-executável.
-- ============================================================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE '%hapvida%');
UPDATE operadoras SET
  subtitle = 'Operadora verticalizada (Hapvida NotreDame) · Maior rede própria do Brasil · +16 mi de beneficiários',
  tags = ARRAY['Operadora','Verticalizada','Rede própria','Medicina de grupo']
WHERE name ILIKE '%hapvida%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$A **NotreDame Intermédica (NDI)** é operadora de medicina de grupo (rede própria + credenciada), fundada em **1968**, pioneira em Medicina Preventiva. Capital aberto na B3 desde 2018.

Em **2022**, a combinação com o **Hapvida** criou uma das maiores operadoras verticalizadas do mundo: **~16 milhões de clientes** e **18% de participação** de mercado.

**Maior rede própria do Brasil:** 87 hospitais, 339 centros clínicos, 77 prontos atendimentos, 293 unidades de diagnóstico, 17 de medicina preventiva e 3 centros NotreLife 50+.

**Público:** do **Smart** (entrada, custo-benefício) ao **Premium** (cobertura nacional). Destaque no público de massa. O Premium **não** incorpora Rede D'Or nem hospitais AA (Einstein, Sírio, Fleury).

> Emissão NotreDame PME: implanta mediante preenchimento da DS.$b$, 0),

  ('Formação do grupo e regras', $b$Contratação **compulsória ou facultativa/opcional**.

**Formação do grupo:**
- **Super Simples 1 vida:** somente o proprietário do CNPJ.
- **Super Simples 02 a 29:** mínimo 1 titular com vínculo + 1 dependente.
- **PME 30 a 99:** mínimo 1 titular com vínculo + dependentes.

**Coparticipação:** parcial ou completa.

**Tempo de abertura:** MEI 6 meses; demais 1 dia. **Inclusão de sócios:** 15 dias.

**Plano só hospitalar:** não. **Tarifa interior:** sim (todo o interior, exceto capital, mesma tabela). **Agrava no contador:** não.$b$, 1),

  ('Dependentes e documentos', $b$**Titular:** RG e CPF ou CNH + comprovante de endereço (recém-contratado: ficha de registro ou CTPS digital).

**Cônjuge:** RG, CPF/CNH, CNS, certidão de casamento. **Companheiro(a):** declaração de união estável em cartório (nos processos de 30 a 99 vidas, escritura pública).

**Filhos:** RG, CPF/CNH (maiores de 18), CNS e certidão. **Adotivo:** + termo de guarda/tutela. **Enteado:** + certidão de casamento/união do titular.

**Agregados** (pai/mãe, padrasto/madrasta, tio, sogro, irmão, neto, cunhado, genro/nora, sobrinho): RG, CPF/CNH, CNS + documento do titular e comprovante de vínculo/parentesco.$b$, 2),

  ('Carências', $b$**Limite de idade para redução:** sem limite vindo da **mesma** operadora; de **outras** operadoras, 63a11m29d.

**Aproveitamento por tempo de plano anterior:**
- 30 a 179 dias: redução de 30 dias dos prazos.
- 180 dias a 12 meses: aproveita 50% do tempo (exceto parto, preexistência e terapias).
- Acima de 12 meses: aproveita 100% (exceto parto, preexistência e terapias).

**Carência Promocional:** empresas de 02–10 e 11–29 vidas sem plano anterior.
> A partir de **30 vidas não há carências** para nenhum procedimento (conforme ANS).

**Carência contratual:** urgência/emergência 24h; consultas e exames simples 30 dias; internações/cirurgias 180 dias; parto a termo 300 dias; CPT (preexistentes) 730 dias.

**Junção:** permite para redução de carência desde que as operadoras sejam **congêneres compatíveis e sem nenhum dia de intervalo** (não junta duas operadoras diferentes — considera-se o prazo da última).$b$, 3),

  ('Congêneres', $b$**Linha Smart:** aceita **qualquer operadora com registro na ANS**.

Demais linhas (lista): Ameplan, Alice, Amhemed, Ana Costa, Assim Saúde, Biovida, Caberj, Cabesp, Care Plus, GoCare, Golden Cross, HBC, Leve Saúde, Mediservice, Omint, Plena Saúde, Porto Seguro, Prevent Senior, Samaritano, Sami, Santa Helena, São Cristóvão, Saúde Beneficência, Sobam, Trasmontano, SulAmérica, Bradesco, Unimed, Amil, Blue Company, Med-tour, Proasa, Cruz Azul, Dona Saúde, entre outras.$b$, 4),

  ('Planos, diferenciais e reembolso', $b$**Planos de entrada (melhor custo-benefício):** Smart 200 e Smart 200 UP — atendimento básico de qualidade em SP capital.
**Advance 600:** nacional, bons hospitais de referência (Leforte, Vitória, Cema, Nipo, Metropolitano, Alvorada, Assunção-SBC, Carlos Chagas-Guarulhos, Hospitalis-Barueri) — boa opção para reduzir custo de clientes vindos de seguradoras/Amil.
**Premium 900 Care:** menos competitivo hoje pela rede credenciada.

**Reembolso:** só a partir do **Advance 600** (R$ 75 consulta), Advance 700 (R$ 96), **Premium** (R$ 240 — alto vs. equivalentes, compensa a rede mais reduzida).

**Odonto vitalício** para todas as categorias. Todos os planos (a partir do Smart): Clube de Vantagens e Medicina Preventiva.
**Advance:** abrangência nacional + assistência viagem nacional.
**Premium:** viagem internacional (Schengen), cirurgia de miopia acima de -3,0, transplante extra-rol (coração e pulmão), programa de vacinas, coleta domiciliar.

> **Não atende Einstein nem Sírio-Libanês.**

**Reajustes:** 2020-21 12,19% · 2021-22 8,63% · 2022-23 18,43% · 2023-24 21,94% · 2024-25 19,20% (média 16,08%). Faixa 58→59: ~45%.$b$, 5),

  ('Implantação e vigência', $b$**PME:** análise em ~5 dias (super rápido). O responsável recebe e-mail para aceite; o titular recebe a DS para assinatura. **Vigência programada:** mínimo 5 e máximo 60 dias (boleto na mesma data da vigência). Período: 12 meses.

**NotreLife / Smart UP PF (individual):** após emitida, análise em 1 dia e libera o boleto; pagou, vigência em 24h (vencimento na data do 1º pagamento). Aceita todas as idades — familiar até 5 vidas. *(O Smart UP PF substitui os planos Notrelife e Notrelife 50+.)*

**Pendências:** não há prazo fixo — regularizar o quanto antes (se a vigência estiver próxima, ela vai sendo empurrada). **Portabilidade:** não comissiona.$b$, 6),

  ('Cancelamento e contatos', $b$**Cancelamento:** aviso prévio de 60 dias; somente o titular responsável pelo CNPJ, por telefone **(11) 4090-2900** (a data fim é informada no ato da ligação). Exclusão sempre programada (a NDI não faz devolução de valores; sem retroativo). *(Pós-vendas não faz.)*

**Carta de Permanência:** envio imediato · WhatsApp (11) 94213-6780 · Tel PME 4020-1685 · Tel PF 4090-1750.

**Cobrança de inadimplentes (GNDI/Intervalor):** intermedica.intervalor@intervalor.com.br · 0800 880 0079.$b$, 7)
) AS t(title, body, ord) WHERE o.name ILIKE '%hapvida%';
