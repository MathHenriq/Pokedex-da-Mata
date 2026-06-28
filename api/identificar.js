// ============================================================================
//  PROXY SERVERLESS  —  o "porteiro" que guarda a chave da IA
// ============================================================================
//  PARA QUE ISSO EXISTE (em uma frase):
//  para a chave da API Gemini NUNCA aparecer no navegador do aluno.
//
//  COMO FUNCIONA: este arquivo NÃO roda no celular do aluno. Ele roda no
//  servidor do Vercel. Quando o app (index.html) precisa identificar uma foto,
//  ele manda a foto para cá (/api/identificar). Só ESTE código tem acesso à
//  chave (guardada na variável de ambiente GEMINI_API_KEY, configurada no
//  painel do Vercel). Ele anexa a chave, fala com o Google e devolve a
//  resposta para o app. Resultado: a chave fica trancada no servidor.
//
//  "serverless" quer dizer que não precisamos manter um servidor ligado: o
//  Vercel executa esta função sozinho, só quando alguém chama o endereço.
//
//  Esta linha é um "filtro de segurança": só aceita nomes de modelo formados
//  por letras, números, ponto e hífen (ex.: gemini-2.5-flash). Assim ninguém
//  consegue enfiar um endereço estranho no lugar do nome do modelo.
const MODELO_VALIDO = /^[a-zA-Z0-9.\-]+$/;

// req = o pedido que chega do app; res = a resposta que devolvemos a ele.
module.exports = async (req, res) => {
  // 1) Só aceitamos pedidos do tipo POST (o jeito de enviar dados). Qualquer
  //    outro método é recusado.
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Método não permitido." } });
    return;
  }

  // 2) Pegamos a chave guardada no servidor. Se ela não foi configurada no
  //    Vercel, avisamos com clareza (erro comum na primeira vez — ver o GUIA).
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: "GEMINI_API_KEY não configurada no servidor." } });
    return;
  }

  // 3) Lemos o que o app enviou: o nome do modelo e o "body" (instruções+foto).
  //    Conferimos se vieram e se o modelo passa no filtro de segurança acima.
  const { modelo, body } = req.body || {};
  if (!modelo || !MODELO_VALIDO.test(modelo) || !body) {
    res.status(400).json({ error: { message: "Requisição inválida." } });
    return;
  }

  // 4) Agora sim falamos com o Google, anexando a chave na URL, e repassamos
  //    exatamente o pacote que o app montou.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  // 5) Devolvemos a resposta do Google para o app, com o mesmo código de
  //    status. Se a resposta não for um JSON válido, devolvemos um objeto vazio
  //    em vez de quebrar.
  const data = await upstream.json().catch(() => ({}));
  res.status(upstream.status).json(data);
};
