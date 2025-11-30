<details>
<summary>Este documento também está disponível em outros idiomas</summary>

- [Français](./README.md)
- [English](./README.en.md)
- [Español](./README.es.md)
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

<!-- Distintivos (atualizar <owner>/<repo> após migração para o GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![Licença: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Índice

- [Descrição](#descrição)
- [Funcionalidades](#-funcionalidades)
- [Início Rápido](#-início-rápido)
- [Arquitetura](#-arquitetura)
- [Modos de Jogo Detalhados](#-modos-de-jogo-detalhados)
- [Desenvolvimento](#-desenvolvimento)
- [Compatibilidade](#-compatibilidade)
- [Localização](#-localização)
- [Armazenamento de Dados](#-armazenamento-de-dados)
- [Relatar um Problema](#-relatar-um-problema)
- [Licença](#-licença)

## Descrição

LeapMultix é uma aplicação web educativa interativa moderna, projetada para crianças (8–12 anos) dominarem as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). A aplicação oferece **5 modos de jogo** e **4 minijogos arcade** numa interface intuitiva, acessível e multilingue.

**Suporte multi-operação:** Os modos Quiz e Desafio permitem praticar todas as operações. Os modos Descoberta, Aventura e Arcade concentram-se na multiplicação.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL Online:** https://leapmultix.jls42.org/

## ✨ Funcionalidades

### 🎮 Modos de Jogo

- **Modo Descoberta**: Exploração visual e interativa das tabuadas de multiplicação
- **Modo Quiz** ⭐: Perguntas de escolha múltipla com suporte para as 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio** ⭐: Corrida contra o tempo com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: Progressão narrativa através de níveis com mapa interativo (multiplicação)

⭐ = Suporte completo para as 4 operações aritméticas

### 🕹️ Minijogos Arcade

- **MultiInvaders**: Space Invaders educativo - Destrua as respostas erradas (multiplicação)
- **MultiMiam**: Pac-Man matemático - Recolha as respostas corretas (multiplicação)
- **MultiMemory**: Jogo de memória - Associe multiplicações aos seus resultados
- **MultiSnake**: Snake educativo - Cresça comendo os números corretos (multiplicação)

### ➕ Suporte Multi-Operação

O LeapMultix vai além da simples multiplicação, oferecendo um treino completo para as 4 operações aritméticas:

| Modo       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Desafio    | ✅  | ✅  | ✅  | ✅  |
| Descoberta | ✅  | ❌  | ❌  | ❌  |
| Aventura   | ✅  | ❌  | ❌  | ❌  |
| Arcade     | ✅  | ❌  | ❌  | ❌  |

**Nota:** O suporte de operações para os modos Descoberta, Aventura e Arcade está planeado para uma versão futura.

### 🌍 Funcionalidades Transversais

- **Multi-utilizador**: Gestão de perfis individuais com progresso guardado
- **Multilingue**: Suporte para francês, inglês e espanhol
- **Personalização**: Avatares, temas de cor, fundos
- **Acessibilidade**: Navegação por teclado, suporte tátil, conformidade WCAG 2.1 AA
- **Mobile responsive**: Interface otimizada para tablets e smartphones
- **Sistema de progressão**: Pontuações, emblemas, desafios diários

## 🚀 Início Rápido

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Um navegador web moderno

### Instalação

```bash
# Clonar o projeto
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento (opção 1)
npm run serve
# A aplicação estará acessível em http://localhost:8080 (ou porta seguinte disponível)

# Ou com Python (opção 2)
python3 -m http.server 8000
# A aplicação estará acessível em http://localhost:8000
```

### Scripts disponíveis

```bash
# Desenvolvimento
npm run serve          # Servidor local (http://localhost:8080)
npm run lint           # Verificação de código com ESLint
npm run lint:fix       # Correção automática de problemas ESLint
npm run format:check   # Verificar formatação do código (SEMPRE antes do commit)
npm run format         # Formatar código com Prettier
npm run verify         # Quality gate: lint + test + coverage

# Testes
npm run test           # Executar todos os testes (CJS)
npm run test:watch     # Testes em modo watch
npm run test:coverage  # Testes com relatório de cobertura
npm run test:core      # Testes apenas dos módulos core
npm run test:integration # Testes de integração
npm run test:storage   # Testes do sistema de armazenamento
npm run test:esm       # Testes ESM (pasta tests-esm/, Jest vm-modules)
npm run test:verbose   # Testes com saída detalhada
npm run test:pwa-offline # Teste offline PWA (requer Puppeteer), após `npm run serve`

# Análise e manutenção
npm run analyze:jsdoc  # Análise da documentação
npm run improve:jsdoc  # Melhoria automática JSDoc
npm run audit:mobile   # Testes de responsividade móvel
npm run audit:accessibility # Testes de acessibilidade
npm run dead-code      # Deteção de código não utilizado
npm run analyze:globals # Análise de variáveis globais
npm run analyze:dependencies # Análise de uso de dependências
npm run verify:cleanup # Análise combinada (código morto + globais)

# Gestão de ativos
npm run assets:generate    # Gerar imagens responsivas
npm run assets:backgrounds # Converter fundos para WebP
npm run assets:analyze     # Análise de ativos responsivos
npm run assets:diff        # Comparação de ativos

# Internacionalização
npm run i18n:verify    # Verificar consistência das chaves de tradução
npm run i18n:unused    # Listar chaves de tradução não utilizadas
npm run i18n:compare   # Comparar traduções (en/es) com fr.json (referência)

# Build & entrega
npm run build          # Build de produção (Rollup) + postbuild (dist/ completo)
npm run serve:dist     # Servir dist/ em http://localhost:5000 (ou porta disponível)

# PWA e Service Worker
npm run sw:disable     # Desativar service worker
npm run sw:fix         # Corrigir problemas de service worker
```

## 🏗️ Arquitetura

### Estrutura de ficheiros

```
leapmultix/
├── index.html              # Ponto de entrada principal
├── js/
│   ├── core/               # Módulos centrais ES6
│   │   ├── GameMode.js     # Classe base dos modos
│   │   ├── GameModeManager.js # Gestão dos modos de jogo
│   │   ├── storage.js      # API de armazenamento LocalStorage
│   │   ├── audio.js        # Gestão de som
│   │   ├── utils.js        # Utilitários genéricos (fonte canónica)
│   │   ├── eventBus.js     # Comunicação por eventos
│   │   ├── userState.js    # Gestão de sessão de utilizador
│   │   ├── mainInit.js     # Inicialização DOM-ready
│   │   ├── theme.js        # Sistema de temas
│   │   ├── userUi.js       # Utilitários de interface de utilizador
│   │   ├── parental.js     # Controlos parentais
│   │   ├── adventure-data.js # Dados do modo Aventura
│   │   ├── mult-stats.js   # Estatísticas de multiplicação
│   │   ├── challenge-stats.js # Estatísticas de desafio
│   │   └── daily-challenge.js # Gestão de desafios diários
│   ├── components/         # Componentes UI reutilizáveis
│   │   ├── topBar.js       # Barra de navegação
│   │   ├── infoBar.js      # Barras de informação dos jogos
│   │   ├── dashboard.js    # Painel de utilizador
│   │   └── customization.js # Interface de personalização
│   ├── modes/              # Modos de jogo
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minijogos arcade
│   │   ├── arcade.js       # Orquestrador principal arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Jogo de memória (31 KB)
│   │   ├── arcade-multimiam.js # Integração Multimiam
│   │   ├── arcade-multisnake.js # Integração Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilitários partilhados
│   │   ├── arcade-message.js, arcade-points.js # Componentes UI
│   │   └── arcade-scores.js # Gestão de pontuações
│   ├── multimiam/          # Jogo Pac-Man (arquitetura decomposta)
│   │   ├── multimiam.js    # Controlador principal
│   │   ├── multimiam-engine.js # Motor de jogo (15 KB)
│   │   ├── multimiam-renderer.js # Sistema de renderização (9 KB)
│   │   ├── multimiam-controls.js # Gestão de controlos (7 KB)
│   │   ├── multimiam-questions.js # Geração de perguntas (6 KB)
│   │   └── multimiam-ui.js # Elementos de interface
│   ├── multisnake.js       # Jogo Snake (38 KB)
│   ├── navigation/         # Sistema de navegação
│   │   ├── slides.js       # Navegação por slides (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Suporte de teclado
│   ├── ui/                 # Interface de utilizador e feedback
│   │   ├── uiUtils.js      # Utilitários de interface
│   │   ├── ui-feedback.js  # Mecanismos de feedback
│   │   ├── touch-support.js # Suporte tátil (7 KB)
│   │   ├── virtual-keyboard.js # Teclado virtual
│   │   ├── coin-display.js, coin-effects.js # Sistema de moeda
│   │   ├── notifications.js # Sistema de notificações
│   │   └── badges.js       # Sistema de emblemas
│   ├── media/              # Gestão de média
│   │   ├── VideoManager.js # Gestão de reprodução de vídeo (12 KB)
│   │   └── responsive-image-loader.js # Carregamento de imagens (9 KB)
│   ├── orchestration/      # Orquestração e carregamento
│   │   ├── mode-orchestrator.js # Mudança de modos
│   │   ├── lazy-loader.js  # Carregamento dinâmico (10 KB)
│   │   └── game-cleanup.js # Limpeza de estado
│   ├── utils/              # Utilitários
│   │   ├── utils-es6.js    # Agregador principal (5 KB)
│   │   ├── main-helpers.js # Helpers da aplicação
│   │   ├── helpers.js      # Funções helpers legacy
│   │   ├── stats-utils.js  # Utilitários de estatísticas
│   │   ├── difficulty.js   # Gestão de dificuldade
│   │   └── questionGenerator.js # Geração de perguntas
│   ├── storage/            # Armazenamento e estado
│   │   ├── storage.js      # Wrapper de armazenamento legacy
│   │   └── userManager.js  # Gestão multi-utilizador (19 KB)
│   ├── i18n/               # Internacionalização
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Armazenamento de traduções
│   ├── security/           # Segurança e gestão de erros
│   │   ├── security-utils.js # Proteção XSS, sanitização
│   │   ├── error-handlers.js # Gestão global de erros
│   │   └── logger.js       # Sistema de registo (logging)
│   ├── accessibility/      # Acessibilidade
│   │   ├── accessibility.js # Funcionalidades de acessibilidade
│   │   └── speech.js       # Suporte de síntese de voz
│   ├── integration/        # Integração e analytics
│   │   ├── plausible-init.js # Analytics Plausible
│   │   ├── cache-updater.js # Gestão de cache (10 KB)
│   │   └── imports.js      # Utilitários de importação
│   ├── main-es6.js         # Ponto de entrada ES6
│   ├── main.js             # Orquestrador principal
│   ├── bootstrap.js        # Configuração dos event handlers ES6
│   └── game.js             # Gestão de estado e desafios diários
├── css/                    # Estilos modulares
├── assets/                 # Recursos
│   ├── images/             # Imagens e sprites
│   ├── generated-images/   # Imagens responsivas geradas
│   ├── sounds/             # Efeitos sonoros
│   ├── translations/       # Ficheiros de tradução (fr, en, es)
│   └── videos/             # Vídeos tutoriais
├── tests/                  # Testes automatizados
│   ├── __tests__/          # Testes unitários e de integração
│   └── tests-esm/          # Testes ESM (.mjs)
├── scripts/                # Scripts de manutenção
│   ├── compare-translations.cjs # Comparação de traduções
│   └── cleanup-i18n-keys.cjs # Limpeza de chaves i18n
└── dist/                   # Build de produção (gerado)
```

### Arquitetura técnica

**Módulos ES6 modernos**: O projeto utiliza uma arquitetura modular com classes ES6 e importações/exportações nativas.

**Componentes reutilizáveis**: Interface construída com componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Carregamento inteligente dos módulos a pedido via `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de armazenamento unificado**: API centralizada para a persistência dos dados do utilizador via LocalStorage com fallbacks.

**Gestão de áudio centralizada**: Controlo do som com suporte multilingue e preferências por utilizador.

**Event Bus**: Comunicação por eventos desacoplada entre componentes para uma arquitetura de fácil manutenção.

**Navegação por slides**: Sistema de navegação baseado em slides numerados (slide0, slide1, etc.) com `goToSlide()`.

**Segurança**: Proteção XSS e sanitização via `security-utils.js` para todas as manipulações DOM.

## 🎯 Modos de Jogo Detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas de multiplicação com:

- Visualização interativa de multiplicações
- Animações e ajudas mnemónicas
- Arrastar e largar educativo
- Progressão livre por tabuada

### Modo Quiz

Perguntas de escolha múltipla com:

- 10 perguntas por sessão
- Progressão adaptativa de acordo com o sucesso
- Teclado numérico virtual
- Sistema de sequência (série de respostas corretas)

### Modo Desafio

Corrida contra o tempo com:

- 3 níveis de dificuldade (Iniciante, Médio, Difícil)
- Bónus de tempo para respostas corretas
- Sistema de vidas
- Classificação das melhores pontuações

### Modo Aventura

Progressão narrativa com:

- 12 níveis temáticos desbloqueáveis
- Mapa interativo com progressão visual
- História imersiva com personagens
- Sistema de estrelas e recompensas

### Minijogos Arcade

Cada minijogo oferece:

- Escolha de dificuldade e personalização
- Sistema de vidas e pontuação
- Controlos de teclado e tátil
- Classificações individuais por utilizador

## 🛠️ Desenvolvimento

### Fluxo de trabalho de desenvolvimento

**IMPORTANTE: Nunca fazer commit diretamente na main**

O projeto utiliza um fluxo de trabalho baseado em ramos de funcionalidade:

1. **Criar um ramo**:

   ```bash
   git checkout -b feat/nome-da-funcionalidade
   # ou
   git checkout -b fix/nome-do-bug
   ```

2. **Desenvolver e testar**:

   ```bash
   npm run format:check  # Verificar SEMPRE a formatação primeiro
   npm run format        # Formatar se necessário
   npm run lint          # Verificar a qualidade do código
   npm run test          # Executar os testes
   npm run test:coverage # Verificar a cobertura
   ```

3. **Fazer commit no ramo**:

   ```bash
   git add .
   git commit -m "feat: descrição da funcionalidade"
   ```

4. **Fazer push e criar um Pull Request**:
   ```bash
   git push -u origin feat/nome-da-funcionalidade
   ```

**Estilo de commit**: Conciso, modo imperativo (ex: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Garantir que `npm run lint`, `npm test` e `npm run test:coverage` passam antes de cada commit

### Arquitetura dos componentes

**GameMode (classe base)**: Todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: Orquestração centralizada do lançamento e gestão dos modos.

**Componentes UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface coerente.

**Lazy Loading**: Os módulos são carregados a pedido para otimizar o desempenho inicial.

**Event Bus**: Comunicação desacoplada entre componentes via o sistema de eventos.

### Testes

O projeto inclui um conjunto de testes completo:

- Testes unitários dos módulos core
- Testes de integração dos componentes
- Testes dos modos de jogo
- Cobertura de código automatizada

```bash
npm test              # Todos os testes (CJS)
npm test:core         # Testes dos módulos centrais
npm test:integration  # Testes de integração
npm test:coverage     # Relatório de cobertura
npm run test:esm      # Testes ESM (ex: components/dashboard) via vm-modules
```

### Build de produção

- **Rollup**: Empacota `js/main-es6.js` em ESM com code-splitting e sourcemaps
- **Terser**: Minificação automática para otimização
- **Post-build**: Copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o ficheiro de entrada com hash (ex: `main-es6-*.js`)
- **Pasta final**: `dist/` pronto a ser servido estaticamente

```bash
npm run build      # gera dist/
npm run serve:dist # serve dist/ (porta 5000)
```

### Integração Contínua

**GitHub Actions**: Pipeline automatizado em `.github/workflows/ci.yml`

O pipeline CI/CD executa automaticamente a cada push e pull request:

**Jobs principais**:

1. **build-test**: Job principal de validação
   - Instalação de dependências: `npm ci`
   - Verificação de formatação: `npm run format:check`
   - Análise estática: `npm run lint`
   - Testes unitários: `npm run test`
   - Auditoria de segurança: `npm audit`
   - Geração do artefacto de cobertura

2. **accessibility**: Auditoria de acessibilidade (não bloqueante)
   - Executa `npm run audit:accessibility`
   - Gera relatório de acessibilidade WCAG 2.1 AA

3. **test-esm**: Testes de módulos ES6
   - Executa `npm run test:esm` com Jest VM modules
   - Valida importações/exportações ES6

4. **lighthouse**: Auditoria de desempenho (não bloqueante)
   - Auditoria de desempenho móvel
   - Geração de artefactos de relatório Lighthouse
   - Métricas Core Web Vitals

**Distintivos de qualidade**:

- Estado do CI Build (GitHub Actions)
- Nota CodeFactor
- Distintivo Codacy
- Quality Gate SonarCloud

### PWA (Progressive Web App)

LeapMultix é uma PWA completa com suporte offline e possibilidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback offline para `offline.html`
- Imagens: Cache-first para otimizar o desempenho
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: Network-first para servir sempre a versão mais recente
- Gestão de versão automática via `cache-updater.js`

**Manifesto** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Instalável em telemóvel (Adicionar ao Ecrã Principal)
- Configuração standalone para experiência tipo app
- Suporte de temas e cores

**Testar o modo offline localmente**:

1. Iniciar o servidor de desenvolvimento:

   ```bash
   npm run serve
   ```

   Abrir `http://localhost:8080` (ou a porta apresentada)

2. Teste manual:
   - Cortar a rede nas DevTools (Separador Network → Offline)
   - Atualizar a página → `offline.html` é apresentado

3. Teste automatizado (Requer Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Scripts de gestão do Service Worker**:

```bash
npm run sw:disable  # Desativar o service worker
npm run sw:fix      # Corrigir problemas de cache
```

### Padrões de qualidade

**Ferramentas de qualidade de código**:

- **ESLint**: Configuração moderna com flat config (`eslint.config.js`), suporte ES2022
- **Prettier**: Formatação automática de código (`.prettierrc`)
- **Stylelint**: Validação CSS (`.stylelintrc.json`)
- **JSDoc**: Documentação automática de funções com análise de cobertura

**Regras de código importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Utilizar gestão de erros específica (sem catch vazios)
- Evitar `innerHTML` a favor das funções `security-utils.js`
- Manter a complexidade cognitiva < 15 para as funções
- Extrair funções complexas em helpers mais pequenos

**Segurança**:

- **Proteção XSS**: Utilizar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo de texto
- **Scripts externos**: Atributo `crossorigin="anonymous"` obrigatório
- **Validação de entradas**: Sanitizar sempre os dados externos
- **Content Security Policy**: Cabeçalhos CSP para restringir as fontes de scripts

**Acessibilidade**:

- Conformidade WCAG 2.1 AA
- Navegação completa por teclado
- Funções ARIA e etiquetas apropriadas
- Contrastes de cor conformes

**Desempenho**:

- Lazy loading dos módulos via `lazy-loader.js`
- Otimizações CSS e ativos responsivos
- Service Worker para cache inteligente
- Code splitting e minificação em produção

## 📱 Compatibilidade

### Navegadores suportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Desktop**: Controlos de teclado e rato
- **Tablets**: Interface tátil otimizada
- **Smartphones**: Design responsivo adaptativo

### Acessibilidade

- Navegação completa por teclado (Tab, setas, Esc)
- Funções ARIA e etiquetas para leitores de ecrã
- Contrastes de cor conformes
- Suporte de tecnologias de assistência

## 🌍 Localização

Suporte multilingue completo:

- **Francês** (idioma predefinido)
- **Inglês**
- **Espanhol**

### Gestão de traduções

**Ficheiros de tradução:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Começar",
  "quiz_correct": "Bem feito!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de gestão i18n

**`npm run i18n:verify`** - Verificar consistência das chaves de tradução

**`npm run i18n:unused`** - Listar chaves de tradução não utilizadas

**`npm run i18n:compare`** - Comparar ficheiros de tradução com fr.json (referência)

Este script (`scripts/compare-translations.cjs`) assegura a sincronização de todos os ficheiros de idioma:

**Funcionalidades:**

- Deteção de chaves em falta (presentes em fr.json mas ausentes noutros idiomas)
- Deteção de chaves extra (presentes noutros idiomas mas não em fr.json)
- Identificação de valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação de consistência de tipos (string vs array)
- Aplanamento de estruturas JSON aninhadas em notação de ponto (ex: `arcade.multiMemory.title`)
- Geração de relatório detalhado na consola
- Guardar relatório JSON em `docs/translations-comparison-report.json`

**Exemplo de saída:**

```
🔍 Análise comparativa dos ficheiros de tradução

📚 Idioma de referência: fr.json
✅ fr.json: 335 chaves

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Análise de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de chaves: 335
✅ Nenhuma chave em falta
✅ Nenhuma chave extra
✅ Nenhum valor vazio

📊 RESUMO FINAL
  fr.json: 335 chaves
  en.json: 335 chaves
  es.json: 335 chaves

✅ Todos os ficheiros de tradução estão perfeitamente sincronizados!
```

**Cobertura de traduções:**

- Interface de utilizador completa
- Instruções dos jogos
- Mensagens de erro e feedback
- Descrições e ajuda contextual
- Conteúdo narrativo do modo Aventura
- Etiquetas de acessibilidade e ARIA

## 📊 Armazenamento de Dados

### Dados de utilizador

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos arcade
- Definições de personalização

### Funcionalidades técnicas

- Armazenamento local (localStorage) com fallbacks
- Isolamento de dados por utilizador
- Guardar automático do progresso
- Migração automática de dados antigos

## 🐛 Relatar um Problema

Os problemas podem ser relatados através das issues do GitHub. Por favor inclua:

- Descrição detalhada do problema
- Passos para o reproduzir
- Navegador e versão
- Capturas de ecrã se relevantes

## 💝 Apoiar o projeto

**[☕ Fazer um donativo via PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a AGPL v3. Ver o ficheiro `LICENSE` para mais detalhes.

---

_LeapMultix - Aplicação educativa moderna para a aprendizagem das tabuadas de multiplicação_
