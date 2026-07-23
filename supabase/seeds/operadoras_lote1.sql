-- ============================================================
-- LOTE 1 — Documentação de operadoras (gerada dos PDFs de treinamento)
-- Amil, Omint, Care Plus, Bradesco, Blue
-- Rode no SQL editor da Lovable (View Backend > SQL editor > Run).
-- Re-executável: apaga os tópicos anteriores de cada operadora antes de inserir.
-- ============================================================

-- ========================= AMIL =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'amil%');
UPDATE operadoras SET
  subtitle = 'Operadora · 4ª maior do Brasil · Fundada em 1978 · 3,16 mi de beneficiários',
  tags = ARRAY['Operadora','Rede própria','Aceita Pleito','Coligada familiar']
WHERE name ILIKE 'amil%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$**Fundação:** 1978, pelo médico e empresário Edson de Godoy Bueno. Saiu da bolsa em 10/05/2013, após anunciar a compra pela UnitedHealth (hoje sem capital aberto).

**Porte:** 3,16 milhões de beneficiários — **4ª maior operadora do Brasil**.

**Público-alvo:** pessoa física (via administradora Supermed) e planos empresariais para todos os tipos de empresa **a partir de 02 vidas**.

**Rede própria:** sim — 36 unidades entre hospitais, centros clínicos e oncológicos, além de ampla rede credenciada.

> **Amil aceita coligada familiar.**
> **Amil aceita Pleito.**$b$, 0),

  ('Regras comerciais', $b$**Porte I (02 a 29 vidas)**
- **Tabela Empresas MEI:** natureza jurídica Empresário Individual. Não permite os planos S2500 (R1 e R2) da Linha One nem Black da Linha Amil.
- **Tabela Empresas Não MEI:** qualquer natureza jurídica (ME, EPP, CAEPF, Produtor Rural com CNPJ ativo), exceto Empresário Individual.

**Mínimo de vidas:** 2 vidas.

**Compulsório por plano anterior / encampação:** inclusão de 100% do grupo coberto em outra operadora (ou na Amil) por pelo menos 12 meses.
> Válido só se o prazo entre a rescisão do plano anterior e o protocolo da nova proposta **não exceder 30 dias corridos**.
> Vale apenas se **100% das vidas** da operadora anterior entrarem (uma vida a mais ou a menos → precificação por livre adesão). Beneficiários de Adesão ou PF não se enquadram.

**Importante:** beneficiários que não aderirem devem apresentar carta declarando que já possuem plano em outra operadora (modelo no Portal do Corretor).$b$, 1),

  ('Coparticipação', $b$Opções de coparticipação **parcial** (somente terapias) e **total com 30%**.

**Internação:** é cobrado um valor fixo, de acordo com a categoria do beneficiário.

Tabelas específicas por linha (Selecionada, Amil e Adesão) disponíveis no material.$b$, 2),

  ('Prestadores e dependentes', $b$**Prestadores de serviço:** aceita com cópia do Contrato Social e alterações, ou Requerimento do Empresário (selo Jucesp), ou Certificado MEI + contrato de prestação de serviços registrado em cartório e termo aditivo de coligadas.

**Dependentes — cônjuge:** certidão de casamento, união estável (verificar reconhecimento em cartório) ou documento que comprove filho em comum.

**Agregados:** irmão(s), sobrinho(s), neto(s), genro, nora, pai, mãe, padrasto e madrasta — até 69 anos 11 meses e 29 dias.

**Inclusão de novos sócios:** geralmente em até 30 dias (varia conforme o tipo de plano).$b$, 3),

  ('Carências', $b$**Tempo mínimo de plano anterior:** 12 meses desde a data de aquisição. A Amil oferece redução de carência conforme a lista de congêneres.

**Carência contratual (prazos máximos ANS):**
- 24h — urgência/emergência
- 180 dias — cirurgias/internações
- 300 dias — parto a termo
- 24 meses — doenças preexistentes (CPT)

**Redução para terapias:** Não.$b$, 4),

  ('Congêneres', $b$Operadoras adquiridas por uma congênere são equivalentes desde que transcorridos 12 meses da aquisição. Lista por linha de produto:

**Bronze e Bronze Mais:** Allianz, Ampla, Assim Saúde, Bio Saúde (GNDI), Blue, BlueMed (Alvorecer), Bradesco, CarePlus, Clinipam, Hapvida NotreDame/GNDI, HBC Saúde, Med Tour, Mediservice, Nova Saúde (CEAM), Omint, Paraná Clínicas, Plena Saúde, Porto Seguro, Quallity Pró Saúde, Samaritano (PHS), Santa Casa de Mauá, Santa Casa de Santos/Santa Saúde, São Cristóvão, Saúde Beneficência, Select, SulAmérica, Trasmontano, Unimed (todas), Usisaúde, Vera Cruz (2Care), Unity Saúde, Grupo Amil (Ana Costa, Santa Helena, SOBAM/APS), autogestão PETROBRÁS e Caixa Saúde.

**S380, S450, S750, Prata, Ouro, Platinum e Platinum Mais:** Allianz, Assim Saúde, Bradesco, CarePlus, Hapvida NotreDame/GNDI (linhas Advance/Premium/Infinity), Omint, Premium Saúde, Porto Seguro, SulAmérica, Vera Cruz (2Care), Unimed (nacionais), Grupo Amil, autogestão PETROBRÁS.

**Linha One (S2500) e Amil (Black):** Allianz, Bradesco, CarePlus, GNDI, Omint, Porto Seguro, SulAmérica, Unimed (todas), Grupo Amil (Ana Costa, Santa Helena, SOBAM/APS).$b$, 5),

  ('Reembolso', $b$**Possui reembolso**, com tabelas por linha: Adesão, PME (linha selecionada), linha Amil e linha Black (materiais específicos por linha).$b$, 6),

  ('Diferenciais e linha premium', $b$**Diferenciais:** Amil Espaço Saúde, Telemedicina, descontos em farmácias, coleta domiciliar, reembolso e ampla rede de hospitais/laboratórios (varia por plano).

**Linha premium — Amil One:** padrão elevado, com acesso a hospitais de referência como **Sírio-Libanês** e **Albert Einstein**.

**Cobertura internacional:** sim, principalmente via Amil One.
**Retaguarda Einstein:** sim (S2500 e S6500).
**Consultas em hospitais:** sim (além de exames e internações).

**Reajustes:** 2021 7,66% · 2022 19,90% · 2023 23,40% · 2024 21,98% · 2025 15,98%.$b$, 7),

  ('Implantação e vigência', $b$**Prazo de assinatura:** 10 dias corridos após a emissão (se não assinar, expira). Análise ~6 dias; após aceite do risco, contrato enviado para assinatura do responsável. Boleto pode ser pago em até 30 dias.

**Vigência:** 24h após o pagamento do boleto. **Período:** 12 meses.

**Resolução de pendências:** regularizar o quanto antes para a proposta não expirar. Filho prova vínculo. União estável com assinatura reconhecida em cartório. Redução de plano anterior individual/adesão: enviar 3 últimos boletos + 3 comprovantes de pagamento + carteirinha + carta de permanência. Cotação com validade de 1 dia.

**Portabilidade:** não comissiona.$b$, 8),

  ('Cancelamento e cartas de permanência', $b$**Aviso prévio:** é possível cancelar com aviso de **30 dias** desde que o chat apareça no portal. Se o chat não aparecer, o cancelamento só sai pelo portal e o prazo continua **60 dias**.

**Cancelamento (retenção):** aviso prévio de 60 dias — Portal amil.com.br/empresa/#/login.

**Cartas de permanência:**
- **Amil PME (retenção):** envio imediato · Portal amil.com.br/empresa · Tel 3003-1332 (só pelo portal; telefone/chat auxiliam).
- **Golden Cross:** até 5 dias úteis · Tel (11) 3003-1332 (informar que o plano é Golden Cross).
- **Amil Supermed (Adesão):** WhatsApp 21 96595-2590 (opção 1) · envio ~5 dias.

**Portabilidade:** não comissiona.
**Portal do corretor:** [amil.com.br/empresa](https://www.amil.com.br/empresa/#/login)$b$, 9),

  ('Modelo de carta de cancelamento', $b$*Modelo amparado na RN nº 557/2022 da ANS — o beneficiário pode cancelar a qualquer tempo, sem aviso prévio e sem cobrança após o pedido.*

> Prezados,
> Por meio deste e-mail, solicito formalmente o cancelamento do meu plano de saúde, a meu pedido, com efeitos a partir da presente data (ou ao término do período já pago, se aplicável).
> Amparo: RN nº 557/2022 da ANS — cancelamento a qualquer tempo mediante solicitação expressa; vedada a exigência de aviso prévio e a cobrança de mensalidades após o pedido.
> Solicito: confirmação do cancelamento com data efetiva; garantia de inexistência de cobranças posteriores; comprovante formal por escrito.
> Atenciosamente, [Nome] · [CPF] · [Contrato/carteirinha] · [Telefone] · [E-mail]$b$, 10)
) AS t(title, body, ord) WHERE o.name ILIKE 'amil%';


-- ========================= OMINT =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'omint%');
UPDATE operadoras SET
  subtitle = 'Seguradora premium · Somente PJ (CNPJ) · +45 anos no Brasil',
  tags = ARRAY['Seguradora','Premium','Somente PJ','Reembolso']
WHERE name ILIKE 'omint%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$Omint Saúde existe há **mais de 45 anos**; Omint Seguros há mais de 10. Fundada pelo acionista **Juan Carlos Villa Larroudet** (Argentina, 1964), chegou ao Brasil em 1980. **Não possui capital aberto.**

**Faturamento 2023:** R$ 2.297.726,00 (16% superior a 2022).

**Linha do tempo:** 1980 chega ao Brasil · 1999 Clínica Odontológica (1ª do Brasil com JCI) · 2011 Premium Assistance (seguro viagem) · 2015 Omint Seguros.

**Diretoria:** Juan Carlos Villa Larroudet (vice-presidente), André Coutinho (geral), Eduardo Monteiro (saúde), Cícero Barreto (comercial).$b$, 0),

  ('Público e contratação', $b$Comercializa **somente planos PJ (CNPJ)**.
- **ME:** a partir de 01 vida.
- **PME:** 4 a 29 vidas (mínimo 2 titulares com vínculo + 2 dependentes).
- Empresas com composição familiar (pais, irmãos, cônjuge, filhos): exigido mínimo **6 meses** de constituição e vínculo societário.
- Contratações com 1 titular (CNPJ/MEI): mínimo **6 meses** de abertura (180 dias).

**Vigência do contrato:** permanência mínima de **24 meses**.$b$, 1),

  ('Regras comerciais', $b$**Compulsoriedade:** possui tabela Compulsória e Opcional.
> Tabela compulsória: 8% de desconto, permitida a partir de 10 vidas, com 100% dos sócios e 100% do FGTS no plano.

**Idade máxima:** cotação com vidas a partir de 59 anos limitada a 69, não podendo ultrapassar 30% da massa.

> Necessário solicitar **estudo do grupo à Omint** se houver beneficiário/dependente acima de 58 anos 11 meses e 29 dias, ou para grupos a partir de 30 vidas.

**Prestadores de serviço:** aceitos apenas a partir da 11ª vida e não podem ultrapassar 49% do total de vidas.

**Tempo de abertura:** ME/PME 6 meses.$b$, 2),

  ('Coparticipação', $b$Tabela com opção de coparticipação **PME: 20% e 30%** (com limitador de R$ 200,00 para exames de alta complexidade).

> **Não cobra coparticipação para internação.**
> Solicitação obrigatória de estudo à Omint para empresas a partir de 30 vidas.

Valores variam por linha (Skill, Corporate, Premium) — tabela detalhada no material.$b$, 3),

  ('Carências', $b$**Redução de carência:**
- 1 a 9 vidas: análise de acordo com o plano de origem (mínimo 12 meses de plano anterior compatível).
- 10 a 29 vidas: análise conforme lista de congêneres (mínimo 12 meses de plano anterior compatível).$b$, 4),

  ('Congêneres', $b$Allianz, Amil (Blue life, Dix, Lincx, One Health), Bradesco Saúde, Care Plus, Golden Cross, Intermédica/Notre Dame, Porto Saúde, Sompo, SulAmérica, Unimed (Paulistana, Seguros, Central Unimed).$b$, 5),

  ('Dependentes', $b$A escolha de categoria de plano é **livre para o titular** — os dependentes não podem escolher plano diferente do titular.

**Dependentes legais:** cônjuge ou companheiro(a), filhos naturais, adotivos, enteados ou menores sob tutela — **sem limite de idade**.

**Documentos (cônjuge):** cópia do RG, CPF, certidão de casamento ou declaração de convivência marital (modelo Omint), com firma reconhecida do titular e do cônjuge.$b$, 6),

  ('Diferenciais e linha premium', $b$**Todos os planos:** Orientação Médica 24h por telefone (0800 726 4001); Boa Hora (acompanhamento da gestante); cirurgia refrativa sem limite de grau; acupuntura/escleroterapia/RPG/fisioterapia/fonoaudiologia sem limite de sessões; transplantes ampliados; ~4 mil exames/procedimentos sem autorização prévia; assistência nacional em viagem.

**Corporate e Premium:** orientação médica (pediatra) por vídeo; Consulta em Casa (SP e RJ); coleta domiciliar (Fleury, Alta, Lavoisier, Delboni); atendimento internacional em viagem.

**Linhas:** Skill · Corporate (Einstein, Sírio-Libanês) · Premium (Einstein, Sírio-Libanês, Vila Nova Star, com retaguarda). Check-up (Premium) para empresas acima de 4 vidas.

**Reajustes PME:** 2020-21 12,59% · 2021-22 7,67% · 2022-23 18,90% · 2023-24 19,69% · 2024-25 16,71% (média até 29 vidas 15,11%).$b$, 7),

  ('Reembolso e cobertura internacional', $b$**Reembolso** inclusive de despesas médicas no exterior. Prazos:
- **Skill:** 15 dias para consultas, exames simples e demais.
- **Corporate e Premium:** 24h para consultas e exames simples; 5 dias para os demais.

**Cobertura internacional:** Seguro Viagem Internacional da Omint Seguros, sem custo adicional (Premium e Corporate) — Emergências médicas €30.000; odontológicas US$ 2.000.$b$, 8),

  ('Implantação e vigência', $b$**Tempo médio:** mínimo de 15 dias para análise e implantação (a contagem inicia quando o cliente assina a DS e ela é transmitida). Cotação válida por **30 dias**.

**Fluxo:** após a emissão, o cliente recebe e-mail do Omint Portal de Vendas com o formulário eletrônico → análise e aceite das carências → assinatura via DocuSign (prazo 48h) → contrato elaborado → assinatura dos responsáveis → e-mail de boas-vindas na vigência.

**Vigência:** ideal ser sempre dia 01 com pagamento dia 10 (o **pagamento da Omint é sempre dia 10**). Período de 12 ou 24 meses.
> 24 meses: encerramento antes do prazo gera **multa de 3 faturas**.

**Upgrade/Downgrade:** análise após 12 meses.$b$, 9),

  ('Pendências, portabilidade e inclusão', $b$> **Não pode gerar pendência** — o sistema não aceita regularização (mesmo um nº de celular errado obriga refazer o processo).
> E-mail e celular devem estar **no nome do cliente**. Dependente maior de 18 anos: e-mail e celular próprios.

**Docs para redução/compra de carência:**
- Plano anterior empresarial: carta de permanência + carteirinha.
- Individual/adesão: carteirinha + carta de permanência (validade 30 dias) + 3 últimos boletos + 3 comprovantes de pagamento detalhados.

**Portabilidade:** aceita e **comissiona na contratação**.
**Inclusão:** pelo portal do gestor, concluída em até 10 dias.$b$, 10),

  ('Cancelamento e contatos', $b$**Aviso prévio:** 60 dias (conforme condições gerais). No portal não há opção de cancelamento — solicitar por **rc@omint.com.br** com carta em papel timbrado/carimbo, nome por extenso e assinatura do responsável (sem timbre/carimbo, enviar cópia do contrato social; assinatura digital, enviar certificado). Antes, verificar a permanência do contrato (12 ou 24 meses).

**Exclusão de beneficiários:** pelo portal (formulário retirado do portal).

**Carta de permanência:** envio imediato · Tel 0800 726 4115.

**Contatos:** central 0800 726 4000 · associado@omint.com.br · Gestora **Luciana +55 11 91122-7534** · Portal [omint.com.br](https://www.omint.com.br/planos-de-saude/)$b$, 11)
) AS t(title, body, ord) WHERE o.name ILIKE 'omint%';


-- ========================= CARE PLUS =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'care%');
UPDATE operadoras SET
  subtitle = 'Seguradora premium · Grupo Bupa · PME 02 a 29 vidas',
  tags = ARRAY['Seguradora','Premium','Grupo Bupa','Reembolso']
WHERE name ILIKE 'care%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$Desde **2016** integra a **Bupa**, uma das maiores empresas de saúde do mundo (presença em +190 países, +84 mil funcionários).

**No Brasil:** 115 mil (saúde), 79 mil (odontológico), 125 mil (ocupacional), +1.000 clientes corporativos — **maior empresa do segmento premium corporativo do Brasil**.

> Aceitação a partir de **2 titulares sem vínculo familiar entre si**.$b$, 0),

  ('Formação do grupo e regras', $b$**PME de 02 a 29 vidas**, mínimo 2 titulares sem vínculo familiar entre si.
- **Titulares:** sócios ou funcionários com vínculo, até 58 anos 11 meses e 29 dias.
- **Dependentes legais:** cônjuge/companheiro(a); filhos naturais ou adotivos até 29 anos 11 meses e 29 dias.

**Contrato compulsório:** 100% do contrato social e/ou 100% da categoria funcional (FGTS) e 100% dos dependentes. Dispensa de sócio mediante carta declarando plano compatível (modelo Care Plus).

**Regras gerais:** público EPP e LTDA/S.A/ME; constituição mínima de 6 meses; prestadores só acima de 20 vidas (análise do grupo); não permite prestadores de serviço em saúde; não elegível estagiários/agregados; contrato não contributário. Fora de SP, apoio da rede **Mediservice**.$b$, 1),

  ('Entrevista médica e coparticipação', $b$**Entrevista médica:** beneficiários a partir de 59 anos podem realizar avaliação médica agendada pela operadora.

**Coparticipação:**
- 20% em consultas, exames simples e pronto-socorro (PS limitado a R$ 150,00).
- 30% em consultas, exames simples e pronto-socorro (PS limitado a R$ 200,00).$b$, 2),

  ('Documentos', $b$**Empresa:** contrato social + última alteração (ou contrato de EI), cartão CNPJ, guia/relação de FGTS ou rais negativa, comprovante de endereço, declaração de faturamento dos últimos 6 meses (carimbo CNPJ + assinatura do responsável e do contador com CRC), CCM ou comprovante de endereço.

**Titular:** RG, CPF, certidão de nascimento, comprovante de residência e de vínculo empregatício. Recém-admitidos: ficha de registro.

**Cônjuge:** certidão de casamento, RG e CPF. **Companheiro:** RG, CPF + 2 documentos comprobatórios (união estável, filho em comum, etc.).

**Filhos:** naturais (certidão, RG, CPF); adotivos (guarda, RG, CPF); enteado (certidão + casamento dos pais).

> RN 187: CPF obrigatório para todos os titulares (inclusive menores e estrangeiros). DNV obrigatória para nascidos a partir de 01/01/2010.$b$, 3),

  ('Vigência do contrato', $b$**Prazo contratual:** 36 meses a partir do início da vigência.

Rescisão imotivada após os 12 meses iniciais: comunicar à Care Plus com **90 dias** de antecedência e pagar **multa de 3 mensalidades**.

**A Care Plus garante limite de reajuste de no máximo 30%.**$b$, 4),

  ('Carências', $b$> **Acima de 11 vidas:** isenção de carência (exceto parto e CPT).
> **Menos de 10 vidas:** isenção de carência exige 2 anos de plano anterior.$b$, 5),

  ('Diferenciais e coberturas', $b$**Consulta garantida** em até 72h (pediatria, clínica médica, cirurgia geral, GO, endocrinologia).

**Assistência/Seguro Viagem Internacional:** SoHo 30/60 US$ 100.000; SoHo 80+ US$ 300.000. Cobertura Internacional Eletiva a partir do SoHo 60 (sem custo a partir do SoHo 160 — USD 3.000.000, franquia USD 5.000).

**Programas:** Momy Care (gestantes), Personal System (clínicas próprias), Mental Health, Cuidado da Família (TEA, Síndrome de Down), Saúde em Casa (SoHo 60, SP), Care Pharma (desconto farmácias), coleta domiciliar, check-up (SoHo 30/60), Personal Network (SoHo 60), retaguarda Sírio-Libanês e Albert Einstein (SoHo 60).

**Central de atendimento:** 0800 013 2993.$b$, 6),

  ('Reembolso — Care Plus Garante', $b$**Possui reembolso.** Pelo programa **Care Plus Garante**, prazos de processamento:
- Autorização: 24h
- Prévia de reembolso: 24h
- Reembolso até R$ 500: até 3 dias úteis
- Reembolso acima de R$ 500: até 5 dias úteis

> Se os prazos não forem cumpridos, o usuário é bonificado: R$ 100 por autorização/prévia; 5% do reembolso (até R$ 100).$b$, 7)
) AS t(title, body, ord) WHERE o.name ILIKE 'care%';


-- ========================= BRADESCO =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'bradesco%');
UPDATE operadoras SET
  subtitle = 'Seguradora · Capital aberto · ~4 mi de beneficiários · Fundada em 1943',
  tags = ARRAY['Seguradora','Reembolso','Aceita Pleito','Retaguarda Einstein']
WHERE name ILIKE 'bradesco%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$**Linha do tempo:** 1981 Bradesco adquire o Grupo Atlântica Boavista (nasce a Bradesco Seguros e Previdência) · 1983 Bradesco Seguros · 1984 Bradesco Capitalização e **Bradesco Saúde**.

Empresa privada de **capital aberto**, fundada por Amador Aguiar em **1943**. CEO atual: Marcelo Noronha.

**Bradesco Saúde:** cerca de **4 milhões de beneficiários**. Público-alvo: PF, microempreendedores, consorciados, funcionários e sociedade.

> **Bradesco aceita Pleito.**$b$, 0),

  ('Regras comerciais', $b$**Compulsoriedade:** tem tabela compulsória e opcional (usa a compulsória com envio de carteirinha de plano equivalente).

**Idade máxima:** sem limite formal; na prática, aceitação tranquila até 65 anos. A partir de 65, entrevista médica com o time Bradesco.

**Mínimo de vidas:** 3 (podendo ser 1 titular + 2 dependentes). Há tabelas com descontos para grupos maiores/mais de um titular.

**Coparticipação:** com e sem; limite de 30% (tem coparticipação para internações).

> **Empresas recém-abertas:** CNPJ ativo há no mínimo 6 meses.

**Prestadores de serviço:** só em contratos com mínimo 3 titulares e 5 vidas (contrato social, contrato de prestação com vigência mín. 12 meses, 3 últimas NFs, termo de integração).

**Tarifa diferenciada para interior:** sim. **Estagiário:** a partir da 5ª vida. **Funcionário novo:** CTPS digital.$b$, 1),

  ('Dependentes', $b$Cônjuge, companheira, filhos solteiros naturais/adotivos ou enteados com até **39 anos 11 meses e 29 dias**; filhos inválidos (elegíveis para o IR do titular).

**Cônjuge:** cópia de RG e CPF (ou CNH), certidão de casamento ou Escritura Pública de União Estável.

**Crianças até 3 anos:** declaração de saúde complementar pediátrica assinada pelo responsável e pelo pediatra.$b$, 2),

  ('Carências', $b$**Tempo mínimo de plano para redução:** 6 meses.

**Carência contratual:**
- 15 dias — consultas e exames simples
- 180 dias — internação, cirurgia, hemodiálise, quimioterapia, radioterapia e terapias com imunológicos (com DUT)

**Junção de dois planos anteriores:** possível mediante análise.

**Redução para terapias:** sem redução, 180 dias (exceto grupos com mais de 21 vidas: 90 dias).

**Perícia médica:** 65+ realizam avaliação médica antes do fechamento (perícia + DS complementar idoso).$b$, 3),

  ('Reembolso e diferenciais', $b$**Reembolso:** sim (tabelas e regras específicas).
**Retaguarda Einstein:** sim.
**Consultas em hospitais:** sim, em rede específica.

**Meu Doutor:** rede médica preferencial (consultas mais longas, 50% de prioridade na agenda) e segunda opinião médica em casos de cirurgia, com possibilidade de indicação ao Einstein (todos os planos).

**Reajustes:** 2021 9,05% · 2022 19,25% · 2023 23,79% · 2024 20,96% · 2025 15,11%. Faixa etária 58→59: 57%.$b$, 4),

  ('Implantação e vigência', $b$**Tempo médio:** entre 10 e 20 dias (pode variar em análises especiais).

**Prazos por etapa:** cotação 40 dias · envio para análise 40 dias · assinatura da proposta 15 dias · quitação do 1º boleto 60 dias.

**Vigência:** na mesma data da quitação do boleto. **Período:** 12 meses, renovação automática.$b$, 5),

  ('Pendências e portabilidade', $b$**Pendências:** regularizar antes de expirar (não deixar para o fim). Redução máx. 30 dias (não 60). Plano físico/adesão: enviar carteirinha + carta de permanência + último boleto com comprovante.

> **Não aceita junção de cartas** (passível de pleito).

Outras regras: PIS pode ser preenchido com números aleatórios; sinalizar ex-beneficiários Bradesco na emissão (vai para desbloqueio); não precisa certidão de casamento/união estável mesmo sem filhos em comum; sócios casados entre si entram como **1 titular**; não adesão de sócio (tabela compulsória) só com carteirinha do plano atual.

**Portabilidade:** aceita e **comissiona** (Declaração MEI, Carta Conforto, Carta de Portabilidade ANS).$b$, 6),

  ('Cancelamento e contatos', $b$**Exclusão de beneficiários:** formulário **RN 561**, exclusão imediata, conclusão em até 10 dias, pelo sistema **MOVe** (acesso do gestor ou da corretora Pride). Boletos já gerados: abrir chamado no SAC. Sem acesso, apenas o titular pode ligar no **11 4004-2700**.

**Cartas de permanência:** prazo imediato · Tel **4004-2700**.

**Portal:** Bradesco. *(Pós-venda ajuda com exclusões.)*$b$, 7)
) AS t(title, body, ord) WHERE o.name ILIKE 'bradesco%';


-- ========================= BLUE =========================
DELETE FROM operadora_topics WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'blue%');
UPDATE operadoras SET
  subtitle = 'Operadora/seguradora · Startup (2 anos) · 100 mil vidas',
  tags = ARRAY['Operadora','Startup','Sem reembolso','Planos completos']
WHERE name ILIKE 'blue%';

INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $b$Operadora/seguradora (medicina de grupo), **startup com 2 anos**. Fundadores: Izaias Pertrelly e Geisa Lima. **100 mil vidas.**

**Rede própria:** não. **Rede administrada/parceria estratégica:** não.$b$, 0),

  ('Regras comerciais', $b$**Compulsoriedade:** 100% dos sócios ou 100% do FGTS (não aceita parte dos beneficiários, exceto quem comprovar plano anterior ativo).

**Idade máxima:** titular 74 anos 11 meses e 29 dias; dependentes 64a11m29d.

**Mínimo de vidas:** 2. **Com e sem coparticipação:** sim.

**Tempo de abertura:** MEI e ME — mínimo 6 meses.

**Planos:** não há plano só hospitalar — todos são completos (ambulatorial + hospitalar com obstetrícia).

> **NÃO aceita prestador de serviço PJ.** Aceita estagiário.
> Mudança de categoria (upgrade/downgrade): após 12 meses.$b$, 1),

  ('Dependentes e agregados', $b$**Dependentes:** cônjuge/companheiro(a) até 64a11m29d; filhos, enteados, tutelados e menores sob guarda solteiros até 47a11m29d; filhos inválidos sem limite de idade.

**Agregados** (só no ato da inclusão do titular): pai, mãe, padrasto, madrasta, sogro(a) e tio(a) até 63a11m29d; irmão(ã) e genro/nora até 57a11m29d; sobrinho(a) e neto(a) até 47a11m29d.

**Cônjuge:** RG, CPF e certidão de casamento.
**Funcionário novo** (admissão < 45 dias): RG, CPF ou CNH + cópia autenticada da CTPS.$b$, 2),

  ('Carências', $b$**Limite de idade para redução:** 74 anos 11 meses e 29 dias.
**Tempo mínimo de plano anterior:** 12 meses.
**Carência contratual:** sim.
**Redução para terapias:** 150 dias.

Para redução, apresentar somente a **carta de permanência**.$b$, 3),

  ('Diferenciais', $b$**Melhor custo-benefício por região:** melhor opção de entrada na zona norte (Nipo, São Camilo) e na zona oeste (São Camilo Leforte - Morumbi).

**Diferenciais:** desconto em farmácia, telemedicina pelo app e **Plano Amigo Pet** (cobertura de assistência médica veterinária, no produto de abrangência nacional).

**Reembolso:** não oferece. **Linha premium:** não. **Cobertura internacional:** não. **Retaguarda Einstein:** não. **Consultas em hospitais:** não divulgado.$b$, 4),

  ('Implantação e vigência', $b$**Tempo médio:** 3 a 7 dias (depende da agilidade do cliente) — após a proposta emitida, responde a DS e agenda a entrevista.

**Vigência:** em até 72h após a compensação do 1º boleto (vencimento mensal = data de pagamento do 1º boleto). **Período:** 12 meses.

**Pendências:** não gera pendência depois — se anexar documento errado (ex.: para redução), é implantado sem a redução.

Outras regras: dependente maior de idade → e-mail e celular próprios; dependente menor → CPF obrigatório em qualquer idade; não adesão do sócio → só carta de permanência; filho em comum comprova vínculo; união estável reconhecida em cartório (não pode ser assinada pelo GOV).$b$, 5),

  ('Canais e cartas de permanência', $b$**Atendimento:** 0800 608 5888 · 0800 366 7777 · Gama: comercial@saudeblue.com / contato@saudeblue.com · Portal [empresas.bluenacional.com](https://empresas.bluenacional.com/acesso).

**Carta de permanência:** envio imediato · Portal empresas.bluenacional.com (Beneficiários → Ações → Carta de permanência) · WhatsApp 800 366 7777.$b$, 6)
) AS t(title, body, ord) WHERE o.name ILIKE 'blue%';
