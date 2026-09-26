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
- [Modos de jogo detalhados](#-modos-de-jogo-detalhados)
- [Desenvolvimento](#-desenvolvimento)
- [Compatibilidade](#-compatibilidade)
- [Localização](#-localização)
- [Voz gravada](#-voz-gravada)
- [Armazenamento de dados](#-armazenamento-de-dados)
- [Comunicar um problema](#-comunicar-um-problema)
- [Licença](#-licença)

## Descrição

LeapMultix é uma aplicação web educativa e interativa destinada a crianças dos 6 aos 12 anos para dominarem as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). Oferece **5 modos de jogo** e **4 minijogos arcade** numa interface intuitiva, acessível e multilíngue.

**Suporte a várias operações:** os cinco modos aceitam as quatro operações. A escolha é feita no ecrã inicial e aplica-se a todo o percurso.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Visão geral

### Os ecrãs

|                                                                                                                  |                                                                                                             |
| :--------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|                       ![Ecrã «Quem joga?»: escolha do perfil](docs/media/01-accueil.webp)                        |              ![Menu principal: escolha da operação e dos cinco modos](docs/media/02-menu.webp)              |
|                   **Quem joga?** — um perfil por criança, com o seu avatar e o seu progresso.                    |                 **O menu** — a operação é escolhida aqui e depois abrem-se os cinco modos.                  |
|             ![Modo Descoberta: a tabuada do 4 apresentada em pontos](docs/media/03-decouverte.webp)              |          ![Modo Quiz: resposta errada a vermelho, resposta certa a verde](docs/media/04-quiz.webp)          |
| **Descoberta** — cada igualdade é apresentada em pontos, saltos ou contagem, juntamente com o truque da tabuada. | **Quiz** — a escolha da criança permanece visível junto à resposta certa, e a explicação detalha o cálculo. |
|                   ![Modo Desafio: contagem decrescente e série atual](docs/media/05-defi.webp)                   |       ![Modo Aventura: mapa dos dez níveis, com os seguintes bloqueados](docs/media/06-aventure.webp)       |
| **Desafio** — corrida contra o relógio. Em caso de erro, o cronómetro para durante a leitura da resposta certa.  |                 **Aventura** — dez níveis que se abrem um após outro em troca de estrelas.                  |
|                          ![Menu Arcade: os quatro minijogos](docs/media/07-arcade.webp)                          |             ![Painel: estrelas por tabuada e estatísticas](docs/media/08-tableau-de-bord.webp)              |
|                   **Arcade** — quatro minijogos, com ajuste da dificuldade e escolha da nave.                    |                 **Painel** — estrelas por tabuada, tabuadas a rever e pontuações por modo.                  |
|             ![Personalização: avatares, temas e acessibilidade](docs/media/09-personnalisation.webp)             |                                                                                                             |
|         **Personalização** — avatar, tema de cores, tamanho do texto, alto contraste e código parental.          |                                                                                                             |

### Os minijogos arcade

Quatro jogos que fazem a mesma pergunta — a apresentada acima da área de
jogo, com o tempo restante e as vidas — mas exigem um gesto
diferente em cada caso.

|                                                                                                                     |                                                                                                       |
| :-----------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
|    ![MultiInvaders: monstros com números e uma nave na parte inferior do ecrã](docs/media/10-multiinvaders.webp)    | ![MultiMiam: um labirinto onde os pontos contêm as respostas possíveis](docs/media/11-multimiam.webp) |
|   **MultiInvaders** — disparar contra as respostas erradas e poupar a certa: ela esconde um amigo para libertar.    |      **MultiMiam** — percorrer o labirinto para apanhar o resultado certo, evitando os monstros.      |
| ![MultiMemory: uma grelha de cartas, duas viradas mostrando um cálculo e um número](docs/media/12-multimemory.webp) |        ![MultiSnake: uma serpente e maçãs numeradas num prado](docs/media/13-multisnake.webp)         |
|                    **MultiMemory** — recordar qual carta contém o resultado do cálculo revelado.                    |            **MultiSnake** — crescer ao engolir os números certos e evitar todos os outros.            |

## ✨ Funcionalidades

### 🎮 Modos de jogo

- **Modo Descoberta**: exploração visual e interativa adaptada a cada operação
- **Modo Quiz**: perguntas de escolha múltipla com suporte para as 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio**: corrida contra o relógio com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: progressão narrativa por níveis com suporte para as 4 operações

### 🕹️ Minijogos arcade

- **MultiInvaders**: Space Invaders educativo — destruir as respostas erradas
- **MultiMiam**: Pac-Man matemático — recolher as respostas certas
- **MultiMemory**: jogo de memória — associar operações e resultados
- **MultiSnake**: Snake educativo — crescer ao comer os números certos

### ➕ Suporte a várias operações

LeapMultix oferece um treino completo das 4 operações aritméticas em **todos os modos**:

| Modo       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Desafio    | ✅  | ✅  | ✅  | ✅  |
| Descoberta | ✅  | ✅  | ✅  | ✅  |
| Aventura   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcionalidades transversais

- **Vários utilizadores**: gestão de perfis individuais com progresso guardado
- **Multilíngue**: suporte para francês, inglês e espanhol
- **Personalização**: avatares, temas de cores e fundos
- **Acessibilidade**: navegação por teclado, suporte tátil e conformidade com WCAG 2.1 AA
- **Voz gravada**: perguntas e incentivos lidos por uma voz sintética pré-gravada (Lucie em francês, criada com ElevenLabs; Jane em inglês, criada com Mistral AI), com recurso automático à voz do dispositivo; clipes fora do repositório público (consulte [Voz gravada](#-voz-gravada))
- **Responsivo em dispositivos móveis**: interface otimizada para tablets e smartphones
- **Sistema de progressão**: pontuações, distintivos e desafios diários

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
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Arquitetura

### Estrutura dos ficheiros

Os módulos JavaScript estão **diretamente em `js/`**, com exceção de três pastas:
`core/`, `components/` e `modes/`. Portanto, é o nome do ficheiro que determina o
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

**Componentes reutilizáveis**: interface construída com componentes de UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: carregamento inteligente dos módulos a pedido através de `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de armazenamento unificado**: API centralizada para a persistência dos dados dos utilizadores através de LocalStorage com fallbacks.

**Gestão de áudio centralizada**: controlo do som com suporte multilíngue e preferências por utilizador.

**Event Bus**: comunicação orientada por eventos e desacoplada entre componentes para uma arquitetura de fácil manutenção.

**Navegação por slides**: sistema de navegação baseado em slides numerados (slide0, slide1, etc.) com `goToSlide()`.

**Segurança**: proteção contra XSS e sanitização através de `security-utils.js` para todas as manipulações do DOM.

## 🎯 Modos de jogo detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas de multiplicação com:

- Visualização interativa das multiplicações
- Animações e auxiliares de memória
- Arrastar e largar educativo
- Progressão livre por tabuada

### Modo Quiz

Perguntas de escolha múltipla com:

- 10 perguntas por sessão
- Progressão adaptativa de acordo com os acertos
- Teclado numérico virtual
- Sistema de streak (série de respostas certas)

### Modo Desafio

Corrida contra o relógio com:

- 3 níveis de dificuldade (Principiante, Médio, Difícil)
- Bónus de tempo por respostas certas
- Sistema de vidas
- Classificação das melhores pontuações

### Modo Aventura

Progressão narrativa com:

- 10 níveis temáticos desbloqueáveis
- Mapa interativo com progressão visual
- História imersiva com personagens
- Sistema de estrelas e recompensas

### Minijogos arcade

Cada minijogo oferece:

- Escolha da dificuldade e personalização
- Sistema de vidas e pontuação
- Controlos por teclado e táteis
- Classificações individuais por utilizador

## 🔧 Desenvolvimento

### Workflow de desenvolvimento

**Nunca fazer commit diretamente na main.** O projeto utiliza branches de
funcionalidade.

**1. Criar uma branch**, `feat/` para uma funcionalidade, `fix/` para uma correção:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Desenvolver e verificar.** A formatação vem primeiro: a CI rejeita-a
antes mesmo de executar os testes.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Fazer commit na branch** e depois fazer push:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir uma pull request** e aguardar as análises: verify, Codacy,
CodeFactor e SonarCloud. Os problemas são corrigidos até tudo ficar verde antes do merge.

**Estilo de commit**: mensagens concisas, no imperativo (por exemplo: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: garantir que `npm run lint`, `npm test` e `npm run test:coverage` são executados com sucesso antes de cada commit

### Arquitetura dos componentes

**GameMode (classe base)**: todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: orquestração centralizada do lançamento e da gestão dos modos.

**Componentes de UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface coerente.

**Lazy Loading**: os módulos são carregados a pedido para otimizar o desempenho inicial.

**Event Bus**: comunicação desacoplada entre componentes através do sistema de eventos.

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

- **Rollup**: cria o bundle de `js/main-es6.js` em ESM com code-splitting e sourcemaps
- **Terser**: minificação automática para otimização
- **Post-build**: copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o ficheiro de entrada com hash (por exemplo: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integração contínua

**GitHub Actions**: `.github/workflows/ci.yml`, acionado a cada push para
`main` e a cada pull request.

**`verify`** — o quality gate bloqueante:

- `npm ci` e depois `npm run verify` (ESLint, testes Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — depois de `verify`: auditoria Lighthouse do site online, para
acompanhar as métricas de SEO ao longo do tempo.

**Análises externas** associadas às pull requests: Codacy, CodeFactor e
SonarCloud. O quality gate do SonarCloud exige classificações A em fiabilidade, segurança e
manutenibilidade do código novo.

**Implementação**: `./deploy.sh` sincroniza o site com o S3 e invalida a cache
do CloudFront. O script volta a gerar, quando necessário, as imagens responsivas ausentes do git.

### PWA (Progressive Web App)

LeapMultix é uma PWA completa, com suporte offline e possibilidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback offline para `offline.html`
- Imagens: Cache-first para otimizar o desempenho
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: Network-first para servir sempre a versão mais recente
- Gestão automática da versão através de `cache-updater.js`

**Manifest** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Possibilidade de instalação em dispositivos móveis (Add to Home Screen)
- Configuração standalone para uma experiência semelhante a uma app
- Suporte para temas e cores

**Testar o modo offline localmente.** Inicie o servidor e depois abra
`http://localhost:8080` (ou a porta apresentada):

```bash
npm run serve
```

Manualmente: desligue a rede nas ferramentas de desenvolvimento (separador Rede,
modo offline) e depois atualize a página. `offline.html` deve ser apresentado.

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
- **Stylelint**: Validação CSS (`.stylelintrc.json`)
- **JSDoc**: Documentação automática das funções com análise de cobertura

**Regras de código importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Utilizar uma gestão de erros específica (sem catch vazios)
- Evitar `innerHTML` em favor das funções `security-utils.js`
- Manter uma complexidade cognitiva < 15 para as funções
- Extrair as funções complexas para helpers menores

**Segurança**:

- **Proteção XSS**: Utilizar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para o conteúdo textual
- **Scripts externos**: Atributo `crossorigin="anonymous"` obrigatório
- **Validação das entradas**: Sanitizar sempre os dados externos
- **Content Security Policy**: Headers CSP para restringir as fontes de scripts

**Acessibilidade**:

- Conformidade com WCAG 2.1 AA
- Navegação completa por teclado
- Funções ARIA e labels apropriados
- Contrastes de cor em conformidade

**Desempenho**:

- Lazy loading dos módulos através de `lazy-loader.js`
- Otimizações CSS e assets responsivos
- Service Worker para cache inteligente
- Code splitting e minificação em produção

## 📱 Compatibilidade

### Navegadores suportados

A interface baseia-se em `oklch()` para as cores e em `:has()` para os
estados contextuais, o que define os requisitos mínimos:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivos

- **Desktop**: Controlos por teclado e rato
- **Tablets**: Interface tátil otimizada
- **Smartphones**: Design responsivo adaptativo

### Acessibilidade

- Navegação completa por teclado (Tab, setas, Esc)
- Funções ARIA e labels para leitores de ecrã
- Contrastes de cor em conformidade
- Suporte para tecnologias de assistência

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

### Scripts de gestão i18n

**`npm run i18n:verify`** - Verificar a consistência das chaves de tradução

**`npm run i18n:unused`** - Listar as chaves de tradução não utilizadas

**`npm run i18n:compare`** - Comparar os ficheiros de tradução com fr.json (referência)

Este script (`scripts/compare-translations.cjs`) assegura a sincronização de todos os ficheiros de idioma:

**Funcionalidades:**

- Deteção das chaves em falta (presentes em fr.json, mas ausentes noutros idiomas)
- Deteção das chaves adicionais (presentes noutros idiomas, mas não em fr.json)
- Identificação dos valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação da consistência dos tipos (string vs array)
- Achatamento das estruturas JSON aninhadas em notação por pontos (ex.: `arcade.multiMemory.title`)
- Geração de um relatório detalhado na consola
- Gravação do relatório JSON em `docs/translations-comparison-report.json`

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

- Interface de utilizador completa
- Instruções dos jogos
- Mensagens de erro e de feedback
- Descrições e ajuda contextual
- Conteúdo narrativo do modo Aventura
- Labels de acessibilidade e ARIA

## 🔊 Voz gravada

O jogo lê em voz alta as perguntas, os incentivos e as explicações, com uma voz de síntese previamente gravada:

- em francês, **Lucie**, criada com ElevenLabs (modelo Eleven v3);
- em inglês, **Jane**, criada com Mistral AI (Voxtral TTS).

O jogo diz apenas um conjunto finito de frases, cerca de 7 400 por idioma: todas são previamente gravadas e nenhuma parte recorre a um serviço de síntese. Por enquanto, o espanhol mantém a voz do dispositivo.

- **Fallback automático** para a voz do dispositivo, frase a frase: clip ausente ou com erro, reprodução recusada pelo navegador, clip que não começa em 1,5 s ou funcionamento offline sem o clip em cache.
- **Definições**: o botão de voz da barra superior ativa ou desativa a reprodução; a caixa «Voz gravada» (Acessibilidade e controlos) permite escolher entre a voz gravada (Lucie ou Jane) e a voz do dispositivo.
- **Offline**: os clips já ouvidos permanecem em cache (service worker).

### Os clips não estão neste repositório

Os clips encontram-se num repositório privado e num bucket S3 dedicado, servido pelo CloudFront em `/voice/*`. Portanto, um fork ou o desenvolvimento local mantém a voz do dispositivo: no repositório, a tag `<meta name="leapmultix-voice-base">` está vazia e apenas o deployment de produção escreve nela `/voice/`.

Com os clips na máquina (repositório privado clonado ao lado do jogo, em `../leapmultix-voices`), o parâmetro `?voix=local` faz com que sejam reproduzidos pelo servidor de desenvolvimento:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Gerar os clips

O pipeline está automatizado em `scripts/voice/` e é executado na máquina do proprietário, nunca na CI pública. As chaves dos fornecedores (ElevenLabs para o francês, Mistral para o inglês) permanecem num ficheiro `.env` fora do repositório, fornecido através de `node --env-file`: nenhuma chave entra no git. O skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) apresenta o procedimento passo a passo (etapas, aprovações, retomas); os detalhes encontram-se em [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** as frases restantes e os caracteres a pagar (Eleven v3: cerca de 0,53 crédito por carácter; Voxtral TTS: 16 $ por milhão de caracteres).
2. **Gerar**. Executar novamente o mesmo comando retoma o que estiver em falta. Quando os créditos se esgotam, o script termina corretamente (código 3) sem deixar ficheiros parcialmente escritos. `--max-total-chars` limita a despesa acumulada da versão: cada resposta paga é registada assim que é recebida num registo que sobrevive a uma interrupção abrupta. Na Mistral, que não disponibiliza um saldo consultável, esta é a única proteção.
3. **Verificar**: cada frase tem o seu clip e cada MP3 é válido. Em seguida, o Whisper transcreve localmente cada clip, e a verificação assinala os números mal reconhecidos e as durações anormais. `voice:review` executa em sequência o Whisper, esta verificação e a página de audição com um único comando.
4. **Ouvir** na página de audição (`voice:listen`) os clips assinalados e uma amostra de formas femininas («une fois 7»), que o Whisper não distingue. Cada clip tem uma caixa «a refazer», que o adiciona à lista de clips rejeitados.
5. **Refazer** os clips rejeitados (`--redo`), executar novamente o Whisper e depois comparar cada clip antes e depois numa segunda página. Um clip que continue a ser pronunciado incorretamente após duas ou três tentativas recebe um texto imposto em `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por exemplo, o número escrito por extenso.
6. **Publicar** os clips, verificar se respondem online e depois publicar o índice do idioma, primeiro para os testadores (`?voix=test`).
7. **Disponibilizar** a voz a todos e depois ativá-la por predefinição. O interruptor de emergência (`voice:publish -- remove`) remove um idioma do índice: o jogo volta a utilizar a voz do dispositivo.

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

### Regra: uma frase falada modificada deve ser regravada antes da entrada em produção

Todas as frases faladas provêm das traduções (`assets/translations/{fr,en,es}.json`) e fazem parte do corpus. Alterar uma frase falada faz, portanto, falhar o teste de bloqueio do corpus (`scripts/voice/corpus.lock.json`). Para um idioma que tenha voz gravada, geram-se os clips das frases afetadas, verificam-se e ouvem-se e, em seguida, publicam-se **antes** de fazer o merge. Por fim, atualiza-se o bloqueio (`npm run voice:corpus:lock`). Sem esses clips, a frase modificada é lida com a voz do dispositivo.

## 📊 Armazenamento de dados

### Dados do utilizador

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos arcade
- Definições de personalização

### Funcionalidades técnicas

- Armazenamento local (localStorage) com fallbacks
- Isolamento dos dados por utilizador
- Gravação automática do progresso
- Migração automática dos dados antigos

## 🐛 Comunicar um problema

Os problemas podem ser comunicados através das issues do GitHub. Inclua:

- Descrição detalhada do problema
- Passos para o reproduzir
- Navegador e versão
- Capturas de ecrã, se forem relevantes

## 💝 Apoiar o projeto

**[☕ Fazer um donativo através do PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a AGPL v3. Consulte o ficheiro `LICENSE` para obter mais detalhes.

---

_LeapMultix — aplicação educativa livre para aprender as quatro operações_
