<details>
<summary>Este documento também está disponível noutros idiomas</summary>

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
[![Emblema Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Estado do Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Classificação de fiabilidade](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
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
- [Armazenamento de dados](#-armazenamento-de-dados)
- [Comunicar um problema](#-comunicar-um-problema)
- [Licença](#-licença)

## Descrição

LeapMultix é uma aplicação web educativa e interativa destinada a crianças dos 6 aos 12 anos, para dominarem as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). Inclui **5 modos de jogo** e **4 minijogos de arcade** numa interface intuitiva, acessível e multilingue.

**Suporte para várias operações:** os cinco modos aceitam as quatro operações. A escolha é feita no ecrã inicial e aplica-se a todo o percurso.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Visão geral

### Os ecrãs

|                                                                                                                        |                                                                                                               |
| :--------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: |
|                          ![Ecrã «Quem joga?»: escolha do perfil](docs/media/01-accueil.webp)                           |               ![Menu principal: escolha da operação e dos cinco modos](docs/media/02-menu.webp)               |
|                      **Quem joga?** — um perfil por criança, com o respetivo avatar e progresso.                       |               **O menu** — a operação é escolhida aqui e, em seguida, abrem-se os cinco modos.                |
|                ![Modo Descoberta: a tabuada do 4 apresentada em pontos](docs/media/03-decouverte.webp)                 |           ![Modo Quiz: resposta errada a vermelho, resposta certa a verde](docs/media/04-quiz.webp)           |
|          **Descoberta** — cada igualdade é apresentada em pontos, saltos ou contagem, com a dica da tabuada.           | **Quiz** — a escolha da criança permanece visível ao lado da resposta certa e a explicação detalha o cálculo. |
|                  ![Modo Desafio: contagem decrescente e sequência em curso](docs/media/05-defi.webp)                   |        ![Modo Aventura: mapa dos dez níveis, com os seguintes bloqueados](docs/media/06-aventure.webp)        |
| **Desafio** — corrida contra o relógio. Em caso de erro, o cronómetro fica parado durante a leitura da resposta certa. |                  **Aventura** — dez níveis que se abrem um após outro, em troca de estrelas.                  |
|                             ![Menu Arcade: os quatro minijogos](docs/media/07-arcade.webp)                             |              ![Painel: estrelas por tabuada e estatísticas](docs/media/08-tableau-de-bord.webp)               |
|                      **Arcade** — quatro minijogos, com ajuste da dificuldade e escolha da nave.                       |                  **Painel** — estrelas por tabuada, tabuadas a rever e pontuações por modo.                   |
|                ![Personalização: avatares, temas e acessibilidade](docs/media/09-personnalisation.webp)                |                                                                                                               |
|           **Personalização** — avatar, tema de cores, tamanho do texto, contraste elevado e código parental.           |                                                                                                               |

### Os minijogos de arcade

Quatro jogos que fazem a mesma pergunta — a que é apresentada acima da área de
jogo, juntamente com o tempo restante e as vidas — mas exigem um gesto
diferente em cada um.

|                                                                                                                               |                                                                                                           |
| :---------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
|         ![MultiInvaders: monstros com números e uma nave na parte inferior do ecrã](docs/media/10-multiinvaders.webp)         | ![MultiMiam: um labirinto onde os pontos apresentam as respostas possíveis](docs/media/11-multimiam.webp) |
|    **MultiInvaders** — disparar contra as respostas erradas e poupar a certa: ela esconde um amigo que deve ser libertado.    |        **MultiMiam** — percorrer o labirinto para apanhar o resultado certo, evitando os monstros.        |
| ![MultiMemory: uma grelha de cartas, duas viradas para cima mostrando um cálculo e um número](docs/media/12-multimemory.webp) |          ![MultiSnake: uma serpente e maçãs numeradas num prado](docs/media/13-multisnake.webp)           |
|                       **MultiMemory** — recordar qual carta contém o resultado do cálculo apresentado.                        |              **MultiSnake** — crescer ao engolir os números certos e evitar todos os outros.              |

## ✨ Funcionalidades

### 🎮 Modos de jogo

- **Modo Descoberta**: exploração visual e interativa adaptada a cada operação
- **Modo Quiz**: perguntas de escolha múltipla com suporte para as 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio**: corrida contra o relógio com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: progressão narrativa por níveis com suporte para as 4 operações

### 🕹️ Minijogos de arcade

- **MultiInvaders**: Space Invaders educativo — destruir as respostas erradas
- **MultiMiam**: Pac-Man matemático — recolher as respostas certas
- **MultiMemory**: jogo de memória — associar operações e resultados
- **MultiSnake**: Snake educativo — crescer ao comer os números certos

### ➕ Suporte para várias operações

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
- **Multilingue**: suporte para francês, inglês e espanhol
- **Personalização**: avatares, temas de cores e fundos
- **Acessibilidade**: navegação por teclado, suporte tátil e conformidade com WCAG 2.1 AA
- **Responsivo em dispositivos móveis**: interface otimizada para tablets e smartphones
- **Sistema de progressão**: pontuações, emblemas e desafios diários

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
```

## 🏗️ Arquitetura

### Estrutura dos ficheiros

Os módulos JavaScript encontram-se **diretamente em `js/`**, com exceção de três pastas:
`core/`, `components/` e `modes/`. Por isso, é o nome do ficheiro que determina o
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
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Arquitetura técnica

**Módulos ES6 modernos**: o projeto utiliza uma arquitetura modular com classes ES6 e imports/exports nativos.

**Componentes reutilizáveis**: interface construída com componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: carregamento inteligente dos módulos a pedido através de `lazy-loader.js`, para otimizar o desempenho inicial.

**Sistema de armazenamento unificado**: API centralizada para a persistência dos dados dos utilizadores através de LocalStorage, com fallbacks.

**Gestão de áudio centralizada**: controlo do som com suporte multilingue e preferências por utilizador.

**Event Bus**: comunicação orientada a eventos e desacoplada entre componentes, para uma arquitetura fácil de manter.

**Navegação por slides**: sistema de navegação baseado em slides numerados (slide0, slide1, etc.) com `goToSlide()`.

**Segurança**: proteção contra XSS e sanitização através de `security-utils.js` em todas as manipulações do DOM.

## 🎯 Modos de jogo detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas de multiplicação com:

- Visualização interativa das multiplicações
- Animações e auxiliares de memória
- Ação educativa de arrastar e largar
- Progressão livre por tabuada

### Modo Quiz

Perguntas de escolha múltipla com:

- 10 perguntas por sessão
- Progressão adaptativa de acordo com os acertos
- Teclado numérico virtual
- Sistema de streak (sequência de respostas certas)

### Modo Desafio

Corrida contra o relógio com:

- 3 níveis de dificuldade (Principiante, Médio, Difícil)
- Bónus de tempo pelas respostas certas
- Sistema de vidas
- Classificação das melhores pontuações

### Modo Aventura

Progressão narrativa com:

- 10 níveis temáticos desbloqueáveis
- Mapa interativo com progressão visual
- História imersiva com personagens
- Sistema de estrelas e recompensas

### Minijogos de arcade

Cada minijogo inclui:

- Escolha da dificuldade e personalização
- Sistema de vidas e pontuação
- Controlos por teclado e táteis
- Classificações individuais por utilizador

## 🛠️ Desenvolvimento

### Workflow de desenvolvimento

**Nunca fazer commits diretamente em main.** O projeto utiliza branches de
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

**3. Fazer commit na branch** e, em seguida, fazer push:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir uma pull request** e aguardar as análises: verify, Codacy,
CodeFactor e SonarCloud. Os problemas devem ser corrigidos até tudo ficar verde antes do merge.

**Estilo de commit**: mensagens concisas, no modo imperativo (ex.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: garantir que `npm run lint`, `npm test` e `npm run test:coverage` passam antes de cada commit

### Arquitetura dos componentes

**GameMode (classe base)**: todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: orquestração centralizada do arranque e da gestão dos modos.

**Componentes UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface coerente.

**Lazy Loading**: os módulos são carregados a pedido para otimizar o desempenho inicial.

**Event Bus**: comunicação desacoplada entre componentes através do sistema de eventos.

### Testes

O projeto inclui uma suite de testes completa:

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

- **Rollup**: bundle de `js/main-es6.js` em ESM, com code-splitting e sourcemaps
- **Terser**: minificação automática para otimização
- **Post-build**: cópia de `css/` e `assets/`, dos favicons (`favicon.ico`, `favicon.png`, `favicon.svg`) e de `sw.js`, além da reescrita de `dist/index.html` para o ficheiro de entrada com hash (ex.: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integração contínua

**GitHub Actions**: `.github/workflows/ci.yml`, acionado a cada push para
`main` e a cada pull request.

**`verify`** — o quality gate, que é bloqueante:

- `npm ci` e depois `npm run verify` (ESLint, testes Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — após `verify`: auditoria Lighthouse do site online, para
acompanhar as métricas de SEO ao longo do tempo.

**Análises externas** ligadas às pull requests: Codacy, CodeFactor e
SonarCloud. O quality gate do SonarCloud exige classificações A em fiabilidade, segurança e
manutenibilidade do código novo.

**Implementação**: `./deploy.sh` sincroniza o site com o S3 e invalida a cache do
CloudFront. Quando necessário, o script volta a gerar as imagens responsivas, que não estão presentes no git.

### PWA (Progressive Web App)

LeapMultix é uma PWA completa, com suporte offline e possibilidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback offline para `offline.html`
- Imagens: Cache-first para otimizar o desempenho
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: Network-first para servir sempre a versão mais recente
- Gestão automática de versões através de `cache-updater.js`

**Manifest** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Possibilidade de instalação em dispositivos móveis (Add to Home Screen)
- Configuração standalone para uma experiência semelhante a uma app
- Suporte para temas e cores

**Testar o modo offline localmente.** Iniciar o servidor e, em seguida, abrir
`http://localhost:8080` (ou a porta apresentada):

```bash
npm run serve
```

Manualmente: desligar a rede nas ferramentas de desenvolvimento (separador Rede,
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

- **ESLint**: configuração moderna com flat config (`eslint.config.js`) e suporte para ES2022
- **Prettier**: formatação automática do código (`.prettierrc`)
- **Stylelint**: validação de CSS (`.stylelintrc.json`)
- **JSDoc**: documentação automática das funções com análise de cobertura

**Regras de código importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Utilizar uma gestão de erros específica (sem catch vazios)
- Evitar `innerHTML` e optar pelas funções `security-utils.js`
- Manter uma complexidade cognitiva < 15 nas funções
- Extrair funções complexas para helpers mais pequenos

**Segurança**:

- **Proteção contra XSS**: utilizar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo de texto
- **Scripts externos**: atributo `crossorigin="anonymous"` obrigatório
- **Validação de entradas**: sanitizar sempre os dados externos
- **Content Security Policy**: headers CSP para restringir as origens dos scripts

**Acessibilidade**:

- Conformidade com WCAG 2.1 AA
- Navegação completa por teclado
- Funções ARIA e labels adequados
- Contrastes de cores em conformidade

**Desempenho**:

- Lazy loading dos módulos através de `lazy-loader.js`
- Otimizações de CSS e assets responsivos
- Service Worker para cache inteligente
- Code splitting e minificação em produção

## 📱 Compatibilidade

### Navegadores compatíveis

A interface baseia-se em `oklch()` para as cores e em `:has()` para os
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
- Funções ARIA e etiquetas para leitores de ecrã
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

Este script (`scripts/compare-translations.cjs`) garante a sincronização de todos os ficheiros de idioma:

**Funcionalidades:**

- Deteção de chaves em falta (presentes em fr.json, mas ausentes noutros idiomas)
- Deteção de chaves adicionais (presentes noutros idiomas, mas não em fr.json)
- Identificação de valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação da consistência dos tipos (string vs array)
- Conversão de estruturas JSON aninhadas em notação de pontos (ex.: `arcade.multiMemory.title`)
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
- Etiquetas de acessibilidade e ARIA

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
- Migração automática de dados antigos

## 🐛 Comunicar um problema

Os problemas podem ser comunicados através das issues do GitHub. Inclua:

- Descrição detalhada do problema
- Passos para o reproduzir
- Navegador e versão
- Capturas de ecrã, se forem relevantes

## 💝 Apoiar o projeto

**[☕ Fazer um donativo através do PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a AGPL v3. Consulte o ficheiro `LICENSE` para mais detalhes.

---

_LeapMultix — aplicação educativa livre para aprender as quatro operações_
