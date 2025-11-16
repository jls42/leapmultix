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

<!-- Emblemas (atualizar <owner>/<repo> após a migração para o GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

O LeapMultix é uma aplicação web educacional interativa e moderna para crianças (8-12 anos) dominarem as tabuadas de multiplicação. A aplicação oferece **4 modos de jogo clássicos** e **4 minijogos de arcade** numa interface intuitiva, acessível e multilingue.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Funcionalidades

### 🎮 Modos de Jogo

- **Modo Descoberta**: Exploração visual e interativa das tabuadas de multiplicação
- **Modo Quiz**: Perguntas de múltipla escolha com progressão adaptativa
- **Modo Desafio**: Corrida contra o tempo com diferentes níveis de dificuldade
- **Modo Aventura**: Progressão narrativa por níveis com um mapa interativo

### 🕹️ Minijogos de Arcade

- **MultiInvaders**: Space Invaders educativo - Destrua as respostas erradas
- **MultiMiam**: Pac-Man matemático - Colete as respostas corretas
- **MultiMemory**: Jogo da memória - Combine multiplicações e resultados
- **MultiSnake**: Snake educativo - Cresça comendo os números corretos

### 🌍 Funcionalidades Transversais

- **Multiusuário**: Gestão de perfis individuais com progresso guardado
- **Multilingue**: Suporte para francês, inglês e espanhol
- **Personalização**: Avatares, temas de cores, fundos
- **Acessibilidade**: Navegação por teclado, suporte tátil, conformidade com WCAG 2.1 AA
- **Responsivo para telemóveis**: Interface otimizada para tablets e smartphones
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

# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento (opção 1)
npm run serve
# A aplicação estará acessível em http://localhost:8080 (ou na próxima porta disponível)

# Ou com Python (opção 2)
python3 -m http.server 8000
# A aplicação estará acessível em http://localhost:8000
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run serve          # Servidor local (http://localhost:8080)
npm run lint           # Verificação de código com ESLint
npm run lint:fix       # Correção automática de problemas do ESLint
npm run format:check   # Verificar a formatação do código (SEMPRE antes de commitar)
npm run format         # Formatar o código com o Prettier
npm run verify         # Porta de qualidade: lint + test + coverage

# Testes
npm run test           # Executar todos os testes (CJS)
npm run test:watch     # Testes em modo de observação
npm run test:coverage  # Testes com relatório de cobertura
npm run test:core      # Apenas testes dos módulos principais
npm run test:integration # Testes de integração
npm run test:storage   # Testes do sistema de armazenamento
npm run test:esm       # Testes ESM (pastas tests-esm/, Jest vm-modules)
npm run test:verbose   # Testes com saída detalhada
npm run test:pwa-offline # Teste PWA offline (requer Puppeteer), após `npm run serve`

# Análise e manutenção
npm run analyze:jsdoc  # Análise da documentação
npm run improve:jsdoc  # Melhoria automática do JSDoc
npm run audit:mobile   # Testes de responsividade móvel
npm run audit:accessibility # Testes de acessibilidade
npm run dead-code      # Deteção de código não utilizado
npm run analyze:globals # Análise de variáveis globais
npm run analyze:dependencies # Análise do uso de dependências
npm run verify:cleanup # Análise combinada (código morto + globais)

# Gestão de ativos
npm run assets:generate    # Gerar imagens responsivas
npm run assets:backgrounds # Converter fundos para WebP
npm run assets:analyze     # Análise de ativos responsivos
npm run assets:diff        # Comparação de ativos

# Internacionalização
npm run i18n:verify    # Verificar a consistência das chaves de tradução
npm run i18n:unused    # Listar chaves de tradução não utilizadas
npm run i18n:compare   # Comparar traduções (en/es) com fr.json (referência)

# Build & entrega
npm run build          # Build de produção (Rollup) + pós-build (dist/ completo)
npm run serve:dist     # Servir dist/ em http://localhost:5000 (ou porta disponível)

# PWA e Service Worker
npm run sw:disable     # Desativar o service worker
npm run sw:fix         # Corrigir problemas do service worker
```

## 🏗️ Arquitetura

### Estrutura de Ficheiros

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
│   │   ├── eventBus.js     # Comunicação orientada a eventos
│   │   ├── userState.js    # Gestão da sessão do utilizador
│   │   ├── mainInit.js     # Inicialização DOM-ready
│   │   ├── theme.js        # Sistema de temas
│   │   ├── userUi.js       # Utilitários da interface do utilizador
│   │   ├── parental.js     # Controlos parentais
│   │   ├── adventure-data.js # Dados do modo Aventura
│   │   ├── mult-stats.js   # Estatísticas de multiplicação
│   │   ├── challenge-stats.js # Estatísticas de desafio
│   │   └── daily-challenge.js # Gestão de desafios diários
│   ├── components/         # Componentes de UI reutilizáveis
│   │   ├── topBar.js       # Barra de navegação
│   │   ├── infoBar.js      # Barras de informação dos jogos
│   │   ├── dashboard.js    # Painel do utilizador
│   │   └── customization.js # Interface de personalização
│   ├── modes/              # Modos de jogo
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minijogos de arcade
│   │   ├── arcade.js       # Orquestrador principal do arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Jogo da memória (31 KB)
│   │   ├── arcade-multimiam.js # Integração do Multimiam
│   │   ├── arcade-multisnake.js # Integração do Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilitários partilhados
│   │   ├── arcade-message.js, arcade-points.js # Componentes de UI
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
│   ├── ui/                 # Interface do utilizador e feedback
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
│   │   ├── main-helpers.js # Ajudantes da aplicação
│   │   ├── helpers.js      # Funções de ajuda legadas
│   │   ├── stats-utils.js  # Utilitários de estatísticas
│   │   ├── difficulty.js   # Gestão de dificuldade
│   │   └── questionGenerator.js # Geração de perguntas
│   ├── storage/            # Armazenamento e estado
│   │   ├── storage.js      # Wrapper de armazenamento legado
│   │   └── userManager.js  # Gestão multiutilizador (19 KB)
│   ├── i18n/               # Internacionalização
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Armazenamento de traduções
│   ├── security/           # Segurança e gestão de erros
│   │   ├── security-utils.js # Proteção XSS, sanitização
│   │   ├── error-handlers.js # Gestão global de erros
│   │   └── logger.js       # Sistema de logging
│   ├── accessibility/      # Acessibilidade
│   │   ├── accessibility.js # Funcionalidades de acessibilidade
│   │   └── speech.js       # Suporte de síntese de voz
│   ├── integration/        # Integração e análise
│   │   ├── plausible-init.js # Análise Plausible
│   │   ├── cache-updater.js # Gestão de cache (10 KB)
│   │   └── imports.js      # Utilitários de importação
│   ├── main-es6.js         # Ponto de entrada ES6
│   ├── main.js             # Orquestrador principal
│   ├── bootstrap.js        # Configuração dos manipuladores de eventos ES6
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

### Arquitetura Técnica

**Módulos ES6 Modernos**: O projeto utiliza uma arquitetura modular com classes ES6 e importações/exportações nativas.

**Componentes Reutilizáveis**: Interface construída com componentes de UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Carregamento Lento (Lazy Loading)**: Carregamento inteligente de módulos sob demanda através do `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de Armazenamento Unificado**: API centralizada para a persistência de dados do utilizador através do LocalStorage com fallbacks.

**Gestão de Áudio Centralizada**: Controlo de som com suporte multilingue e preferências por utilizador.

**Barramento de Eventos (Event Bus)**: Comunicação orientada a eventos desacoplada entre componentes para uma arquitetura de fácil manutenção.

**Navegação por Slides**: Sistema de navegação baseado em slides numerados (slide0, slide1, etc.) com `goToSlide()`.

**Segurança**: Proteção contra XSS e sanitização através do `security-utils.js` para todas as manipulações do DOM.

## 🎯 Modos de Jogo Detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas de multiplicação com:

- Visualização interativa das multiplicações
- Animações e ajudas de memória
- Arrastar e largar educativo
- Progressão livre por tabuada

### Modo Quiz

Perguntas de múltipla escolha com:

- 10 perguntas por sessão
- Progressão adaptativa com base nos sucessos
- Teclado numérico virtual
- Sistema de sequência (série de respostas corretas)

### Modo Desafio

Corrida contra o tempo com:

- 3 níveis de dificuldade (Iniciante, Médio, Difícil)
- Bónus de tempo para respostas corretas
- Sistema de vidas
- Tabela de classificação das melhores pontuações

### Modo Aventura

Progressão narrativa com:

- 12 níveis temáticos desbloqueáveis
- Mapa interativo com progressão visual
- História imersiva com personagens
- Sistema de estrelas e recompensas

### Minijogos de Arcade

Cada minijogo oferece:

- Escolha de dificuldade e personalização
- Sistema de vidas e pontuação
- Controlos de teclado e táteis
- Tabelas de classificação individuais por utilizador

## 🛠️ Desenvolvimento

### Fluxo de Trabalho de Desenvolvimento

**IMPORTANTE: Nunca fazer commit diretamente para a main**

O projeto utiliza um fluxo de trabalho baseado em ramos de funcionalidades:

1. **Criar um ramo**:

   ```bash
   git checkout -b feat/nome-da-funcionalidade
   # ou
   git checkout -b fix/nome-do-bug
   ```

2. **Desenvolver e testar**:

   ```bash
   npm run format:check  # SEMPRE verificar a formatação primeiro
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

**Estilo de commit**: Mensagens concisas, modo imperativo (ex: "Fix arcade init errors", "Refactor cache updater")

**Porta de qualidade**: Garantir que `npm run lint`, `npm run test` e `npm run test:coverage` passam antes de cada commit

### Arquitetura de Componentes

**GameMode (classe base)**: Todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: Orquestração centralizada do lançamento e gestão dos modos.

**Componentes de UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface consistente.

**Carregamento Lento (Lazy Loading)**: Os módulos são carregados sob demanda para otimizar o desempenho inicial.

**Barramento de Eventos (Event Bus)**: Comunicação desacoplada entre componentes através do sistema de eventos.

### Testes

O projeto inclui um conjunto completo de testes:

- Testes unitários dos módulos principais
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

### Build de Produção

- **Rollup**: Agrupa `js/main-es6.js` em ESM com divisão de código e sourcemaps
- **Terser**: Minificação automática para otimização
- **Pós-build**: Copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o ficheiro de entrada com hash (ex: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # gera dist/
npm run serve:dist # serve dist/ (porta 5000)
```

### Integração Contínua

**GitHub Actions**: Pipeline automatizado em `.github/workflows/ci.yml`

O pipeline de CI/CD é executado automaticamente em cada push e pull request:

**Tarefas principais**:

1. **build-test**: Tarefa principal de validação
   - Instalação de dependências: `npm ci`
   - Verificação de formatação: `npm run format:check`
   - Análise estática: `npm run lint`
   - Testes unitários: `npm run test`
   - Auditoria de segurança: `npm audit`
   - Geração do artefacto de cobertura

2. **accessibility**: Auditoria de acessibilidade (não bloqueante)
   - Executa `npm run audit:accessibility`
   - Gera um relatório de acessibilidade WCAG 2.1 AA

3. **test-esm**: Testes dos módulos ES6
   - Executa `npm run test:esm` com os módulos Jest VM
   - Valida as importações/exportações ES6

4. **lighthouse**: Auditoria de desempenho (não bloqueante)
   - Auditoria de desempenho móvel
   - Geração de artefactos de relatório do Lighthouse
   - Métricas Core Web Vitals

**Emblemas de qualidade**:

- Estado da Build CI (GitHub Actions)
- Classificação CodeFactor
- Emblema Codacy
- Porta de Qualidade SonarCloud

### PWA (Progressive Web App)

O LeapMultix é uma PWA completa com suporte offline e capacidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback offline para `offline.html`
- Imagens: Cache-first para otimizar o desempenho
- Traduções: Stale-while-revalidate para atualização em segundo plano
- JS/CSS: Network-first para servir sempre a versão mais recente
- Gestão automática de versões através do `cache-updater.js`

**Manifesto** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Instalação possível em telemóveis (Adicionar ao ecrã principal)
- Configuração autónoma para uma experiência semelhante a uma aplicação
- Suporte a temas e cores

**Testar o modo offline localmente**:

1. Iniciar o servidor de desenvolvimento:

   ```bash
   npm run serve
   ```

   Abrir `http://localhost:8080` (ou a porta apresentada)

2. Testar manualmente:
   - Desligar a rede nas Ferramentas de Programador (separador Rede → Offline)
   - Atualizar a página → `offline.html` é apresentado

3. Teste automatizado (requer Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Scripts de gestão do Service Worker**:

```bash
npm run sw:disable  # Desativar o service worker
npm run sw:fix      # Corrigir problemas de cache
```

### Padrões de Qualidade

**Ferramentas de Qualidade de Código**:

- **ESLint**: Configuração moderna com configuração plana (`eslint.config.js`), suporte ES2022
- **Prettier**: Formatação automática de código (`.prettierrc`)
- **Stylelint**: Validação de CSS (`.stylelintrc.json`)
- **JSDoc**: Documentação automática de funções com análise de cobertura

**Regras de Código Importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Utilizar tratamento de erros específico (sem blocos catch vazios)
- Evitar `innerHTML` em favor das funções de `security-utils.js`
- Manter uma complexidade cognitiva < 15 para as funções
- Extrair funções complexas para ajudantes mais pequenos

**Segurança**:

- **Proteção XSS**: Utilizar as funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo de texto
- **Scripts Externos**: Atributo `crossorigin="anonymous"` obrigatório
- **Validação de Entradas**: Sanitizar sempre os dados externos
- **Política de Segurança de Conteúdo (CSP)**: Cabeçalhos CSP para restringir as fontes de scripts

**Acessibilidade**:

- Conformidade com WCAG 2.1 AA
- Navegação completa por teclado
- Funções e etiquetas ARIA apropriadas
- Contrastes de cor conformes

**Desempenho**:

- Carregamento lento de módulos através do `lazy-loader.js`
- Otimizações de CSS e ativos responsivos
- Service Worker para cache inteligente
- Divisão de código e minificação em produção

## 📱 Compatibilidade

### Navegadores Suportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Desktop**: Controlos de teclado e rato
- **Tablets**: Interface tátil otimizada
- **Smartphones**: Design responsivo adaptável

### Acessibilidade

- Navegação completa por teclado (Tab, setas, Esc)
- Funções e etiquetas ARIA para leitores de ecrã
- Contrastes de cor conformes
- Suporte a tecnologias de assistência

## 🌍 Localização

Suporte multilingue completo:

- **Francês** (idioma padrão)
- **Inglês**
- **Espanhol**

### Gestão de Traduções

**Ficheiros de tradução:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de Gestão i18n

**`npm run i18n:verify`** - Verificar a consistência das chaves de tradução

**`npm run i18n:unused`** - Listar as chaves de tradução não utilizadas

**`npm run i18n:compare`** - Comparar os ficheiros de tradução com fr.json (referência)

Este script (`scripts/compare-translations.cjs`) garante a sincronização de todos os ficheiros de idioma:

**Funcionalidades:**

- Deteção de chaves em falta (presentes em fr.json mas ausentes noutros idiomas)
- Deteção de chaves extra (presentes noutros idiomas mas não em fr.json)
- Identificação de valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação da consistência de tipos (string vs array)
- Achatamento de estruturas JSON aninhadas para notação de pontos (ex: `arcade.multiMemory.title`)
- Geração de um relatório detalhado na consola
- Gravação do relatório JSON em `docs/translations-comparison-report.json`

**Exemplo de saída:**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 335 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 335
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 335 clés
  en.json: 335 clés
  es.json: 335 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Cobertura das Traduções:**

- Interface do utilizador completa
- Instruções dos jogos
- Mensagens de erro e de feedback
- Descrições e ajuda contextual
- Conteúdo narrativo do modo Aventura
- Etiquetas de acessibilidade e ARIA

## 📊 Armazenamento de Dados

### Dados do Utilizador

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos de arcade
- Definições de personalização

### Funcionalidades Técnicas

- Armazenamento local (localStorage) com fallbacks
- Isolamento de dados por utilizador
- Gravação automática do progresso
- Migração automática de dados antigos

## 🐛 Relatar um Problema

Os problemas podem ser relatados através das issues do GitHub. Por favor, inclua:

- Descrição detalhada do problema
- Passos para o reproduzir
- Navegador e versão
- Capturas de ecrã, se relevante

## 💝 Apoiar o Projeto

**[☕ Doar via PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a Licença AGPL v3. Consulte o ficheiro `LICENSE` para mais detalhes.

---

_LeapMultix - Aplicação educacional moderna para aprender as tabuadas de multiplicação_
