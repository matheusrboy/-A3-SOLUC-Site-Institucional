const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const menuLinks = document.querySelectorAll('.main-nav a');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

menuLinks.forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();



// Site language
let currentLanguage = 'pt';
const languageWidget = document.getElementById('language-widget');
const languageTrigger = document.getElementById('language-trigger');
const languagePanel = document.getElementById('language-panel');
const originalTextNodes = new WeakMap();

const englishTranslations = new Map(Object.entries({
  "Ir para o conteúdo": "Skip to content",
  "CONTABILIDADE & SOLUÇÕES": "ACCOUNTING & SOLUTIONS",
  "Início": "Home",
  "Serviços": "Services",
  "Consulta CNPJ": "CNPJ Lookup",
  "Sobre nós": "About us",
  "Resultados": "Results",
  "Como funciona": "How it works",
  "Contato": "Contact",
  "Falar no WhatsApp": "Talk on WhatsApp",
  "CONTABILIDADE & SOLUÇÕES EMPRESARIAIS": "ACCOUNTING & BUSINESS SOLUTIONS",
  "Contabilidade que organiza o presente e prepara sua empresa para": "Accounting that organizes today and prepares your company to",
  "crescer.": "grow.",
  "A A3 SOLUC atende empreendedores e empresas nas rotinas fiscal, contábil, de RH e Departamento Pessoal e paralegal, unindo obrigações em dia, processos organizados e orientação próxima para decisões mais claras.": "A3 SOLUC supports entrepreneurs and companies across tax, accounting, HR, payroll and corporate routines, combining compliant obligations, organized processes and close guidance for clearer decisions.",
  "Falar com a A3": "Talk to A3",
  "Conhecer serviços": "Explore services",
  "Fiscal": "Tax",
  "Contábil": "Accounting",
  "RH & DP": "HR & Payroll",
  "Paralegal": "Corporate",
  "A3 SOLUC • CONTABILIDADE & SOLUÇÕES": "A3 SOLUC • ACCOUNTING & SOLUTIONS",
  "Menos burocracia.": "Less bureaucracy.",
  "Mais clareza para decidir.": "More clarity to decide.",
  "Atendimento": "Service",
  "Rápido, próximo e eficaz": "Fast, close and effective",
  "Localização": "Location",
  "Obrigações em dia, processos organizados e informação útil para a gestão.": "Compliant obligations, organized processes and useful information for management.",
  "Atendimento a empresas, empreendedores, MEIs, pequenos negócios e pessoa física.": "Service for companies, entrepreneurs, MEIs, small businesses and individuals.",
  "NOSSAS SOLUÇÕES": "OUR SOLUTIONS",
  "O essencial da sua empresa,": "The essentials of your business,",
  "bem cuidado.": "well taken care of.",
  "Do dia a dia da empresa à regularização de situações específicas, a A3 reúne as principais frentes contábeis e empresariais em um atendimento integrado, claro e próximo.": "From day-to-day routines to the regularization of specific situations, A3 brings together the main accounting and business services in an integrated, clear and close approach.",
  "Apuração de tributos, acompanhamento de obrigações fiscais, análise de enquadramento tributário e orientação sobre emissão de notas fiscais.": "Tax calculation, monitoring of tax obligations, tax regime analysis and guidance on issuing invoices.",
  "Escrituração, demonstrações contábeis, análise de balancetes e informações organizadas para apoiar a gestão da empresa.": "Bookkeeping, financial statements, trial balance analysis and organized information to support business management.",
  "RH & Departamento Pessoal": "HR & Payroll",
  "Admissões, férias, rescisões, folha de pagamento, encargos e acompanhamento das obrigações trabalhistas.": "Hiring, vacations, terminations, payroll, charges and monitoring of labor obligations.",
  "Paralegal & Societário": "Corporate & Legal Support",
  "Abertura, alteração e regularização de empresas, com acompanhamento de cadastros e processos perante os órgãos competentes.": "Company incorporation, amendments and regularization, with monitoring of registrations and processes before the relevant authorities.",
  "MEI & Pequenos Negócios": "MEI & Small Businesses",
  "Abertura e regularização de MEI, acompanhamento das obrigações e orientação na transição para microempresa quando necessário.": "MEI registration and regularization, monitoring of obligations and guidance for transitioning to a microenterprise when needed.",
  "Imposto de Renda Pessoa Física": "Individual Income Tax",
  "Preparação e entrega da declaração, com conferência das informações e orientação sobre eventuais pendências.": "Preparation and filing of the return, with information review and guidance on possible pending issues.",
  "CONSULTA EMPRESARIAL": "BUSINESS LOOKUP",
  "Descubra o que merece atenção no seu": "Find out what deserves attention in your",
  "Consulte dados públicos da empresa e receba uma triagem inicial das áreas que podem merecer revisão com a A3.": "Check public company data and receive an initial screening of areas that may deserve review with A3.",
  "DADOS PÚBLICOS • BETA": "PUBLIC DATA • BETA",
  "A consulta busca informações cadastrais públicas e gera uma triagem inicial. O resultado não substitui a análise da equipe A3.": "The lookup uses public registration data and provides an initial screening. The result does not replace an A3 team review.",
  "CNPJ da empresa": "Company CNPJ",
  "Analisar CNPJ": "Analyze CNPJ",
  "Utilizamos apenas informações cadastrais públicas para esta pré-análise.": "We use only public registration information for this preliminary analysis.",
  "Não foi possível consultar este CNPJ.": "We could not look up this CNPJ.",
  "PRÉ-ANÁLISE": "PRELIMINARY REVIEW",
  "Perfil cadastral da empresa": "Company registration profile",
  "Nova consulta": "New lookup",
  "Empresa": "Company",
  "Cidade / UF": "City / State",
  "Atividade principal": "Primary activity",
  "Porte": "Company size",
  "Simples Nacional": "Simples Nacional",
  "Pontos que podem merecer revisão com a A3": "Items that may deserve review with A3",
  "A triagem usa dados cadastrais públicos e indica possíveis frentes de atenção. Ela não afirma, por si só, a existência de pendências ou obrigações específicas.": "The screening uses public registration data and points to possible areas of attention. By itself, it does not confirm the existence of pending issues or specific obligations.",
  "Quero revisar meu CNPJ com a A3": "I want to review my CNPJ with A3",
  "SOBRE NÓS": "ABOUT US",
  "Contabilidade próxima da realidade de quem": "Accounting close to the reality of those who",
  "empreende.": "run a business.",
  "A A3 SOLUC atende empreendedores e empresas nas rotinas fiscal, contábil, de RH e Departamento Pessoal e paralegal, além de apoiar MEIs, pequenos negócios e pessoas físicas no Imposto de Renda.": "A3 SOLUC supports entrepreneurs and companies in tax, accounting, HR, payroll and corporate routines, as well as MEIs, small businesses and individuals with income tax matters.",
  "Nossa proposta é unir cumprimento das obrigações, organização dos processos e orientação próxima ao cliente para que cada decisão seja tomada com mais clareza.": "Our approach combines compliance, process organization and close client guidance so each decision can be made with greater clarity.",
  "ATENDEMOS": "WE SERVE",
  "Empresas": "Companies",
  "Empreendedores": "Entrepreneurs",
  "MEIs e pequenos negócios": "MEIs and small businesses",
  "Pessoa física • IRPF": "Individuals • Income Tax",
  "Conheça nosso atendimento": "Learn about our service",
  "NOSSO JEITO DE ATENDER": "HOW WE WORK",
  "Contabilidade não deve ser só entrega de obrigação. Deve ajudar o cliente a entender o negócio e decidir melhor.": "Accounting should be more than filing obligations. It should help clients understand their business and make better decisions.",
  "Rapidez e eficácia": "Speed and effectiveness",
  "Respostas objetivas e condução ágil das demandas, sem perder clareza no processo.": "Clear answers and agile handling of requests, without losing transparency throughout the process.",
  "Solução em conjunto": "Solutions built together",
  "Cada caminho é construído com o cliente, considerando a realidade e as prioridades da empresa.": "Each path is built with the client, considering the company's reality and priorities.",
  "Acompanhamento próximo": "Close follow-up",
  "Reuniões de acompanhamento mantêm processos, pendências e próximos passos sempre alinhados.": "Follow-up meetings keep processes, pending items and next steps aligned.",
  "RESULTADOS NA PRÁTICA": "RESULTS IN PRACTICE",
  "Rotinas mais organizadas. Decisões com mais": "More organized routines. Decisions with more",
  "clareza.": "clarity.",
  "O trabalho da A3 é voltado a resolver pendências, estruturar rotinas e transformar informações contábeis em apoio para a gestão do negócio.": "A3's work focuses on resolving pending matters, structuring routines and turning accounting information into support for business management.",
  "Regularização de pendências": "Resolution of pending issues",
  "Apoio na identificação e condução de pendências fiscais, cadastrais, trabalhistas e societárias.": "Support in identifying and handling tax, registration, labor and corporate pending matters.",
  "Rotinas fiscais e trabalhistas em ordem": "Tax and labor routines in order",
  "Processos acompanhados com organização para facilitar o cumprimento das obrigações do dia a dia.": "Organized process monitoring to make day-to-day compliance easier.",
  "Abertura e alterações com acompanhamento": "Company setup and amendments with follow-up",
  "Suporte na abertura, alteração e atualização cadastral da empresa perante os órgãos competentes.": "Support with incorporation, amendments and registration updates before the relevant authorities.",
  "Mais clareza dos números": "Clearer financial information",
  "Informações contábeis e balancetes organizados para apoiar a leitura do negócio e a tomada de decisão.": "Organized accounting information and trial balances to support business understanding and decision-making.",
  "COMO FUNCIONA": "HOW IT WORKS",
  "Atendimento próximo, rápido e": "Close, fast service",
  "construído com você.": "built with you.",
  "Entendemos seu cenário": "We understand your situation",
  "Começamos ouvindo sua empresa para identificar necessidades, prioridades e o que precisa ser resolvido.": "We start by listening to your business to identify needs, priorities and what must be resolved.",
  "Construímos a solução com você": "We build the solution with you",
  "A condução é definida em conjunto com o cliente, com orientação clara e decisões alinhadas à realidade do negócio.": "The approach is defined together with the client, with clear guidance and decisions aligned with the business reality.",
  "Agimos com rapidez e eficácia": "We act quickly and effectively",
  "Tratamos cada demanda de forma objetiva, mantendo comunicação próxima durante a execução dos processos.": "We handle each request objectively, maintaining close communication throughout execution.",
  "Acompanhamos todos os processos": "We follow every process",
  "Realizamos reuniões de acompanhamento para revisar o andamento das demandas, alinhar próximos passos e manter o cliente informado.": "We hold follow-up meetings to review progress, align next steps and keep the client informed.",
  "FALE COM A GENTE": "TALK TO US",
  "Vamos simplificar a rotina da sua": "Let's simplify your",
  "empresa?": "business?",
  "Conte o que você precisa e fale diretamente com a A3 SOLUC.": "Tell us what you need and talk directly with A3 SOLUC.",
  "Chamar no WhatsApp": "Message on WhatsApp",
  "Enviar e-mail": "Send email",
  "E-mail": "Email",
  "Instagram": "Instagram",
  "Endereço": "Address",
  "CONTABILIDADE & SOLUÇÕES": "ACCOUNTING & SOLUTIONS",
  "Todos os direitos reservados.": "All rights reserved.",
  "Acessibilidade": "Accessibility",
  "ACESSIBILIDADE": "ACCESSIBILITY",
  "Leitura em voz alta": "Read aloud",
  "Ouça o conteúdo principal do site usando a voz disponível no seu navegador.": "Listen to the main website content using a voice available in your browser.",
  "Idioma": "Language",
  "Ouvir página": "Read page",
  "Pausar": "Pause",
  "Continuar": "Resume",
  "Parar": "Stop",
  "Pronto para ouvir.": "Ready to listen.",
  "Este recurso complementa leitores de tela e outras tecnologias assistivas.": "This feature complements screen readers and other assistive technologies.",
  "Selecionar idioma": "Select language",
  "Idioma do site": "Website language",
  "Português": "Portuguese",
  "Assistente de acessibilidade": "Accessibility assistant",
  "Ajuste a leitura do site e use o leitor por áudio. As preferências ficam salvas neste navegador.": "Adjust how the site is displayed and use the audio reader. Your preferences are saved in this browser.",
  "Aumentar texto": "Increase text",
  "Aumenta um nível por clique": "Increases one level per click",
  "Diminuir texto": "Decrease text",
  "Reduz um nível por clique": "Decreases one level per click",
  "Mais contraste": "Higher contrast",
  "Reforça a separação visual": "Strengthens visual separation",
  "Destacar links": "Highlight links",
  "Sublinha links e ações": "Underlines links and actions",
  "Fonte legível": "Readable font",
  "Troca para uma fonte simples": "Switches to a simpler font",
  "Reduzir movimento": "Reduce motion",
  "Desativa animações e transições": "Disables animations and transitions",
  "Leitor por áudio": "Audio reader",
  "Ouça o conteúdo principal da página. O recurso usa a voz disponível no seu navegador.": "Listen to the main page content using a voice available in your browser.",
  "Pronto para iniciar a leitura.": "Ready to start reading.",
  "Restaurar padrão": "Restore defaults",
  "A3 SOLUC — Contabilidade & Soluções Empresariais. Todos os direitos reservados.": "A3 SOLUC — Accounting & Business Solutions. All rights reserved.",
  "Fiscal • Contábil • RH & DP • Paralegal • MEI • IRPF": "Tax • Accounting • HR & Payroll • Corporate • MEI • Income Tax"
}));

const translateTextNodes = (language) => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest('script, style, svg')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    if (!originalTextNodes.has(node)) {
      originalTextNodes.set(node, node.textContent);
    }

    const original = originalTextNodes.get(node);
    const trimmed = original.trim();
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';

    if (language === 'en' && englishTranslations.has(trimmed)) {
      node.textContent = leading + englishTranslations.get(trimmed) + trailing;
    } else {
      node.textContent = original;
    }
  });
};

const translateAttributes = (language) => {
  const en = language === 'en';

  document.documentElement.lang = en ? 'en' : 'pt-BR';
  document.title = en
    ? 'A3 SOLUC | Accounting in São Bernardo do Campo'
    : 'A3 SOLUC | Contabilidade em São Bernardo do Campo';

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = en
      ? 'A3 SOLUC — Accounting & Business Solutions in São Bernardo do Campo. Tax, accounting, HR, payroll, corporate support, MEI and individual income tax services.'
      : 'A3 SOLUC — Contabilidade & Soluções Empresariais em São Bernardo do Campo. Serviços fiscal, contábil, RH e Departamento Pessoal, paralegal, MEI e Imposto de Renda Pessoa Física.';
  }

  const attrs = [
    ['.brand[href="#inicio"]', 'aria-label', en ? 'A3 SOLUC - home' : 'A3 SOLUC - início'],
    ['.menu-toggle', 'aria-label', en ? 'Open menu' : 'Abrir menu'],
    ['#menu-principal', 'aria-label', en ? 'Main navigation' : 'Navegação principal'],
    ['.hero-tags', 'aria-label', en ? 'Areas of expertise' : 'Áreas de atuação'],
    ['.hero-panel', 'aria-label', en ? 'A3 SOLUC overview' : 'Resumo da A3 SOLUC'],
    ['.audience-tags', 'aria-label', en ? 'Clients served' : 'Públicos atendidos'],
    ['.about-approach', 'aria-label', en ? 'How we work' : 'Nosso jeito de atender'],
    ['.footer-brand', 'aria-label', en ? 'A3 SOLUC - back to top' : 'A3 SOLUC - voltar ao topo'],
    ['#accessibility-trigger', 'aria-label', en ? 'Open accessibility assistant' : 'Abrir assistente de acessibilidade'],
    ['#accessibility-close', 'aria-label', en ? 'Close accessibility assistant' : 'Fechar assistente de acessibilidade'],
    ['#language-trigger', 'aria-label', en ? 'Select language' : 'Selecionar idioma'],
    ['.language-switch', 'aria-label', en ? 'Select language' : 'Selecionar idioma'],
    ['.floating-whatsapp', 'aria-label', en ? 'Talk to A3 SOLUC on WhatsApp' : 'Falar com a A3 SOLUC pelo WhatsApp'],
    ['.map-card iframe', 'title', en ? 'Map of A3 SOLUC' : 'Mapa da A3 SOLUC']
  ];

  attrs.forEach(([selector, attr, value]) => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attr, value);
  });

  const whatsappLinks = document.querySelectorAll('a[href*="wa.me/5511913298952"]');
  whatsappLinks.forEach(link => {
    if (!link.dataset.ptHref) link.dataset.ptHref = link.href;

    if (en) {
      const base = 'https://wa.me/5511913298952';
      let message = 'Hello, I came from the A3 SOLUC website and would like to talk about accounting services.';
      if (link.id === 'cnpj-whatsapp') {
        message = 'Hello, I came from the A3 SOLUC website and would like to review my CNPJ with your team.';
      }
      link.href = base + '?text=' + encodeURIComponent(message);
    } else if (link.dataset.ptHref) {
      link.href = link.dataset.ptHref;
    }
  });
};

const updateLanguageControls = () => {
  document.querySelectorAll('.language-option').forEach(button => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
};

let lastCnpjData = null;

const refreshCnpjLanguage = () => {
  if (!lastCnpjData) return;

  const statusElement = document.getElementById('cnpj-company-status');
  const simplesElement = document.getElementById('cnpj-simples');
  const meiElement = document.getElementById('cnpj-mei');
  const tasksElement = document.getElementById('cnpj-tasks');

  if (statusElement) statusElement.textContent = translateCompanyStatus(lastCnpjData.descricao_situacao_cadastral);
  if (simplesElement) simplesElement.textContent = boolLabel(lastCnpjData.opcao_pelo_simples);
  if (meiElement) meiElement.textContent = boolLabel(lastCnpjData.opcao_pelo_mei);
  if (tasksElement) tasksElement.innerHTML = buildTasks(lastCnpjData);
};

const applyLanguage = (language, persist = true) => {
  currentLanguage = language === 'en' ? 'en' : 'pt';

  if (typeof speechSupported !== 'undefined' && speechSupported) {
    window.speechSynthesis.cancel();
  }

  translateTextNodes(currentLanguage);
  translateAttributes(currentLanguage);
  updateLanguageControls();

  if (typeof refreshCnpjLanguage === 'function') refreshCnpjLanguage();
  if (typeof loadPreferredVoice === 'function') loadPreferredVoice();
  if (typeof updateSpeechButtons === 'function') updateSpeechButtons();

  if (persist) {
    try {
      localStorage.setItem('a3-language', currentLanguage);
    } catch (_) {}
  }
};

document.querySelectorAll('.language-option').forEach(button => {
  button.addEventListener('click', () => {
    applyLanguage(button.dataset.language);
    languagePanel?.setAttribute('hidden', '');
    languageTrigger?.setAttribute('aria-expanded', 'false');
  });
});

languageTrigger?.addEventListener('click', () => {
  const willOpen = languagePanel?.hasAttribute('hidden');

  if (willOpen) {
    languagePanel?.removeAttribute('hidden');
    languageTrigger?.setAttribute('aria-expanded', 'true');
  } else {
    languagePanel?.setAttribute('hidden', '');
    languageTrigger?.setAttribute('aria-expanded', 'false');
  }
});

let savedLanguage = 'pt';
try {
  savedLanguage = localStorage.getItem('a3-language') || 'pt';
} catch (_) {}

const cnpjForm = document.getElementById('cnpj-form');
const cnpjInput = document.getElementById('cnpj-input');
const cnpjError = document.getElementById('cnpj-error');
const cnpjResult = document.getElementById('cnpj-result');
const cnpjResultNumber = document.getElementById('cnpj-result-number');
const cnpjReset = document.getElementById('cnpj-reset');
const cnpjWhatsapp = document.getElementById('cnpj-whatsapp');
const cnpjSubmit = document.getElementById('cnpj-submit');
const companyName = document.getElementById('cnpj-company-name');
const tradeName = document.getElementById('cnpj-trade-name');
const companyStatus = document.getElementById('cnpj-company-status');
const companyLocation = document.getElementById('cnpj-location');
const companyCnae = document.getElementById('cnpj-cnae');
const companySize = document.getElementById('cnpj-size');
const companySimples = document.getElementById('cnpj-simples');
const companyMei = document.getElementById('cnpj-mei');
const cnpjTasks = document.getElementById('cnpj-tasks');

const normalizeCnpj = (value) => String(value || '').toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 14);

const formatCnpj = (value) => {
  const chars = normalizeCnpj(value);
  if (!chars) return '';
  const parts = [
    chars.slice(0,2),
    chars.slice(2,5),
    chars.slice(5,8),
    chars.slice(8,12),
    chars.slice(12,14)
  ];
  let out = parts[0];
  if (parts[1]) out += '.' + parts[1];
  if (parts[2]) out += '.' + parts[2];
  if (parts[3]) out += '/' + parts[3];
  if (parts[4]) out += '-' + parts[4];
  return out;
};

const isPlausibleCnpj = (value) => /^[0-9A-Z]{12}[0-9]{2}$/.test(normalizeCnpj(value));

const boolLabel = (value) => {
  if (currentLanguage === 'en') {
    return value === true ? 'Yes' : value === false ? 'No' : 'Not informed';
  }
  return value === true ? 'Sim' : value === false ? 'Não' : 'Não informado';
};

const translateCompanyStatus = (status) => {
  const raw = String(status || '').trim();
  if (currentLanguage !== 'en') return raw || 'Não informado';

  const statuses = {
    'ATIVA': 'ACTIVE',
    'BAIXADA': 'CLOSED',
    'INAPTA': 'UNFIT',
    'SUSPENSA': 'SUSPENDED',
    'NULA': 'VOID'
  };

  return statuses[raw.toUpperCase()] || raw || 'Not informed';
};

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[char]));

const taskCard = (area, title, text, attention = false) => `
  <article class="${attention ? 'needs-attention' : ''}">
    <span>${escapeHtml(area)}</span>
    <h4>${escapeHtml(title)}</h4>
    <p>${escapeHtml(text)}</p>
  </article>
`;

const buildTasks = (data) => {
  const tasks = [];
  const status = String(data.descricao_situacao_cadastral || '').toUpperCase();
  const cnae = data.cnae_fiscal_descricao || (currentLanguage === 'en' ? 'activity listed in the registration' : 'atividade informada no cadastro');
  const simples = data.opcao_pelo_simples;
  const mei = data.opcao_pelo_mei;
  const en = currentLanguage === 'en';

  if (status && status !== 'ATIVA') {
    tasks.push(taskCard(
      en ? 'Corporate' : 'Paralegal',
      en ? 'Registration status deserves attention' : 'Situação cadastral merece atenção',
      en
        ? `The registration status appears as "${status}". A3 can review the situation and guide the next steps.`
        : `O cadastro aparece como "${status}". A A3 pode revisar a situação e orientar os próximos passos.`,
      true
    ));
  } else {
    tasks.push(taskCard(
      en ? 'Corporate' : 'Paralegal',
      en ? 'Registration and amendments' : 'Cadastro e alterações',
      en
        ? 'The registration status appears active. A3 can support amendments, updates and regularization when needed.'
        : 'A situação cadastral aparece ativa. A A3 pode apoiar alterações, atualizações e regularizações quando necessárias.'
    ));
  }

  let fiscalText = en
    ? `The primary registered activity is "${cnae}". `
    : `A atividade principal cadastrada é "${cnae}". `;

  if (simples === true) {
    fiscalText += en
      ? 'The registration indicates Simples Nacional; it may be useful to review tax regime, taxes and applicable obligations.'
      : 'O cadastro indica opção pelo Simples Nacional; vale revisar enquadramento, tributos e obrigações aplicáveis.';
  } else if (simples === false) {
    fiscalText += en
      ? 'The registration does not indicate a current Simples Nacional option; A3 can review the tax regime and fiscal obligations.'
      : 'O cadastro não indica opção atual pelo Simples Nacional; a A3 pode revisar enquadramento e obrigações fiscais.';
  } else {
    fiscalText += en
      ? 'A3 can review the tax regime, invoice issuance and obligations related to the activity.'
      : 'A A3 pode revisar enquadramento tributário, emissão de notas e obrigações relacionadas à atividade.';
  }

  tasks.push(taskCard(en ? 'Tax' : 'Fiscal', en ? 'Tax regime and obligations' : 'Enquadramento e obrigações', fiscalText));

  tasks.push(taskCard(
    en ? 'Accounting' : 'Contábil',
    en ? 'Organization and financial information' : 'Organização e números',
    en
      ? 'Bookkeeping, trial balances and financial statements can be reviewed to support financial understanding and business management.'
      : 'Escrituração, balancetes e demonstrações podem ser revisados para apoiar a leitura financeira e a gestão da empresa.'
  ));

  if (mei === true) {
    tasks.push(taskCard(
      'MEI',
      en ? 'Obligations and business growth' : 'Obrigações e evolução do negócio',
      en
        ? 'The registration indicates MEI. A3 can monitor obligations and assess a transition to a microenterprise when appropriate.'
        : 'O cadastro indica MEI. A A3 pode acompanhar obrigações e avaliar a transição para microempresa quando fizer sentido.'
    ));
  } else {
    tasks.push(taskCard(
      en ? 'HR & Payroll' : 'RH & DP',
      en ? 'Labor routines' : 'Rotinas trabalhistas',
      en
        ? 'Public CNPJ data does not show whether the company has employees. If it does, A3 can review payroll, charges and labor obligations.'
        : 'A consulta pública do CNPJ não informa se há funcionários. Se houver equipe, a A3 pode revisar folha, encargos e obrigações trabalhistas.'
    ));
  }

  return tasks.join('');
};

cnpjInput?.addEventListener('input', () => {
  cnpjInput.value = formatCnpj(cnpjInput.value);
  cnpjError.hidden = true;
});

cnpjForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const normalized = normalizeCnpj(cnpjInput.value);
  const formatted = formatCnpj(normalized);

  if (!isPlausibleCnpj(normalized)) {
    cnpjError.textContent = currentLanguage === 'en'
      ? 'Enter a valid CNPJ to continue.'
      : 'Digite um CNPJ válido para continuar.';
    cnpjError.hidden = false;
    cnpjResult.hidden = true;
    cnpjInput.focus();
    return;
  }

  cnpjError.hidden = true;
  cnpjResult.hidden = true;
  cnpjSubmit.disabled = true;
  cnpjSubmit.innerHTML = currentLanguage === 'en' ? 'Checking…' : 'Consultando…';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`/api/cnpj?cnpj=${encodeURIComponent(normalized)}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || (currentLanguage === 'en'
        ? 'We could not look up this CNPJ right now.'
        : 'Não foi possível consultar o CNPJ agora.'));
    }

    const data = payload.data || payload;
    lastCnpjData = data;

    cnpjResultNumber.textContent = formatCnpj(data.cnpj || normalized);
    companyName.textContent = data.razao_social || (currentLanguage === 'en' ? 'Legal name not informed' : 'Razão social não informada');
    tradeName.textContent = data.nome_fantasia && data.nome_fantasia !== data.razao_social ? data.nome_fantasia : '';
    companyStatus.textContent = translateCompanyStatus(data.descricao_situacao_cadastral);

    const active = String(data.descricao_situacao_cadastral || '').toUpperCase() === 'ATIVA';
    companyStatus.classList.toggle('is-active', active);
    companyStatus.classList.toggle('is-warning', !active);

    companyLocation.textContent = [data.municipio, data.uf].filter(Boolean).join(' / ') || (currentLanguage === 'en' ? 'Not informed' : 'Não informado');
    companyCnae.textContent = data.cnae_fiscal_descricao || (currentLanguage === 'en' ? 'Not informed' : 'Não informado');
    companySize.textContent = data.porte || data.descricao_porte || (currentLanguage === 'en' ? 'Not informed' : 'Não informado');
    companySimples.textContent = boolLabel(data.opcao_pelo_simples);
    companyMei.textContent = boolLabel(data.opcao_pelo_mei);
    cnpjTasks.innerHTML = buildTasks(data);

    const summary = [
      `CNPJ ${formatted}`,
      data.razao_social ? `(${data.razao_social})` : '',
      data.descricao_situacao_cadastral
        ? (currentLanguage === 'en'
            ? `- status ${translateCompanyStatus(data.descricao_situacao_cadastral)}`
            : `- situação ${data.descricao_situacao_cadastral}`)
        : ''
    ].filter(Boolean).join(' ');

    const message = currentLanguage === 'en'
      ? `Hello, I came from the A3 SOLUC website. I checked ${summary} and would like to review which services and obligations are relevant to the company.`
      : `Olá, vim pelo site da A3 SOLUC. Consultei ${summary} e gostaria de revisar quais serviços e obrigações fazem sentido para a empresa.`;
    cnpjWhatsapp.href = `https://wa.me/5511913298952?text=${encodeURIComponent(message)}`;

    cnpjResult.hidden = false;
    cnpjResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    cnpjError.textContent = error?.name === 'AbortError'
      ? (currentLanguage === 'en' ? 'The lookup took longer than expected. Please try again.' : 'A consulta demorou mais que o esperado. Tente novamente.')
      : (error?.message || (currentLanguage === 'en' ? 'We could not look up the CNPJ right now.' : 'Não foi possível consultar o CNPJ agora.'));
    cnpjError.hidden = false;
  } finally {
    clearTimeout(timeout);
    cnpjSubmit.disabled = false;
    cnpjSubmit.innerHTML = (currentLanguage === 'en' ? 'Analyze CNPJ' : 'Analisar CNPJ') + ' <span aria-hidden="true">→</span>';
  }
});

cnpjReset?.addEventListener('click', () => {
  cnpjResult.hidden = true;
  cnpjInput.value = '';
  cnpjError.hidden = true;
  cnpjInput.focus();
});


// Accessibility voice reader
const accessibilityTrigger = document.getElementById('accessibility-trigger');
const accessibilityPanel = document.getElementById('accessibility-panel');
const accessibilityClose = document.getElementById('accessibility-close');
const accessibilityBackdrop = document.getElementById('accessibility-backdrop');
const a11yTextUp = document.getElementById('a11y-text-up');
const a11yTextDown = document.getElementById('a11y-text-down');
const a11yContrast = document.getElementById('a11y-contrast');
const a11yLinks = document.getElementById('a11y-links');
const a11yFont = document.getElementById('a11y-font');
const a11yMotion = document.getElementById('a11y-motion');
const a11yReset = document.getElementById('a11y-reset');
const speakStart = document.getElementById('speak-start');
const speakPause = document.getElementById('speak-pause');
const speakStop = document.getElementById('speak-stop');
const accessibilityStatus = document.getElementById('accessibility-status');

// Accessibility display preferences
const accessibilityDefaults = {
  textScale: 1,
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  reduceMotion: false
};

let accessibilityPrefs = { ...accessibilityDefaults };

try {
  const saved = JSON.parse(localStorage.getItem('a3-accessibility') || '{}');
  accessibilityPrefs = { ...accessibilityDefaults, ...saved };
} catch (_) {}

const scalableTextSelector = [
  'main h1',
  'main h2',
  'main h3',
  'main h4',
  'main p',
  'main a',
  'main button',
  'main label',
  'main small',
  '.site-header .main-nav a',
  '.site-header .brand-name strong',
  '.site-header .brand-name small',
  '.site-footer p',
  '.site-footer a'
].join(',');

const captureBaseFontSizes = () => {
  document.querySelectorAll(scalableTextSelector).forEach(element => {
    if (!element.dataset.a11yBaseFontSize) {
      element.dataset.a11yBaseFontSize = String(parseFloat(getComputedStyle(element).fontSize) || 16);
    }
  });
};

const applyTextScale = () => {
  const elements = document.querySelectorAll(scalableTextSelector);

  if (accessibilityPrefs.textScale === 1) {
    elements.forEach(element => element.style.removeProperty('font-size'));
    return;
  }

  captureBaseFontSizes();
  elements.forEach(element => {
    const base = parseFloat(element.dataset.a11yBaseFontSize || '16');
    element.style.fontSize = Math.round(base * accessibilityPrefs.textScale * 100) / 100 + 'px';
  });
};

const setPressedState = (button, pressed) => {
  if (!button) return;
  button.setAttribute('aria-pressed', String(Boolean(pressed)));
};

const saveAccessibilityPrefs = () => {
  try {
    localStorage.setItem('a3-accessibility', JSON.stringify(accessibilityPrefs));
  } catch (_) {}
};

const applyAccessibilityPrefs = () => {
  document.body.classList.toggle('a11y-high-contrast', accessibilityPrefs.highContrast);
  document.body.classList.toggle('a11y-link-highlight', accessibilityPrefs.highlightLinks);
  document.body.classList.toggle('a11y-readable-font', accessibilityPrefs.readableFont);
  document.documentElement.classList.toggle('a11y-reduce-motion', accessibilityPrefs.reduceMotion);

  setPressedState(a11yContrast, accessibilityPrefs.highContrast);
  setPressedState(a11yLinks, accessibilityPrefs.highlightLinks);
  setPressedState(a11yFont, accessibilityPrefs.readableFont);
  setPressedState(a11yMotion, accessibilityPrefs.reduceMotion);

  applyTextScale();
};

const updateAccessibilityPreference = (key) => {
  accessibilityPrefs[key] = !accessibilityPrefs[key];
  applyAccessibilityPrefs();
  saveAccessibilityPrefs();
};

a11yTextUp?.addEventListener('click', () => {
  accessibilityPrefs.textScale = Math.min(1.3, Math.round((accessibilityPrefs.textScale + 0.1) * 10) / 10);
  applyTextScale();
  saveAccessibilityPrefs();
});

a11yTextDown?.addEventListener('click', () => {
  accessibilityPrefs.textScale = Math.max(0.9, Math.round((accessibilityPrefs.textScale - 0.1) * 10) / 10);
  applyTextScale();
  saveAccessibilityPrefs();
});

a11yContrast?.addEventListener('click', () => updateAccessibilityPreference('highContrast'));
a11yLinks?.addEventListener('click', () => updateAccessibilityPreference('highlightLinks'));
a11yFont?.addEventListener('click', () => updateAccessibilityPreference('readableFont'));
a11yMotion?.addEventListener('click', () => updateAccessibilityPreference('reduceMotion'));

a11yReset?.addEventListener('click', () => {
  accessibilityPrefs = { ...accessibilityDefaults };
  applyAccessibilityPrefs();
  saveAccessibilityPrefs();
});

applyAccessibilityPrefs();

const speechSupported =
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof window.SpeechSynthesisUtterance === 'function';

let speechChunks = [];
let speechIndex = 0;
let speechPaused = false;
let speechReading = false;
let preferredVoice = null;
let activeUtterance = null;
let speechTimer = null;

const setSpeechStatus = (message) => {
  if (accessibilityStatus) accessibilityStatus.textContent = message;
};

const updateSpeechButtons = () => {
  if (!speechSupported) {
    if (speakStart) speakStart.disabled = true;
    if (speakPause) speakPause.disabled = true;
    if (speakStop) speakStop.disabled = true;
    setSpeechStatus(currentLanguage === 'en'
      ? 'Read-aloud is not available in this browser.'
      : 'A leitura em voz alta não está disponível neste navegador.');
    return;
  }

  if (speakStart) {
    speakStart.disabled = speechReading;
    speakStart.innerHTML = '<span aria-hidden="true">▶</span> ' + (currentLanguage === 'en' ? 'Read page' : 'Ouvir página');
  }
  if (speakPause) {
    speakPause.disabled = !speechReading;
    speakPause.innerHTML = '<span aria-hidden="true">Ⅱ</span> ' + (
      speechPaused
        ? (currentLanguage === 'en' ? 'Resume' : 'Continuar')
        : (currentLanguage === 'en' ? 'Pause' : 'Pausar')
    );
  }
  if (speakStop) {
    speakStop.disabled = !speechReading;
    speakStop.innerHTML = '<span aria-hidden="true">■</span> ' + (currentLanguage === 'en' ? 'Stop' : 'Parar');
  }
};

const loadPreferredVoice = () => {
  if (!speechSupported) return;

  const voices = window.speechSynthesis.getVoices();
  if (currentLanguage === 'en') {
    preferredVoice =
      voices.find(voice => /^en-US$/i.test(voice.lang)) ||
      voices.find(voice => /^en/i.test(voice.lang)) ||
      null;
  } else {
    preferredVoice =
      voices.find(voice => /^pt-BR$/i.test(voice.lang)) ||
      voices.find(voice => /^pt/i.test(voice.lang)) ||
      voices.find(voice => /portugu/i.test(voice.name)) ||
      null;
  }
};

if (speechSupported) {
  loadPreferredVoice();
  window.speechSynthesis.onvoiceschanged = loadPreferredVoice;
}

const getReadablePageText = () => {
  const main = document.querySelector('main');
  if (!main) return '';

  const clone = main.cloneNode(true);

  clone
    .querySelectorAll(
      'script, style, svg, iframe, form, button, input, textarea, select, [hidden], .floating-whatsapp, .accessibility-widget'
    )
    .forEach(el => el.remove());

  return (clone.textContent || '')
    .replace(/\s+/g, ' ')
    .replace(/•/g, ',')
    .replace(/↗|→/g, '')
    .trim();
};

const splitSpeechText = (text, maxLength = 170) => {
  const chunks = [];
  const sentences = text.match(/[^.!?;:]+[.!?;:]?|[^.!?;:]+$/g) || [text];
  let current = '';

  const pushCurrent = () => {
    const clean = current.trim();
    if (clean) chunks.push(clean);
    current = '';
  };

  sentences.forEach(sentence => {
    const clean = sentence.trim();
    if (!clean) return;

    if ((current + ' ' + clean).trim().length <= maxLength) {
      current = (current + ' ' + clean).trim();
      return;
    }

    pushCurrent();

    if (clean.length <= maxLength) {
      current = clean;
      return;
    }

    const words = clean.split(/\s+/);
    words.forEach(word => {
      if ((current + ' ' + word).trim().length > maxLength) {
        pushCurrent();
      }
      current = (current + ' ' + word).trim();
    });
  });

  pushCurrent();
  return chunks;
};

const clearSpeechTimer = () => {
  if (speechTimer) {
    clearTimeout(speechTimer);
    speechTimer = null;
  }
};

const finishSpeech = (message = (currentLanguage === 'en' ? 'Reading complete.' : 'Leitura concluída.')) => {
  clearSpeechTimer();
  speechReading = false;
  speechPaused = false;
  speechChunks = [];
  speechIndex = 0;
  activeUtterance = null;
  setSpeechStatus(message);
  updateSpeechButtons();
};

const speakNextChunk = () => {
  if (!speechSupported || !speechReading) return;

  if (speechIndex >= speechChunks.length) {
    finishSpeech();
    return;
  }

  const text = speechChunks[speechIndex];
  activeUtterance = new SpeechSynthesisUtterance(text);
  activeUtterance.lang = preferredVoice?.lang || (currentLanguage === 'en' ? 'en-US' : 'pt-BR');
  if (preferredVoice) activeUtterance.voice = preferredVoice;
  activeUtterance.rate = 0.96;
  activeUtterance.pitch = 1;
  activeUtterance.volume = 1;

  activeUtterance.onstart = () => {
    setSpeechStatus(currentLanguage === 'en' ? 'Reading page content…' : 'Lendo o conteúdo da página…');
  };

  activeUtterance.onend = () => {
    if (!speechReading) return;
    activeUtterance = null;
    speechIndex += 1;
    speechTimer = setTimeout(speakNextChunk, 80);
  };

  activeUtterance.onerror = event => {
    if (event.error === 'canceled' || event.error === 'interrupted') return;
    finishSpeech(currentLanguage === 'en'
      ? 'Unable to continue reading. Please try again.'
      : 'Não foi possível reproduzir a leitura. Tente novamente.');
  };

  try {
    window.speechSynthesis.speak(activeUtterance);

    // Alguns navegadores entram em estado pausado sem refletir isso na interface.
    speechTimer = setTimeout(() => {
      if (speechReading && !speechPaused && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 250);
  } catch (error) {
    finishSpeech(currentLanguage === 'en'
      ? 'Unable to start reading in this browser.'
      : 'Não foi possível iniciar a leitura neste navegador.');
  }
};

const startPageReading = () => {
  if (!speechSupported) {
    setSpeechStatus(currentLanguage === 'en'
      ? 'Read-aloud is not available in this browser.'
      : 'A leitura em voz alta não está disponível neste navegador.');
    return;
  }

  const pageText = getReadablePageText();
  if (!pageText) {
    setSpeechStatus(currentLanguage === 'en' ? 'No readable content was found.' : 'Não encontrei conteúdo para ler.');
    return;
  }

  clearSpeechTimer();
  window.speechSynthesis.cancel();

  speechChunks = splitSpeechText(pageText);
  speechIndex = 0;
  speechPaused = false;
  speechReading = true;
  activeUtterance = null;

  setSpeechStatus(currentLanguage === 'en' ? 'Preparing reading…' : 'Preparando a leitura…');
  updateSpeechButtons();

  // Dar um pequeno intervalo depois do cancel evita que Chrome/Safari ignorem a primeira fala.
  speechTimer = setTimeout(() => {
    loadPreferredVoice();
    speakNextChunk();
  }, 180);
};

const openAccessibilityPanel = () => {
  languagePanel?.setAttribute('hidden', '');
  languageTrigger?.setAttribute('aria-expanded', 'false');
  accessibilityPanel?.removeAttribute('hidden');
  accessibilityBackdrop?.removeAttribute('hidden');
  accessibilityTrigger?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';

  setSpeechStatus(
    currentLanguage === 'en'
      ? (speechReading ? 'Reading in progress.' : 'Ready to start reading.')
      : (speechReading ? 'Leitura em andamento.' : 'Pronto para iniciar a leitura.')
  );

  accessibilityClose?.focus();
};

const closeAccessibilityPanel = () => {
  accessibilityPanel?.setAttribute('hidden', '');
  accessibilityBackdrop?.setAttribute('hidden', '');
  accessibilityTrigger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

accessibilityTrigger?.addEventListener('click', () => {
  if (accessibilityPanel?.hasAttribute('hidden')) {
    openAccessibilityPanel();
  } else {
    closeAccessibilityPanel();
  }
});

accessibilityClose?.addEventListener('click', () => {
  closeAccessibilityPanel();
  accessibilityTrigger?.focus();
});

accessibilityBackdrop?.addEventListener('click', closeAccessibilityPanel);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !accessibilityPanel?.hasAttribute('hidden')) {
    closeAccessibilityPanel();
    accessibilityTrigger?.focus();
  }
});

speakStart?.addEventListener('click', startPageReading);

speakPause?.addEventListener('click', () => {
  if (!speechSupported || !speechReading) return;

  if (speechPaused) {
    window.speechSynthesis.resume();
    speechPaused = false;
    setSpeechStatus(currentLanguage === 'en' ? 'Reading resumed.' : 'Leitura retomada.');
  } else {
    window.speechSynthesis.pause();
    speechPaused = true;
    setSpeechStatus(currentLanguage === 'en' ? 'Reading paused.' : 'Leitura pausada.');
  }

  updateSpeechButtons();
});

speakStop?.addEventListener('click', () => {
  if (!speechSupported) return;

  clearSpeechTimer();
  window.speechSynthesis.cancel();
  finishSpeech(currentLanguage === 'en' ? 'Reading stopped.' : 'Leitura interrompida.');
});

document.addEventListener('visibilitychange', () => {
  if (!speechSupported || !speechReading || speechPaused) return;

  if (document.visibilityState === 'visible' && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
});

window.addEventListener('beforeunload', () => {
  if (!speechSupported) return;
  clearSpeechTimer();
  window.speechSynthesis.cancel();
});

updateSpeechButtons();


// Initialize persisted language after all features are available.
applyLanguage(savedLanguage, false);


document.addEventListener('click', event => {
  if (!languagePanel || languagePanel.hasAttribute('hidden')) return;
  if (languageWidget?.contains?.(event.target)) return;
  languagePanel.setAttribute('hidden', '');
  languageTrigger?.setAttribute('aria-expanded', 'false');
});
