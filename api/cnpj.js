module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const raw = String(req.query?.cnpj || '').toUpperCase();
  const cnpj = raw.replace(/[^0-9A-Z]/g, '');

  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(cnpj)) {
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
      return res.status(404).json({ error: 'CNPJ não encontrado na base pública.' });
    }
    if (upstream.status === 400) {
      return res.status(400).json({ error: 'CNPJ inválido ou mal formatado.' });
    }
    if (upstream.status === 429) {
      return res.status(503).json({ error: 'O serviço de consulta está temporariamente ocupado. Tente novamente em instantes.' });
    }
    if (!upstream.ok) {
      return res.status(502).json({ error: 'A fonte pública de CNPJ não respondeu corretamente.' });
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
      opcao_pelo_simples: typeof body.opcao_pelo_simples === 'boolean' ? body.opcao_pelo_simples : null,
      opcao_pelo_mei: typeof body.opcao_pelo_mei === 'boolean' ? body.opcao_pelo_mei : null
    };

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ data });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'A consulta à fonte pública excedeu o tempo limite.' });
    }
    return res.status(502).json({ error: 'Não foi possível consultar os dados públicos agora.' });
  } finally {
    clearTimeout(timeout);
  }
};
