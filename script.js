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

const boolLabel = (value) => value === true ? 'Sim' : value === false ? 'Não' : 'Não informado';

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
  const cnae = data.cnae_fiscal_descricao || 'atividade informada no cadastro';
  const simples = data.opcao_pelo_simples;
  const mei = data.opcao_pelo_mei;

  if (status && status !== 'ATIVA') {
    tasks.push(taskCard(
      'Paralegal',
      'Situação cadastral merece atenção',
      `O cadastro aparece como "${status}". A A3 pode revisar a situação e orientar os próximos passos.`,
      true
    ));
  } else {
    tasks.push(taskCard(
      'Paralegal',
      'Cadastro e alterações',
      'A situação cadastral aparece ativa. A A3 pode apoiar alterações, atualizações e regularizações quando necessárias.'
    ));
  }

  let fiscalText = `A atividade principal cadastrada é "${cnae}". `;
  if (simples === true) {
    fiscalText += 'O cadastro indica opção pelo Simples Nacional; vale revisar enquadramento, tributos e obrigações aplicáveis.';
  } else if (simples === false) {
    fiscalText += 'O cadastro não indica opção atual pelo Simples Nacional; a A3 pode revisar enquadramento e obrigações fiscais.';
  } else {
    fiscalText += 'A A3 pode revisar enquadramento tributário, emissão de notas e obrigações relacionadas à atividade.';
  }
  tasks.push(taskCard('Fiscal', 'Enquadramento e obrigações', fiscalText));

  tasks.push(taskCard(
    'Contábil',
    'Organização e números',
    'Escrituração, balancetes e demonstrações podem ser revisados para apoiar a leitura financeira e a gestão da empresa.'
  ));

  if (mei === true) {
    tasks.push(taskCard(
      'MEI',
      'Obrigações e evolução do negócio',
      'O cadastro indica MEI. A A3 pode acompanhar obrigações e avaliar a transição para microempresa quando fizer sentido.'
    ));
  } else {
    tasks.push(taskCard(
      'RH & DP',
      'Rotinas trabalhistas',
      'A consulta pública do CNPJ não informa se há funcionários. Se houver equipe, a A3 pode revisar folha, encargos e obrigações trabalhistas.'
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
    cnpjError.textContent = 'Digite um CNPJ válido para continuar.';
    cnpjError.hidden = false;
    cnpjResult.hidden = true;
    cnpjInput.focus();
    return;
  }

  cnpjError.hidden = true;
  cnpjResult.hidden = true;
  cnpjSubmit.disabled = true;
  cnpjSubmit.innerHTML = 'Consultando…';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`/api/cnpj?cnpj=${encodeURIComponent(normalized)}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || 'Não foi possível consultar o CNPJ agora.');
    }

    const data = payload.data || payload;

    cnpjResultNumber.textContent = formatCnpj(data.cnpj || normalized);
    companyName.textContent = data.razao_social || 'Razão social não informada';
    tradeName.textContent = data.nome_fantasia && data.nome_fantasia !== data.razao_social ? data.nome_fantasia : '';
    companyStatus.textContent = data.descricao_situacao_cadastral || 'Não informado';

    const active = String(data.descricao_situacao_cadastral || '').toUpperCase() === 'ATIVA';
    companyStatus.classList.toggle('is-active', active);
    companyStatus.classList.toggle('is-warning', !active);

    companyLocation.textContent = [data.municipio, data.uf].filter(Boolean).join(' / ') || 'Não informado';
    companyCnae.textContent = data.cnae_fiscal_descricao || 'Não informado';
    companySize.textContent = data.porte || data.descricao_porte || 'Não informado';
    companySimples.textContent = boolLabel(data.opcao_pelo_simples);
    companyMei.textContent = boolLabel(data.opcao_pelo_mei);
    cnpjTasks.innerHTML = buildTasks(data);

    const summary = [
      `CNPJ ${formatted}`,
      data.razao_social ? `(${data.razao_social})` : '',
      data.descricao_situacao_cadastral ? `- situação ${data.descricao_situacao_cadastral}` : ''
    ].filter(Boolean).join(' ');

    const message = `Olá, vim pelo site da A3 SOLUC. Consultei ${summary} e gostaria de revisar quais serviços e obrigações fazem sentido para a empresa.`;
    cnpjWhatsapp.href = `https://wa.me/5511913298952?text=${encodeURIComponent(message)}`;

    cnpjResult.hidden = false;
    cnpjResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    cnpjError.textContent = error?.name === 'AbortError'
      ? 'A consulta demorou mais que o esperado. Tente novamente.'
      : (error?.message || 'Não foi possível consultar o CNPJ agora.');
    cnpjError.hidden = false;
  } finally {
    clearTimeout(timeout);
    cnpjSubmit.disabled = false;
    cnpjSubmit.innerHTML = 'Analisar CNPJ <span aria-hidden="true">→</span>';
  }
});

cnpjReset?.addEventListener('click', () => {
  cnpjResult.hidden = true;
  cnpjInput.value = '';
  cnpjError.hidden = true;
  cnpjInput.focus();
});
