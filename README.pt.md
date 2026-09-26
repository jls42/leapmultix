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
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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
- [Relatar um problema](#-relatar-um-problema)
- [Licença](#-licença)

## Descrição

O LeapMultix é uma aplicação web educativa e interativa destinada a crianças de 6 a 12 anos para dominar as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). Ele oferece **5 modos de jogo** e **4 minijogos de arcade** em uma interface intuitiva, acessível e multilíngue.

**Suporte a múltiplas operações:** os cinco modos aceitam as quatro operações. A escolha é feita na tela inicial e é válida para todo o percurso.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Visão geral

### As telas

|                                                                                                                 |                                                                                                                  |
| :-------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
|                   ![Tela "Quem está jogando?": escolha de perfil](docs/media/01-accueil.webp)                   |                ![Menu principal: escolha da operação e dos cinco modos](docs/media/02-menu.webp)                 |
|                   **Quem está jogando?** — um perfil por criança, com seu avatar e progresso.                   |                   **O menu** — a operação é escolhida aqui, depois os cinco modos são abertos.                   |
|               ![Modo Descoberta: a tabuada do 4 exibida em pontos](docs/media/03-decouverte.webp)               |           ![Modo Quiz: resposta errada em vermelho, resposta certa em verde](docs/media/04-quiz.webp)            |
|        **Descoberta** — cada igualdade é mostrada em pontos, saltos ou contagem, com a dica da tabuada.         | **Quiz** — a escolha da criança permanece exibida ao lado da resposta correta, e a explicação detalha o cálculo. |
|                 ![Modo Desafio: contagem regressiva e sequência atual](docs/media/05-defi.webp)                 |           ![Modo Aventura: mapa dos dez níveis, os seguintes bloqueados](docs/media/06-aventure.webp)            |
| **Desafio** — corrida contra o tempo. Ao errar, o cronômetro pausa para permitir a leitura da resposta correta. |               **Aventura** — dez níveis que se desbloqueiam um após o outro, em troca de estrelas.               |
|                         ![Menu Arcade: os quatro minijogos](docs/media/07-arcade.webp)                          |          ![Painel de controle: estrelas por tabuada e estatísticas](docs/media/08-tableau-de-bord.webp)          |
|                   **Arcade** — quatro minijogos, com ajuste de dificuldade e escolha da nave.                   |             **Painel de controle** — estrelas por tabuada, tabuadas a revisar, pontuações por modo.              |
|             ![Personalização: avatares, temas, acessibilidade](docs/media/09-personnalisation.webp)             |                                                                                                                  |
|        **Personalização** — avatar, tema de cores, tamanho do texto, alto contraste, controle parental.         |                                                                                                                  |

### Os minijogos de arcade

Quatro jogos que fazem a mesma pergunta — exibida acima da área de
jogo, com o tempo restante e as vidas —, mas exigem a cada vez uma ação
diferente.

|                                                                                                                     |                                                                                                       |
| :-----------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
| ![MultiInvaders: monstros carregando números, uma nave na parte inferior da tela](docs/media/10-multiinvaders.webp) | ![MultiMiam: um labirinto onde pastilhas trazem as respostas possíveis](docs/media/11-multimiam.webp) |
|        **MultiInvaders** — atirar nas respostas erradas, poupar a certa: ela esconde um amigo para libertar.        |     **MultiMiam** — percorrer o labirinto para pegar o resultado correto, desviando dos monstros.     |
| ![MultiMemory: uma grade de cartas, duas viradas mostrando um cálculo e um número](docs/media/12-multimemory.webp)  |        ![MultiSnake: uma cobra e maçãs numeradas em um gramado](docs/media/13-multisnake.webp)        |
|                     **MultiMemory** — lembrar qual carta contém o resultado do cálculo virado.                      |              **MultiSnake** — crescer comendo os números certos, evitar todos os outros.              |

## ✨ Funcionalidades

### 🎮 Modos de Jogo

- **Modo Descoberta**: Exploração visual e interativa adaptada a cada operação
- **Modo Quiz**: Perguntas de múltipla escolha com suporte às 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio**: Corrida contra o tempo com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: Progressão narrativa por níveis com suporte às 4 operações

### 🕹️ Minijogos Arcade

- **MultiInvaders**: Space Invaders educativo - Destruir as respostas erradas
- **MultiMiam**: Pac-Man matemático - Coletar as respostas corretas
- **MultiMemory**: Jogo da memória - Associar operações e resultados
- **MultiSnake**: Snake educativo - Crescer comendo os números certos

### ➕ Suporte Multi-Operações

O LeapMultix oferece um treinamento completo nas 4 operações aritméticas em **todos os modos**:

| Modo       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Desafio    | ✅  | ✅  | ✅  | ✅  |
| Descoberta | ✅  | ✅  | ✅  | ✅  |
| Aventura   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcionalidades Transversais

- **Multiusuário**: Gerenciamento de perfis individuais com progresso salvo
- **Multilíngue**: Suporte a francês, inglês e espanhol
- **Personalização**: Avatares, temas de cores, planos de fundo
- **Acessibilidade**: Navegação por teclado, suporte a toque, conformidade com WCAG 2.1 AA
- **Voz gravada**: o jogo pode ler perguntas e incentivos com uma voz sintetizada pré-gravada, com fallback automático para a voz do dispositivo. As vozes não estão neste repositório: o site leapmultix.jls42.org fornece Lucie em francês e Sulafat em inglês e espanhol (ver [Voz gravada](#-voz-gravada))
- **Design responsivo móvel**: Interface otimizada para tablets e smartphones
- **Sistema de progressão**: Pontuações, medalhas, desafios diários

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

### Estrutura de arquivos

Os módulos JavaScript estão **diretamente em `js/`**, com exceção de três pastas:
`core/`, `components/` e `modes/`. É, portanto, o nome do arquivo que define o
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

**Módulos ES6 modernos**: O projeto utiliza uma arquitetura modular com classes ES6 e imports/exports nativos.

**Componentes reutilizáveis**: Interface construída com componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Carregamento inteligente de módulos sob demanda via `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de armazenamento unificado**: API centralizada para a persistência dos dados do usuário via LocalStorage com fallbacks.

**Gerenciamento de áudio centralizado**: Controle de som com suporte multilíngue e preferências por usuário.

**Event Bus**: Comunicação orientada a eventos desacoplada entre componentes para uma arquitetura sustentável.

**Navegação por slides**: Sistema de navegação baseado em slides numerados (slide0, slide1, etc.) com `goToSlide()`.

**Segurança**: Proteção XSS e sanitização via `security-utils.js` para todas as manipulações do DOM.

## 🎯 Modos de Jogo Detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas de multiplicação com:

- Visualização interativa das multiplicações
- Animações e lembretes visuais
- Arrastar e soltar educativo
- Progressão livre por tabuada

### Modo Quiz

Perguntas de múltipla escolha com:

- 10 perguntas por sessão
- Progressão adaptativa de acordo com os acertos
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

### Minijogos Arcade

Cada minijogo oferece:

- Escolha de dificuldade e personalização
- Sistema de vidas e pontuação
- Controles por teclado e toque
- Classificações individuais por usuário

## 🔧 Desenvolvimento

### Fluxo de desenvolvimento

**Nunca faça commit diretamente na main.** O projeto trabalha com branches de
funcionalidade.

**1. Criar uma branch**, `feat/` para uma funcionalidade, `fix/` para uma correção:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Desenvolver e verificar.** A formatação vem em primeiro lugar: a CI a rejeita
antes mesmo de executar os testes.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Fazer commit na branch**, e depois enviá-la:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir uma pull request** e aguardar as análises: verify, Codacy,
CodeFactor e SonarCloud. Corrige-se até que tudo fique verde antes de mesclar.

**Estilo de commit**: Mensagens concisas, modo imperativo (ex.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Garantir que `npm run lint`, `npm test` e `npm run test:coverage` passem antes de cada commit

### Arquitetura dos componentes

**GameMode (classe base)**: Todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: Orquestração centralizada da inicialização e do gerenciamento dos modos.

**Componentes UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface consistente.

**Lazy Loading**: Os módulos são carregados sob demanda para otimizar o desempenho inicial.

**Event Bus**: Comunicação desacoplada entre componentes por meio do sistema de eventos.

### Testes

O projeto inclui uma suíte de testes abrangente:

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

- **Rollup**: Empacota `js/main-es6.js` em ESM com code-splitting e sourcemaps
- **Terser**: Minificação automática para otimização
- **Post-build**: Copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o arquivo de entrada com hash (ex.: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integração Contínua

**GitHub Actions**: `.github/workflows/ci.yml`, acionado a cada push na
`main` e a cada pull request.

**`verify`** — a barreira de qualidade (quality gate), bloqueante:

- `npm ci` e depois `npm run verify` (ESLint, testes Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — após `verify`: auditoria Lighthouse do site em produção, para
acompanhar as métricas de SEO ao longo do tempo.

**Análises externas** conectadas às pull requests: Codacy, CodeFactor e
SonarCloud. A barreira do SonarCloud exige notas A em confiabilidade, segurança e
manutenibilidade no código novo.

**Implantação**: `./deploy.sh` sincroniza o site com o S3 e invalida o cache do
CloudFront. O script regenera, conforme necessário, as imagens responsivas, ausentes do git.

### PWA (Progressive Web App)

O LeapMultix é uma PWA completa com suporte offline e possibilidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback offline para `offline.html`
- Imagens: Cache-first para otimizar o desempenho
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: Network-first para sempre servir a versão mais recente
- Gerenciamento automático de versões via `cache-updater.js`

**Manifest** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Instalação possível em dispositivos móveis (Add to Home Screen)
- Configuração standalone para uma experiência semelhante à de um app nativo
- Suporte a temas e cores

**Testar o modo offline localmente.** Iniciar o servidor e abrir
`http://localhost:8080` (ou a porta exibida):

```bash
npm run serve
```

Manualmente: desconectar a rede nas ferramentas de desenvolvedor (aba Rede,
modo offline) e atualizar a página. `offline.html` deve ser exibido.

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

**Ferramentas de qualidade de código**:

- **ESLint**: Configuração moderna com flat config (`eslint.config.js`), suporte a ES2022
- **Prettier**: Formatação automática de código (`.prettierrc`)
- **Stylelint**: Validação de CSS (`.stylelintrc.json`)
- **JSDoc**: Documentação automática de funções com análise de cobertura

**Regras de código importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Usar tratamento de erros específico (sem blocos catch vazios)
- Evitar `innerHTML` em favor das funções `security-utils.js`
- Manter a complexidade cognitiva < 15 para funções
- Extrair funções complexas em helpers menores

**Segurança**:

- **Proteção contra XSS**: Usar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo de texto
- **Scripts externos**: Atributo `crossorigin="anonymous"` obrigatório
- **Validação de entradas**: Sempre sanitizar dados externos
- **Content Security Policy**: Cabeçalhos CSP para restringir fontes de scripts

**Acessibilidade**:

- Conformidade com WCAG 2.1 AA
- Navegação completa por teclado
- Funções ARIA e rótulos apropriados
- Contrastes de cores em conformidade

**Desempenho**:

- Lazy loading de módulos via `lazy-loader.js`
- Otimizações de CSS e recursos responsivos
- Service Worker para cache inteligente
- Code splitting e minificação em produção

## 📱 Compatibilidade

### Navegadores suportados

A interface baseia-se em `oklch()` para cores e em `:has()` para
estados contextuais, estabelecendo a linha de base:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivos

- **Desktop**: Controles por teclado e mouse
- **Tablets**: Interface tátil otimizada
- **Smartphones**: Design responsivo e adaptativo

### Acessibilidade

- Navegação completa por teclado (Tab, setas, Esc)
- Funções ARIA e rótulos para leitores de tela
- Contrastes de cores em conformidade
- Suporte a tecnologias assistivas

## 🌍 Localização

Suporte multilíngue completo:

- **Francês** (idioma padrão)
- **Inglês**
- **Espanhol**

### Gestão de traduções

**Arquivos de tradução:** `assets/translations/*.json`

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

**`npm run i18n:compare`** - Comparar os arquivos de tradução com fr.json (referência)

Este script (`scripts/compare-translations.cjs`) garante a sincronização de todos os arquivos de idioma:

**Recursos:**

- Detecção de chaves ausentes (presentes em fr.json, mas ausentes em outros idiomas)
- Detecção de chaves excedentes (presentes em outros idiomas, mas não em fr.json)
- Identificação de valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação de consistência de tipos (string vs array)
- Aplainamento de estruturas JSON aninhadas em notação por pontos (ex.: `arcade.multiMemory.title`)
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

- Interface de usuário completa
- Instruções dos jogos
- Mensagens de erro e feedback
- Descrições e ajuda contextual
- Conteúdo narrativo do modo Aventura
- Rótulos de acessibilidade e ARIA

## 🔊 Voz gravada

O jogo lê em voz alta as perguntas, os incentivos e as explicações. Ele pronuncia apenas um conjunto finito de frases, cerca de 7.400 por idioma: portanto, elas podem ser gravadas de uma vez por todas, e nenhuma partida chama um serviço de síntese. Sem os clipes, o jogo lê com a voz do dispositivo.

### Neste repositório: a aplicação, sem as vozes

O código sabe reproduzir clipes pré-gravados e contém o pipeline que os gera. Os clipes não estão aqui, nem as chaves dos provedores: um fork ou uma instalação local lê com a voz do dispositivo.

- **Fallback automático** para a voz do dispositivo, frase por frase: clipe ausente ou com erro, reprodução recusada pelo navegador, clipe que não inicia em 1,5 s ou offline sem o clipe em cache.
- **Configurações**: o botão de voz na barra superior ativa ou desativa a reprodução; a opção "Voz gravada" (Acessibilidade e controles) alterna entre a voz gravada e a voz do dispositivo. Ela só aparece nos idiomas em que uma voz foi publicada.
- **Offline**: os clipes já ouvidos permanecem em cache (service worker).
- **Onde o jogo busca os clipes**: na tag `<meta name="leapmultix-voice-base">`, vazia no repositório. Apenas o deploy de produção grava `/voice/` nela.

Com os seus próprios clipes na máquina (produzidos pelo pipeline abaixo, organizados ao lado do jogo em `../leapmultix-voices`), o parâmetro `?voix=local` faz com que o servidor de desenvolvimento os leia:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Em leapmultix.jls42.org: as vozes da hospedagem

O site disponibilizado pelo autor serve vozes de síntese gravadas:

- em francês, **Lucie**, criada com o ElevenLabs (modelo Eleven v3);
- em inglês britânico e espanhol da Espanha, **Sulafat**, criada com o Google Cloud Text-to-Speech (voz Chirp 3 HD).

Os clipes residem em um repositório privado e em um bucket S3 dedicado, servido pelo CloudFront em `/voice/*`. Nas configurações, cada idioma nomeia o serviço que gerou sua voz.

### Gerar os clipes

O pipeline é scriptado em `scripts/voice/` e é executado na máquina do mantenedor, nunca na CI pública. As chaves dos provedores (ElevenLabs para francês, Google Cloud Text-to-Speech para inglês e espanhol; Mistral permanece conectado) ficam em um arquivo `.env` fora do repositório, passado via `node --env-file`: nenhuma chave entra no git. A skill do Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) executa o procedimento passo a passo (validações, concordâncias, repetições); os detalhes estão em [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** as frases restantes e os caracteres a pagar (Eleven v3: cerca de 0,53 crédito por caractere; Chirp 3 HD: US$ 30 por milhão de caracteres, sendo o primeiro milhão de cada mês gratuito; Voxtral TTS: US$ 16 por milhão).
2. **Gerar**. Executar novamente o mesmo comando retoma o que falta. Quando os créditos se esgotam, o script é encerrado de forma limpa (código 3) sem deixar arquivos pela metade. `--max-total-chars` limita o gasto acumulado da versão: cada resposta paga é registrada assim que é recebida em um log, que sobrevive a uma interrupção inesperada. No Google e na Mistral, que não fornecem saldo legível, essa é a única proteção.
3. **Verificar**: cada frase tem seu clipe e cada MP3 é válido. O Whisper então transcreve cada clipe localmente, e a verificação aponta números mal compreendidos e durações anormais. `voice:review` encadeia o Whisper, essa verificação e a página de escuta em um único comando.
4. **Ouvir** na página de escuta (`voice:listen`) os clipes sinalizados e uma amostra de formas femininas ("une fois 7"), que o Whisper não distingue. Cada clipe possui uma caixa de seleção "refazer", que o adiciona à lista de clipes descartados.
5. **Refazer** os clipes descartados (`--redo`) e executar novamente o Whisper, comparando depois cada clipe antes e depois em uma segunda página. Um clipe que continue com pronúncia incorreta após duas ou três tentativas recebe um texto fixado em `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por exemplo, o número por extenso.
6. **Publicar** os clipes, verificar se respondem online e publicar o índice do idioma, primeiro para testadores (`?voix=test`).
7. **Liberar** a voz para todos e ativá-la por padrão. O disjuntor (`voice:publish -- remove`) remove um idioma do índice: o jogo volta a utilizar a voz do dispositivo.

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

### Regra: uma frase falada modificada deve ser regravada antes de ir para produção

Toda frase falada provém das traduções (`assets/translations/{fr,en,es}.json`) e faz parte do corpus. Alterar uma frase falada faz, portanto, com que o teste de trava do corpus (`scripts/voice/corpus.lock.json`) falhe. Para um idioma que possui voz gravada, são gerados os clipes das frases afetadas, verificados e ouvidos, e depois publicados **antes** do merge. Por fim, a trava é atualizada (`npm run voice:corpus:lock`). Sem esses clipes, a frase modificada é lida com a voz do dispositivo.

## 📊 Armazenamento de dados

### Dados do usuário

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos arcade
- Configurações de personalização

### Recursos técnicos

- Armazenamento local (localStorage) com fallbacks
- Isolamento de dados por usuário
- Salvamento automático do progresso
- Migração automática de dados legados

## 🐛 Relatar um problema

Os problemas podem ser relatados por meio das issues do GitHub. Por favor, inclua:

- Descrição detalhada do problema
- Etapas para reproduzi-lo
- Navegador e versão
- Capturas de tela, se relevantes

## 💝 Apoie o projeto

**[☕ Faça uma doação via PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a AGPL v3. Consulte o arquivo `LICENSE` para obter mais detalhes.

---

_LeapMultix — aplicativo educacional livre para aprender as quatro operações_
