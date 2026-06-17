// Proxy serverless: mantém a chave da Gemini API só no servidor (variável de
// ambiente GEMINI_API_KEY no painel do Vercel), nunca exposta no navegador.
const MODELO_VALIDO = /^[a-zA-Z0-9.\-]+$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Método não permitido." } });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: "GEMINI_API_KEY não configurada no servidor." } });
    return;
  }

  const { modelo, body } = req.body || {};
  if (!modelo || !MODELO_VALIDO.test(modelo) || !body) {
    res.status(400).json({ error: { message: "Requisição inválida." } });
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await upstream.json().catch(() => ({}));
  res.status(upstream.status).json(data);
};
