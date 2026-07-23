-- ============================================================
-- ALICE — documentação (gerada a partir do PDF "TREINAMENTO ALICE")
-- Rode no SQL editor da Lovable (View Backend > SQL editor > Run).
-- Re-executável: apaga os tópicos anteriores da Alice antes de inserir.
-- ============================================================

-- Remove tópicos anteriores da Alice (evita duplicar se rodar de novo)
DELETE FROM operadora_topics
WHERE operadora_id IN (SELECT id FROM operadoras WHERE name ILIKE 'alice%');

-- Atualiza o cabeçalho da operadora
UPDATE operadoras
SET subtitle = 'Operadora de saúde · PME, MEI e grandes · Fundada em 2019',
    tags = ARRAY['Operadora', 'Sem reembolso', 'Com/sem coparticipação', 'Sem rede própria']
WHERE name ILIKE 'alice%';

-- Insere os tópicos (identifica a operadora Alice pelo nome)
INSERT INTO operadora_topics (operadora_id, title, body, display_order)
SELECT o.id, t.title, t.body, t.ord
FROM operadoras o
CROSS JOIN (VALUES
  ('Visão geral', $$**Perfil:** operadora de saúde fundada em **2019** pelos empreendedores André Florence, Matheus Moraes e Guilherme Azevedo. Capital fechado (sem ações em bolsa) — cerca de 6 anos de mercado.

**Público-alvo:** empresas (PME, MEI e grandes), com foco em quem busca um modelo de saúde moderno e preventivo.

**Participações e coligações:** não faz parte de grupo nem recebeu investimento.

**Rede própria:** não possui. **Reembolso:** não possui.

> ⚠ **Declaração de Saúde:** oriente o cliente a ter muita atenção ao responder a DS. A Alice é bastante criteriosa na análise. Se a cliente informar que pretende engravidar, pode gerar agravo na DS e até cancelamento da proposta por desinteresse comercial.

**Reajustes (histórico anual):**
- 2022 — 10,54%
- 2023 — 13,40%
- 2024 — 11,21%
- 2025 — 11,20%$$, 0),

  ('Regras comerciais', $$**Compulsoriedade**
- **Livre adesão:** sem obrigatoriedade de 100% da população da empresa (sócios, administradores, diretores ou funcionários).
- **Compulsório a partir de 03 vidas:** obrigatória a inclusão de 100% do FGTS.
- **Encampação de massa:** contrato compulsório para contratação dos funcionários com plano anterior.
- **Categoria funcional:** compulsório quando 100% de um cargo/função aderirem, mesmo que não entrem todos os funcionários.
- **Carta de não adesão:** compulsório caso não haja ingresso de todos os funcionários — eles devem assinar carta abrindo mão da adesão, junto à documentação do plano anterior.

A escolha de categoria de plano é livre para titulares e dependentes (informada no cadastro pela Planilha de Cotação e Contratação Alice). Dependentes não precisam ter a mesma categoria do titular.

> **Idade máxima permitida:** 69 anos, 11 meses e 29 dias.
> **Mínimo de vidas:** 1 vida (contrato deve ser com coparticipação de 30%).

**Coparticipação:** possui com e sem coparticipação.

**Prestadores de serviço:** aceita 100% de prestadores PJ, podendo ser MEI recém-aberto (cópia do contrato social e do contrato assinado entre as partes).

**Funcionário novo:** deve comprovar vínculo empregatício.

**Tempo de abertura da empresa:** MEI precisa ter no mínimo 6 meses; LTDA recém-aberto comercializa a partir de 1 vida.

**Inclusão de novos sócios:** de 1 a 2 dias úteis após a aprovação da documentação.

**Tarifa diferenciada para interior:** sim, o preço varia conforme a região.

**Agrava no contador:** não.$$, 1),

  ('Coparticipação', $$O valor de coparticipação total é **fixo para consultas e internação** e de **30% do custo** do procedimento para os demais eventos de saúde, com **teto por procedimento e por plano**.

No modelo de **coparticipação de terapias**, o valor é de **30% do custo da terapia**, com teto por evento e por plano.$$, 2),

  ('Carências', $$**Entrevista médica:** todos os beneficiários passam por entrevista médica por vídeo.

**Carência contratual:**
- **24h** — consultas em pronto-socorro e internações por acidentes pessoais
- **60 dias** — terapias e exames especiais
- **90 dias** — internações de U/E não decorrentes de acidentes
- **180 dias** — internações eletivas e PACs
- **300 dias** — parto
- **730 dias** — CPT (Cobertura Parcial Temporária)

**Redução de carência**
- Limite de idade: 69 anos, 11 meses e 29 dias
- Tempo mínimo de plano anterior: **1 ano**
- **Redução pelo grupo:** possível, conforme o tempo de permanência em planos anteriores.

**Junção entre planos anteriores:** a Alice permite aproveitamento/redução de carências de planos anteriores (portabilidade de carências) — muda de plano sem cumprir todos os prazos novamente. *(Não comissiona.)*

**Redução para terapias:**
- Redução parcial (6 meses de plano anterior): redução de 30 dias.
- Redução total (12 meses de plano anterior): sem carência.$$, 3),

  ('Dependentes', $$**Quem pode ser dependente:**
- Cônjuge ou companheiro(a)
- Filhos naturais e/ou adotivos, enteados solteiros, ou menores sob tutela do titular
- Idade limitada até 69 anos, 11 meses e 29 dias

**Documentos (cônjuge/agregados):** cópia do RG, CPF, certidão de casamento ou declaração de convivência marital — obrigatório reconhecer firma da assinatura do titular e do cônjuge/companheiro(a).$$, 4),

  ('Congêneres', $$Allianz, Amil, Blue (Integra), Blue Med (Alvorecer), Bradesco, Care Plus, Omint, Mediservice, Porto, Sami, SulAmérica, São Cristóvão, Trasmontano, Unimed, Vera Cruz, Ampla Saúde, Fundação Itaú, MedSenior, Onmed, Porto Med, Proasa Saúde e Select Saúde.$$, 5),

  ('Reembolso', $$**Não possui reembolso.**

**Cobertura internacional:** não possui.$$, 6),

  ('Diferenciais e linha premium', $$Melhor custo-benefício por hospitais/laboratórios e região (ex.: Alice Efetivo + Fleury; Porto Ouro + Sírio; Alice Efetivo na zona norte já atende Nipo e São Camilo).

**Diferenciais:** gestão proativa de saúde e possibilidade de mesclar planos (titular em plano top e dependente em plano simples).

**Plano Exclusivo Mais + L.E:** além dos laboratórios descritos, acrescenta atendimento de laboratório nas unidades do **Albert Einstein**.

**Linha premium — o beneficiário tem acesso a:**
- **Time de Saúde** — médicos e enfermeiros focados na jornada de saúde desde o primeiro dia.
- **Alice Agora** — atendimento 24h; o Time de Saúde atende, resolve, ou encaminha para a Casa Alice, PS ou especialista.
- **Especialistas Alice** — profissionais selecionados, com experiência de consulta particular e menor reajuste.

**Retaguarda Einstein:** sim. **Consultas em hospitais:** sim.$$, 7),

  ('Rede credenciada', $$Consulte a rede credenciada e os prestadores no site oficial:
[Rede credenciada Alice](https://alice.com.br/rede-credenciada/prestadores)

> ⚠ **Atenção:** ao acessar o link existe um botão "Fazer cotação". Se o cliente clicar nessa opção, o atendimento pode ser direcionado para **outro corretor**. Oriente o cliente a utilizar **apenas a consulta** da rede credenciada.$$, 8),

  ('Implantação e vigência', $$**Tempo médio:** após a emissão, 7 a 10 dias para concluir o processo (varia conforme a agilidade do cliente).

**Fluxo de implantação:**
1. (Corretor) Envio da proposta
2. (Alice) Análise de documentos (pendências)
3. (Alice) Análise de risco (CNPJ, dados contratuais)
4. (Alice) Confirmação da proposta ao cliente
5. (Cliente) Baixa o app para iniciar a proposta
6. (Cliente/app) CPF + Declaração de Saúde (titulares e maiores de 16 anos com o próprio CPF)
7. (Cliente/app) Entrevista com enfermeiro (todos, incluindo crianças)
8. (Alice) Análise de CPT
9. (Cliente/app) Assinatura do contrato de CPT
10. (Alice) Elaboração e envio do contrato
11. (Cliente/e-mail) Assinatura do contrato empresarial
12. (Alice) Emissão e envio do boleto de ativação
13. (Cliente) Pagamento do boleto
14. (Alice) Revisão de dados e implantação

**Vigência/Vencimento:** a vigência da empresa é a data de quitação do 1º boleto, assim como o vencimento mensal.

**Vigência do contrato:** prazo mínimo de permanência de **12 meses**, com renovação automática.

**Inclusão:** feita pelo app Alice → botão "Alice Agora" → nova conversa → assuntos administrativos.

**Aviso prévio:** o contrato prevê 60 dias; na prática a Alice não cobra em grupos menores de 05 vidas.

**Portabilidade:** não comissiona.

**Resolução de pendências:** inicia pelo contato direto com a operadora nos canais oficiais.$$, 9),

  ('Cancelamento e contatos', $$**Cancelamento da apólice:** pelo app → botão "Alice Agora" → nova conversa → assuntos administrativos.

**Cartas de permanência:** disponíveis no aplicativo. *(Se o cliente estiver inadimplente, solicitar pelo e-mail help_center@alice.com.br.)*

**Portal do corretor:** [alice.com.br/corretores](https://alice.com.br/corretores)$$, 10)
) AS t(title, body, ord)
WHERE o.name ILIKE 'alice%';
