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
                 │   anexa a CHAVE secreta (GEMINI_API_KEY)
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

## 4. Criar 1 projeto no Google Cloud por turma e gerar a chave do Gemini

**Por que 1 projeto por turma?** O plano gratuito tem um **limite diário** de
requisições. Se cada turma tiver o seu próprio projeto (e sua própria chave), o
uso de uma turma **não derruba** a outra — a cota fica isolada. Também fica mais
fácil desativar a chave de uma turma específica depois do curso.

Passo a passo (a forma mais simples é pelo Google AI Studio):

1. Acesse **https://aistudio.google.com/apikey** e entre com a conta Google.
2. Clique em **"Create API key"** (Criar chave de API).
3. Quando ele pedir o projeto, escolha **"Create a new project"** (Criar novo
   projeto) e dê um nome que identifique a turma, por exemplo
   `pokedex-turma-7A`. *(Assim cada turma tem o seu projeto = cota isolada.)*
4. Confirme. Ele vai gerar uma chave que **começa com `AIza...`**.
5. **Copie a chave e guarde em lugar seguro** (um bloco de notas privado). Trate
   como uma senha: **não** mande por grupo público, **não** coloque em
   slides, **não** suba para o GitHub.

> Se preferir o console completo do Google Cloud
> (https://console.cloud.google.com), o equivalente é: criar um projeto novo →
> ativar a **"Generative Language API"** → criar uma credencial do tipo
> **API key**. O AI Studio acima já faz isso por você de forma mais curta.

Repita esse processo **uma vez por turma**.

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
   - **Value** (valor): cole a chave `AIza...` da turma.
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
  chave `AIza...` e salve. Ela fica guardada **só naquele navegador**
  (tecnologia `localStorage`) e o app passa a falar direto com o Google.
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
> chave nenhuma do aluno.

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

## 9. Quota do plano gratuito — e o que fazer se estourar

O plano gratuito do Gemini tem **limites** (quantas fotos por minuto e por dia).
Numa turma inteira identificando ao mesmo tempo, é possível bater no teto. O
sintoma é o app mostrar:

> *"Limite de requisições atingido. Tente de novo em alguns instantes."*

(Isso é o erro **429** vindo do Google.) O app **já tenta sozinho de novo** umas
vezes antes de mostrar esse aviso, então picos pequenos costumam se resolver.

Se estourar com frequência, as saídas são:

1. **Trocar para um modelo mais leve.** No `index.html`, procure a linha:

   ```js
   const MODELO = "gemini-2.5-flash";   // troque por "gemini-2.5-flash-lite" pra mais requisições/dia
   ```

   Troque por:

   ```js
   const MODELO = "gemini-2.5-flash-lite";
   ```

   O `flash-lite` é mais econômico e **permite mais requisições por dia**. A
   qualidade continua boa para o uso em sala.

2. **Isolar por turma** (já recomendado na Seção 4): uma turma não consome a
   cota da outra.

3. **Escalonar o uso:** evitar que a turma toda dispare no mesmo minuto; fazer
   em pequenas levas.

4. *(Se o projeto crescer muito)* avaliar ativar faturamento no Google Cloud
   para subir os limites — normalmente desnecessário para uma turma.

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
| O proxy que guarda a chave | `api/identificar.js` |
| A chave secreta | Vercel → Settings → Environment Variables → `GEMINI_API_KEY` |
| Baixar/atualizar o código | `git clone` / `git pull origin main` (Seção 1) |

Bom curso! 🌱
