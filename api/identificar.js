// ============================================================================
//  PROXY SERVERLESS  —  o "porteiro" que guarda as chaves da IA
// ============================================================================
//  PARA QUE ISSO EXISTE (em uma frase):
//  para a chave da API Gemini NUNCA aparecer no navegador do aluno.
//
//  COMO FUNCIONA: este arquivo NÃO roda no celular do aluno. Ele roda no
//  servidor do Vercel. Quando o app (index.html) precisa identificar uma foto,
//  ele manda a foto para cá (/api/identificar). Só ESTE código tem acesso às
//  chaves (guardadas em variáveis de ambiente, configuradas no painel do
//  Vercel). Ele anexa uma chave, fala com o Google e devolve a resposta para o
//  app. Resultado: a chave fica trancada no servidor.
//
//  "serverless" quer dizer que não precisamos manter um servidor ligado: o
//  Vercel executa esta função sozinho, só quando alguém chama o endereço.
//
//  ---------------------------------------------------------------------------
//  NOVIDADE: VÁRIAS CHAVES, COM REVEZAMENTO E TROCA AUTOMÁTICA
//  ---------------------------------------------------------------------------
//  O plano gratuito do Gemini tem cota curta e ela é contada POR PROJETO do
//  Google Cloud (não por chave!). Duas chaves do MESMO projeto dividem a MESMA
//  cota — não adianta nada. Duas chaves de PROJETOS DIFERENTES têm cotas
//  separadas, e é isso que este arquivo aproveita: você configura várias
//  chaves (uma de cada projeto) e, quando uma bate no limite, ele passa
//  sozinho para a próxima. Ver a Seção 9 do GUIA-DO-INSTRUTOR.
//
//  Onde colocar as chaves (no Vercel → Settings → Environment Variables):
//    - GEMINI_API_KEY ......... a principal. Pode conter VÁRIAS chaves
//                               separadas por vírgula, se preferir.
//    - GEMINI_API_KEY_2 ....... a segunda (reserva)
//    - GEMINI_API_KEY_3 ....... a terceira… e assim por diante, até _10.
//  Configurar só a GEMINI_API_KEY continua funcionando exatamente como antes.
const MODELO_VALIDO = /^[a-zA-Z0-9.\-]+$/;

//  Modelo de reserva: usado como última cartada em DOIS casos —
//   (1) todas as chaves estouraram a cota do modelo pedido (a cota é contada
//       por modelo, então o reserva tem contador próprio);
//   (2) o modelo pedido foi APOSENTADO pelo Google (erro 404 "no longer
//       available"). Isso acontece de tempos em tempos, e sem esta rede de
//       proteção o app quebraria no meio da aula. Ele continua funcionando
//       com o reserva enquanto o instrutor não atualiza o nome no index.html.
//  Para desligar, crie a variável GEMINI_MODELO_RESERVA vazia no Vercel.
const MODELO_RESERVA = process.env.GEMINI_MODELO_RESERVA !== undefined
  ? process.env.GEMINI_MODELO_RESERVA.trim()
  : "gemini-3.5-flash-lite";

// Status que significam "essa chave não pode agora, tente outra":
//   429 = estourou a cota / muitas requisições
//   403 = chave sem permissão (API não ativada naquele projeto, chave restrita)
//   400 = chave inválida (digitada errada, com espaço no meio…)
// Os três valem a pena tentar na chave seguinte, porque o problema é DAQUELA
// chave, não do pedido em si.
const TROCAR_DE_CHAVE = [400, 403, 429];
// Estes aqui são instabilidade do lado do Google: não adianta trocar de chave,
// mas vale esperar um instante e insistir.
const INSTABILIDADE = [500, 502, 503, 504];

/* lerChaves(): junta todas as chaves configuradas numa lista só.
   - aceita GEMINI_API_KEY, GEMINI_API_KEY_2 … GEMINI_API_KEY_10;
   - aceita várias chaves numa mesma variável, separadas por vírgula, ponto e
     vírgula, espaço ou quebra de linha;
   - descarta repetidas e vazias (erro comum: colar a mesma chave duas vezes). */
function lerChaves() {
  const nomes = ["GEMINI_API_KEY"];
  for (let i = 2; i <= 10; i++) nomes.push("GEMINI_API_KEY_" + i);
  const chaves = [];
  for (const nome of nomes) {
    const bruto = process.env[nome];
    if (!bruto) continue;
    for (const chave of bruto.split(/[\s,;]+/)) {
      const limpa = chave.trim();
      if (limpa && !chaves.includes(limpa)) chaves.push(limpa);
    }
  }
  return chaves;
}

/* De qual chave começar. Este número vive na memória do servidor entre um
   pedido e outro (enquanto a função está "quente") e anda de um em um. Serve
   para ESPALHAR o uso: o 1º aluno começa pela chave 1, o 2º pela chave 2, e
   assim por diante. Sem isso, a chave 1 gastaria toda a cota sozinha antes de
   a chave 2 ser usada uma única vez. */
let proximoInicio = 0;

/* chamarGoogle(): faz UMA tentativa — uma chave, um modelo. Devolve a resposta
   crua do Google (ou um "erro de rede" disfarçado de resposta 503, para o
   código de cima não quebrar se a internet do servidor falhar). */
async function chamarGoogle(modelo, chave, body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${chave}`;
  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await upstream.json().catch(() => ({}));
    return { status: upstream.status, data };
  } catch (e) {
    return { status: 503, data: { error: { message: "Não foi possível falar com o Google agora." } } };
  }
}

// req = o pedido que chega do app; res = a resposta que devolvemos a ele.
module.exports = async (req, res) => {
  // 1) Só aceitamos pedidos do tipo POST (o jeito de enviar dados). Qualquer
  //    outro método é recusado.
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Método não permitido." } });
    return;
  }

  // 2) Pegamos as chaves guardadas no servidor. Se nenhuma foi configurada no
  //    Vercel, avisamos com clareza (erro comum na primeira vez — ver o GUIA).
  const chaves = lerChaves();
  if (chaves.length === 0) {
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

  // 4) Montamos a ORDEM das tentativas:
  //    primeiro o modelo pedido em TODAS as chaves (começando por uma
  //    diferente a cada pedido, para espalhar o uso); e, se tudo falhar por
  //    cota, o modelo de reserva em todas as chaves de novo.
  const modelos = [modelo];
  if (MODELO_RESERVA && MODELO_RESERVA !== modelo) modelos.push(MODELO_RESERVA);
  const inicio = proximoInicio++ % chaves.length;

  let ultima = null;          // a última resposta ruim, para devolver ao app
  let houveCotaEstourada = false;  // alguma chave respondeu 429?
  let modeloAposentado = false;    // o modelo pedido não existe mais (404)?

  for (const modeloAtual of modelos) {
    for (let i = 0; i < chaves.length; i++) {
      // O "% chaves.length" faz a lista dar a volta: se começamos na chave 2 de
      // 3, a ordem vira 2 → 3 → 1. Todas são tentadas, só que em outra ordem.
      const indice = (inicio + i) % chaves.length;
      const r = await chamarGoogle(modeloAtual, chaves[indice], body);

      if (r.status >= 200 && r.status < 300) {
        // Deu certo. Estes dois cabeçalhos são só para DIAGNÓSTICO do
        // instrutor (aparecem na aba Network do navegador): dizem qual chave
        // (pelo número, nunca o valor!) e qual modelo responderam.
        res.setHeader("X-Chave-Usada", String(indice + 1));
        res.setHeader("X-Modelo-Usado", modeloAtual);
        res.status(r.status).json(r.data);
        return;
      }

      ultima = r;
      if (r.status === 429) houveCotaEstourada = true;
      // 404 = o modelo não existe (ou foi aposentado). Não adianta tentar as
      // outras chaves: o problema é o MODELO, não a chave. Saímos do laço das
      // chaves para ir direto ao modelo de reserva.
      if (r.status === 404) { modeloAposentado = true; break; }
      // Se o problema NÃO é da chave (ex.: instabilidade do Google, ou a foto
      // veio malformada), trocar de chave não resolve — paramos por aqui e
      // devolvemos o erro. O app tem o seu próprio "tentar de novo".
      if (!TROCAR_DE_CHAVE.includes(r.status)) {
        if (INSTABILIDADE.includes(r.status)) break;
        res.status(r.status).json(r.data);
        return;
      }
    }
    // Só vale a pena tentar o modelo de reserva se a barreira foi COTA (429) ou
    // MODELO APOSENTADO (404). Se as chaves são inválidas, o reserva falha igual.
    if (!houveCotaEstourada && !modeloAposentado) break;
  }

  // 5) Chegou aqui: todas as tentativas falharam. Devolvemos o último erro do
  //    Google, mas acrescentamos uma frase que explica o quadro para quem está
  //    na sala (o app mostra esse "Detalhe" na tela de erro).
  const data = ultima ? ultima.data : {};
  if (houveCotaEstourada && chaves.length > 1 && data && data.error) {
    data.error.message =
      `Todas as ${chaves.length} chaves configuradas estão sem cota agora. ` +
      (data.error.message || "");
  }
  if (modeloAposentado && data && data.error) {
    data.error.message =
      `O modelo "${modelo}" não está mais disponível, e o reserva ` +
      `("${MODELO_RESERVA}") também falhou. Atualize a linha const MODELO no ` +
      `index.html com o modelo sugerido abaixo. ` + (data.error.message || "");
  }
  res.setHeader("X-Chaves-Configuradas", String(chaves.length));
  res.status(ultima ? ultima.status : 503).json(data);
};
