const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildSvg = () => {
  const brand = escapeXml('A3 SOLUC');
  const subtitle = escapeXml('Contabilidade & Soluções Empresariais');
  const location = escapeXml('São Bernardo do Campo • SP');
  const services = escapeXml('Fiscal • Contábil • RH & DP • Paralegal • MEI • Imposto de Renda');
  const promise = escapeXml('Atendimento próximo, rápido e eficaz');
  const domain = escapeXml('a3soluccontabil.com.br');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#E4CF91"/>
        <stop offset=".55" stop-color="#C7A45C"/>
        <stop offset="1" stop-color="#9EA4AA"/>
      </linearGradient>
      <radialGradient id="glow" cx=".18" cy=".2" r=".9">
        <stop offset="0" stop-color="#B8924F" stop-opacity=".18"/>
        <stop offset=".65" stop-color="#111418" stop-opacity=".05"/>
        <stop offset="1" stop-color="#070809" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="#08090B"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

    <path d="M0 510 L360 630 H0 Z" fill="#B8924F" opacity=".12"/>
    <path d="M905 0 H1200 V250 Z" fill="#D6BF83" opacity=".08"/>
    <path d="M930 0 L1200 285" stroke="#C9A75F" stroke-width="2" opacity=".35"/>
    <path d="M875 0 L1200 345" stroke="#9EA4AA" stroke-width="1" opacity=".18"/>
    <path d="M0 100 L235 0" stroke="#C9A75F" stroke-width="2" opacity=".28"/>

    <g transform="translate(88 88)">
      <text x="0" y="116" font-family="Arial, Helvetica, sans-serif" font-size="142" font-weight="800" letter-spacing="-9" fill="url(#gold)">A3</text>
      <line x1="230" y1="18" x2="230" y2="132" stroke="#C9A75F" stroke-width="3" opacity=".8"/>
      <text x="270" y="101" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="700" letter-spacing="7" fill="#F0F1F2">${brand.replace('A3 ', '')}</text>
      <text x="274" y="147" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="400" letter-spacing="1.2" fill="#C7C9CC">${subtitle}</text>
    </g>

    <g transform="translate(88 288)">
      <circle cx="12" cy="0" r="8" fill="#C9A75F"/>
      <text x="36" y="10" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="500" fill="#E8E9EA">${location}</text>
      <line x1="0" y1="42" x2="1024" y2="42" stroke="#C9A75F" stroke-width="1.5" opacity=".45"/>
    </g>

    <text x="88" y="402" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="500" fill="#D6D8DA">${services}</text>

    <rect x="88" y="454" width="735" height="76" rx="38" fill="#0E1013" stroke="#C9A75F" stroke-width="2"/>
    <text x="125" y="503" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="500" fill="#F0F1F2">${promise}</text>

    <rect x="88" y="558" width="430" height="45" rx="22" fill="#111317" stroke="#545A60" stroke-width="1"/>
    <text x="117" y="589" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="500" fill="#D9DBDD">${domain}</text>

    <text x="1105" y="580" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" letter-spacing="3" fill="#C9A75F">A3 SOLUC</text>
  </svg>`;
};

let cachedPng;

module.exports = async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).end();
  }

  try {
    if (!cachedPng) {
      cachedPng = await sharp(Buffer.from(buildSvg()))
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', String(cachedPng.length));
    res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=2592000');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(cachedPng);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: 'Não foi possível gerar a imagem social.' });
  }
};
