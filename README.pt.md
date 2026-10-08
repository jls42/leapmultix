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
[![Badge do Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
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
- [Modos de Jogo Detalhados](#-modos-de-jogo-detalhados)
- [Desenvolvimento](#-desenvolvimento)
- [Compatibilidade](#-compatibilidade)
- [Localização](#-localização)
- [Voz gravada](#-voz-gravada)
- [Armazenamento de dados](#-armazenamento-de-dados)
- [Relatar um problema](#-comunicar-um-problema)
- [Licença](#-licença)

## Descrição

LeapMultix é uma aplicação web educativa e interativa destinada a crianças dos 6 aos 12 anos para dominar as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). Oferece **6 modos de jogo** e **4 minijogos de arcade** numa interface intuitiva, acessível e multilíngue.

**Suporte a múltiplas operações:** todos os modos aceitam as quatro operações. A escolha é feita na tela inicial e aplica-se a todo o percurso.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Visão geral

### As telas

|                                                                                                                                   |                                                                                                                 |
| :-------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------: |
|                                ![Tela «Quem joga?»: escolha do perfil](docs/media/01-accueil.webp)                                |                ![Menu principal: escolha da operação e do modo de jogo](docs/media/02-menu.webp)                |
|                              **Quem joga?** — um perfil por criança, com seu avatar e seu progresso.                              |                       **O menu** — a operação é escolhida aqui e, depois, o modo de jogo.                       |
|                       ![Modo Descoberta: a tabuada do 4 mostrada em pontos](docs/media/03-decouverte.webp)                        |          ![Modo Quiz: resposta errada em vermelho, resposta correta em verde](docs/media/04-quiz.webp)          |
|              **Descoberta** — cada igualdade é mostrada em pontos, em saltos ou em contagem, com a dica da tabuada.               | **Quiz** — a escolha da criança continua visível ao lado da resposta correta, e a explicação detalha o cálculo. |
|                      ![Modo Desafio: contagem regressiva e sequência em andamento](docs/media/05-defi.webp)                       |         ![Modo Aventura: mapa dos dez níveis, com os seguintes bloqueados](docs/media/06-aventure.webp)         |
|          **Desafio** — corrida contra o tempo. Em caso de erro, o cronômetro para durante a leitura da resposta correta.          |             **Aventura** — dez níveis que são desbloqueados um após o outro, em troca de estrelas.              |
|                ![Modo Cronômetro: uma corrida de subtração, o cronômetro e o progresso](docs/media/14-chrono.webp)                |                         ![Menu Arcade: os quatro minijogos](docs/media/07-arcade.webp)                          |
| **Cronômetro** — dez respostas corretas contra o tempo, na operação escolhida; os cálculos errados vão para uma lista de revisão. |                   **Arcade** — quatro minijogos, com ajuste de dificuldade e escolha da nave.                   |
|        ![Painel: partidas, recordes e respostas de cada modo, detalhados por operação](docs/media/08-tableau-de-bord.webp)        |             ![Personalização: avatares, temas, acessibilidade](docs/media/09-personnalisation.webp)             |
|    **Painel** — partidas e recordes de cada modo, detalhados por operação; estrelas e tabuadas para revisar em multiplicação.     |                  **Personalização** — avatar, tema de cores, tamanho do texto, alto contraste.                  |

### Os minijogos de arcade

Quatro jogos que fazem a mesma pergunta — a exibida acima da área de
jogo, com o tempo restante e as vidas —, mas exigem um gesto
diferente a cada vez.

|                                                                                                                     |                                                                                                          |
| :-----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| ![MultiInvaders: monstros carregando números, uma nave na parte inferior da tela](docs/media/10-multiinvaders.webp) | ![MultiMiam: um labirinto onde as pastilhas exibem as respostas possíveis](docs/media/11-multimiam.webp) |
|  **MultiInvaders** — atirar nas respostas erradas e poupar a correta: ela esconde um amigo que deve ser libertado.  |      **MultiMiam** — percorrer o labirinto para capturar o resultado correto, evitando os monstros.      |
| ![MultiMemory: uma grade de cartas, duas viradas mostrando um cálculo e um número](docs/media/12-multimemory.webp)  |           ![MultiSnake: uma cobra e maçãs numeradas num campo](docs/media/13-multisnake.webp)            |
|                    **MultiMemory** — lembrar qual carta contém o resultado do cálculo revelado.                     |             **MultiSnake** — crescer engolindo os números corretos e evitar todos os outros.             |

## ✨ Funcionalidades

### 🎮 Modos de Jogo

- **Modo Descoberta**: exploração visual e interativa adaptada a cada operação
- **Modo Quiz**: perguntas de múltipla escolha com suporte às 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio**: corrida contra o tempo com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: progressão narrativa por níveis com suporte às 4 operações
- **Modo Cronômetro**: 10 respostas corretas contra um cronômetro que não para, para superar o melhor tempo, com as 4 operações (×, +, −, ÷)

### 🕹️ Minijogos de Arcade

- **MultiInvaders**: Space Invaders educativo - Destruir as respostas erradas
- **MultiMiam**: Pac-Man matemático - Coletar as respostas corretas
- **MultiMemory**: jogo da memória - Associar operações e resultados
- **MultiSnake**: Snake educativo - Crescer comendo os números corretos

### ➕ Suporte a Múltiplas Operações

LeapMultix oferece um treinamento completo nas 4 operações aritméticas em **todos os modos**:

| Modo       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Desafio    | ✅  | ✅  | ✅  | ✅  |
| Descoberta | ✅  | ✅  | ✅  | ✅  |
| Aventura   | ✅  | ✅  | ✅  | ✅  |
| Cronômetro | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcionalidades Transversais

- **Múltiplos usuários**: gerenciamento de perfis individuais com progresso salvo
- **Multilíngue**: suporte a francês, inglês e espanhol
- **Personalização**: avatares, temas de cores, planos de fundo
- **Acessibilidade**: navegação por teclado, suporte a telas sensíveis ao toque, conformidade com WCAG 2.1 AA
- **Voz gravada**: o jogo consegue ler perguntas e incentivos com uma voz de síntese pré-gravada, recorrendo automaticamente à voz do dispositivo. As vozes não estão neste repositório: o site leapmultix.jls42.org disponibiliza Lucie em francês, Sulafat em inglês e espanhol e, à escolha, Sulafat e Marie em francês, Jane em inglês (consulte [Voz gravada](#-voz-gravada))
- **Responsivo para dispositivos móveis**: interface otimizada para tablets e smartphones
- **Sistema de progressão**: painel por perfil (partidas, recordes e tabuadas para revisar, detalhados por operação), badges, desafios diários

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
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Arquitetura

### Estrutura dos arquivos

Os módulos JavaScript ficam **diretamente em `js/`**, com exceção de três pastas:
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
│   │   ├── audio.js, theme.js                # Son, thèmes
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── chrono-stats.js, chrono-questions.js, chrono-input.js   # Mode Chrono
│   │   ├── mode-stats.js, adventure-progress.js   # Compteurs du tableau de bord
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
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

**Componentes reutilizáveis**: interface construída com componentes de UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: carregamento inteligente dos módulos sob demanda por meio de `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de armazenamento unificado**: API centralizada para a persistência dos dados do usuário por meio de LocalStorage com fallbacks.

**Gerenciamento de áudio centralizado**: controle do som com suporte multilíngue e preferências por usuário.

**Event Bus**: comunicação orientada a eventos e desacoplada entre componentes para uma arquitetura de fácil manutenção.

**Navegação por slides**: sistema de navegação baseado em slides numerados (slide0, slide1 etc.) com `goToSlide()`.

**Segurança**: proteção contra XSS e sanitização por meio de `security-utils.js` para todas as manipulações do DOM.

## 🎯 Modos de Jogo Detalhados

### Modo Descoberta

Interface de exploração visual, adaptada a cada operação, com:

- Visualização interativa das multiplicações
- Animações e recursos mnemônicos
- Arrastar e soltar educativo
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
- Bônus de tempo para as respostas corretas
- Sistema de vidas
- Classificação das melhores pontuações

### Modo Aventura

Progressão narrativa com:

- 10 níveis temáticos desbloqueáveis
- Mapa interativo com progresso visual
- História imersiva com personagens
- Sistema de estrelas e recompensas

### Modo Cronômetro

Dez respostas corretas o mais rápido possível, contra um cronômetro que não para:

- As quatro operações: as tabuadas de multiplicação (configuradas nas Configurações das tabuadas) e
  todas as tabuadas de adição (7 + k), de subtração ((7 + k) − 7) e de divisão ((7 × k) ÷ 7)
- Resposta por escolha ou pelo teclado numérico, tanto por clique quanto pelo teclado
- Melhores tempos, tempo médio e gráfico das últimas partidas, por operação
- «Meus cálculos para revisar»: uma lista por operação, revisada nos dois sentidos (6 × 7 e 7 × 6,
  15 − 7 e 15 − 8)

### Painel

O que a criança realmente jogou, perfil por perfil:

- Estrelas da Aventura e tabuadas de multiplicação para revisar (20 últimas respostas de cada tabuada)
- Perguntas e respostas corretas no Quiz, Desafio, Aventura e Cronômetro
- Partidas e recordes de cada modo e de cada minijogo, incluindo abandonos, detalhados por operação
  assim que a criança pratica mais de uma

### Minijogos de Arcade

Cada minijogo oferece:

- Escolha de dificuldade e personalização
- Sistema de vidas e pontuação
- Controles por teclado e tela sensível ao toque
- Classificações individuais por usuário

## 🔧 Desenvolvimento

### Workflow de desenvolvimento

**Nunca fazer commit diretamente em main.** O projeto trabalha com branches de
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

**3. Fazer commit na branch** e depois enviá-la:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir uma pull request** e aguardar as análises: verify, Codacy,
CodeFactor e SonarCloud. As correções são feitas até tudo ficar verde antes do merge.

**Estilo de commit**: mensagens concisas, no modo imperativo (ex.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: garantir que `npm run lint`, `npm test` e `npm run test:coverage` sejam aprovados antes de cada commit

### Arquitetura dos componentes

**GameMode (classe base)**: todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: orquestração centralizada da inicialização e do gerenciamento dos modos.

**Componentes de UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface consistente.

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

- **Rollup**: empacota `js/main-es6.js` em ESM com code-splitting e sourcemaps
- **Terser**: minificação automática para otimização
- **Post-build**: copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o arquivo de entrada com hash (ex.: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integração Contínua

**GitHub Actions**: `.github/workflows/ci.yml`, acionado a cada push em
`main` e a cada pull request.

**`verify`** — o quality gate bloqueante:

- `npm ci` e depois `npm run verify` (ESLint, testes Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — após `verify`: auditoria Lighthouse do site online para
acompanhar as métricas de SEO ao longo do tempo.

**Análises externas** integradas às pull requests: Codacy, CodeFactor e
SonarCloud. O quality gate do SonarCloud exige notas A em confiabilidade, segurança e
manutenibilidade no código novo.

**Implantação**: `./deploy.sh` sincroniza o site com o S3 e invalida o cache do
CloudFront. O script regenera, quando necessário, as imagens responsivas ausentes do git.

### PWA (Progressive Web App)

O LeapMultix é uma PWA completa com suporte offline e possibilidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback offline para `offline.html`
- Imagens: Cache-first para otimizar o desempenho
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: Network-first para disponibilizar sempre a versão mais recente
- Gestão automática de versões por meio de `cache-updater.js`

**Manifest** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Possibilidade de instalação em dispositivos móveis (Add to Home Screen)
- Configuração standalone para uma experiência app-like
- Suporte a temas e cores

**Testar o modo offline localmente.** Iniciar o servidor e, em seguida, abrir
`http://localhost:8080` (ou a porta apresentada):

```bash
npm run serve
```

Manualmente: desativar a rede nas ferramentas de desenvolvimento (separador Rede,
modo offline) e, em seguida, atualizar a página. `offline.html` deve ser apresentado.

Automaticamente, com Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripts de gestão do Service Worker**:

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
- Utilizar uma gestão de erros específica (sem catch vazios)
- Evitar `innerHTML` em favor das funções `security-utils.js`
- Manter uma complexidade cognitiva < 15 nas funções
- Extrair funções complexas para helpers menores

**Segurança**:

- **Proteção contra XSS**: Utilizar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo de texto
- **Scripts externos**: Atributo `crossorigin="anonymous"` obrigatório
- **Validação das entradas**: Sanitizar sempre os dados externos
- **Content Security Policy**: Headers CSP para restringir as fontes de scripts

**Acessibilidade**:

- Conformidade com WCAG 2.1 AA
- Navegação completa por teclado
- Funções ARIA e labels adequados
- Contrastes de cores em conformidade

**Desempenho**:

- Lazy loading dos módulos por meio de `lazy-loader.js`
- Otimizações de CSS e assets responsivos
- Service Worker para caching inteligente
- Code splitting e minificação em produção

## 📱 Compatibilidade

### Navegadores suportados

A interface utiliza `oklch()` para as cores e `:has()` para os
estados contextuais, o que define os requisitos mínimos:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivos

- **Desktop**: Controlos por teclado e rato
- **Tablets**: Interface tátil otimizada
- **Smartphones**: Design responsivo adaptável

### Acessibilidade

- Navegação completa por teclado (Tab, setas, Esc)
- Funções ARIA e labels para leitores de ecrã
- Contrastes de cores em conformidade
- Suporte a tecnologias de assistência

## 🌍 Localização

Suporte multilingue completo:

- **Francês** (idioma predefinido)
- **Inglês**
- **Espanhol**

### Gestão das traduções

**Ficheiros de tradução:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de gestão de i18n

**`npm run i18n:verify`** - Verificar a consistência das chaves de tradução

**`npm run i18n:unused`** - Listar as chaves de tradução não utilizadas

**`npm run i18n:compare`** - Comparar os ficheiros de tradução com fr.json (referência)

Este script (`scripts/compare-translations.cjs`) assegura a sincronização de todos os ficheiros de idioma:

**Funcionalidades:**

- Deteção de chaves em falta (presentes em fr.json, mas ausentes noutros idiomas)
- Deteção de chaves adicionais (presentes noutros idiomas, mas não em fr.json)
- Identificação de valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação da consistência dos tipos (string vs array)
- Achatamento de estruturas JSON aninhadas em notação por pontos (ex.: `arcade.multiMemory.title`)
- Geração de um relatório detalhado na consola
- Gravação do relatório JSON em `docs/translations-comparison-report.json`

**Exemplo de resultado:**

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

- Interface de utilizador completa
- Instruções dos jogos
- Mensagens de erro e de feedback
- Descrições e ajuda contextual
- Conteúdo narrativo do modo Aventura
- Labels de acessibilidade e ARIA

## 🔊 Voz gravada

O jogo lê em voz alta as perguntas, os incentivos e as explicações. Diz apenas um conjunto finito de frases, cerca de 7 400 por idioma: podem, portanto, ser gravadas de uma vez por todas e, desse modo, nenhuma parte recorre a um serviço de síntese. Sem clips, o jogo utiliza a voz do dispositivo.

### Neste repositório: a aplicação, sem as vozes

O código consegue reproduzir clips pré-gravados e contém o pipeline que os produz. Os clips não estão incluídos, tal como as chaves dos fornecedores: um fork ou uma instalação local utiliza a voz do dispositivo.

- **Fallback automático** para a voz do dispositivo, frase a frase: clip ausente ou com erro, reprodução recusada pelo navegador, clip que não começa em 1,5 s ou modo offline sem o clip em cache.
- **Definições**: o botão de voz da barra superior ativa ou desativa a reprodução; a caixa «Voz gravada» (Acessibilidade e controlos) permite escolher entre a voz gravada e a voz do dispositivo. Só aparece nos idiomas em que está publicada uma voz.
- **Offline**: os clips já ouvidos permanecem em cache (service worker).
- **Onde o jogo procura os clips**: na tag `<meta name="leapmultix-voice-base">`, vazia no repositório. Apenas o deployment de produção escreve nela `/voice/`.

Com os seus próprios clips no computador (produzidos pelo pipeline abaixo e guardados junto do jogo em `../leapmultix-voices`), o parâmetro `?voix=local` permite que sejam reproduzidos pelo servidor de desenvolvimento:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Em leapmultix.jls42.org: as vozes do alojamento

O site disponibilizado pelo autor fornece vozes de síntese gravadas:

- em francês, **Lucie**, criada com ElevenLabs (modelo Eleven v3);
- em inglês britânico e em espanhol de Espanha, **Sulafat**, criada com Google Cloud Text-to-Speech (voz Chirp 3 HD);
- à escolha do jogador, **Sulafat** em francês, para manter a mesma voz nos três idiomas;
- também à escolha do jogador, **Marie** em francês e **Jane** em inglês, criadas com Mistral AI (Voxtral TTS).

Os clips encontram-se num repositório privado e num bucket S3 dedicado, disponibilizado pelo CloudFront em `/voice/*`. São gerados uma única vez: durante o jogo, nada é enviado para esses serviços. Nas definições, o menu «Voz» apresenta as vozes disponíveis para o idioma quando existem várias, e a indicação identifica o serviço da voz ouvida.

### Gerar os clips

O pipeline está automatizado por scripts em `scripts/voice/` e é executado no computador do proprietário, nunca na CI pública. As chaves dos fornecedores (ElevenLabs para Lucie, Google Cloud Text-to-Speech para Sulafat, Mistral para Marie e Jane) permanecem num ficheiro `.env` fora do repositório, fornecido por `node --env-file`: nenhuma chave entra no git. O skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) descreve o procedimento passo a passo (pontos de controlo, aprovações, retomas); os detalhes encontram-se em [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** as frases restantes e os caracteres a pagar (Eleven v3: cerca de 0,53 crédito por carácter; Chirp 3 HD: 30 $ por milhão de caracteres, com o primeiro milhão de cada mês gratuito; Voxtral TTS: 16 $ por milhão).
2. **Gerar**. Executar novamente o mesmo comando retoma o que estiver em falta. Quando os créditos se esgotam, o script termina corretamente (código 3) sem deixar ficheiros parcialmente escritos. `--max-total-chars` limita a despesa acumulada da versão: cada resposta paga é registada assim que é recebida num registo que sobrevive a uma interrupção abrupta. Na Google e na Mistral, que não fornecem qualquer saldo consultável, esta é a única proteção.
3. **Verificar**: cada frase tem o seu clip e cada MP3 é válido. Em seguida, o Whisper transcreve localmente cada clip, e a verificação assinala os números mal compreendidos e as durações anormais. `voice:review` executa em sequência o Whisper, esta verificação e a página de audição num único comando.
4. **Ouvir** na página de audição (`voice:listen`) os clips assinalados e uma amostra de formas femininas («uma vez 7»), que o Whisper não distingue. Cada clip tem uma caixa «refazer», que o adiciona à lista de clips rejeitados.
5. **Refazer** os clips rejeitados (`--redo`), executar novamente o Whisper e depois comparar cada clip antes e depois numa segunda página. Um clip ainda pronunciado incorretamente após duas ou três tentativas recebe um texto imposto em `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por exemplo, o número por extenso.
6. **Publicar** os clips, verificar se respondem online e, em seguida, publicar o índice do idioma, primeiro para os testers (`?voix=test`).
7. **Disponibilizar** a voz para todos e depois ativá-la por predefinição. O kill switch (`voice:publish -- remove`) remove um idioma do índice: o jogo volta a utilizar a voz do dispositivo.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant), plafond cumulé en caractères ; --reserve protège les crédits ElevenLabs
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000 --max-total-chars <plafond>
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang en --max-total-chars <plafond>
# 3. Contrôler : Whisper (installé une fois : voir l'en-tête de whisper_transcribe.py), contrôle, page d'écoute
npm run voice:review -- --lang fr
npm run voice:check -- --lang fr --probe
# 4. Écouter sur la page indiquée (la liste « à refaire » va dans ecartes.txt)
# 5. Refaire (payant), puis comparer avant/après (Whisper ne transcrit que les clips refaits)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt --max-total-chars <plafond>
npm run voice:review -- --lang fr --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Regra: uma frase falada que seja modificada deve ser regravada antes da entrada em produção

Todas as frases faladas provêm das traduções (`assets/translations/{fr,en,es}.json`) e fazem parte do corpus. Alterar uma frase falada faz, portanto, falhar o teste de bloqueio do corpus (`scripts/voice/corpus.lock.json`). Para um idioma que tenha uma voz gravada, são então gerados os clips das frases alteradas, que são verificados e ouvidos e, em seguida, publicados **antes** do merge. Por fim, o bloqueio é atualizado (`npm run voice:corpus:lock`). Sem esses clips, a frase modificada é reproduzida com a voz do dispositivo.

## 📊 Armazenamento de dados

### Dados do utilizador

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos arcade
- Definições de personalização

### Funcionalidades técnicas

- Armazenamento local (localStorage) com fallbacks
- Dados do jogo organizados por perfil (as estatísticas por cálculo continuam a ser comuns ao dispositivo)
- Gravação automática do progresso
- Migração automática dos dados antigos

## 🐛 Comunicar um problema

Os problemas podem ser comunicados por meio das issues do GitHub. Inclua:

- Descrição detalhada do problema
- Passos para o reproduzir
- Navegador e versão
- Capturas de ecrã, se forem pertinentes

## 💝 Apoiar o projeto

**[☕ Fazer um donativo através do PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a AGPL v3. Consulte o ficheiro `LICENSE` para obter mais detalhes.

---

_LeapMultix — aplicação educativa livre para aprender as quatro operações_
