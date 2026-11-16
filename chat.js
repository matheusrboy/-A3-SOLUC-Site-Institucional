/* A3 SOLUC — Assistente de dúvidas (chat de perguntas frequentes, sem IA).
   - Não envia nenhum dado para servidores: tudo roda no navegador.
   - Só monta o painel quando a pessoa clica no botão (não pesa no carregamento).
   - Respostas vêm do conteúdo do próprio site; casos específicos vão para a equipe. */
(() => {
  'use strict';
  if (window.__a3Chat) return;
  window.__a3Chat = true;

  const WA = '5511913298952';
  const MAIL = 'a3soluc.contabil@gmail.com';
  const isEn = () => document.documentElement.lang.toLowerCase().startsWith('en');

  /* ---------- Conteúdo (revisar com o cliente antes de publicar) ---------- */
  const S = {
    pt: {
      open: 'Tirar uma dúvida', title: 'Assistente A3', sub: 'Respostas rápidas sobre a A3 SOLUC',
      close: 'Fechar assistente', placeholder: 'Escreva sua dúvida…', send: 'Enviar',
      hello: 'Olá! Sou o assistente da A3 SOLUC. Posso tirar dúvidas gerais sobre nossos serviços e como trabalhamos. Escolha um tema ou escreva sua pergunta.',
      note: 'Respostas gerais, sem análise do seu caso. Para orientação específica, nossa equipe atende você.',
      wa: 'Falar com a equipe no WhatsApp', mail: 'Enviar e-mail',
      fallback: 'Não encontrei uma resposta pronta para isso. Como pode depender do seu caso, o melhor é falar direto com a nossa equipe.',
      waText: 'Olá, vim pelo site da A3 SOLUC e tenho uma dúvida', waDoubt: '. Minha dúvida: ',
      back: 'Ver outros temas', more: 'Saiba mais', other: 'Outro assunto', teaser: 'Olá! Posso tirar suas dúvidas?', teaserClose: 'Dispensar aviso',
      quoteText: (n) => 'Olá, vim pelo site da A3 SOLUC e gostaria de um orçamento de ' + n + '.',
      quoteReply: (n) => 'Certo, ' + n + '. O valor depende do porte e das rotinas da sua empresa, então a equipe prepara um orçamento sob medida. Toque abaixo para chamar no WhatsApp com o serviço já indicado.', mailHref: 'https://mail.google.com/mail/?view=cm&fs=1&to=' + MAIL,
      svc: (s) => '/servicos/' + s, home: '/', cnpj: '/#consulta-cnpj'
    },
    en: {
      open: 'Ask a question', title: 'A3 Assistant', sub: 'Quick answers about A3 SOLUC',
      close: 'Close assistant', placeholder: 'Type your question…', send: 'Send',
      hello: 'Hello! I am the A3 SOLUC assistant. I can answer general questions about our services and how we work. Pick a topic or type your question.',
      note: 'General answers, not an analysis of your case. For specific guidance, our team will help you.',
      wa: 'Talk to the team on WhatsApp', mail: 'Send an email',
      fallback: 'I could not find a ready answer for that. Since it may depend on your case, the best step is to talk to our team directly.',
      waText: 'Hello, I came from the A3 SOLUC website and have a question', waDoubt: '. My question: ',
      back: 'See other topics', more: 'Learn more', other: 'Something else', teaser: 'Hi! Can I answer your questions?', teaserClose: 'Dismiss notice',
      quoteText: (n) => 'Hello, I came from the A3 SOLUC website and would like a quote for ' + n + '.',
      quoteReply: (n) => 'Got it, ' + n + '. The price depends on your company size and routines, so the team prepares a tailored quote. Tap below to message us on WhatsApp with the service already selected.', mailHref: 'https://mail.google.com/mail/?view=cm&fs=1&to=' + MAIL,
      svc: (s) => '/en/services/' + s, home: '/en/', cnpj: '/en/#consulta-cnpj'
    }
  };

  // Opções numeradas do menu de orçamento (n = número digitável)
  const MENU = [
    { pt: 'Fiscal', en: 'Tax', ps: 'fiscal', es: 'tax' },
    { pt: 'Contábil', en: 'Accounting', ps: 'contabil', es: 'accounting' },
    { pt: 'RH e Departamento Pessoal', en: 'HR and Payroll', ps: 'departamento-pessoal', es: 'hr-payroll' },
    { pt: 'Abertura e alteração de empresa', en: 'Opening or changing a company', ps: 'paralegal-societario', es: 'corporate' },
    { pt: 'MEI e pequenos negócios', en: 'MEI and small business', ps: 'mei-pequenos-negocios', es: 'mei-small-business' },
    { pt: 'Imposto de Renda (pessoa física)', en: 'Individual income tax', ps: 'imposto-de-renda', es: 'income-tax' }
  ];

  // Cada item: chip (rótulo do botão), keys (palavras para busca, sem acento), a (resposta), link (slug de serviço ou rota)
  const FAQ = {
    pt: [
      { id: 'servicos', chip: 'Quais serviços vocês oferecem?', keys: ['servico', 'servicos', 'oferecem', 'fazem', 'trabalham', 'atuam', 'o que voces'],
        a: 'Atuamos nas rotinas fiscal, contábil, de RH e Departamento Pessoal e paralegal/societária. Também atendemos MEI e pequenos negócios e fazemos Imposto de Renda de Pessoa Física.', link: ['servicos', 'index'] },
      { id: 'fiscal', chip: 'O que é o serviço fiscal?', keys: ['fiscal', 'tributo', 'tributos', 'imposto', 'impostos', 'nota fiscal', 'notas fiscais', 'nf', 'enquadramento', 'simples nacional', 'regime'],
        a: 'No fiscal cuidamos da apuração de tributos, do acompanhamento das obrigações fiscais, da análise de enquadramento tributário e da orientação sobre emissão de notas fiscais.', link: ['fiscal'] },
      { id: 'contabil', chip: 'O que é o serviço contábil?', keys: ['contabil', 'contabilidade', 'balanco', 'balancete', 'escrituracao', 'demonstracoes', 'demonstracao', 'contador'],
        a: 'No contábil fazemos a escrituração, as demonstrações contábeis e a análise de balancetes, com informações para apoiar a gestão da sua empresa.', link: ['contabil'] },
      { id: 'dp', chip: 'Vocês fazem folha de pagamento?', keys: ['folha', 'pagamento', 'funcionario', 'funcionarios', 'empregado', 'admissao', 'ferias', 'rescisao', 'demissao', 'encargos', 'trabalhista', 'trabalhistas', 'rh', 'departamento pessoal', 'dp', 'clt', 'contratar'],
        a: 'Sim. No RH e Departamento Pessoal cuidamos de admissão, férias, rescisão, folha de pagamento, encargos e obrigações trabalhistas.', link: ['departamento-pessoal'] },
      { id: 'empresa', chip: 'Como abrir ou alterar uma empresa?', keys: ['abrir empresa', 'abertura', 'abrir', 'cnpj novo', 'alterar', 'alteracao', 'regularizar', 'regularizacao', 'paralegal', 'societario', 'contrato social', 'junta', 'registro', 'cadastro', 'cadastros', 'fechar empresa', 'baixa'],
        a: 'Cuidamos da abertura, alteração e regularização de empresas, e acompanhamos cadastros e processos perante os órgãos competentes. Os documentos e passos dependem do tipo de empresa e da atividade, e a nossa equipe orienta você em cada etapa.', link: ['paralegal-societario'] },
      { id: 'mei', chip: 'Atendem MEI?', keys: ['mei', 'microempreendedor', 'pequeno negocio', 'pequenos negocios', 'microempresa', 'autonomo'],
        a: 'Sim. Fazemos a abertura e a regularização de MEI, acompanhamos as obrigações e orientamos na transição para microempresa quando isso for necessário.', link: ['mei-pequenos-negocios'] },
      { id: 'irpf', chip: 'Fazem Imposto de Renda?', keys: ['imposto de renda', 'irpf', 'declaracao', 'declarar', 'restituicao', 'pessoa fisica', 'malha'],
        a: 'Sim. Preparamos e entregamos a declaração de Imposto de Renda de Pessoa Física, conferimos as informações e orientamos sobre pendências.', link: ['imposto-de-renda'] },
      { id: 'quem', chip: 'Quem vocês atendem?', keys: ['quem', 'atendem', 'atendemos', 'publico', 'empresas', 'empreendedor', 'empreendedores', 'cliente', 'clientes', 'para quem'],
        a: 'Atendemos empresas, empreendedores, MEIs e pequenos negócios, e também pessoa física, no caso do Imposto de Renda.' },
      { id: 'como', chip: 'Como é o atendimento?', keys: ['atendimento', 'como funciona', 'como trabalham', 'reuniao', 'reunioes', 'acompanhamento', 'rapido', 'proximo', 'diferencial', 'diferenciais', 'processo'],
        a: 'Nosso atendimento é rápido, próximo e eficaz. Construímos a solução em conjunto com você e fazemos reuniões de acompanhamento de todos os processos, para você decidir com mais clareza.' },
      { id: 'cnpj', chip: 'O que é a consulta de CNPJ do site?', keys: ['consulta', 'consultar', 'pre-analise', 'pre analise', 'tarefas', 'cnpj', 'minha empresa', 'ferramenta'],
        a: 'É uma ferramenta do site: você informa o CNPJ, ela busca dados cadastrais públicos e mostra quais frentes a A3 pode revisar com a sua empresa. É uma pré-análise, não um diagnóstico definitivo.', link: ['#cnpj'] },
      { id: 'preco', chip: 'Quanto custa?', keys: ['preco', 'precos', 'valor', 'valores', 'custa', 'custo', 'quanto', 'orcamento', 'mensalidade', 'honorario', 'honorarios', 'cobram', 'cobranca', 'plano', 'planos'],
        a: 'Os valores dependem do porte da empresa e das rotinas envolvidas, então não temos uma tabela única. Para qual serviço você quer um orçamento? Toque numa opção ou digite o número.', menu: true },
      { id: 'contato', chip: 'Onde fica e como falo com vocês?', keys: ['onde', 'endereco', 'fica', 'localizacao', 'mapa', 'contato', 'telefone', 'whatsapp', 'whats', 'email', 'e-mail', 'instagram', 'falar', 'chegar', 'sao bernardo'],
        a: 'Ficamos na Rua José Versolato, 111, Bloco B, Sala 1101, São Bernardo do Campo, SP, CEP 09750-730. WhatsApp: +55 11 91329-8952. E-mail: ' + MAIL + '. Instagram: @a3contabilidades.', contact: true },
      { id: 'especifico', hidden: true, keys: ['multa', 'devo', 'posso', 'preciso pagar', 'atrasado', 'atraso', 'divida', 'debito', 'processo', 'fiscalizacao', 'notificacao', 'deduzir', 'vale a pena', 'melhor regime', 'qual regime'],
        a: 'Esse tipo de dúvida depende da situação de cada empresa ou pessoa, e não é adequado responder de forma genérica. Nossa equipe analisa o seu caso e orienta você com segurança.', contact: true }
    ],
    en: [
      { id: 'servicos', chip: 'What services do you offer?', keys: ['service', 'services', 'offer', 'do you do'],
        a: 'We work on tax, accounting, HR and payroll, and corporate/legal registration routines. We also serve MEI and small businesses and prepare individual income tax returns.', link: ['services', 'index'] },
      { id: 'fiscal', chip: 'What is the tax service?', keys: ['tax', 'taxes', 'fiscal', 'invoice', 'invoices', 'nf', 'tax regime', 'simples'],
        a: 'In tax we handle tax calculation, follow-up of tax obligations, analysis of the right tax regime, and guidance on issuing invoices.', link: ['tax'] },
      { id: 'contabil', chip: 'What is the accounting service?', keys: ['accounting', 'accountant', 'bookkeeping', 'balance', 'statements', 'financial statements'],
        a: 'In accounting we do bookkeeping, financial statements and trial balance analysis, with information to support your company management.', link: ['accounting'] },
      { id: 'dp', chip: 'Do you handle payroll?', keys: ['payroll', 'employee', 'employees', 'hiring', 'vacation', 'termination', 'hr', 'labor', 'labour', 'human resources', 'personnel'],
        a: 'Yes. In HR and payroll we handle hiring, vacation, termination, payroll, charges and labor obligations.', link: ['hr-payroll'] },
      { id: 'empresa', chip: 'How do I open or change a company?', keys: ['open company', 'open a company', 'opening', 'register', 'registration', 'change company', 'corporate', 'legal', 'incorporate', 'close company', 'regularize'],
        a: 'We handle opening, changing and regularizing companies, and follow registrations and processes with the competent agencies. Documents and steps depend on the company type and activity, and our team guides you through each stage.', link: ['corporate'] },
      { id: 'mei', chip: 'Do you serve MEI?', keys: ['mei', 'microentrepreneur', 'small business', 'small businesses', 'freelancer', 'sole'],
        a: 'Yes. We handle MEI registration and regularization, follow its obligations and guide the transition to a micro company when needed.', link: ['mei-small-business'] },
      { id: 'irpf', chip: 'Do you prepare income tax returns?', keys: ['income tax', 'irpf', 'tax return', 'return', 'refund', 'individual'],
        a: 'Yes. We prepare and file individual income tax returns, check the information and guide you on pending issues.', link: ['income-tax'] },
      { id: 'quem', chip: 'Who do you serve?', keys: ['who', 'clients', 'customers', 'audience', 'for whom'],
        a: 'We serve companies, entrepreneurs, MEI and small businesses, and also individuals for income tax.' },
      { id: 'como', chip: 'How does your service work?', keys: ['how does', 'how do you work', 'meeting', 'meetings', 'follow-up', 'follow up', 'fast', 'process', 'differential'],
        a: 'Our service is fast, close and effective. We build the solution together with you and hold follow-up meetings on all processes, so you can decide with more clarity.' },
      { id: 'cnpj', chip: 'What is the CNPJ lookup?', keys: ['lookup', 'check', 'cnpj', 'pre-analysis', 'tasks', 'tool'],
        a: 'It is a tool on the site: you enter the CNPJ, it fetches public registration data and shows which areas A3 can review with your company. It is a preliminary analysis, not a final diagnosis.', link: ['#cnpj'] },
      { id: 'preco', chip: 'How much does it cost?', keys: ['price', 'prices', 'cost', 'costs', 'fee', 'fees', 'how much', 'quote', 'budget', 'plan', 'plans', 'pricing'],
        a: 'Fees depend on the company size and the routines involved, so there is no single price list. Which service would you like a quote for? Tap an option or type the number.', menu: true },
      { id: 'contato', chip: 'Where are you and how do I reach you?', keys: ['where', 'address', 'location', 'map', 'contact', 'phone', 'whatsapp', 'email', 'instagram', 'reach', 'sao bernardo'],
        a: 'We are at Rua José Versolato, 111, Block B, Room 1101, São Bernardo do Campo, SP, Brazil, ZIP 09750-730. WhatsApp: +55 11 91329-8952. Email: ' + MAIL + '. Instagram: @a3contabilidades.', contact: true },
      { id: 'especifico', hidden: true, keys: ['fine', 'penalty', 'should i', 'can i', 'must i', 'overdue', 'debt', 'audit', 'notice', 'deduct', 'worth it', 'best regime', 'which regime'],
        a: 'This kind of question depends on each company or person, so a generic answer would not be appropriate. Our team can analyze your case and guide you safely.', contact: true }
    ]
  };

  /* ---------- Estilo (injetado só uma vez; segue a identidade escura/dourada) ---------- */
  const CSS = `
.a3c-trigger{position:fixed;right:20px;bottom:212px;z-index:380;width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:#111314;color:#f3f0e8;display:grid;place-items:center;cursor:pointer;box-shadow:0 12px 32px rgba(0,0,0,.36);transition:transform .2s ease,border-color .2s ease,background .2s ease;padding:0}
.a3c-trigger:hover,.a3c-trigger:focus-visible{transform:translateY(-2px);border-color:rgba(213,188,124,.46);background:#181a1c}
.a3c-trigger:focus-visible,.a3c-btn:focus-visible,.a3c-chip:focus-visible,.a3c-close:focus-visible,.a3c-input:focus-visible,.a3c-link:focus-visible{outline:3px solid rgba(213,188,124,.35);outline-offset:2px}
.a3c-trigger svg{width:22px;height:22px;fill:none;stroke:#d5bc7c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.a3c-trigger.a3c-low{bottom:84px}
.a3c-teaser{position:fixed;z-index:381;display:flex;align-items:center;max-width:min(260px,calc(100vw - 100px));background:#17191b;color:#f2f1ed;border:1px solid rgba(213,188,124,.4);border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.45);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.a3c-teaser[hidden]{display:none}
.a3c-teaser-open{flex:1;background:transparent;border:0;color:inherit;font:inherit;font-size:13.5px;line-height:1.35;text-align:left;padding:11px 4px 11px 14px;cursor:pointer}
.a3c-teaser-x{flex:none;width:30px;height:30px;margin-right:4px;background:transparent;border:0;border-radius:50%;color:#9a9ea3;font-size:18px;line-height:1;cursor:pointer}
.a3c-teaser-x:hover{color:#f2f1ed}
.a3c-teaser-open:focus-visible,.a3c-teaser-x:focus-visible{outline:3px solid rgba(213,188,124,.35);outline-offset:2px}
.a3c-panel{position:fixed;right:84px;bottom:20px;z-index:381;width:372px;max-width:calc(100vw - 104px);height:min(600px,calc(100dvh - 40px));display:flex;flex-direction:column;background:#0c0d0e;color:#f2f1ed;border:1px solid rgba(255,255,255,.12);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.55);overflow:hidden;font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.a3c-panel[hidden]{display:none}
.a3c-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 14px 18px;border-bottom:1px solid rgba(255,255,255,.08);background:#101112}
.a3c-head strong{display:block;font-size:15px;font-weight:600;letter-spacing:.01em}
.a3c-head small{display:block;margin-top:2px;font-size:12px;color:#9a9ea3}
.a3c-close{width:34px;height:34px;flex:none;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:transparent;color:#f2f1ed;font-size:20px;line-height:1;cursor:pointer}
.a3c-close:hover{border-color:rgba(213,188,124,.46)}
.a3c-log{flex:1;overflow-y:auto;padding:16px 16px 6px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
.a3c-msg{max-width:88%;padding:10px 13px;border-radius:16px;font-size:14px;line-height:1.5;overflow-wrap:anywhere}
.a3c-bot{align-self:flex-start;background:#17191b;border:1px solid rgba(255,255,255,.07);border-bottom-left-radius:5px}
.a3c-user{align-self:flex-end;background:#b8924f;color:#14110a;border-bottom-right-radius:5px}
.a3c-chips{display:flex;flex-wrap:wrap;gap:7px;padding:2px 0 4px}
.a3c-chip{border:1px solid rgba(213,188,124,.34);background:transparent;color:#e6d5a6;font:inherit;font-size:13px;line-height:1.3;padding:7px 11px;border-radius:999px;cursor:pointer;text-align:left}
.a3c-chip:hover{background:rgba(213,188,124,.1);border-color:rgba(213,188,124,.6)}
.a3c-opts{display:flex;flex-direction:column;gap:6px;margin-top:10px}
.a3c-opt{display:flex;align-items:center;gap:10px;width:100%;border:1px solid rgba(213,188,124,.34);background:transparent;color:#f2f1ed;font:inherit;font-size:13px;line-height:1.3;padding:8px 11px;border-radius:12px;cursor:pointer;text-align:left}
.a3c-opt:hover{background:rgba(213,188,124,.1);border-color:rgba(213,188,124,.6)}
.a3c-opt:focus-visible{outline:3px solid rgba(213,188,124,.35);outline-offset:2px}
.a3c-opt b{flex:none;width:22px;height:22px;border-radius:50%;background:#b8924f;color:#14110a;display:grid;place-items:center;font-size:12px}
.a3c-actions{display:flex;flex-direction:column;gap:7px;margin-top:10px}
.a3c-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:999px;font:inherit;font-size:13px;font-weight:600;padding:9px 14px;text-decoration:none;cursor:pointer;border:1px solid transparent}
.a3c-btn-wa{background:#25D366;color:#06210f}
.a3c-btn-wa:hover{background:#1ebe5d}
.a3c-btn-ghost{background:transparent;color:#f2f1ed;border-color:rgba(255,255,255,.18)}
.a3c-btn-ghost:hover{border-color:rgba(213,188,124,.5)}
.a3c-link{color:#d5bc7c;font-size:13px;text-decoration:underline;text-underline-offset:3px}
.a3c-form{display:flex;gap:8px;padding:12px 14px 6px;border-top:1px solid rgba(255,255,255,.08)}
.a3c-input{flex:1;min-width:0;background:#141516;color:#f2f1ed;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:11px 15px;font:inherit;font-size:16px}
.a3c-input::placeholder{color:#7d8186}
.a3c-send{flex:none;border:0;border-radius:999px;background:#b8924f;color:#14110a;font:inherit;font-size:13px;font-weight:700;padding:0 16px;cursor:pointer}
.a3c-send:hover{background:#d5bc7c}
.a3c-note{margin:0;padding:6px 18px 14px;font-size:11.5px;line-height:1.4;color:#7d8186}
@media (max-width:768px){
.a3c-trigger.a3c-low{bottom:calc(74px + env(safe-area-inset-bottom))}
.a3c-trigger{right:max(14px,env(safe-area-inset-right));bottom:calc(194px + env(safe-area-inset-bottom));width:48px;height:48px}
.a3c-panel{right:12px;left:12px;bottom:12px;width:auto;max-width:none;height:min(78dvh,640px);border-radius:20px}
}
html.a11y-reduce-motion .a3c-trigger,html.a11y-reduce-motion .a3c-log{transition:none;scroll-behavior:auto}
body.a11y-high-contrast .a3c-panel{background:#000;border-color:#fff}
body.a11y-high-contrast .a3c-bot{background:#000;border-color:#fff}
`;

  /* ---------- Utilidades ---------- */
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const lang = () => (isEn() ? 'en' : 'pt');

  const find = (query, items) => {
    const q = ' ' + norm(query) + ' ';
    let best = null, bestScore = 0;
    items.forEach((item) => {
      let score = 0;
      item.keys.forEach((k) => {
        const nk = norm(k);
        if (!nk) return;
        // palavra inteira para termos curtos (evita "me" casar com "mensagem"); trecho para frases
        const hit = nk.length <= 3 || !nk.includes(' ') ? q.includes(' ' + nk + ' ') : q.includes(nk);
        if (hit) score += nk.includes(' ') ? 2 : 1;
      });
      if (item.id === 'especifico') score += 0.5; // desempata a favor de encaminhar à equipe
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return bestScore >= 1 ? best : null;
  };

  /* ---------- Botão (leve) + painel (montado no primeiro clique) ---------- */
  const trigger = el('button', 'a3c-trigger');
  trigger.type = 'button';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'a3c-panel');
  trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-3.9A8 8 0 1 1 20 12Z"></path><path d="M9 11h6M9 14h3.5"></path></svg>';
  const setTriggerLabel = () => trigger.setAttribute('aria-label', S[lang()].open);
  setTriggerLabel();

  const FLAG = 'a3-chat-dismissed';
  const dismissed = () => { try { return sessionStorage.getItem(FLAG) === '1'; } catch (_) { return false; } };
  const markDismissed = () => { try { sessionStorage.setItem(FLAG, '1'); } catch (_) {} };
  let teaser = null;
  let panel, log, input, built = false, builtLang = null, lastQuestion = '', pendingMenu = false;

  const style = el('style'); style.textContent = CSS; document.head.appendChild(style);
  // Home tem a pilha completa (acessibilidade, idioma, WhatsApp); páginas internas só têm acessibilidade.
  if (!document.querySelector('.floating-whatsapp')) trigger.classList.add('a3c-low');
  document.body.appendChild(trigger);

  const scroll = () => { log.scrollTop = log.scrollHeight; };
  const say = (text, who) => { const m = el('div', 'a3c-msg a3c-' + who, text); log.appendChild(m); scroll(); return m; };

  const waLink = (custom) => {
    const t = S[lang()];
    let text = custom || t.waText;
    if (!custom && lastQuestion) text += t.waDoubt + lastQuestion.slice(0, 220);
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(/[.?!]$/.test(text) ? text : text + '.');
  };

  const contactActions = (parent, customWa) => {
    const t = S[lang()];
    const box = el('div', 'a3c-actions');
    const wa = el('a', 'a3c-btn a3c-btn-wa', t.wa); wa.href = waLink(customWa); wa.target = '_blank'; wa.rel = 'noopener';
    const mail = el('a', 'a3c-btn a3c-btn-ghost', t.mail); mail.href = t.mailHref; mail.target = '_blank'; mail.rel = 'noopener noreferrer';
    box.append(wa, mail); parent.appendChild(box);
  };

  const chips = () => {
    const l = lang(), t = S[l];
    const wrap = el('div', 'a3c-chips'); wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', t.back);
    FAQ[l].filter((i) => !i.hidden).forEach((item) => {
      const b = el('button', 'a3c-chip', item.chip); b.type = 'button';
      b.addEventListener('click', () => { wrap.remove(); ask(item.chip, item); });
      wrap.appendChild(b);
    });
    log.appendChild(wrap); scroll();
  };

  const answer = (item) => {
    const l = lang(), t = S[l];
    const m = say(item ? item.a : t.fallback, 'bot');
    if (item && item.link) {
      const [slug, sub] = item.link;
      const href = slug === '#cnpj' ? t.cnpj : (sub === 'index' ? (l === 'en' ? '/en/services' : '/servicos') : t.svc(slug));
      const a = el('a', 'a3c-link', t.more + ' →'); a.href = href;
      const row = el('div', 'a3c-actions'); row.appendChild(a); m.appendChild(row);
    }
    pendingMenu = Boolean(item && item.menu);
    if (pendingMenu) {
      const list = el('div', 'a3c-opts'); list.setAttribute('role', 'group'); list.setAttribute('aria-label', l === 'en' ? 'Services' : 'Serviços');
      MENU.forEach((o, i) => {
        const b = el('button', 'a3c-opt'); b.type = 'button';
        b.append(el('b', null, String(i + 1)), el('span', null, o[l]));
        b.addEventListener('click', () => pick(i + 1));
        list.appendChild(b);
      });
      const other = el('button', 'a3c-opt'); other.type = 'button';
      other.append(el('b', null, String(MENU.length + 1)), el('span', null, t.other));
      other.addEventListener('click', () => pick(MENU.length + 1));
      list.appendChild(other); m.appendChild(list);
      log.scrollTop = Math.max(0, m.offsetTop - 12); // mostra o início da pergunta junto com as opções
      return;
    }
    if (!item || item.contact) contactActions(m);
    finishRow();
  };

  const finishRow = () => {
    const t = S[lang()];
    const back = el('button', 'a3c-chip', t.back); back.type = 'button';
    back.addEventListener('click', () => { back.remove(); chips(); });
    const wrap = el('div', 'a3c-chips'); wrap.appendChild(back); log.appendChild(wrap); scroll();
  };

  // Escolha de um serviço no menu de orçamento (n de 1 a MENU.length; o último número é "outro assunto")
  const pick = (n) => {
    const l = lang(), t = S[l];
    pendingMenu = false;
    log.querySelectorAll('.a3c-chips').forEach((c) => c.remove());
    log.querySelectorAll('.a3c-opt').forEach((b) => { b.disabled = true; });
    const opt = MENU[n - 1];
    say(opt ? n + ' · ' + opt[l] : n + ' · ' + t.other, 'user');
    lastQuestion = '';
    const calm = document.documentElement.classList.contains('a11y-reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      if (!opt) { const m = say(t.fallback, 'bot'); contactActions(m); finishRow(); return; }
      const m = say(t.quoteReply(opt[l]), 'bot');
      contactActions(m, t.quoteText(opt[l]));
      const href = l === 'en' ? '/en/services/' + opt.es : '/servicos/' + opt.ps;
      const a = el('a', 'a3c-link', t.more + ' →'); a.href = href;
      const row = el('div', 'a3c-actions'); row.appendChild(a); m.appendChild(row);
      finishRow();
    }, calm ? 0 : 350);
  };

  const ask = (text, forced) => {
    const num = /^\s*(\d)\s*[.)\-–]?\s*$/.exec(text);
    if (pendingMenu && num && Number(num[1]) >= 1 && Number(num[1]) <= MENU.length + 1) { pick(Number(num[1])); return; }
    pendingMenu = false;
    const l = lang();
    lastQuestion = forced ? '' : text;
    log.querySelectorAll('.a3c-chips').forEach((c) => c.remove());
    say(text, 'user');
    const item = forced || find(text, FAQ[l]);
    // pequena pausa só para dar ritmo de conversa (zerada com movimento reduzido)
    const calm = document.documentElement.classList.contains('a11y-reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => answer(item), calm ? 0 : 350);
  };

  const build = () => {
    const l = lang(), t = S[l];
    if (panel) panel.remove();
    panel = el('section'); panel.id = 'a3c-panel'; panel.className = 'a3c-panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false'); panel.setAttribute('aria-labelledby', 'a3c-title');
    const head = el('div', 'a3c-head');
    const titles = el('div'); const h = el('strong', null, t.title); h.id = 'a3c-title'; titles.append(h, el('small', null, t.sub));
    const close = el('button', 'a3c-close', '×'); close.type = 'button'; close.setAttribute('aria-label', t.close);
    close.addEventListener('click', closePanel); head.append(titles, close);
    log = el('div', 'a3c-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
    const form = el('form', 'a3c-form');
    input = el('input', 'a3c-input'); input.type = 'text'; input.maxLength = 300; input.placeholder = t.placeholder; input.setAttribute('aria-label', t.placeholder); input.autocomplete = 'off';
    const send = el('button', 'a3c-send', t.send); send.type = 'submit';
    form.append(input, send);
    form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; input.value = ''; ask(v); });
    panel.append(head, log, form, el('p', 'a3c-note', t.note));
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closePanel(); } });
    document.body.appendChild(panel);
    say(t.hello, 'bot'); chips();
    built = true; builtLang = l;
  };

  const openPanel = (focus = true) => {
    hideTeaser();
    if (!built || builtLang !== lang()) build();
    panel.hidden = false; trigger.setAttribute('aria-expanded', 'true');
    setTriggerLabel();
    // No celular não foca o campo ao abrir (o teclado cobriria os temas); no desktop, foca para digitar direto.
    if (!focus) return; // abertura automática: não rouba o foco de quem está lendo a página
    if (matchMedia('(pointer: coarse)').matches) { panel.tabIndex = -1; panel.focus({ preventScroll: true }); } else { input.focus({ preventScroll: true }); }
  };
  function closePanel() {
    if (!panel || panel.hidden) return;
    panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); markDismissed();
    if (panel.contains(document.activeElement)) trigger.focus();
  }

  function hideTeaser() { if (teaser) { teaser.remove(); teaser = null; } }
  // Celular: um aviso curto ao lado do botão (o painel inteiro cobriria a página logo na chegada).
  const showTeaser = () => {
    const t = S[lang()];
    teaser = el('div', 'a3c-teaser');
    const open = el('button', 'a3c-teaser-open', t.teaser); open.type = 'button';
    const x = el('button', 'a3c-teaser-x', '×'); x.type = 'button'; x.setAttribute('aria-label', t.teaserClose);
    open.addEventListener('click', () => openPanel());
    x.addEventListener('click', () => { hideTeaser(); markDismissed(); });
    teaser.append(open, x); document.body.appendChild(teaser);
    const r = trigger.getBoundingClientRect();
    teaser.style.right = Math.round(innerWidth - r.left + 10) + 'px';
    teaser.style.bottom = Math.round(innerHeight - r.bottom + (r.height - teaser.offsetHeight) / 2) + 'px';
  };
  // Ao abrir o site: desktop abre o assistente; celular mostra o aviso. Quem fechar não é incomodado de novo nesta visita.
  const autoStart = () => {
    if (dismissed() || (panel && !panel.hidden) || document.hidden) return;
    if (matchMedia('(min-width: 769px)').matches) openPanel(false); else showTeaser();
  };
  const schedule = () => setTimeout(autoStart, 1200);
  if (document.readyState === 'complete') schedule(); else addEventListener('load', schedule, { once: true });

  trigger.addEventListener('click', () => (panel && !panel.hidden ? closePanel() : openPanel()));
  // Se a pessoa trocar o idioma do site, o rótulo do botão acompanha; o painel se refaz na próxima abertura.
  new MutationObserver(setTriggerLabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
