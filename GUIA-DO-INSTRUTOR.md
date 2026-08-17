# Guia do Instrutor — Pokédex da Mata

Este guia é para **professores e instrutores** que vão replicar o projeto
"Pokédex da Mata" com uma turma — mesmo quem **não é da área de tecnologia**.
Está escrito de forma bem mastigada, passo a passo. Leia com calma; cada seção
explica **o que fazer** e **por quê**.

> **Resumo de 30 segundos:** é um app de uma página (`index.html`) que reconhece
> espécies por foto usando a inteligência artificial de visão do Google
> (Gemini). Cada aluno fica responsável por **um tema** (aves, frutas,
> insetos…). Publicamos o app no Vercel, e a chave secreta da IA fica
> **guardada no servidor**, nunca no navegador do aluno.

---

## 1. Baixar o código do repositório (clonar) — comece por aqui

Todo o código oficial e **sempre mais atualizado** vive neste repositório:

> **https://github.com/MathHenriq/Pokedex-da-Mata**

"Clonar" significa **baixar uma cópia** desse repositório para o seu computador,
de um jeito que permite **puxar as atualizações** depois com um comando só. É
assim que a turma garante que está usando a versão mais recente, seguindo sempre
o repositório oficial. Faça **exatamente** os passos abaixo, na ordem.

### Passo 1.1 — Instalar o Git

O Git é o programa que baixa e atualiza o código. Instale conforme o seu sistema:

**Windows**
1. Acesse **https://git-scm.com/download/win** — o download começa sozinho.
2. Abra o instalador e vá clicando em **"Next"** até **"Install"** (pode aceitar
   todas as opções padrão; não precisa mudar nada).
3. Ao terminar, abra o menu Iniciar, digite **"Git Bash"** e abra. É nessa
   janela preta que você vai digitar os comandos.

**macOS**
1. Abra o aplicativo **"Terminal"** (use a busca Spotlight: `Cmd + espaço`, digite
   "Terminal").
2. Digite o comando abaixo e tecle Enter:
   ```bash
   git --version
   ```
3. Se o Git não estiver instalado, o macOS abre uma janela oferecendo instalar as
   "ferramentas de linha de comando" — clique em **"Instalar"** e aguarde.
   *(Alternativa, se você usa o Homebrew: `brew install git`.)*

**Linux (Ubuntu/Debian)**
1. Abra o **Terminal**.
2. Rode:
   ```bash
   sudo apt update
   sudo apt install git -y
   ```

### Passo 1.2 — Conferir se o Git foi instalado

No terminal (no Windows, use o **Git Bash**), digite e tecle Enter:

```bash
git --version
```

Deve aparecer algo como `git version 2.43.0`. Se apareceu um número de versão,
**deu certo**. Se aparecer "comando não encontrado", refaça o Passo 1.1.

### Passo 1.3 — (Opcional, só na primeira vez) dizer ao Git quem é você

Isso só é necessário se você for **enviar mudanças** de volta ao GitHub. Para
apenas baixar/atualizar, pode pular. Se quiser configurar:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Passo 1.4 — Escolher a pasta onde o projeto vai ficar

Entre na pasta onde você quer guardar o projeto (por exemplo, a Área de
Trabalho). Escolha **uma** linha conforme o seu sistema:

```bash
# Windows (Git Bash)
cd ~/Desktop

# macOS / Linux
cd ~/Desktop
```

> `cd` quer dizer "entrar na pasta". `~` é a sua pasta pessoal.

### Passo 1.5 — Clonar (baixar) o repositório

Agora baixe o projeto com:

```bash
git clone https://github.com/MathHenriq/Pokedex-da-Mata.git
```

Isso cria uma pasta chamada **`Pokedex-da-Mata`** com todos os arquivos
(`index.html`, a pasta `api/`, este guia, etc.). Entre nela:

```bash
cd Pokedex-da-Mata
```

Para ver os arquivos que vieram:

```bash
# Windows (Git Bash), macOS e Linux
ls
```

Pronto: o código está no seu computador. Você já pode abrir o `index.html` no
navegador (ver a Seção 7 sobre teste local) ou publicar no Vercel (Seção 6).

### Passo 1.6 — Baixar as ATUALIZAÇÕES depois (manter sempre o repo mais novo)

Sempre que o repositório oficial receber melhorias, **não precisa clonar de
novo**. Dentro da pasta `Pokedex-da-Mata`, rode:

```bash
git pull origin main
```

Esse comando puxa as últimas mudanças da branch principal (`main`) e atualiza os
seus arquivos. Faça isso antes de cada aula para garantir que a turma está com a
versão mais recente.

> **Dica:** se você (ou um aluno) tiver alterado arquivos localmente e o
> `git pull` reclamar de conflito, o jeito mais simples para quem só quer a
> versão oficial é guardar suas mudanças à parte com `git stash` e então rodar o
> `git pull` de novo. Em turma, o ideal é que cada aluno trabalhe na sua própria
> cópia/fork para evitar isso.

---

## 2. Visão geral — como o app funciona

O caminho que uma foto percorre é simples:

```
   [Aluno tira/envia a foto no app]
                 │
                 ▼
   index.html  (roda no navegador do aluno)
                 │   envia a foto
                 ▼
   /api/identificar   (o "proxy" — roda no servidor do Vercel)
                 │   anexa uma CHAVE secreta (GEMINI_API_KEY…)
                 │   e troca de chave sozinho se a cota estourar
                 ▼
   API do Google Gemini   (a inteligência artificial)
                 │   devolve nome, curiosidades, biomas, habitat…
                 ▼
   index.html  desenha a ficha bonita na tela
```

Pontos importantes dessa figura:

- **O app (`index.html`)** é o rosto: telas, botões, fotos, mapa, animações.
- **O proxy (`api/identificar.js`)** é o porteiro: a única peça que conhece a
  chave secreta. Ele recebe a foto do app, fala com o Google e devolve a
  resposta. Roda no servidor, longe dos olhos do aluno.
- **O Gemini** é o cérebro: olha a foto e responde em português, num formato
  fixo, com nome popular, nome científico, biomas, habitat e curiosidades.

**Por que esse vai-e-volta pelo proxy?** Para a chave da IA **nunca** ficar
exposta. Se a chave estivesse dentro do `index.html`, qualquer pessoa poderia
copiá-la e gastar a sua cota. Colocando-a só no servidor, ela fica protegida.

---

## 3. Pré-requisitos

Você (instrutor) vai precisar de:

- [ ] O **Git instalado** e o projeto **clonado** (Seção 1).
- [ ] Uma **conta Google** (para criar a chave do Gemini).
- [ ] Uma **conta no Vercel** (grátis) — pode entrar com o GitHub.
- [ ] Uma **conta no GitHub** com este projeto (faça um *fork* ou suba os
      arquivos `index.html` e a pasta `api/`).
- [ ] Um **navegador** (Chrome, Edge, Firefox…) e internet.
- [ ] *(Opcional, para testar local sem publicar)* nada além do navegador — dá
      para abrir o `index.html` direto e colar uma chave na engrenagem.

Fora o Git (Seção 1), não é preciso instalar programas de desenvolvedor. O resto
é feito por sites.

---

## 4. Criar os projetos no Google Cloud e gerar as chaves do Gemini

### A regra de ouro: **a cota é por PROJETO, não por chave**

Esta é a informação mais importante deste guia, e a que mais causa dor de
cabeça. O Google conta o limite gratuito **por projeto do Google Cloud**, por
modelo e por dia. Consequência prática:

| O que você faz | Ganha cota? |
|---|---|
| Criar 3 chaves dentro do **mesmo** projeto | ❌ **Não.** As 3 dividem a mesma cota. |
| Criar 1 chave em cada um de **3 projetos** | ✅ **Sim.** Três cotas separadas. |
| Usar a mesma chave em 2 sites diferentes | ❌ Não. Continua a mesma cota. |

Ou seja: **"ter mais chaves" só ajuda se cada chave vier de um projeto
diferente.** É exatamente isso que o app agora sabe fazer sozinho (Seção 5).

**Por que 1 projeto por turma?** Se cada turma tiver o seu próprio projeto (e
sua própria chave), o uso de uma turma **não derruba** a outra — a cota fica
isolada. Também fica mais fácil desativar a chave de uma turma específica
depois do curso.

### Passo a passo (pelo Google AI Studio)

1. Acesse **https://aistudio.google.com/apikey** e entre com a conta Google.
2. Clique em **"Create API key"** (Criar chave de API).
3. Quando ele pedir o projeto, escolha **"Create a new project"** (Criar novo
   projeto) e dê um nome que identifique a turma, por exemplo
   `pokedex-turma-7A`. *(Assim cada turma tem o seu projeto = cota isolada.)*
4. Confirme. Ele vai gerar a chave. **Dois formatos são normais:** as antigas
   começam com **`AIza...`** e as novas com **`AQ.Ab8...`**. As duas funcionam
   igual neste app — não se assuste se a sua vier diferente da do colega.
5. **Copie a chave e guarde em lugar seguro** (um bloco de notas privado). Trate
   como uma senha: **não** mande por grupo público, **não** coloque em
   slides, **não** cole em chat/IA, **não** suba para o GitHub. Se escapar,
   **apague a chave** no AI Studio e gere outra — é rápido e resolve.

> **Confira em qual projeto cada chave nasceu.** A lista em
> https://aistudio.google.com/apikey mostra o **projeto** de cada chave. Se duas
> chaves mostram o mesmo projeto, elas dividem a mesma cota (e não adiantam como
> reserva). É o erro mais comum de quem tenta "ter mais chaves".

Para ter uma **segunda chave de reserva**, repita os passos 2 a 5 e, no passo 3,
crie **outro projeto** (`pokedex-turma-7A-reserva`). Se o AI Studio não oferecer
a opção "Create a new project", veja a Seção 9.2 — é o problema mais comum.

> Se preferir o console completo do Google Cloud
> (https://console.cloud.google.com), o equivalente é: criar um projeto novo →
> ativar a **"Generative Language API"** → criar uma credencial do tipo
> **API key**. O AI Studio acima já faz isso por você de forma mais curta.

Repita esse processo **uma vez por turma** (e mais uma vez, em outro projeto,
se quiser a chave reserva).

---

## 5. Configurar a variável GEMINI_API_KEY no Vercel (chave só no servidor)

Aqui está o passo que mantém a chave segura. Em vez de escrever a chave no
código, nós a guardamos como uma **"variável de ambiente"** no Vercel — uma
gaveta trancada do servidor. O proxy (`api/identificar.js`) lê dessa gaveta
quando precisa.

1. No painel do **Vercel**, abra o seu projeto (ou importe-o primeiro — veja a
   Seção 6 sobre deploy).
2. Vá em **Settings** (Configurações) → **Environment Variables** (Variáveis de
   Ambiente).
3. Crie uma nova variável:
   - **Name** (nome): `GEMINI_API_KEY`  ← precisa ser **exatamente** isso.
   - **Value** (valor): cole a chave da turma (`AIza...` ou `AQ.Ab8...`).
   - **Environments**: deixe marcado **Production** (e, se quiser, Preview e
     Development também).
4. Clique em **Save** (Salvar).
5. **Importante:** variáveis novas só passam a valer num **deploy novo**. Se o
   site já estava publicado, vá em **Deployments**, abra o último e clique em
   **Redeploy** (Reimplantar). Sem isso, o servidor ainda não enxerga a chave.

> O nome `GEMINI_API_KEY` não é por acaso: é exatamente o nome que o proxy
> procura (`process.env.GEMINI_API_KEY` no arquivo `api/identificar.js`).
> Se digitar diferente, o app vai responder *"GEMINI_API_KEY não configurada no
> servidor."*

### 5.1 — Chaves de reserva (revezamento automático)

O proxy aceita **várias chaves** e troca de chave sozinho quando uma bate no
limite. Basta criar mais variáveis, do mesmo jeito do passo 3 acima:

| Nome da variável | Valor |
|---|---|
| `GEMINI_API_KEY` | a chave principal (projeto 1) |
| `GEMINI_API_KEY_2` | a chave reserva (projeto 2) |
| `GEMINI_API_KEY_3` | mais uma reserva (projeto 3) — e assim até `_10` |

*(Alternativa: colocar todas na `GEMINI_API_KEY` mesmo, separadas por vírgula.)*

Como o proxy usa isso:

- **Reveza a ordem** a cada foto — a 1ª foto começa pela chave 1, a 2ª pela
  chave 2… Assim o gasto se espalha em vez de torrar a chave 1 primeiro.
- **Troca na hora** se uma chave responder "sem cota" (429), "sem permissão"
  (403) ou "inválida" (400). O aluno nem percebe.
- **Última cartada:** se *todas* as chaves estourarem a cota do modelo, ele
  tenta de novo com o `gemini-3.5-flash-lite`, que tem cota própria. Para
  desligar isso, crie a variável `GEMINI_MODELO_RESERVA` vazia.

> ⚠️ **Só funciona se as chaves forem de projetos diferentes** (Seção 4). Duas
> chaves do mesmo projeto dividem a mesma cota e vão estourar juntas.

**Como conferir se está revezando:** abra o site, aperte `F12` → aba
**Network** → tire uma foto → clique em `identificar` → veja em **Response
Headers** o `X-Chave-Usada` (o *número* da chave, nunca o valor) e o
`X-Modelo-Usado`. Se aparecer `X-Modelo-Usado: gemini-3.5-flash-lite`, é sinal
de que as chaves principais já estão no limite.

Lembre-se: **variável nova só vale depois de um deploy novo** (Redeploy).

---

## 6. Deploy no Vercel — passo a passo

"Deploy" é só **publicar** o app na internet, com um endereço próprio.

1. Garanta que o projeto (com `index.html` e a pasta `api/`) está num
   repositório no **GitHub**.
2. Acesse **https://vercel.com** e entre (pode usar o login do GitHub).
3. Clique em **"Add New…" → "Project"**.
4. Escolha **"Import"** no repositório do GitHub do projeto.
5. Na tela de configuração:
   - **Framework Preset**: pode deixar em **"Other"** (é um site simples).
   - **Root Directory**: deixe a raiz (onde está o `index.html`).
   - **Build/Output**: não precisa mexer — não há etapa de compilação.
6. *(Recomendado fazer já agora)* abra **Environment Variables** e adicione a
   `GEMINI_API_KEY` (Seção 5). Assim o primeiro deploy já sai com a chave.
7. Clique em **"Deploy"** e aguarde. Ao terminar, o Vercel mostra um endereço,
   algo como `https://pokedex-da-mata-suaturma.vercel.app`.
8. Abra esse endereço no celular ou no computador e teste tirando uma foto.

**Como saber se o proxy está no ar?** A pasta `api/` vira automaticamente uma
"função serverless" no Vercel: o arquivo `api/identificar.js` fica acessível no
endereço `.../api/identificar`. Você não precisa configurar nada extra para
isso — é só ter a pasta `api/` no projeto.

> **Atualizações:** sempre que você (ou um aluno) mudar o código no GitHub, o
> Vercel publica de novo sozinho. Conveniente para corrigir um tema e ver no ar
> em segundos.

---

## 7. Teste local (engrenagem/localStorage) vs produção (proxy)

O app foi feito para funcionar dos **dois jeitos**. Entender a diferença evita
confusão na hora de testar.

### Produção (site publicado no Vercel) — o jeito normal
- O app **não tem** a chave.
- Ao identificar, ele envia a foto para `/api/identificar`, e **o servidor**
  usa a `GEMINI_API_KEY`.
- O aluno **não precisa** fazer nada de chave. É só usar.

### Teste local (abrir o `index.html` direto, sem publicar)
- Não existe servidor, então não há proxy.
- Nesse caso, clique na **engrenagem** (canto superior direito), cole a sua
  chave (`AIza...` ou `AQ.Ab8...`) e salve. Ela fica guardada **só naquele navegador**
  (tecnologia `localStorage`) e o app passa a falar direto com o Google.
- Dá para colar **mais de uma chave, uma por linha**: se a primeira ficar sem
  cota, o app tenta a seguinte sozinho — desde que sejam de **projetos
  diferentes** (Seção 4).
- O app percebe sozinho que está rodando local (endereço começa com `file:`) e
  só aí ele exige a chave. Se você não colar nada, ele te lembra com um aviso.

| | Produção (Vercel) | Teste local (arquivo) |
|---|---|---|
| Onde a chave fica | No servidor (`GEMINI_API_KEY`) | No navegador (engrenagem) |
| Aluno digita chave? | **Não** | Sim, uma vez |
| Caminho da IA | App → `/api/identificar` → Google | App → Google (direto) |
| Recomendado para | Uso com a turma | Conferir rápido no seu PC |

> **Cuidado ao demonstrar com a turma:** se você colar a chave na engrenagem de
> um computador compartilhado, ela fica salva naquele navegador. Em
> equipamentos de uso comum, prefira sempre o **site publicado**, que não pede
> chave nenhuma do aluno. E, como a janela agora aceita várias chaves, ela as
> mostra **em texto** (não mais como senha) — **não abra a engrenagem com a
> tela projetada** para a turma.

---

## 8. "Um tema por aluno" — como personalizar a lente

Esta é a parte que **cada aluno** mexe. Todos os temas vivem numa lista chamada
`TEMAS`, lá no `index.html` (procure por `const TEMAS = [`). Cada tema é um
bloco entre chaves `{ … }`. Para criar/ajustar o seu, o aluno copia um bloco,
cola e troca os campos.

Exemplo de um tema (com comentários do que é cada campo):

```js
{ id:"aves",                         // apelido curto, sem espaço/acento, ÚNICO
  nome:"Aves do Brasil",             // título que aparece no cartão
  desc:"Pássaros e aves nativas",    // frase pequena embaixo do nome
  alvo:"ave brasileira",             // O QUE a IA deve procurar na foto
  especialista:"um ornitólogo brasileiro especialista nas aves do Brasil",
                                     // o "personagem" que a IA encarna
  cor:"#3ef0a0", cor2:"#22d3ee",     // as duas cores do tema (ver aviso abaixo)
  icone:"🐦" },                      // emoji que aparece no Safari
```

Campos que dão mais resultado quando bem feitos:

- **`alvo`** e **`especialista`**: são o que mais mudam a **qualidade** da
  resposta. Quanto mais específico o especialista (ex.: "um etnobotânico
  especialista em plantas medicinais brasileiras"), melhor e mais no tom certo
  a IA responde.
- **`nome` / `desc`**: aparecem no cartão do catálogo.
- **`cor` / `cor2`**: pintam o app inteiro quando o tema é aberto.
- **`icone`**: um emoji.
- **`aviso`** *(opcional)*: se você adicionar este campo com um texto de
  segurança, o app mostra a tarja de alerta **e** pede para a IA repetir o
  aviso numa curiosidade. Use em temas com risco. Exemplo:

```js
{ id:"cogumelos", nome:"Cogumelos e Fungos", desc:"Espécies do reino fungi",
  alvo:"cogumelo ou fungo",
  especialista:"um micólogo especialista em fungos e cogumelos",
  cor:"#f0765e", cor2:"#f0a05e", icone:"🍄",
  aviso:"NUNCA consuma um cogumelo identificado por aplicativo. Espécies tóxicas se parecem com comestíveis." },
```

### ⚠️ Aviso sobre contraste de cor (vermelho/verde)

As cores são em **código hexadecimal** (aquele `#` seguido de 6 caracteres).
Dois cuidados ao escolher:

1. **O fundo do app é escuro.** Cores muito escuras (ex.: um azul-marinho quase
   preto) somem no fundo e deixam textos e botões difíceis de ler. Prefira
   cores **vivas e claras o suficiente** para brilhar sobre o escuro.
2. **Pense em quem não distingue vermelho de verde.** Daltonismo
   vermelho-verde é comum. Se o seu tema usar **vermelho e verde** como as duas
   cores principais (`cor` e `cor2`), parte da turma pode não diferenciar uma
   da outra. Combine cores que também variem em **brilho/claridade**, não só em
   matiz — assim a diferença aparece para todo mundo. Uma boa dupla mistura
   tons distintos (ex.: verde + ciano, laranja + amarelo) em vez de
   vermelho + verde de brilho parecido.

> Dica prática: depois de trocar as cores, abra o tema no app e confira se o
> texto continua legível e se os dois tons são distinguíveis. Se ficou
> "lavado" ou escondido, escolha outro par.

---

## 9. Quota do plano gratuito — o guia de sobrevivência

Esta é a seção para ler **antes** da aula. A cota gratuita do Gemini é curta e
o Google já a reduziu mais de uma vez, então vale entender como ela funciona em
vez de descobrir no meio da atividade.

### 9.1 — Como a cota funciona (e o mito das "várias chaves")

A cota tem **três contadores** ao mesmo tempo, e estourar **qualquer um** deles
já derruba a foto com erro **429**:

- **RPM** — requisições por minuto (a turma toda apertando o botão junto);
- **RPD** — requisições por **dia**, que zera à **meia-noite do Pacífico**
  (± 4h ou 5h da manhã no Brasil);
- **TPM** — tokens por minuto (foto é "cara" em tokens).

E o ponto que engana quase todo mundo:

> **A cota é contada por PROJETO do Google Cloud, por modelo — não por chave.**
> Criar 5 chaves no mesmo projeto dá 5 chaves com **a mesma** cota.

O erro que aparece na tela conta exatamente qual contador estourou. Neste, por
exemplo:

```
Quota exceeded for metric: generate_content_free_tier_requests,
limit: 20, model: gemini-2.5-flash
```

…o limite atingido foi de **20 requisições no plano gratuito para o modelo
`gemini-2.5-flash`**. Repare que ele nomeia o **modelo**: o
`gemini-3.5-flash-lite` tem contador **separado** — por isso trocar de modelo
funciona como respiro.

**Confira os seus limites reais** (eles mudam e variam por conta) em
**https://aistudio.google.com/app/rate-limits** ou https://ai.dev/rate-limit,
com o projeto certo selecionado no alto da página.

### 9.2 — "Tentei criar outra chave e não deixou"

Três causas, em ordem de frequência:

1. **Você criou a chave, mas no mesmo projeto.** Deu certo, só não adiantou —
   veja a tabela da Seção 4. Ao clicar em "Create API key", é preciso escolher
   **"Create a new project"**. Se essa opção não aparece, crie o projeto
   primeiro em **https://console.cloud.google.com/projectcreate**, depois volte
   ao AI Studio e aponte a chave para ele.
2. **A conta é gerenciada por uma escola/empresa (Google Workspace).** É o caso
   clássico do *"na outra conta está desabilitada"* e do **botão "Create API
   Key" cinza**. Vale a pena entender, porque é o problema que mais derruba
   turma inteira — e **criar um projeto novo NÃO resolve**. Detalhes em 9.2.1.
3. **Limite de projetos da conta.** Uma conta Google nova tem um teto de
   projetos no Cloud. Apague projetos velhos
   (https://console.cloud.google.com/cloud-resource-manager) ou use outra conta.

#### 9.2.1 — O botão "Create API Key" está cinza (política da organização)

Sintoma exato: a página abre normalmente, mas o botão de criar a chave está
**desabilitado**, sem mensagem de erro. Acontece igual num projeto recém-criado.

**Por quê:** as chaves novas do Gemini são **vinculadas a uma service account**,
e existe uma restrição chamada `iam.managed.disableServiceAccountApiKeyCreation`
que vem **ativada por padrão em organizações** do Google Cloud. Contas de
escola/empresa (Workspace) ficam dentro de uma organização, e a política é
**herdada por todos os projetos filhos**. Ou seja: qualquer projeto que você
criar com essa conta já nasce bloqueado.

**Como confirmar (30 segundos):**

1. **Passe o mouse por cima do botão cinza.** O aviso costuma dizer *"You do not
   have permission to create a key in this project"*.
2. Abra o **seletor de projeto** no topo. Se aparecer o nome da escola como
   **organização** acima do projeto, é isso mesmo.

**Como resolver**, em ordem de praticidade:

1. **Use uma conta `@gmail.com` pessoal.** Projetos criados por conta pessoal
   nascem **sem organização** — sem política herdada, botão liberado. É a saída
   que a própria documentação do Google sugere: *"criar um novo projeto do
   Google Cloud que não esteja associado a uma organização"*.
2. **Peça à TI da escola** para marcar a política como *Not enforced* (dá para
   sobrescrever no nível do projeto, em IAM & Admin → Organization policies) e
   para te dar o papel de **Editor** no projeto.
3. Insistir na conta institucional sem 1 ou 2 não vai funcionar. **Nenhum ajuste
   no código deste projeto resolve isso** — é permissão da conta.

> **Atenção a qual tela você está usando.** A chave gratuita do curso sai em
> **https://aistudio.google.com/apikey**. A tela do **"Agent Platform"** no
> console do Google Cloud (Configurações → Chaves de API) é o produto
> *enterprise*, com outro fluxo e cobrança — não é o caminho deste guia.

### 9.3 — O que fazer quando estourar (na ordem)

O sintoma é o app mostrar *"Limite de requisições atingido…"*. O app **já tenta
sozinho de novo** algumas vezes e **já troca de chave** antes de desistir, então
picos pequenos se resolvem sozinhos.

1. **Configure chaves de reserva** — Seção 5.1. É a melhor defesa: 3 projetos =
   3 cotas, com troca automática. Faça isso *antes* da aula.
2. **Troque o modelo** para o mais leve (cota própria e maior). No `index.html`:

   ```js
   const MODELO = "gemini-3.5-flash-lite";
   ```

   A qualidade continua boa para o uso em sala. *(O proxy já cai para o
   `flash-lite` sozinho como última tentativa, mas fixar aqui economiza desde
   a primeira foto.)*
3. **Escalone o uso:** a turma toda disparando no mesmo minuto estoura o RPM
   mesmo com cota diária sobrando. Faça em levas de 4–5 alunos, ou peça que
   fotografem primeiro e identifiquem depois.
4. **Isole por turma** (Seção 4): uma turma não come a cota da outra.
5. **Ative o faturamento (Tier 1)** no projeto — veja 9.4.

### 9.4 — A saída definitiva: ativar faturamento (Tier 1)

Se o projeto é a espinha dorsal do curso, **não dependa do plano gratuito**.
Basta vincular um cartão ao projeto do Google Cloud
(https://aistudio.google.com/apikey → **"Set up billing"**) para o projeto subir
automaticamente para o **Tier 1**, com limites dezenas de vezes maiores.

Vale a pena saber:

- Você paga **só pelo que usar**, por token. Identificar uma foto com o
  `flash-lite` custa uma fração de centavo — uma turma inteira numa aula tende
  a custar **centavos**, não reais.
- Dá para **definir um limite de gastos** no Google Cloud (Billing → Budgets &
  alerts) e receber alerta por e-mail, para dormir tranquilo.
- Recomendação prática: ative o faturamento **na sua conta de instrutor**, que
  é a que roda a demonstração da aula, e deixe os alunos no plano gratuito.

### 9.5 — Planejando a turma: cada aluno com o SEU projeto

Como cada aluno vai criar o próprio projeto (Vercel + chave), a conta fecha bem:

- Cada aluno usa a **própria conta Google** → **próprio projeto** → **própria
  cota**. Um aluno estourar o limite **não afeta** os outros. Essa é a
  arquitetura certa, e ela já resolve 90% do problema.
- **Não** distribua a sua chave para a turma inteira: além do risco de
  vazamento, todos passam a dividir **uma** cota — e ela acaba em minutos.
- **Combine com antecedência** que a conta usada precisa ser **pessoal
  (`@gmail.com`)**, não a institucional da escola. Isso é **bloqueante**, não um
  detalhe: com a conta da escola o botão de criar a chave fica cinza para
  **todos** os alunos ao mesmo tempo (motivo em 9.2.1). Peça que criem a chave
  **em casa, um dia antes** — assim os problemas de conta aparecem antes da
  aula, e não durante.
- **Teste com um aluno-piloto** antes de levar para a turma: peça a um aluno que
  faça o caminho inteiro (criar chave → deploy) e conte onde travou. Vale também
  conferir se contas de menores de idade não esbarram em restrição de idade do
  Google.
- Leve um **plano B**: seu projeto com faturamento ativo (9.4) e chaves reserva
  configuradas, para demonstrar no telão se a chave de alguém falhar.
- Lembre à turma que a cota diária **zera de madrugada**: quem estourou hoje
  volta a ter as fotos amanhã.

### 9.6 — Quando o Google APOSENTA o modelo (erro 404)

De tempos em tempos o Google aposenta um modelo. O sintoma é claro e **não tem
nada a ver com cota**:

> *"Este modelo de IA foi aposentado pelo Google. Detalhe: This model
> models/… is no longer available to new users. Please update your code to use
> models/… for the latest features and improvements."*

**Uma pegadinha importante:** modelos são aposentados **primeiro para projetos
novos**. Ou seja, a sua chave antiga pode continuar funcionando enquanto as
chaves recém-criadas (e as dos alunos!) já dão 404 no mesmo app. Se "funciona no
meu e não no dos alunos", suspeite disso antes de qualquer outra coisa.

**O app aguenta o tranco sozinho:** ao receber 404, o proxy cai automaticamente
para o modelo de reserva (`GEMINI_MODELO_RESERVA`) e a aula continua. Você vai
notar pelo cabeçalho `X-Modelo-Usado`, que passa a mostrar o reserva.

**O conserto definitivo leva 1 minuto:**

1. Leia o nome do modelo que o próprio erro sugere.
2. No `index.html`, troque a linha:
   ```js
   const MODELO = "gemini-3.6-flash";
   ```
3. Publique (commit + push; o Vercel republica sozinho).
4. Se quiser, atualize também o `GEMINI_MODELO_RESERVA` no Vercel para um
   modelo `-lite` da mesma geração.

**Como saber quais modelos a sua chave aceita**, sem chutar: abra o endereço
abaixo no navegador, trocando `SUA_CHAVE` pela sua chave. Ele devolve a lista.

```
https://generativelanguage.googleapis.com/v1beta/models?key=SUA_CHAVE
```

> **Histórico deste projeto:** o app nasceu com `gemini-2.5-flash`. Em fevereiro
> de 2026 esse modelo parou de aceitar projetos novos, e o projeto passou para
> **`gemini-3.6-flash`** (reserva `gemini-3.5-flash-lite`). Se você clonou o
> repositório antes disso, rode `git pull origin main`.

---

## 10. Avisos de segurança que já existem no app

O app **não é** um guia para consumo, manuseio ou tratamento. Ele é educativo, e
a IA **pode errar**. Alguns temas já trazem avisos embutidos (o campo `aviso`),
que aparecem como tarja de alerta e são reforçados numa curiosidade:

- 🍄 **Cogumelos e Fungos:**
  *"NUNCA consuma um cogumelo identificado por aplicativo. Espécies tóxicas se
  parecem com comestíveis."*
- 🦎 **Répteis e Anfíbios:**
  *"Em caso de picada, procure atendimento médico imediato. Nunca manuseie o
  animal."*
- 🌿 **Plantas Medicinais:**
  *"As informações são educativas. Nunca use uma planta como remédio sem
  orientação de um profissional de saúde."*

Recomendações para conduzir com a turma:

- Reforce em voz alta a regra de ouro: **identificação por IA não é garantia.**
  Nunca comer, tocar ou usar como remédio algo com base no app.
- Outro detalhe de design seguro: o app **não chuta**. Quando a IA não tem pelo
  menos **80% de certeza** (o `LIMIAR_CONFIANCA` no código), ele mostra a tela
  *"Não consegui ter certeza"* em vez de inventar uma resposta. Isso é
  proposital — é melhor não responder do que responder errado.
- Se o aluno criar um tema novo com algum risco (animais peçonhentos, plantas,
  fungos), oriente-o a **adicionar o campo `aviso`** com a frase de segurança
  adequada.

---

### Apêndice — Onde fica cada coisa

| O quê | Onde |
|---|---|
| Telas, cores, lógica do app | `index.html` (arquivo único, todo comentado) |
| Lista de temas (cada aluno mexe) | `index.html`, procure `const TEMAS = [` |
| Qual modelo da IA usar | `index.html`, linha `const MODELO = …` |
| Nota de corte da confiança | `index.html`, `const LIMIAR_CONFIANCA = 80` |
| O proxy que guarda as chaves | `api/identificar.js` |
| A chave secreta | Vercel → Settings → Environment Variables → `GEMINI_API_KEY` |
| As chaves de reserva | Mesmo lugar → `GEMINI_API_KEY_2`, `_3`… (Seção 5.1) |
| Modelo usado quando a cota acaba | Vercel → `GEMINI_MODELO_RESERVA` (padrão: `gemini-3.5-flash-lite`) |
| Ver os limites da sua conta | https://aistudio.google.com/app/rate-limits |
| Modelo aposentado (erro 404) | Seção 9.6 — troque `const MODELO` no `index.html` |
| Baixar/atualizar o código | `git clone` / `git pull origin main` (Seção 1) |

Bom curso! 🌱
