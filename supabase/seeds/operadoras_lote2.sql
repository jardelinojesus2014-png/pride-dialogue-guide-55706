-- ============================================================
-- LOTE 2 — Documentação de operadoras (gerada dos PDFs de treinamento)
-- Plena, Porto Seguro, Prevent Senior, Seguros Unimed, SulAmérica
-- Rode no SQL editor da Lovable (View Backend > SQL editor > Run).
-- Re-executável: apaga os tópicos anteriores de cada operadora antes de inserir.
-- ============================================================

-- ========================= PLENA =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'plena%');
UPDATE operadoras SET
  subtitle = 'Operadora regional (Grande SP) · PME de 01 a 99 vidas · Venda 100% online',
  tags = ARRAY['Operadora','Regional SP','Rede própria','Venda online']
WHERE name ILIKE 'plena%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral e venda online', $b$**Formação do grupo:** PME de **01 a 99 vidas**.

**Venda 100% online (sem processo físico):**
1. Cadastro do corretor (nome, CPF, celular, e-mail) na área técnica → recebe e-mail para criar senha.
2. Envio do formulário preenchido + documentação em **JPEG**.
3. Área técnica faz upload → cliente recebe e-mail com a Declaração de Saúde.
4. Link de pagamento da 1ª parcela (débito ou cartão) — **expira em 48h**.

> ⚠ Se o link de pagamento expirar, o processo é cancelado e refeito do zero.
> ⚠ A Plena **não envia boletos** — imprimir no site plenasaude.com.br, campo Empresas.$b$, 0),

  ('Composição / Quem pode aderir', $b$**Titulares:** sócios e funcionários com vínculo (FGTS) sem limite de idade; prestadores de serviço até 70a11m29d; estagiários de 16 a 59a11m29d; aprendizes de 14 a 24a11m29d.

**Dependentes:** cônjuge/companheiro(a) até 75a11m29d; filhos solteiros/enteados até 49a11m29d; filhos inválidos sem limite; pai, mãe, padrasto, madrasta, irmão(ã), cunhado(a), tio(a), sogro(a) até 75a11m29d; sobrinho(a), genro, nora até 49a11m29d; neto(a) até 24a11m29d.

> Estagiários e aprendizes: só a partir da 2ª vida.

**Contratação:** total ou parcial. Dependentes não escolhem plano diferente do titular.$b$, 1),

  ('Regras gerais e documentos', $b$- DNV obrigatória para nascidos a partir de 01/01/2010.
- A partir de 30 vidas: preenchimento de layout e declaração (sem documentos físicos).
- Empresas Individuais (exceto Eireli): mínimo **6 meses** de abertura.
- Proposta com assinatura idêntica à do Contrato Social (sócio/ADM).
- Fichas de adesão com nomes completos (usuário, dependentes e mãe), sem abreviações; endereço **residencial** do titular (não o da empresa).

**Documentos:** empresa (contrato social/requerimento, CNPJ, FGTS quando houver funcionário), titular (RG/CPF/CNS/comprovante de endereço/registro), cônjuge (certidão ou união estável reconhecida), filhos, agregados e estrangeiros (RNE) — conforme relação por tipo de beneficiário.$b$, 2),

  ('Entrevista médica', $b$> A entrevista médica é **obrigatória para todos os beneficiários, sem exceção**.

Agendamento pelo corretor/plataforma: **(11) 3944-5414**. Sempre por videoconferência e/ou telefone — nunca presencial.

A partir de 30 vidas, não é exigida consulta orientada.$b$, 3),

  ('Coparticipação', $b$Planos **Confort 300** e **Confort 500**:
- Terapias simples (psicólogo, nutricionista, fisio, acupuntura, fono, TO): **R$ 150,00** — cobrança a partir da **13ª sessão**.
- Terapias complexas (psicoterapia, quimio, radio, hemodiálise, ABA, etc.): **R$ 150,00**.
- Internação em rede credenciada: **R$ 500,00** (apenas Confort 500).

> Se o beneficiário tem plano de rede credenciada e interna na **rede própria**, não há cobrança de coparticipação.$b$, 4),

  ('Vigência, prazos e comercialização', $b$**Vigência:** 24h a partir do pagamento do 1º boleto. O 1º pagamento é programado para **15 dias** (pode pagar antes). Vencimentos seguintes na data escolhida na digitação.

**Entrega da proposta:** 48h após a assinatura. PME sem pendência é enviada à operadora no dia seguinte — atenção ao prazo de vigência.

**Área de comercialização (Grande SP):**
- **Confort 300:** Arujá, Caieiras, Cajamar, Carapicuíba, Ferraz de Vasconcelos, Francisco Morato, Franco da Rocha, Guarulhos, Itaquaquecetuba, Jundiaí, Mairiporã, Mogi das Cruzes, Osasco, Poá, Santa Isabel, São Paulo, entre outros.
- **Confort 500:** os mesmos + Barueri, Embu das Artes, Itapecerica da Serra, Jandira, Santana de Parnaíba, Suzano.$b$, 5),

  ('Movimentação, cancelamento e contatos', $b$**Movimentação cadastral:** inclusões até 30 dias após a admissão; inclusão de dependentes só em nascimento, casamento ou adoção — tratada direto na operadora.

**Cancelamento/não renovação:** manifestação escrita com **60 dias** de antecedência ao fim da vigência. *(Atenção a estorno de comissão/premiação.)*

**Contatos:** central do corretor 3944-5402 / 3944-5403 · WhatsApp 11 91348-2236 · SAC 24h 11 91348-2236 ou 4445-9080 · App Plena Saúde e portal web.$b$, 6)
) AS t(title, body, ord) WHERE o.name ILIKE 'plena%';


-- ========================= PORTO SEGURO =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'porto%');
UPDATE operadoras SET
  subtitle = 'Seguradora · +70 anos · Somente PJ (CNPJ) · Com reembolso · Incide IOF',
  tags = ARRAY['Seguradora','Reembolso','Pleito 30+ vidas','Com IOF']
WHERE name ILIKE 'porto%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$Conglomerado de seguros (saúde, odonto, vida, auto, residencial, etc.). **Incide IOF** nas contratações de saúde.

Fundada em **1945**; mais de 70 anos de mercado. Controle: família Garfinkel (40,4%) e Itaú Unibanco (30,4%); 29,2% em bolsa.

~1 milhão de segurados (saúde e odonto), 8.200 empresas, +30 mil prestadores. Comercializa **somente PJ (CNPJ)**. **Não possui rede própria.**

> ⚠ **Pleito na Porto só acima de 30 vidas.**$b$, 0),

  ('Regras comerciais', $b$Possui **somente tabela compulsória** (não tem opcional). PME de **3 a 99 vidas**.

**Adesão mínima:**
- 03–19 vidas: 80% do FGTS/plano anterior/contrato social e/ou 100% Empresário Individual
- 20–99 vidas: 80%
- 100–499: 70% · Acima de 500: 50%

**Idade:** 3–4 vidas aceitam 1 vida até 71 anos; 5–19 vidas aceitam 2 vidas até 71; 20–99 aceitam 15% do grupo acima de 59.

**Tempo de abertura:** PME até 99 vidas mín. 3 meses; a partir de 100 vidas mín. 1 ano; MEI mín. 6 meses (**sem aceitação na linha tradicional**); empresas CEI não têm aceitação.

**Plano só hospitalar:** não possui. **Tarifa interior:** sim (DF, RJ, Vale do Paraíba, Litoral, ABCDMR). **Agrava no contador:** sim.$b$, 1),

  ('Coparticipação', $b$Contratação **opcional**, nas opções de **20% e 30%** (consultas, terapias, exames, PS, internação, internação psiquiátrica).
- **Linha Pro:** 10% ou 20%.
- **Linha P:** integral 20%/30%; coparticipação de terapias só na opção 20%.

Valores fixos por evento variam por plano (Prata/Ouro/Diamante Pro, P220–P520, linhas I).$b$, 2),

  ('Prestadores e dependentes', $b$**Prestadores PJ:** PME 03–09 vidas aceita 1 vida PJ a partir da 4ª; a partir de 10 vidas, 50% do grupo.

**Dependentes legais:** cônjuge/companheiro(a) até 58a11m29d (de 59 a 68 anos, consultar tabela de vidas acima do limite). Filhos naturais/adotivos até 45a11m29d; inválidos sem limite.

**Agregados:** pai, mãe, padrasto, madrasta, sogro(a) até 68 anos; sobrinhos consanguíneos, irmãos, netos, genro/nora até 45 anos (mediante análise e documentos).

**Funcionário novo:** cópias da carteira de trabalho (foto + registro).$b$, 3),

  ('Carências', $b$Análise de redução para empresas de **03 a 29 vidas**.
- **Carência Padrão:** empresas novas sem plano anterior.
- **Redução 01:** permanência de 03 a 12 meses em congênere.
- **Redução 02:** permanência a partir de 13 meses em congênere.
- **Isenção:** grupos a partir de 30 vidas.

> Junção de planos anteriores: ambos devem ser congêneres e **sem nenhum dia de janela** entre um plano e o outro.

**Documentos de aproveitamento:** individual/adesão (3 boletos + comprovantes + carteirinha + carta); PME/grupal (carta + carteirinha); mesma operadora (carteirinha — redução analisada pela seguradora).$b$, 4),

  ('Diferenciais e reembolso', $b$**Melhor custo-benefício:** linha **Ouro** (Hospital Nove de Julho, São Camilo, Rede D'Or); **Diamante** pode incluir Sírio-Libanês e retaguarda completa do Albert Einstein.

**Exclusivos do Diamante:** coleta domiciliar (Fleury, Alta, CDB Premium), cirurgias refrativas qualquer grau, reembolso de consultas/exames simples em 48h úteis, SALA VIP Albert Einstein, apoio ao viajante, seguro viagem (Schengen), Porto Faz, check-up diferenciado.

**Reembolso:** possui — Linha Bronze/Prata/P220/P320 só consultas; Ouro e a partir do P420, consultas + terapias + honorários médicos.

**Reajustes PME:** 2020-21 14,57% · 2021-22 8,38% · 2022-23 15,90% · 2023-24 24,90% · 2024-25 16,97%.$b$, 5),

  ('Implantação e vigência', $b$**Assinatura:** 8 dias corridos após a emissão (responsável dá o aceite; cada titular responde a DS).

**Vigência programada:** após aceite do risco, a Porto pergunta a data exata desejada (não pode ser alterada depois). O 1º boleto sai 10 dias após a vigência; os próximos na data de vigência.

**Vigência:** 24 meses, renovável automaticamente (aviso prévio de 60 dias para não renovar).

**Inclusão:** pelo portal da empresa/corretora (burocrática, a DS vai online ao e-mail do cliente); se der erro, enviar prints para movimentacao.saude@portoseguro.com.br. Pendência: ~3 dias para regularizar.$b$, 6),

  ('Cancelamento e contatos', $b$> ⚠ **Retenção:** alinhe previamente com o cliente — solicitar a Carta de Permanência pode acionar a retenção da operadora e comprometer a migração.

**Cancelamento:** aviso prévio de **60 dias**, por e-mail movimentacao.saude@portoseguro.com.br (data fim conta ~10 dias de análise; 24 meses na apólice para não cobrar multa).

**Carta de Permanência:** 2 dias úteis · relacionamento.pme@portoseguro.com.br · Tel 0800 727 2762.

**Portal do corretor:** [corretoronline](https://corretor.portoseguro.com.br/corretoronline/)

*Modelo de carta de cancelamento amparado na RN 557/2022 da ANS (cancelamento a qualquer tempo, sem aviso prévio e sem cobrança após o pedido).*$b$, 7)
) AS t(title, body, ord) WHERE o.name ILIKE 'porto%';


-- ========================= PREVENT SENIOR =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'prevent%');
UPDATE operadoras SET
  subtitle = 'Operadora regional (SP e RJ) · Contratos individuais · Ambulatorial + Hospitalar sem obstetrícia',
  tags = ARRAY['Operadora','Regional','Sem obstetrícia','Portabilidade']
WHERE name ILIKE 'prevent%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral e planos', $b$> ⚠ A operadora **não comercializa contratos familiares** — cada beneficiário contrata sua proposta individualmente.

**Cobertura:** ambulatorial + hospitalar **SEM obstetrícia**. Regras comerciais válidas a partir de 01/2026.

**Áreas de comercialização/utilização:**
- **Prevent 1025:** São Paulo (capital), Santo André, São Bernardo do Campo, São Caetano do Sul, Santos, Praia Grande.
- **Prevent Ma+s:** os mesmos + Rio de Janeiro (capital) e Niterói.$b$, 0),

  ('Portabilidade e cartas', $b$**Portabilidade:** comissiona — o cliente precisa ter **mais de 2 anos** de plano (enviar carta de compatibilidade ANS + carta de portabilidade do plano atual).

**Carta de permanência:** envio imediato · Solicitação por WhatsApp **+55 11 4949-3304** · recebe por e-mail.

**Cancelamento:** atenção à possibilidade de estorno de comissão/premiação.$b$, 1),

  ('Contatos', $b$**Núcleo de Apoio ao Corretor:** (11) 4004-4800 · apoioaocorretor@preventsenior.com.br

**Atendimento ao beneficiário:** (11) 3003-6284 (capitais/RMs) · 0800 591 1156 (demais)

**Central de agendamento:** (11) 3003-2442 (São Paulo) · (13) 4042-0844 (Baixada Santista) — todos os dias, inclusive feriados, das 7h às 20h.$b$, 2)
) AS t(title, body, ord) WHERE o.name ILIKE 'prevent%';


-- ========================= SEGUROS UNIMED =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'seguros%');
UPDATE operadoras SET
  subtitle = 'Cooperativa (Sistema Unimed) · Maior rede nacional · Comercialização em regiões específicas',
  tags = ARRAY['Cooperativa','Maior rede nacional','Reembolso','Retaguarda Einstein']
WHERE name ILIKE 'seguros%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$A Seguros Unimed opera no **sistema cooperativo Unimed** e utiliza toda a rede Unimed (hospitais, clínicas e laboratórios das singulares).

> ⚠ A Unimed Seguradora S/A **não se confunde** com a Central Nacional Unimed nem com as Unimed's singulares — têm CNPJ, administração e regras distintas.

Primeira Unimed fundada em 1967 (Santos/SP); a marca Seguros Unimed consolidou-se em 2008. Grupo de 341 cooperativas, 118 mil médicos cooperados, ~150 hospitais próprios, **38% de participação** no mercado nacional.

> ⚠ **A Pride só pode vender em regiões específicas:** São Paulo, Distrito Federal, Salvador e São Luís (MA).$b$, 0),

  ('Regras comerciais', $b$**Compulsório:** 100% do FGTS / categoria funcional (comprovada por CBO) ou da região; 50% de prestadores PJ (advocacia, TI e engenharia) ou 40% (demais ramos) — com contrato de prestação de 12 meses + 3 últimas NFs.

**Facultativa:** sem obrigatoriedade de inclusão de todo o grupo nem dos dependentes.

Dependentes não escolhem plano diferente do titular.

**Tempo de abertura:** MEI 6 meses; demais empresas 1 dia. **Plano só hospitalar:** não existe (todos completos: ambulatorial + hospitalar + obstetrícia).$b$, 1),

  ('Coparticipação', $b$Planos **sem coparticipação** ou **com 30%** (limitador por procedimento + limite mensal).

Tabela por plano (PME Nacional: Compacto, Efetivo, Completo, Superior, Superior Plus, Sênior). Internação psiquiátrica: 30% a partir da 31ª diária.$b$, 2),

  ('Dependentes', $b$Dependentes: **cônjuge e filhos**.
- Cônjuge/companheiro(a): CNS, certidão de casamento ou escritura pública de união estável (cartório).
- Filhos solteiros: até 39a11m29d (incapazes sem limite).
- Netos solteiros: até 39a11m29d.

**Funcionário novo:** páginas de foto, qualificação civil e registro da CTPS + CNS.$b$, 3),

  ('Carências', $b$**Carência contratual** (grupos 02–09 e 10–29 vidas): urgência/emergência 24h; consultas/exames básicos 15 dias; terapias 180 dias; internações clínicas 180/90; cirúrgicas/psiquiátricas/obstétricas 180/90; parto 300 dias; assistência domiciliar 180/90. CPT 24 meses.

> Junção entre planos anteriores: permitida **desde que não haja janela** entre as cartas de permanência.$b$, 4),

  ('Congêneres', $b$**Equivalentes ao Superior e Superior Plus:** Allianz (Superieur Completo Apto), CarePlus (Especial III e Soho30), Amil (700 QP, Lincx LT3, S750, S1500, S580, One1000), Bradesco (linha Nacional), Mediservice (Bronze/Prata Apto), Marítima (Pleno Apto), GNDI (Premium 900), SulAmérica (Especial 100/RC/Mais), Omint (SC1 e SC2), Porto Seguro (Ouro Apto/Mais Q/Max Q), Sompo (Absoluto Apto).

**Equivalentes ao Sênior:** Allianz (Excellence/Exclusivo), CarePlus (Master I/Soho160), Amil (One Back T2–T5, One S2500/S6500), Bradesco (Nacional Plus/Premium), Mediservice (Ouro Apto), GNDI (Infinity), SulAmérica (Executivo/Prestige), Omint (C16–C43), Porto Seguro (Diamante Mais Apto), Sompo (Supremo Apto).

> Para Superior/Superior Plus/Sênior: plano anterior congênere com **12+ meses** de vigência.$b$, 5),

  ('Diferenciais e coberturas', $b$**Maior rede nacional** — consolida toda a rede das Unimed's locais (vantagem forte no interior e demais estados).

**Todos os planos:** Unimed Odonto, desconto em medicamentos (Raia, Drogasil, Pacheco, Drogaria SP), Remissão (1 ano aos dependentes em caso de falecimento do titular), Garantia Funeral, Assistência PME.
**Completo:** + Assistência Acessibilidade e Residencial.
**Superior:** + Assistência Viagem (Brasil, 50km+) e Kids.
**Sênior:** + Concierge, Assistência Pet, Check-up e **Programa Einstein Corporate** (consultas e cirurgias no Albert Einstein).

**Cobertura internacional:** não. **Retaguarda Einstein:** sim. **Consultas em hospitais:** sim. **Reembolso:** oferece (política equiparada aos equivalentes).$b$, 6),

  ('Implantação e cancelamento', $b$**Implantação:** emissão pelo sistema Platinum; ~10 dias de análise após assinatura. Cada titular recebe link para agendar a **tele-entrevista** (token expira — agendar logo; 4 datas). Bebê até 8 meses: entrevista presencial. Boleto 60 dias. Vigência 12 meses.

**Aviso prévio:** 60 dias (com 12 meses de permanência para não cobrar multa); dependendo do contrato, cancela com 30 dias — sempre consultar antes.

**Reajuste médio (5 anos):** 12,92%. Faixa 58→59: acima de 68%.

**Central de Relacionamento:** 0800 016 66 33.$b$, 7)
) AS t(title, body, ord) WHERE o.name ILIKE 'seguros%';


-- ========================= SULAMÉRICA =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'sulam%');
UPDATE operadoras SET
  subtitle = 'Seguradora · Grupo Rede D''Or São Luiz · Capital aberto · Com reembolso',
  tags = ARRAY['Seguradora','Rede D''Or','Reembolso','Aceita Pleito']
WHERE name ILIKE 'sulam%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$Uma das seguradoras mais antigas do país (cerca de 130 anos), **capital aberto** na bolsa. Pertence ao **Grupo Rede D'Or São Luiz** (vendida em 2022 por R$ 13 bilhões).

**Público-alvo:** amplo — empresas (PME, MEI e grandes), profissionais liberais (via conselhos) e adesão (cooperativas/associações).

Não tinha hospital próprio até a compra; agora conta com a **rede São Luiz** como referência.$b$, 0),

  ('Regras comerciais', $b$**Compulsoriedade:** tem tabela compulsória e opcional. Aceita **carta de não ingresso** com carteirinha de plano (qualquer) + carta de permanência (modelo de não adesão da SulAmérica).

**Idade máxima:** sem limite formal, mas a partir dos **67 anos** dificulta a aceitação.

**Mínimo de vidas:** 3 pessoas.

**Coparticipação:** com e sem; **30%** (03–29 vidas com limitador; 30–99 sem limitador).

**Prestadores PJ:** não aceita em grupos de 03–29 vidas; PJ apenas com contrato mínimo de 1 ano.

**Tempo de abertura:** 1 dia. **Inclusão de sócios:** 1 dia. **Plano hospitalar:** sim. **Tarifa interior:** sim. **Agrava no contador:** sim. **Funcionário novo:** constar no FGTS.$b$, 1),

  ('Dependentes', $b$- Filhos até **44 anos** / netos até **17 anos**.
- Irmãos, pai e mãe até **64 anos**, com 12 meses de plano anterior sem DS positiva.$b$, 2),

  ('Carências', $b$**Limite de idade para redução:** 64a11m29d.

**Aproveitamento de carências:** plano anterior de congênere, permanência mínima de 3 meses completos, sem ultrapassar 60 dias do último boleto quitado. Tempo mínimo inicia com 3 meses; redução máxima com 12 meses de plano anterior. **Redução pelo grupo:** não.

**Carência contratual:** urgência/emergência 24h; consultas e exames simples 15 dias; internações, cirurgias complexas e ultrassonografias 180 dias.

**Junção:** sim, via portabilidade de carências.
**Redução para terapias:** sem redução para terapia ocupacional e nutricionista.$b$, 3),

  ('Congêneres', $b$**Grupos de 03 a 29 vidas:** Amil, Bradesco/Mediservice, Care Plus, Cassi, Clinipam, Doctor Clin, Geap, GNDI, Humana, Lincx, Omint, One Health, Petrobras, Porto Seguro, Promedica, Seguros Unimed, Sobam, e diversas Unimeds (BH, Campinas, Curitiba, Estado de SP, Fortaleza, Goiânia, Porto Alegre, Ribeirão Preto, Sorocaba, etc.), entre outras.

**Grupos a partir de 5 vidas:** CNU, Golden Cross, Hapvida, demais Unimeds.$b$, 4),

  ('Diferenciais e reembolso', $b$**Melhor custo-benefício:** "Direto Nacional" — ótima opção no ABC.

**Reembolso:** oferece (PME e PME Mais/Empresarial).

**Diferenciais:** telemedicina, Assistência 24h (nacional e internacional). **Prestige:** concierge e consulta médica domiciliar. **Cobertura internacional:** 30 mil euros (Tratado de Schengen). **Retaguarda Einstein:** sim. **Consultas em hospitais:** sim.

**Odonto PME (3+ vidas):** sem carência para urgência/emergência, consultas, dentística, radiologia, periodontia, cirurgia e endodontia. (Odonto Mais/Cuidado 360 possui carência.)

> **SulAmérica aceita Pleito, mas é difícil passar.**

**Reajustes:** 2021 9,35% · 2022 19,4% · 2023 24,76% · 2024 19,67% · 2025 15,23%. Faixa 58→59: 59%.$b$, 5),

  ('Implantação e vigência', $b$**Análise:** ~10 dias. Após emitida, o cliente assina em até **5 dias** (senão expira). Titular responde a DS (peso/altura) via **DocuSign**; representante legal recebe token para assinar a proposta. Boleto com vencimento em 60 dias.

> Certidão de casamento **obrigatória** (ou escritura pública de união estável), mesmo com filho em comum.
> Comprovante de endereço **obrigatório**, em nome do titular ou de um sócio (endereço da empresa ou mesmo município).

**Pendências:** ~2 dias para regularizar (senão a proposta é cancelada). Conta de consumo em nome dos sócios no endereço do CNPJ. Regra compulsório: mais de 51% do contrato aderindo, senão vai para a Flex.$b$, 6),

  ('Cancelamento, portabilidade e contatos', $b$**Portabilidade:** não comissiona.

**Cancelamento:** aviso prévio de 60 dias (formulário gerado no portal do gestor, assinado pelo cliente; ultimamente exigindo firma reconhecida). A data fim conta a partir da vigência do contrato.

**Carta de Permanência (PME):** envio imediato · Portal saude.sulamericaseguros.com.br/empresa/login · Tel 4004-5900 (solicitar pelo portal; telefone só em caso de erro).

**Contato do gestor:** David — +55 11 93408-8083.$b$, 7)
) AS t(title, body, ord) WHERE o.name ILIKE 'sulam%';
