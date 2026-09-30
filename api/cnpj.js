const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const BURST_WINDOW_MS = 60 * 1000;
const BURST_MAX_REQUESTS = 8;
const RATE_LIMIT_STORE_MAX_KEYS = 5000;

const rateLimitStore =
  globalThis.__a3CnpjRateLimitStore ||
  (globalThis.__a3CnpjRateLimitStore = new Map());

const getClientIp = (req) => {
  const forwarded =
    req.headers['x-vercel-forwarded-for'] ||
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'];

  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const firstForwardedIp = String(value || '').split(',')[0].trim();

  return firstForwardedIp || req.socket?.remoteAddress || 'unknown';
};

const cleanupRateLimitStore = (now) => {
  if (rateLimitStore.size < RATE_LIMIT_STORE_MAX_KEYS) return;

  for (const [key, timestamps] of rateLimitStore) {
    const recent = timestamps.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recent.length) {
      rateLimitStore.set(key, recent);
    } else {
      rateLimitStore.delete(key);
    }

    if (rateLimitStore.size < RATE_LIMIT_STORE_MAX_KEYS) break;
  }
};

const checkRateLimit = (clientIp) => {
  const now = Date.now();
  cleanupRateLimitStore(now);

  const previous = rateLimitStore.get(clientIp) || [];
  const recent = previous.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  const burstCount = recent.filter(
    timestamp => now - timestamp < BURST_WINDOW_MS
  ).length;

  const windowExceeded = recent.length >= RATE_LIMIT_MAX_REQUESTS;
  const burstExceeded = burstCount >= BURST_MAX_REQUESTS;

  if (windowExceeded || burstExceeded) {
    const relevantWindow = burstExceeded
      ? BURST_WINDOW_MS
      : RATE_LIMIT_WINDOW_MS;

    const relevantTimestamps = burstExceeded
      ? recent.filter(timestamp => now - timestamp < BURST_WINDOW_MS)
      : recent;

    const oldestRelevant = relevantTimestamps[0] || now;
    const retryAfterMs = Math.max(
      1000,
      relevantWindow - (now - oldestRelevant)
    );

    rateLimitStore.set(clientIp, recent);

    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000)
    };
  }

  recent.push(now);
  rateLimitStore.set(clientIp, recent);

  return { allowed: true, retryAfterSeconds: 0 };
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({
      error: 'Muitas consultas em pouco tempo. Aguarde alguns instantes e tente novamente.'
    });
  }

  const raw = String(req.query?.cnpj || '').toUpperCase();

  if (raw.length > 32) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ error: 'CNPJ inválido ou mal formatado.' });
  }

  const cnpj = raw.replace(/[^0-9A-Z]/g, '');

  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(cnpj)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ error: 'CNPJ inválido ou mal formatado.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const upstream = await fetch(
      'https://brasilapi.com.br/api/cnpj/v1/' + encodeURIComponent(cnpj),
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'A3-SOLUC-Site/1.0'
        },
        signal: controller.signal
      }
    );

    const body = await upstream.json().catch(() => ({}));

    if (upstream.status === 404) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ error: 'CNPJ não encontrado na base pública.' });
    }

    if (upstream.status === 400) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(400).json({ error: 'CNPJ inválido ou mal formatado.' });
    }

    if (upstream.status === 429) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(503).json({
        error: 'O serviço de consulta está temporariamente ocupado. Tente novamente em instantes.'
      });
    }

    if (!upstream.ok) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({
        error: 'A fonte pública de CNPJ não respondeu corretamente.'
      });
    }

    const data = {
      cnpj: body.cnpj ?? cnpj,
      razao_social: body.razao_social ?? null,
      nome_fantasia: body.nome_fantasia ?? null,
      descricao_situacao_cadastral: body.descricao_situacao_cadastral ?? null,
      cnae_fiscal: body.cnae_fiscal ?? null,
      cnae_fiscal_descricao: body.cnae_fiscal_descricao ?? null,
      municipio: body.municipio ?? null,
      uf: body.uf ?? null,
      porte: body.porte ?? body.descricao_porte ?? null,
      descricao_porte: body.descricao_porte ?? body.porte ?? null,
      opcao_pelo_simples:
        typeof body.opcao_pelo_simples === 'boolean'
          ? body.opcao_pelo_simples
          : null,
      opcao_pelo_mei:
        typeof body.opcao_pelo_mei === 'boolean'
          ? body.opcao_pelo_mei
          : null
    };

    res.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400'
    );

    return res.status(200).json({ data });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');

    if (error?.name === 'AbortError') {
      return res.status(504).json({
        error: 'A consulta à fonte pública excedeu o tempo limite.'
      });
    }

    return res.status(502).json({
      error: 'Não foi possível consultar os dados públicos agora.'
    });
  } finally {
    clearTimeout(timeout);
  }
};
