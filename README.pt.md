<details>
<summary>Este documento também está disponível em outros idiomas</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Italiano](./README.it.md)
- [Svenska](./README.sv.md)
- [Polski](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licença: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Selo Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Status do Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Classificação de confiabilidade](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Classificação de segurança](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Classificação de manutenibilidade](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Dívida técnica](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilidades](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Linhas duplicadas (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Linhas de código](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Índice

- [Descrição](#descrição)
- [Visão geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Início rápido](#-início-rápido)
- [Arquitetura](#-arquitetura)
- [Modos de jogo detalhados](#-modos-de-jogo-detalhados)
- [Desenvolvimento](#-desenvolvimento)
- [Compatibilidade](#-compatibilidade)
- [Localização](#-localização)
- [Voz gravada](#-voz-gravada)
- [Armazenamento de dados](#-armazenamento-de-dados)
- [Relatar um problema](#-relatar-um-problema)
- [Licença](#-licença)

## Descrição

LeapMultix é uma aplicação web educativa e interativa destinada a crianças de 6 a 12 anos para dominar as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). Ela oferece **5 modos de jogo** e **4 minijogos de arcade** em uma interface intuitiva, acessível e multilíngue.

**Suporte a múltiplas operações:** os cinco modos aceitam as quatro operações. A escolha é feita na tela inicial e vale para todo o percurso.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL on-line:** https://leapmultix.jls42.org/

## 📸 Visão geral

### As telas

|                                                                                                              |                                                                                                                  |
| :----------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
|                 ![Tela «Quem está jogando?»: escolha do perfil](docs/media/01-accueil.webp)                  |                ![Menu principal: escolha da operação e dos cinco modos](docs/media/02-menu.webp)                 |
|               **Quem está jogando?** — um perfil por criança, com seu avatar e sua progressão.               |                 **O menu** — a operação é escolhida aqui e, depois, os cinco modos são abertos.                  |
|            ![Modo Descoberta: a tabuada do 4 mostrada com pontos](docs/media/03-decouverte.webp)             |          ![Modo Quiz: resposta errada em vermelho, resposta correta em verde](docs/media/04-quiz.webp)           |
| **Descoberta** — cada igualdade é mostrada com pontos, saltos ou contagem, acompanhada do truque da tabuada. | **Quiz** — a escolha da criança permanece exibida ao lado da resposta correta, e a explicação detalha o cálculo. |
|               ![Modo Desafio: contagem regressiva e sequência atual](docs/media/05-defi.webp)                |         ![Modo Aventura: mapa dos dez níveis, com os seguintes bloqueados](docs/media/06-aventure.webp)          |
| **Desafio** — corrida contra o tempo. Em caso de erro, o cronômetro para enquanto a resposta correta é lida. |                 **Aventura** — dez níveis que são abertos um após o outro, em troca de estrelas.                 |
|                        ![Menu Arcade: os quatro minijogos](docs/media/07-arcade.webp)                        |                ![Painel: estrelas por tabuada e estatísticas](docs/media/08-tableau-de-bord.webp)                |
|                 **Arcade** — quatro minijogos, com ajuste de dificuldade e escolha da nave.                  |                  **Painel** — estrelas por tabuada, tabuadas para revisar, pontuações por modo.                  |
|           ![Personalização: avatares, temas, acessibilidade](docs/media/09-personnalisation.webp)            |                                                                                                                  |
|        **Personalização** — avatar, tema de cores, tamanho do texto, alto contraste, código parental.        |                                                                                                                  |

### Os minijogos de arcade

Quatro jogos que fazem a mesma pergunta — aquela exibida acima da área de
jogo, com o tempo restante e as vidas —, mas exigem um gesto
diferente a cada vez.

|                                                                                                                    |                                                                                                          |
| :----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
|   ![MultiInvaders: monstros com números e uma nave na parte inferior da tela](docs/media/10-multiinvaders.webp)    | ![MultiMiam: um labirinto onde as pastilhas exibem as respostas possíveis](docs/media/11-multimiam.webp) |
|     **MultiInvaders** — atirar nas respostas erradas e poupar a correta: ela esconde um amigo a ser libertado.     |       **MultiMiam** — percorrer o labirinto para pegar o resultado correto, evitando os monstros.        |
| ![MultiMemory: uma grade de cartas, duas viradas mostrando um cálculo e um número](docs/media/12-multimemory.webp) |          ![MultiSnake: uma cobra e maçãs numeradas em um campo](docs/media/13-multisnake.webp)           |
|                     **MultiMemory** — lembrar qual carta contém o resultado do cálculo virado.                     |             **MultiSnake** — crescer engolindo os números corretos e evitar todos os outros.             |

## ✨ Funcionalidades

### 🎮 Modos de jogo

- **Modo Descoberta**: exploração visual e interativa adaptada a cada operação
- **Modo Quiz**: perguntas de múltipla escolha com suporte às 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio**: corrida contra o tempo com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: progressão narrativa por níveis com suporte às 4 operações

### 🕹️ Minijogos de arcade

- **MultiInvaders**: Space Invaders educativo — destruir as respostas erradas
- **MultiMiam**: Pac-Man matemático — coletar as respostas corretas
- **MultiMemory**: jogo da memória — associar operações e resultados
- **MultiSnake**: Snake educativo — crescer comendo os números corretos

### ➕ Suporte a múltiplas operações

LeapMultix oferece um treinamento completo das 4 operações aritméticas em **todos os modos**:

| Modo       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Desafio    | ✅  | ✅  | ✅  | ✅  |
| Descoberta | ✅  | ✅  | ✅  | ✅  |
| Aventura   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcionalidades transversais

- **Múltiplos usuários**: gerenciamento de perfis individuais com progressão salva
- **Multilíngue**: suporte a francês, inglês e espanhol
- **Personalização**: avatares, temas de cores, planos de fundo
- **Acessibilidade**: navegação por teclado, suporte a toque, conformidade com WCAG 2.1 AA
- **Voz gravada**: perguntas e incentivos lidos por uma voz sintetizada pré-gravada (criada com ElevenLabs), com fallback automático para a voz do dispositivo; clipes fora do repositório público (consulte [Voz gravada](#-voz-gravada))
- **Responsivo para dispositivos móveis**: interface otimizada para tablets e smartphones
- **Sistema de progressão**: pontuações, distintivos, desafios diários

## 🚀 Início rápido

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Um navegador web moderno

### Instalação

```bash
# Cloner le projet
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installer les dépendances
npm install

# Lancer le serveur de développement (option 1)
npm run serve
# L'application sera accessible sur http://localhost:8080 (ou port suivant disponible)

# Ou avec Python (option 2)
python3 -m http.server 8000
# L'application sera accessible sur http://localhost:8000
```

### Scripts disponíveis

```bash
# Développement
npm run serve          # Serveur local (http://localhost:8080)
npm run lint           # Vérification du code avec ESLint
npm run lint:fix       # Correction automatique des problèmes ESLint
npm run format:check   # Vérifier le formatage du code (TOUJOURS avant commit)
npm run format         # Formater le code avec Prettier
npm run verify         # Quality gate: lint + test + coverage

# Tests
npm run test           # Lancer tous les tests (CJS)
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Tests avec rapport de couverture
npm run test:core      # Tests des modules core uniquement
npm run test:integration # Tests d'intégration
npm run test:storage   # Tests du système de stockage
npm run test:esm       # Tests ESM (dossiers tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests avec sortie détaillée
npm run test:pwa-offline # Test offline PWA (nécessite Puppeteer), après `npm run serve`

# Analyse et maintenance
npm run analyze:jsdoc  # Analyse de la documentation
npm run improve:jsdoc  # Amélioration automatique JSDoc
npm run audit:mobile   # Tests responsivité mobile
npm run audit:accessibility # Tests d'accessibilité
npm run dead-code      # Détection de code non utilisé
npm run analyze:globals # Analyse des variables globales
npm run analyze:dependencies # Analyse usage des dépendances
npm run verify:cleanup # Analyse combinée (dead code + globals)

# Gestion des assets
npm run assets:generate    # Générer les images responsives
npm run assets:backgrounds # Convertir les fonds en WebP
npm run assets:analyze     # Analyse des assets responsive
npm run assets:diff        # Comparaison des assets

# Internationalisation
npm run i18n:verify    # Vérifier la cohérence des clés de traduction
npm run i18n:unused    # Lister les clés de traduction non utilisées
npm run i18n:compare   # Comparer les traductions (en/es) avec fr.json (référence)

# Build & livraison
npm run build          # Build de prod (Rollup) + postbuild (dist/ complet)
npm run serve:dist     # Servir dist/ sur http://localhost:5000 (ou port disponible)

# PWA et Service Worker
npm run sw:disable     # Désactiver le service worker
npm run sw:fix         # Corriger les problèmes de service worker

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Arquitetura

### Estrutura dos arquivos

Os módulos JavaScript estão **diretamente em `js/`**, com exceção de três pastas:
`core/`, `components/` e `modes/`. Portanto, é o nome do arquivo que indica o
agrupamento (`arcade-*`, `multimiam-*`, `i18n*`…).

```
leapmultix/
├── index.html              # Application (navigation par slides)
├── modes.html              # Page publique : les modes de jeu
├── parents.html            # Page publique : guide parents et enseignants
├── pwa.html                # Page publique : installation hors ligne
├── offline.html            # Page servie hors ligne par le service worker
├── sw.js                   # Service worker (version alignée sur js/cache-updater.js)
├── deploy.sh               # Déploiement S3 + invalidation CloudFront
├── js/
│   ├── core/               # Socle applicatif
│   │   ├── GameMode.js, GameModeManager.js   # Classe de base des modes
│   │   ├── storage.js, userState.js          # Persistance et session
│   │   ├── audio.js, theme.js, parental.js   # Son, thèmes, contrôle parental
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les cinq modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── VideoManager.js, responsive-image-loader.js
│   ├── userManager.js, main-helpers.js, utils-es6.js, questionGenerator.js
│   └── main-es6.js, main.js, bootstrap.js, game.js   # Points d'entrée
├── css/                    # Feuilles de style (jetons de design : themes.css)
├── assets/
│   ├── images/             # Sources PNG (avatars, sprites, fonds)
│   ├── generated-images/   # Variantes responsives (généré, hors git)
│   ├── fonts/, sounds/, videos/, icons/, social/
│   └── translations/       # fr.json, en.json, es.json
├── tests/__tests__/        # Tests Jest (jsdom, et bout-en-bout via Puppeteer)
├── tests-esm/              # Tests Jest en modules ES (.mjs)
├── scripts/                # Génération d'assets, i18n, rapports
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Arquitetura técnica

**Módulos ES6 modernos**: o projeto utiliza uma arquitetura modular com classes ES6 e imports/exports nativos.

**Componentes reutilizáveis**: interface construída com componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: carregamento inteligente de módulos sob demanda por meio de `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de armazenamento unificado**: API centralizada para a persistência dos dados dos usuários por meio do LocalStorage com fallbacks.

**Gerenciamento de áudio centralizado**: controle de som com suporte multilíngue e preferências por usuário.

**Event Bus**: comunicação orientada a eventos e desacoplada entre componentes para uma arquitetura de fácil manutenção.

**Navegação por slides**: sistema de navegação baseado em slides numerados (slide0, slide1 etc.) com `goToSlide()`.

**Segurança**: proteção contra XSS e sanitização por meio de `security-utils.js` em todas as manipulações do DOM.

## 🎯 Modos de jogo detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas de multiplicação com:

- Visualização interativa das multiplicações
- Animações e recursos mnemônicos
- Recurso educativo de arrastar e soltar
- Progressão livre por tabuada

### Modo Quiz

Perguntas de múltipla escolha com:

- 10 perguntas por sessão
- Progressão adaptativa conforme os acertos
- Teclado numérico virtual
- Sistema de streak (sequência de respostas corretas)

### Modo Desafio

Corrida contra o tempo com:

- 3 níveis de dificuldade (Iniciante, Médio, Difícil)
- Bônus de tempo para respostas corretas
- Sistema de vidas
- Classificação das melhores pontuações

### Modo Aventura

Progressão narrativa com:

- 10 níveis temáticos desbloqueáveis
- Mapa interativo com progressão visual
- História imersiva com personagens
- Sistema de estrelas e recompensas

### Minijogos de arcade

Cada minijogo oferece:

- Escolha de dificuldade e personalização
- Sistema de vidas e pontuação
- Controles por teclado e toque
- Classificações individuais por usuário

## 🔧 Desenvolvimento

### Workflow de desenvolvimento

**Nunca fazer commit diretamente na main.** O projeto trabalha com branches de
funcionalidade.

**1. Criar uma branch**, `feat/` para uma funcionalidade, `fix/` para uma correção:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Desenvolver e verificar.** A formatação vem primeiro: a CI a rejeita
antes mesmo de executar os testes.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Fazer commit na branch** e, depois, enviá-la:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir uma pull request** e aguardar as análises: verify, Codacy,
CodeFactor e SonarCloud. Os problemas devem ser corrigidos até tudo ficar verde antes da mesclagem.

**Estilo de commit**: mensagens concisas, no modo imperativo (ex.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: garantir que `npm run lint`, `npm test` e `npm run test:coverage` sejam aprovados antes de cada commit

### Arquitetura dos componentes

**GameMode (classe base)**: todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: orquestração centralizada da inicialização e do gerenciamento dos modos.

**Componentes UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface consistente.

**Lazy Loading**: os módulos são carregados sob demanda para otimizar o desempenho inicial.

**Event Bus**: comunicação desacoplada entre componentes por meio do sistema de eventos.

### Testes

O projeto inclui uma suíte de testes completa:

- Testes unitários dos módulos core
- Testes de integração dos componentes
- Testes dos modos de jogo
- Cobertura de código automatizada

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build de produção

- **Rollup**: gera o bundle de `js/main-es6.js` em ESM com code-splitting e sourcemaps
- **Terser**: minificação automática para otimização
- **Post-build**: copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o arquivo de entrada com hash (ex.: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integração contínua

**GitHub Actions**: `.github/workflows/ci.yml`, acionado a cada push em
`main` e a cada pull request.

**`verify`** — o quality gate, bloqueante:

- `npm ci` e depois `npm run verify` (ESLint, testes Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — depois de `verify`: auditoria Lighthouse do site on-line, para
acompanhar as métricas de SEO ao longo do tempo.

**Análises externas** integradas às pull requests: Codacy, CodeFactor e
SonarCloud. O quality gate do SonarCloud exige classificações A em confiabilidade, segurança e
manutenibilidade para o código novo.

**Implantação**: `./deploy.sh` sincroniza o site com o S3 e invalida o cache
do CloudFront. O script regenera, quando necessário, as imagens responsivas ausentes do git.

### PWA (Progressive Web App)

LeapMultix é uma PWA completa com suporte off-line e possibilidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback off-line para `offline.html`
- Imagens: Cache-first para otimizar o desempenho
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: Network-first para sempre servir a versão mais recente
- Gerenciamento automático de versão por meio de `cache-updater.js`

**Manifest** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Possibilidade de instalação em dispositivos móveis (Add to Home Screen)
- Configuração standalone para uma experiência semelhante à de um aplicativo
- Suporte a temas e cores

**Testar o modo off-line localmente.** Inicie o servidor e, depois, abra
`http://localhost:8080` (ou a porta exibida):

```bash
npm run serve
```

Manualmente: desative a rede nas ferramentas de desenvolvimento (aba Rede,
modo off-line) e atualize a página. `offline.html` deve ser exibido.

Automaticamente, com Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripts de gerenciamento do Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Padrões de qualidade

**Ferramentas de qualidade do código**:

- **ESLint**: Configuração moderna com flat config (`eslint.config.js`), suporte a ES2022
- **Prettier**: Formatação automática do código (`.prettierrc`)
- **Stylelint**: Validação de CSS (`.stylelintrc.json`)
- **JSDoc**: Documentação automática das funções com análise de cobertura

**Regras de código importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Utilizar um tratamento de erros específico (sem catch vazios)
- Evitar `innerHTML` em favor das funções `security-utils.js`
- Manter uma complexidade cognitiva < 15 para as funções
- Extrair funções complexas para helpers menores

**Segurança**:

- **Proteção contra XSS**: Utilizar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo textual
- **Scripts externos**: Atributo `crossorigin="anonymous"` obrigatório
- **Validação das entradas**: Sempre sanitizar os dados externos
- **Content Security Policy**: Headers CSP para restringir as fontes de scripts

**Acessibilidade**:

- Conformidade com WCAG 2.1 AA
- Navegação completa pelo teclado
- Funções ARIA e labels apropriados
- Contrastes de cores em conformidade

**Desempenho**:

- Lazy loading dos módulos por meio de `lazy-loader.js`
- Otimizações de CSS e assets responsivos
- Service Worker para cache inteligente
- Code splitting e minificação em produção

## 📱 Compatibilidade

### Navegadores compatíveis

A interface utiliza `oklch()` para as cores e `:has()` para os
estados contextuais, o que define os requisitos mínimos:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivos

- **Desktop**: Controles por teclado e mouse
- **Tablets**: Interface tátil otimizada
- **Smartphones**: Design responsivo adaptável

### Acessibilidade

- Navegação completa pelo teclado (Tab, setas, Esc)
- Funções ARIA e labels para leitores de tela
- Contrastes de cores em conformidade
- Suporte a tecnologias assistivas

## 🌍 Localização

Suporte multilíngue completo:

- **Francês** (idioma padrão)
- **Inglês**
- **Espanhol**

### Gerenciamento das traduções

**Arquivos de tradução:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de gerenciamento de i18n

**`npm run i18n:verify`** - Verificar a consistência das chaves de tradução

**`npm run i18n:unused`** - Listar as chaves de tradução não utilizadas

**`npm run i18n:compare`** - Comparar os arquivos de tradução com fr.json (referência)

Este script (`scripts/compare-translations.cjs`) garante a sincronização de todos os arquivos de idioma:

**Funcionalidades:**

- Detecção de chaves ausentes (presentes em fr.json, mas ausentes em outros idiomas)
- Detecção de chaves adicionais (presentes em outros idiomas, mas não em fr.json)
- Identificação de valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação da consistência dos tipos (string vs array)
- Achatamento das estruturas JSON aninhadas em notação de pontos (ex.: `arcade.multiMemory.title`)
- Geração de um relatório detalhado no console
- Salvamento do relatório JSON em `docs/translations-comparison-report.json`

**Exemplo de saída:**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 570 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 570
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 570 clés
  en.json: 570 clés
  es.json: 570 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Cobertura das traduções:**

- Interface do usuário completa
- Instruções dos jogos
- Mensagens de erro e de feedback
- Descrições e ajuda contextual
- Conteúdo narrativo do modo Aventura
- Labels de acessibilidade e ARIA

## 🔊 Voz gravada

O jogo lê em voz alta as perguntas, os incentivos e as explicações. Em francês, a voz é **Lucie**, uma voz sintética criada com ElevenLabs (modelo Eleven v3). O jogo utiliza apenas um conjunto limitado de frases, cerca de 7.400 por idioma: todas são gravadas antecipadamente, e nenhuma parte faz chamadas ao ElevenLabs. O inglês e o espanhol utilizam, por enquanto, a voz do dispositivo.

- **Fallback automático** para a voz do dispositivo, frase por frase: clipe ausente ou com erro, reprodução recusada pelo navegador, clipe que não inicia em 1,5 s ou modo offline sem o clipe no cache.
- **Configurações**: o botão de voz da barra superior ativa ou desativa a reprodução; a opção «Voz gravada» (Acessibilidade e controles) permite escolher entre Lucie e a voz do dispositivo.
- **Offline**: os clipes já ouvidos permanecem no cache (service worker).

### Os clipes não estão neste repositório

Os clipes ficam em um repositório privado e em um bucket S3 dedicado, disponibilizado pelo CloudFront em `/voice/*`. Portanto, um fork ou o desenvolvimento local mantém a voz do dispositivo: no repositório, a tag `<meta name="leapmultix-voice-base">` fica vazia, e somente o deploy de produção insere nela `/voice/`.

Com os clipes na máquina (repositório privado clonado ao lado do jogo, em `../leapmultix-voices`), o parâmetro `?voix=local` faz com que sejam reproduzidos pelo servidor de desenvolvimento:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Gerar os clipes

O processo está automatizado em `scripts/voice/` e é executado na máquina do proprietário, nunca na CI pública. A chave da ElevenLabs permanece em um arquivo `.env` fora do repositório, fornecido por meio de `node --env-file`: nenhuma chave entra no git. A skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) descreve o procedimento passo a passo (etapas de validação, aprovações e retomadas); os detalhes estão em [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** as frases restantes e os caracteres a pagar (Eleven v3: cerca de 0,53 crédito por caractere).
2. **Gerar**. Executar novamente o mesmo comando retoma o que estiver faltando. Quando os créditos acabam, o script é encerrado corretamente (código 3), sem deixar arquivos gravados pela metade.
3. **Verificar**: cada frase possui seu clipe e cada MP3 é válido. Em seguida, o Whisper transcreve cada clipe localmente, e `voice:check` sinaliza os números mal compreendidos e as durações anormais.
4. **Ouvir** na página de escuta (`voice:listen`) os clipes sinalizados e uma amostra de formas femininas («uma vez 7»), que o Whisper não distingue. Cada clipe possui uma opção «refazer», que o adiciona à lista de clipes descartados.
5. **Refazer** os clipes descartados (`--redo`) e executar novamente o Whisper; depois, comparar cada clipe antes e depois em uma segunda página. Um clipe que ainda seja pronunciado incorretamente após duas ou três tentativas recebe um texto imposto em `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por exemplo, o número por extenso.
6. **Publicar** os clipes, verificar se estão disponíveis online e, em seguida, publicar o índice do idioma, primeiro para os testadores (`?voix=test`).
7. **Disponibilizar** a voz para todos e, depois, ativá-la por padrão. O kill switch (`voice:publish -- remove`) remove um idioma do índice: o jogo volta a usar a voz do dispositivo.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000
# 3. Contrôler (Whisper s'installe une fois : voir l'en-tête de whisper_transcribe.py)
npm run voice:check -- --lang fr --probe
.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest ../leapmultix-voices/manifests/fr/<version>.json --clips ../leapmultix-voices/clips/fr/<version> --lang fr --out transcripts-fr.jsonl
npm run voice:check -- --lang fr --transcripts transcripts-fr.jsonl
# 4. Écouter (page locale ; la liste « à refaire » va dans ecartes.txt)
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl
# 5. Refaire (payant), relancer Whisper (il ne transcrit que les clips refaits), comparer
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Regra: uma frase falada que for modificada deve ser regravada antes de entrar em produção

Todas as frases faladas vêm das traduções (`assets/translations/{fr,en,es}.json`) e fazem parte do corpus. Portanto, alterar uma frase falada faz com que o teste de bloqueio do corpus (`scripts/voice/corpus.lock.json`) falhe. Para um idioma que possui voz gravada, os clipes das frases afetadas devem então ser gerados, verificados, ouvidos e publicados **antes** do merge. Por fim, o bloqueio é atualizado (`npm run voice:corpus:lock`). Sem esses clipes, a frase modificada é reproduzida com a voz do dispositivo.

## 📊 Armazenamento de dados

### Dados do usuário

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos de arcade
- Configurações de personalização

### Funcionalidades técnicas

- Armazenamento local (localStorage) com fallbacks
- Isolamento dos dados por usuário
- Salvamento automático do progresso
- Migração automática dos dados antigos

## 🐛 Relatar um problema

Os problemas podem ser relatados por meio das issues do GitHub. Inclua:

- Descrição detalhada do problema
- Etapas para reproduzi-lo
- Navegador e versão
- Capturas de tela, se forem relevantes

## 💝 Apoiar o projeto

**[☕ Fazer uma doação pelo PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está sob a licença AGPL v3. Consulte o arquivo `LICENSE` para obter mais detalhes.

---

_LeapMultix — aplicativo educacional livre para aprender as quatro operações_
