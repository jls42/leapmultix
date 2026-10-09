<details>
<summary>Este documento também está disponível em outros idiomas</summary>

- [Inglês](./README.en.md)
- [Espanhol](./README.es.md)
- [Português](./README.pt.md)
- [Alemão](./README.de.md)
- [Chinês](./README.zh.md)
- [Hindi](./README.hi.md)
- [Árabe](./README.ar.md)
- [Italiano](./README.it.md)
- [Sueco](./README.sv.md)
- [Polonês](./README.pl.md)
- [Neerlandês](./README.nl.md)
- [Romeno](./README.ro.md)
- [Japonês](./README.ja.md)
- [Coreano](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licença: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Distintivo Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Estado da barreira de qualidade](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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
- [Voz gravada](#-voz-gravada)
- [Armazenamento de dados](#-armazenamento-de-dados)
- [Comunicar um problema](#-comunicar-um-problema)
- [Licença](#-licença)

## Descrição

LeapMultix é uma aplicação web educativa e interativa destinada a crianças dos 6 aos 12 anos para dominarem as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). Oferece **6 modos de jogo** e **4 minijogos de arcade** numa interface intuitiva, acessível e multilingue.

**Suporte para várias operações:** todos os modos aceitam as quatro operações. A escolha é feita no ecrã inicial e aplica-se a todo o percurso.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Visão geral

### Os ecrãs

|                                                                                                                                        |                                                                                                                  |
| :------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
|                                  ![Ecrã «Quem joga?»: escolha do perfil](docs/media/01-accueil.webp)                                   |                ![Menu principal: escolha da operação e do modo de jogo](docs/media/02-menu.webp)                 |
|                              **Quem joga?** — um perfil por criança, com o respetivo avatar e progresso.                               |                     **O menu** — a operação é escolhida aqui e, em seguida, o modo de jogo.                      |
|                        ![Modo Descoberta: a tabuada do 4 apresentada com pontos](docs/media/03-decouverte.webp)                        |            ![Modo Quiz: resposta errada a vermelho, resposta certa a verde](docs/media/04-quiz.webp)             |
|           **Descoberta** — cada igualdade é apresentada com pontos, saltos ou contagem, juntamente com o truque da tabuada.            | **Quiz** — a escolha da criança permanece visível ao lado da resposta correta, e a explicação detalha o cálculo. |
|                              ![Modo Desafio: contagem decrescente e série atual](docs/media/05-defi.webp)                              |         ![Modo Aventura: mapa dos dez níveis, com os seguintes bloqueados](docs/media/06-aventure.webp)          |
|    **Desafio** — corrida contra o tempo. Em caso de erro, o cronómetro para durante o tempo necessário para ler a resposta correta.    |                  **Aventura** — dez níveis que se abrem um após o outro, em troca de estrelas.                   |
|                     ![Modo Crono: uma corrida de subtração, o cronómetro e o progresso](docs/media/14-chrono.webp)                     |                          ![Menu Arcade: os quatro minijogos](docs/media/07-arcade.webp)                          |
| **Crono** — dez respostas certas contra o tempo, na operação escolhida; os cálculos falhados são adicionados a uma lista para revisão. |                   **Arcade** — quatro minijogos, com ajuste de dificuldade e escolha da nave.                    |
|          ![Painel: partidas, recordes e respostas de cada modo, detalhados por operação](docs/media/08-tableau-de-bord.webp)           |             ![Personalização: avatares, temas, acessibilidade](docs/media/09-personnalisation.webp)              |
|         **Painel** — partidas e recordes de cada modo, detalhados por operação; estrelas e tabuadas a rever na multiplicação.          | **Personalização** — avatares para desbloquear com moedas, tema de cores, tamanho do texto e contraste elevado.  |

### Os minijogos de arcade

Quatro jogos que fazem a mesma pergunta — a apresentada acima da área de
jogo, com o tempo restante e as vidas — mas que exigem um gesto
diferente em cada ocasião.

|                                                                                                                               |                                                                                                              |
| :---------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
|         ![MultiInvaders: monstros com números e uma nave na parte inferior do ecrã](docs/media/10-multiinvaders.webp)         | ![MultiMiam: um labirinto onde as pastilhas apresentam as respostas possíveis](docs/media/11-multimiam.webp) |
| **MultiInvaders** — disparar contra as respostas erradas e poupar a certa: ela esconde um amigo que precisa de ser libertado. |        **MultiMiam** — percorrer o labirinto para apanhar o resultado correto, evitando os monstros.         |
|      ![MultiMemory: uma grelha de cartas, duas viradas mostrando um cálculo e um número](docs/media/12-multimemory.webp)      |            ![MultiSnake: uma serpente e maçãs numeradas num prado](docs/media/13-multisnake.webp)            |
|                       **MultiMemory** — recordar qual carta apresenta o resultado do cálculo revelado.                        |               **MultiSnake** — crescer engolindo os números certos e evitando todos os outros.               |

## ✨ Funcionalidades

### 🎮 Modos de jogo

- **Modo Descoberta**: exploração visual e interativa adaptada a cada operação
- **Modo Quiz**: perguntas de escolha múltipla com suporte para as 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio**: corrida contra o tempo com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: progressão narrativa por níveis com suporte para as 4 operações
- **Modo Crono**: 10 respostas certas contra um cronómetro que não para, para superar o melhor tempo, com as 4 operações (×, +, −, ÷)

### 🕹️ Minijogos de arcade

- **MultiInvaders**: Space Invaders educativo — destruir as respostas erradas
- **MultiMiam**: Pac-Man matemático — recolher as respostas certas
- **MultiMemory**: jogo de memória — associar operações e resultados
- **MultiSnake**: Snake educativo — crescer comendo os números certos

### ➕ Suporte para várias operações

LeapMultix oferece um treino completo das 4 operações aritméticas em **todos os modos**:

| Modo       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Desafio    | ✅  | ✅  | ✅  | ✅  |
| Descoberta | ✅  | ✅  | ✅  | ✅  |
| Aventura   | ✅  | ✅  | ✅  | ✅  |
| Crono      | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcionalidades transversais

- **Vários utilizadores**: um perfil por criança, com o respetivo progresso; num computador de sala de aula, nomes ordenados, filtro a partir de 10 jogadores, reciclagem durante 30 dias e cópia de segurança dos jogadores num ficheiro
- **Multilingue**: suporte para francês, inglês e espanhol
- **Personalização**: avatares (o primeiro à escolha, os restantes desbloqueados com as moedas ganhas ao jogar, 50 moedas cada), temas de cores e fundos
- **Acessibilidade**: navegação completa por teclado, suporte tátil, pausa no Arcade, tamanho do texto e contraste elevado; verificada com axe-core, sem violações WCAG de nível A ou AA nos ecrãs percorridos
- **Voz gravada**: o jogo consegue ler perguntas e incentivos com uma voz sintetizada pré-gravada, recorrendo automaticamente à voz do dispositivo como alternativa. As vozes não estão neste repositório: o site leapmultix.jls42.org disponibiliza Lucie em francês, Sulafat em inglês e espanhol e, à escolha, Sulafat e Marie em francês e Jane em inglês (consulte [Voz gravada](#-voz-gravada))
- **Responsivo em dispositivos móveis**: interface otimizada para tablets e smartphones
- **Sistema de progressão**: painel por perfil (partidas, recordes e tabuadas a rever, detalhados por operação), distintivos, desafios diários, moedas (no Crono, na Aventura, no Desafio e no Desafio do dia)

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
npm run test:pwa-offline # Hors ligne de bout en bout (Puppeteer, serveur intégré)

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

### Estrutura dos ficheiros

Os módulos JavaScript estão **organizados num único nível em `js/`**, com exceção de três pastas:
`core/`, `components/` e `modes/`. Assim, é o nome do ficheiro que indica o
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
│   │   ├── profile-operation-stats.js        # Statistiques par calcul, rangées dans le profil
│   │   ├── players-trash.js, players-backup.js   # Corbeille et sauvegarde des joueurs
│   │   ├── avatar-shop.js                    # Avatars débloqués avec les pièces (prix, achat)
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   ├── playerTools.js  # « Qui joue ? » sur un poste de classe : filtre, corbeille, sauvegarde
│   │   ├── loadErrorNotice.js   # Avis d'un jeu qui n'a pas pu s'ouvrir (hors ligne…)
│   │   ├── confirm-dialog.js, avatarShop.js   # Fenêtre de confirmation du jeu, boutique d'avatars
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux (temps et pause :
│   │                       #   arcade-time.js ; plein écran : arcade-fullscreen.js)
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── game-exit.js        # Une seule règle pour quitter une partie en cours
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
│   ├── precache-list.mjs   # Liste de préchargement hors ligne de sw.js (npm run precache:update)
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Arquitetura técnica

**Módulos ES6 modernos**: o projeto utiliza uma arquitetura modular com classes ES6 e imports/exports nativos.

**Componentes reutilizáveis**: interface construída com componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: carregamento inteligente dos módulos a pedido através de `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de armazenamento unificado**: API centralizada para a persistência dos dados dos utilizadores através de LocalStorage com fallbacks.

**Gestão de áudio centralizada**: controlo do som com suporte multilingue e preferências por utilizador.

**Event Bus**: comunicação orientada a eventos e desacoplada entre componentes, para uma arquitetura fácil de manter.

**Navegação por slides**: sistema de navegação baseado em slides numerados (slide0, slide1, etc.) com `goToSlide()`.

**Segurança**: proteção contra XSS e sanitização através de `security-utils.js` para todas as manipulações do DOM.

## 🎯 Modos de jogo detalhados

### Modo Descoberta

Interface de exploração visual, adaptada a cada operação, com:

- Visualização interativa das multiplicações
- Animações e auxiliares de memória
- Arrastar e largar educativo
- Progressão livre por tabuada

### Modo Quiz

Perguntas de escolha múltipla com:

- 10 perguntas por sessão
- Progressão adaptativa conforme os resultados
- Teclado numérico virtual
- Sistema de streak (série de respostas certas)

### Modo Desafio

Corrida contra o tempo com:

- 3 níveis de dificuldade (Principiante, Médio, Difícil)
- Bónus de tempo pelas respostas certas
- Sistema de vidas
- Classificação das melhores pontuações

### Modo Aventura

Progressão narrativa com:

- 10 níveis temáticos desbloqueáveis
- Mapa interativo com progressão visual
- História envolvente com personagens
- Sistema de estrelas e recompensas

### Modo Crono

Dez respostas certas o mais depressa possível, contra um cronómetro que não para:

- As quatro operações: as tabuadas de multiplicação (configuradas nas Definições das tabuadas) e
  todas as tabuadas de adição (7 + k), de subtração ((7 + k) − 7) e de divisão ((7 × k) ÷ 7)
- Resposta por escolha ou pelo teclado numérico, tanto por clique como pelo teclado
- Melhores tempos, tempo médio e gráfico das partidas mais recentes, por operação
- «Os meus cálculos para rever»: uma lista por operação, revista nos dois sentidos (6 × 7 e 7 × 6,
  15 − 7 e 15 − 8)

### Painel

Aquilo que a criança realmente jogou, perfil a perfil:

- Estrelas da Aventura e tabuadas de multiplicação a rever (as 20 respostas mais recentes de cada tabuada)
- Perguntas e respostas certas no Quiz, no Desafio, na Aventura e no Crono
- Partidas e recordes de cada modo e de cada minijogo, incluindo desistências, detalhados por operação
  assim que a criança praticar várias

### Minijogos de arcade

Cada minijogo oferece:

- Três níveis de dificuldade, nas quatro operações
- Sistema de vidas e pontuação
- Controlos com o rato, teclado e toque, descritos na ficha do jogo
- Pausa: botão ao lado do tempo ou tecla P; o jogo também entra em pausa quando o separador fica
  oculto e nunca recomeça sozinho
- MultiMemory: uma partida sem limite de tempo, opcionalmente
- Tabuleiro adaptado ao espaço disponível (mais alto do que largo num telemóvel na vertical) e ecrã inteiro,
  tanto no computador como no telemóvel, incluindo com o telemóvel rodado (exceto no iPhone, cujo navegador
  não o permite)
- Melhores pontuações de cada jogador; «Repor» indica tudo o que elimina

## 🔧 Desenvolvimento

### Workflow de desenvolvimento

**Nunca fazer commit diretamente em main.** O projeto utiliza branches de
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

**3. Fazer commit na branch** e depois enviar a branch:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir uma pull request** e aguardar as análises: verify, Codacy,
CodeFactor e SonarCloud. Os problemas devem ser corrigidos até tudo ficar verde antes da integração.

**Estilo de commit**: mensagens concisas no imperativo (por exemplo: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: garantir que `npm run lint`, `npm test` e `npm run test:coverage` passam antes de cada commit

### Arquitetura dos componentes

**GameMode (classe base)**: todos os modos herdam de uma classe comum com métodos normalizados.

**GameModeManager**: orquestração centralizada do lançamento e da gestão dos modos.

**Componentes UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface coerente.

**Lazy Loading**: os módulos são carregados a pedido para otimizar o desempenho inicial.

**Event Bus**: comunicação desacoplada entre componentes através do sistema de eventos.

### Testes

O projeto inclui um conjunto completo de testes:

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
- **Post-build**: copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para apontar para o ficheiro de entrada com hash (por exemplo: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integração Contínua

**GitHub Actions**: `.github/workflows/ci.yml`, acionado a cada push para
`main` e a cada pull request.

**`verify`** — a porta de qualidade, bloqueante:

- `npm ci` e depois `npm run verify` (ESLint, testes Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — após `verify`: auditoria Lighthouse do site online, para
acompanhar as métricas de SEO ao longo do tempo.

**Análises externas** associadas às pull requests: Codacy, CodeFactor e
SonarCloud. A porta SonarCloud exige classificações A em fiabilidade, segurança e
manutenibilidade no código novo.

**Implementação**: `./deploy.sh` sincroniza o site com o S3 e invalida a cache
do CloudFront. O script regenera, quando necessário, as imagens responsivas ausentes do git.

### PWA (Progressive Web App)

O LeapMultix é uma PWA completa, com suporte offline e possibilidade de instalação.

**Service Worker** (`sw.js`):

- Instalação: pré-carregamento de tudo o que o jogo requer, com uma lista gerada a partir do código
  por `scripts/precache-list.mjs` (`npm run precache:update`, verificada pelos testes): após
  uma primeira visita, os 6 modos e os 4 jogos de Arcade iniciam offline
- Navegação: Network-first, com um prazo de 4 s: passado esse prazo (uma rede que não responde: wifi da escola, portal cativo) ou offline, a página do jogo em cache (`offline.html` apenas para uma página que nunca tenha sido guardada)
- Imagens: Cache-first; offline, outro tamanho do mesmo sprite ou outro fundo do mesmo avatar
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: os desta versão (endereços com `?v=`, os de um site publicado) vêm primeiro da sua cópia pré-carregada, da mesma versão por construção: o servidor ignora `?v=` e, após uma publicação, serviria caso contrário outra versão. Os restantes (sem `?v=` em desenvolvimento): Network-first, com o mesmo prazo de 4 s antes da cópia desta versão
- Sons e tipos de letra: Cache-first, com intervalos de bytes servidos (leitor de áudio do Safari)
- Gestão automática de versões através de `cache-updater.js`

**Manifest** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Instalação possível em dispositivos móveis (Add to Home Screen)
- Configuração standalone para uma experiência semelhante a uma aplicação
- Suporte para temas e cores

**Testar localmente o modo offline.** Iniciar o servidor e depois abrir
`http://localhost:8080` (ou a porta apresentada):

```bash
npm run serve
```

Manualmente: deixar a página aberta enquanto o service worker regista o jogo, parar
o servidor (ou desligar a rede do dispositivo) e depois atualizar a página. O jogo deve
ser apresentado e todos os modos devem iniciar.

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

- **ESLint**: configuração moderna com flat config (`eslint.config.js`), suporte para ES2022
- **Prettier**: formatação automática do código (`.prettierrc`)
- **Stylelint**: validação de CSS (`.stylelintrc.json`)
- **JSDoc**: documentação automática das funções com análise de cobertura

**Regras de código importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Utilizar uma gestão de erros específica (sem catch vazios)
- Evitar `innerHTML` em favor das funções `security-utils.js`
- Manter uma complexidade cognitiva < 15 nas funções
- Extrair funções complexas para helpers menores

**Segurança**:

- **Proteção contra XSS**: utilizar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo de texto
- **Scripts externos**: atributo `crossorigin="anonymous"` obrigatório
- **Validação das entradas**: sanitizar sempre os dados externos
- **Content Security Policy**: headers CSP para restringir as origens dos scripts

**Acessibilidade**:

- Objetivo WCAG 2.1 nível AA, verificado com axe-core: nenhuma violação de nível A ou AA, nem de
  boas práticas
- Navegação completa por teclado
- Funções ARIA e nomes acessíveis
- Contrastes verificados pelo axe-core

**Desempenho**:

- Lazy loading dos módulos através de `lazy-loader.js`
- Otimizações de CSS e assets responsivos
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

- **Desktop**: controlos por teclado e rato
- **Tablets**: interface tátil otimizada
- **Smartphones**: design responsivo adaptável

### Acessibilidade

- Navegação completa por teclado: Tab, setas nas grelhas de respostas e nos cartões do
  MultiMemory, Enter, Esc; ligação «Ir para os modos de jogo» no topo da página inicial
- Uma única regra para sair de uma partida: «Desistir», Esc ou um botão da barra superior
  fazem a mesma pergunta, e a partida continua se a criança recusar
- Leitores de ecrã: cada resposta está associada à respetiva pergunta, há um título de nível 1 por ecrã e as
  mensagens são anunciadas
- A página pode ser ampliada com os dedos (exceto nos jogos de Arcade); tamanho do texto, contraste elevado,
  animações reduzidas e um tipo de letra para leitura derivado do Andika, concebido para leitores
  principiantes
- Arcade: pausa (botão, tecla P ou separador oculto); MultiMemory sem limite de tempo, opcionalmente
- Verificada com axe-core (WCAG 2.0 a 2.2, níveis A e AA e boas práticas): nenhuma
  violação em 41 ecrãs com largura de computador e 40 com largura de telemóvel (390 px), incluindo o tema
  Noite e o contraste elevado

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
- Achatamento de estruturas JSON aninhadas em notação de pontos (ex.: `arcade.multiMemory.title`)
- Geração de um relatório detalhado na consola
- Armazenamento do relatório JSON em `docs/translations-comparison-report.json`

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

O jogo lê em voz alta as perguntas, os incentivos e as explicações. Utiliza apenas um conjunto finito de frases, cerca de 7 400 por idioma: estas podem, portanto, ser gravadas de uma vez por todas e, assim, nenhuma partida recorre a um serviço de síntese. Sem clips, o jogo utiliza a voz do dispositivo.

### Neste repositório: a aplicação, sem as vozes

O código consegue reproduzir clips pré-gravados e contém o fluxo que os produz. Os clips não estão incluídos, tal como as chaves dos fornecedores: um fork ou uma instalação local utiliza a voz do dispositivo.

- **Fallback automático** para a voz do dispositivo, frase a frase: clip ausente ou com erro, reprodução recusada pelo navegador, clip que não inicia em 1,5 s ou modo offline sem o clip em cache.
- **Definições**: o botão de voz da barra superior ativa ou desativa a leitura; a caixa «Voz gravada» (Acessibilidade e controlos) permite escolher entre a voz gravada e a voz do dispositivo. Só aparece nos idiomas para os quais existe uma voz publicada.
- **Offline**: os clips já ouvidos permanecem em cache (service worker).
- **Onde o jogo procura os clips**: na tag `<meta name="leapmultix-voice-base">`, vazia no repositório. Apenas a implementação em produção escreve nela `/voice/`.

Com os seus próprios clips na máquina (produzidos pelo fluxo abaixo e colocados junto ao jogo em `../leapmultix-voices`), o parâmetro `?voix=local` faz com que sejam reproduzidos pelo servidor de desenvolvimento:

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

Os clips encontram-se num repositório privado e num bucket S3 dedicado, servido pelo CloudFront em `/voice/*`. São gerados uma única vez: durante o jogo, nada é enviado para estes serviços. Nas definições, o menu «Voz» apresenta as vozes do idioma quando há várias, e a indicação identifica o serviço da voz ouvida.

### Gerar os clips

O fluxo está automatizado em `scripts/voice/` e é executado na máquina do proprietário, nunca na CI pública. As chaves dos fornecedores (ElevenLabs para Lucie, Google Cloud Text-to-Speech para Sulafat, Mistral para Marie e Jane) permanecem num ficheiro `.env` fora do repositório, fornecido através de `node --env-file`: nenhuma chave entra no git. O skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) conduz o procedimento passo a passo (portas, aprovações, retomas); os detalhes encontram-se em [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** as frases restantes e os caracteres a pagar (Eleven v3: cerca de 0,53 crédito por carácter; Chirp 3 HD: 30 $ por milhão de caracteres, com o primeiro milhão de cada mês gratuito; Voxtral TTS: 16 $ por milhão).
2. **Gerar**. Executar novamente o mesmo comando retoma o que falta. Quando os créditos se esgotam, o script para corretamente (código 3) sem deixar ficheiros parcialmente escritos. `--max-total-chars` limita a despesa acumulada da versão: cada resposta paga é registada assim que é recebida num registo que sobrevive a uma interrupção abrupta. Na Google e na Mistral, que não disponibilizam qualquer saldo legível, esta é a única proteção.
3. **Verificar**: cada frase tem o seu clip e cada MP3 é válido. Em seguida, o Whisper transcreve cada clip localmente, e a verificação assinala os números mal reconhecidos e as durações anormais. `voice:review` executa em sequência o Whisper, esta verificação e a página de audição num único comando.
4. **Ouvir** na página de audição (`voice:listen`) os clips assinalados e uma amostra de formas femininas («uma vez 7»), que o Whisper não distingue. Cada clip tem uma caixa «refazer», que o adiciona à lista de clips rejeitados.
5. **Refazer** os clips rejeitados (`--redo`), executar novamente o Whisper e depois comparar cada clip antes e depois numa segunda página. Um clip que continue mal pronunciado após duas ou três tentativas recebe um texto imposto em `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por exemplo, o número por extenso.
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

### Regra: uma frase falada que seja modificada deve ser regravada antes da entrada em produção

Todas as frases faladas provêm das traduções (`assets/translations/{fr,en,es}.json`) e fazem parte do corpus. Alterar uma frase falada faz, portanto, falhar o teste de bloqueio do corpus (`scripts/voice/corpus.lock.json`). Para um idioma que tenha voz gravada, geram-se então os clips das frases afetadas, verificam-se e ouvem-se e, em seguida, publicam-se **antes** da fusão. Por fim, atualiza-se o bloqueio (`npm run voice:corpus:lock`). Sem estes clips, a frase modificada é lida com a voz do dispositivo.

## 📊 Armazenamento de dados

### Dados do utilizador

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos de Arcade
- Definições de personalização

### Funcionalidades técnicas

- Armazenamento local (localStorage) com fallbacks; é solicitado ao navegador que não o elimine
  por iniciativa própria (`navigator.storage.persist()`)
- Reciclagem dos jogadores eliminados: 30 dias com todos os seus dados, com restauro a partir de
  «Quem está a jogar?»
- Cópia de segurança dos jogadores num ficheiro JSON, com restauro neste dispositivo ou noutro (um jogador
  já existente nunca é substituído)
- Dados de jogo organizados por perfil, incluindo estatísticas por cálculo: num dispositivo partilhado, os erros de um jogador não influenciam as perguntas de outro
- Armazenamento automático do progresso
- Migração automática dos dados antigos

## 🐛 Comunicar um problema

Os problemas podem ser comunicados através das issues do GitHub. Inclua:

- Descrição detalhada do problema
- Passos para o reproduzir
- Navegador e versão
- Capturas de ecrã, se pertinentes

## 💝 Apoiar o projeto

**[☕ Fazer uma doação através do PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a AGPL v3. Consulte o ficheiro `LICENSE` para mais detalhes.

---

_LeapMultix — aplicação educativa livre para aprender as quatro operações_
