<details>
<summary>Este documento também está disponível em outros idiomas</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Français](./README.md)
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

<!-- Badges (atualizar <owner>/<repo> após migração para o GitHub) -->

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
- [Relatar Problemas](#-relatar-problemas)
- [Licença](#-licença)

## Descrição

LeapMultix é uma aplicação web educativa moderna e interativa projetada para crianças (8–12 anos) dominarem as 4 operações aritméticas: multiplicação (×), adição (+), subtração (−) e divisão (÷). A aplicação oferece **5 modos de jogo** e **4 minijogos arcade** em uma interface intuitiva, acessível e multilíngue.

**Suporte multi-operação:** Os modos Quiz e Desafio permitem praticar todas as operações. Os modos Descoberta, Aventura e Arcade focam na multiplicação, mas são projetados para suportar todas as operações.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL Online:** https://leapmultix.jls42.org/

## ✨ Funcionalidades

### 🎮 Modos de Jogo

- **Modo Descoberta**: Exploração visual e interativa adaptada a cada operação
- **Modo Quiz**: Perguntas de múltipla escolha com suporte para as 4 operações (×, +, −, ÷) e progressão adaptativa
- **Modo Desafio**: Corrida contra o tempo com as 4 operações (×, +, −, ÷) e diferentes níveis de dificuldade
- **Modo Aventura**: Progressão narrativa por níveis com suporte para as 4 operações

### 🕹️ Minijogos Arcade

- **MultiInvaders**: Space Invaders educativo - Destrua as respostas erradas
- **MultiMiam**: Pac-Man matemático - Colete as respostas certas
- **MultiMemory**: Jogo da memória - Associe operações e resultados
- **MultiSnake**: Snake educativo - Cresça comendo os números certos

### ➕ Suporte Multi-Operações

LeapMultix oferece treinamento completo para as 4 operações aritméticas em **todos os modos**:

| Modo       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Desafio    | ✅  | ✅  | ✅  | ✅  |
| Descoberta | ✅  | ✅  | ✅  | ✅  |
| Aventura   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcionalidades Transversais

- **Multiusuário**: Gerenciamento de perfis individuais com progresso salvo
- **Multilíngue**: Suporte para francês, inglês e espanhol
- **Personalização**: Avatares, temas de cores, planos de fundo
- **Acessibilidade**: Navegação por teclado, suporte a toque, conformidade WCAG 2.1 AA
- **Responsivo móvel**: Interface otimizada para tablets e smartphones
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
# A aplicação estará acessível em http://localhost:8080 (ou próxima porta disponível)

# Ou com Python (opção 2)
python3 -m http.server 8000
# A aplicação estará acessível em http://localhost:8000
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run serve          # Servidor local (http://localhost:8080)
npm run lint           # Verificação de código com ESLint
npm run lint:fix       # Correção automática de problemas ESLint
npm run format:check   # Verificar formatação de código (SEMPRE antes do commit)
npm run format         # Formatar código com Prettier
npm run verify         # Quality gate: lint + test + coverage

# Testes
npm run test           # Executar todos os testes (CJS)
npm run test:watch     # Testes em modo watch
npm run test:coverage  # Testes com relatório de cobertura
npm run test:core      # Testes apenas dos módulos core
npm run test:integration # Testes de integração
npm run test:storage   # Testes do sistema de armazenamento
npm run test:esm       # Testes ESM (pastas tests-esm/, Jest vm-modules)
npm run test:verbose   # Testes com saída detalhada
npm run test:pwa-offline # Teste offline PWA (requer Puppeteer), após `npm run serve`

# Análise e Manutenção
npm run analyze:jsdoc  # Análise de documentação
npm run improve:jsdoc  # Melhoria automática JSDoc
npm run audit:mobile   # Testes de responsividade móvel
npm run audit:accessibility # Testes de acessibilidade
npm run dead-code      # Detecção de código não utilizado
npm run analyze:globals # Análise de variáveis globais
npm run analyze:dependencies # Análise de uso de dependências
npm run verify:cleanup # Análise combinada (código morto + globais)

# Gestão de Assets
npm run assets:generate    # Gerar imagens responsivas
npm run assets:backgrounds # Converter fundos para WebP
npm run assets:analyze     # Análise de assets responsivos
npm run assets:diff        # Comparação de assets

# Internacionalização
npm run i18n:verify    # Verificar consistência de chaves de tradução
npm run i18n:unused    # Listar chaves de tradução não utilizadas
npm run i18n:compare   # Comparar traduções (en/es) com fr.json (referência)

# Build e Entrega
npm run build          # Build de produção (Rollup) + postbuild (dist/ completo)
npm run serve:dist     # Servir dist/ em http://localhost:5000 (ou porta disponível)

# PWA e Service Worker
npm run sw:disable     # Desativar service worker
npm run sw:fix         # Corrigir problemas de service worker
```

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
leapmultix/
├── index.html              # Ponto de entrada principal
├── js/
│   ├── core/               # Módulos centrais ES6
│   │   ├── GameMode.js     # Classe base para modos
│   │   ├── GameModeManager.js # Gerenciamento de modos de jogo
│   │   ├── storage.js      # API LocalStorage
│   │   ├── audio.js        # Gerenciamento de som
│   │   ├── utils.js        # Utilitários genéricos (fonte canônica)
│   │   ├── eventBus.js     # Comunicação por eventos
│   │   ├── userState.js    # Gerenciamento de sessão de usuário
│   │   ├── mainInit.js     # Inicialização DOM-ready
│   │   ├── theme.js        # Sistema de temas
│   │   ├── userUi.js       # Utilitários de interface de usuário
│   │   ├── parental.js     # Controles parentais
│   │   ├── adventure-data.js # Dados do modo Aventura
│   │   ├── mult-stats.js   # Estatísticas de multiplicação
│   │   ├── challenge-stats.js # Estatísticas de desafio
│   │   └── daily-challenge.js # Gerenciamento de desafios diários
│   ├── components/         # Componentes UI reutilizáveis
│   │   ├── topBar.js       # Barra de navegação
│   │   ├── infoBar.js      # Barras de informações do jogo
│   │   ├── dashboard.js    # Painel do usuário
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
│   │   ├── arcade-multimemory.js # Jogo da memória (31 KB)
│   │   ├── arcade-multimiam.js # Integração MultiMiam
│   │   ├── arcade-multisnake.js # Integração Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilitários compartilhados
│   │   ├── arcade-message.js, arcade-points.js # Componentes UI
│   │   └── arcade-scores.js # Gerenciamento de pontuações
│   ├── multimiam/          # Jogo Pac-Man (arquitetura decomposta)
│   │   ├── multimiam.js    # Controlador principal
│   │   ├── multimiam-engine.js # Motor de jogo (15 KB)
│   │   ├── multimiam-renderer.js # Sistema de renderização (9 KB)
│   │   ├── multimiam-controls.js # Gerenciamento de controles (7 KB)
│   │   ├── multimiam-questions.js # Geração de perguntas (6 KB)
│   │   └── multimiam-ui.js # Elementos de interface
│   ├── multisnake.js       # Jogo Snake (38 KB)
│   ├── navigation/         # Sistema de navegação
│   │   ├── slides.js       # Navegação baseada em slides (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Suporte a teclado
│   ├── ui/                 # Interface de usuário e feedback
│   │   ├── uiUtils.js      # Utilitários de interface
│   │   ├── ui-feedback.js  # Mecanismos de feedback
│   │   ├── touch-support.js # Suporte a toque (7 KB)
│   │   ├── virtual-keyboard.js # Teclado virtual
│   │   ├── coin-display.js, coin-effects.js # Sistema de moedas
│   │   ├── notifications.js # Sistema de notificações
│   │   └── badges.js       # Sistema de emblemas
│   ├── media/              # Gerenciamento de mídia
│   │   ├── VideoManager.js # Gerenciamento de reprodução de vídeo (12 KB)
│   │   └── responsive-image-loader.js # Carregamento de imagens (9 KB)
│   ├── orchestration/      # Orquestração e carregamento
│   │   ├── mode-orchestrator.js # Troca de modos
│   │   ├── lazy-loader.js  # Carregamento dinâmico (10 KB)
│   │   └── game-cleanup.js # Limpeza de estado
│   ├── utils/              # Utilitários
│   │   ├── utils-es6.js    # Agregador principal (5 KB)
│   │   ├── main-helpers.js # Helpers da aplicação
│   │   ├── helpers.js      # Funções helper legadas
│   │   ├── stats-utils.js  # Utilitários de estatísticas
│   │   ├── difficulty.js   # Gerenciamento de dificuldade
│   │   └── questionGenerator.js # Geração de perguntas
│   ├── storage/            # Armazenamento e estado
│   │   ├── storage.js      # Wrapper de armazenamento legado
│   │   └── userManager.js  # Gerenciamento multiusuário (19 KB)
│   ├── i18n/               # Internacionalização
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Armazenamento de traduções
│   ├── security/           # Segurança e tratamento de erros
│   │   ├── security-utils.js # Proteção XSS, sanitização
│   │   ├── error-handlers.js # Tratamento global de erros
│   │   └── logger.js       # Sistema de logging
│   ├── accessibility/      # Acessibilidade
│   │   ├── accessibility.js # Recursos de acessibilidade
│   │   └── speech.js       # Suporte a síntese de fala
│   ├── integration/        # Integração e análises
│   │   ├── plausible-init.js # Análises Plausible
│   │   ├── cache-updater.js # Gerenciamento de cache (10 KB)
│   │   └── imports.js      # Utilitários de importação
│   ├── main-es6.js         # Ponto de entrada ES6
│   ├── main.js             # Orquestrador principal
│   ├── bootstrap.js        # Configuração de manipuladores de eventos ES6
│   └── game.js             # Gerenciamento de estado e desafios diários
├── css/                    # Estilos modulares
├── assets/                 # Recursos
│   ├── images/             # Imagens e sprites
│   ├── generated-images/   # Imagens responsivas geradas
│   ├── sounds/             # Efeitos sonoros
│   ├── translations/       # Arquivos de tradução (fr, en, es)
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

**Componentes Reutilizáveis**: Interface construída com componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Carregamento inteligente de módulos sob demanda via `lazy-loader.js` para otimizar o desempenho inicial.

**Sistema de Armazenamento Unificado**: API centralizada para persistência de dados do usuário via LocalStorage com fallbacks.

**Gerenciamento de Áudio Centralizado**: Controle de som com suporte multilíngue e preferências por usuário.

**Event Bus**: Comunicação por eventos desacoplada entre componentes para uma arquitetura sustentável.

**Navegação por Slides**: Sistema de navegação baseado em slides numerados (slide0, slide1, etc.) com `goToSlide()`.

**Segurança**: Proteção XSS e sanitização via `security-utils.js` para todas as manipulações do DOM.

## 🎯 Modos de Jogo Detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas com:

- Visualização interativa de multiplicações
- Animações e ajudas de memória
- Arrastar e soltar educativo
- Progressão livre por tabuada

### Modo Quiz

Perguntas de múltipla escolha com:

- 10 perguntas por sessão
- Progressão adaptativa baseada no sucesso
- Teclado numérico virtual
- Sistema de sequência (série de respostas corretas)

### Modo Desafio

Corrida contra o tempo com:

- 3 níveis de dificuldade (Iniciante, Médio, Difícil)
- Bônus de tempo por respostas corretas
- Sistema de vidas
- Tabela de classificação das melhores pontuações

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
- Controles de teclado e toque
- Tabelas de classificação individuais por usuário

## 🛠️ Desenvolvimento

### Fluxo de Trabalho de Desenvolvimento

**IMPORTANTE: Nunca faça commit diretamente na main**

O projeto usa um fluxo de trabalho baseado em branches de funcionalidade:

1.  **Criar uma branch**:

    ```bash
    git checkout -b feat/nome-da-funcionalidade
    # ou
    git checkout -b fix/nome-do-bug
    ```

2.  **Desenvolver e testar**:

    ```bash
    npm run format:check  # SEMPRE verificar a formatação primeiro
    npm run format        # Formatar se necessário
    npm run lint          # Verificar qualidade do código
    npm run test          # Executar testes
    npm run test:coverage # Verificar cobertura
    ```

3.  **Commitar na branch**:

    ```bash
    git add .
    git commit -m "feat: descrição da funcionalidade"
    ```

4.  **Push e criar um Pull Request**:
    ```bash
    git push -u origin feat/nome-da-funcionalidade
    ```

**Estilo de commit**: Conciso, modo imperativo (ex: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Garantir que `npm run lint`, `npm test` e `npm run test:coverage` passem antes de cada commit

### Arquitetura de Componentes

**GameMode (classe base)**: Todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: Orquestração centralizada do lançamento e gerenciamento de modos.

**Componentes UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface consistente.

**Lazy Loading**: Os módulos são carregados sob demanda para otimizar o desempenho inicial.

**Event Bus**: Comunicação desacoplada entre componentes via sistema de eventos.

### Testes

O projeto inclui uma suíte de testes completa:

- Testes unitários para módulos core
- Testes de integração para componentes
- Testes de modos de jogo
- Cobertura de código automatizada

```bash
npm test              # Todos os testes (CJS)
npm test:core         # Testes dos módulos centrais
npm test:integration  # Testes de integração
npm test:coverage     # Relatório de cobertura
npm run test:esm      # Testes ESM (ex: components/dashboard) via vm-modules
```

### Build de Produção

- **Rollup**: Empacota `js/main-es6.js` em ESM com code-splitting e sourcemaps
- **Terser**: Minificação automática para otimização
- **Post-build**: Copia `css/` e `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o arquivo de entrada com hash (ex: `main-es6-*.js`)
- **Pasta final**: `dist/` pronta para ser servida estaticamente

```bash
npm run build      # gera dist/
npm run serve:dist # serve dist/ (porta 5000)
```

### Integração Contínua

**GitHub Actions**: Pipeline automatizado em `.github/workflows/ci.yml`

O pipeline CI/CD é executado automaticamente em cada push e pull request:

**Jobs Principais**:

1.  **build-test**: Job de validação principal
    - Instalação de dependências: `npm ci`
    - Verificação de formatação: `npm run format:check`
    - Análise estática: `npm run lint`
    - Testes unitários: `npm run test`
    - Auditoria de segurança: `npm audit`
    - Geração de artefato de cobertura

2.  **accessibility**: Auditoria de acessibilidade (não bloqueante)
    - Executa `npm run audit:accessibility`
    - Gera relatório de acessibilidade WCAG 2.1 AA

3.  **test-esm**: Testes de módulos ES6
    - Executa `npm run test:esm` com Jest VM modules
    - Valida importações/exportações ES6

4.  **lighthouse**: Auditoria de desempenho (não bloqueante)
    - Auditoria de desempenho móvel
    - Gera artefatos de relatório Lighthouse
    - Métricas Core Web Vitals

**Emblemas de Qualidade**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix é uma PWA completa com suporte offline e capacidade de instalação.

**Service Worker** (`sw.js`):

- Navegação: Network-first com fallback offline para `offline.html`
- Imagens: Cache-first para otimizar desempenho
- Traduções: Stale-while-revalidate para atualizações em segundo plano
- JS/CSS: Network-first para sempre servir a versão mais recente
- Gerenciamento automático de versão via `cache-updater.js`

**Manifest** (`manifest.json`):

- Ícones SVG e PNG para todos os dispositivos
- Instalação possível em celular (Adicionar à Tela Inicial)
- Configuração standalone para experiência tipo app
- Suporte para temas e cores

**Testar modo offline localmente**:

1.  Iniciar o servidor de desenvolvimento:

    ```bash
    npm run serve
    ```

    Abrir `http://localhost:8080` (ou a porta exibida)

2.  Testar manualmente:
    - Cortar a rede no DevTools (aba Network → Offline)
    - Atualizar a página → `offline.html` é exibido

3.  Teste automatizado (requer Puppeteer):
    ```bash
    npm run test:pwa-offline
    ```

**Scripts de Gerenciamento do Service Worker**:

```bash
npm run sw:disable  # Desativar service worker
npm run sw:fix      # Corrigir problemas de cache
```

### Padrões de Qualidade

**Ferramentas de Qualidade de Código**:

- **ESLint**: Configuração moderna com flat config (`eslint.config.js`), suporte ES2022
- **Prettier**: Formatação automática de código (`.prettierrc`)
- **Stylelint**: Validação CSS (`.stylelintrc.json`)
- **JSDoc**: Documentação automática de funções com análise de cobertura

**Regras de Código Importantes**:

- Remover variáveis e parâmetros não utilizados (`no-unused-vars`)
- Usar tratamento de erros específico (sem catches vazios)
- Evitar `innerHTML` em favor de funções de `security-utils.js`
- Manter complexidade cognitiva < 15 para funções
- Extrair funções complexas em helpers menores

**Segurança**:

- **Proteção XSS**: Usar funções de `security-utils.js`:
  - `appendSanitizedHTML()` em vez de `innerHTML`
  - `createSafeElement()` para criar elementos seguros
  - `setSafeMessage()` para conteúdo de texto
- **Scripts Externos**: Atributo `crossorigin="anonymous"` obrigatório
- **Validação de Entrada**: Sempre sanitizar dados externos
- **Content Security Policy**: Headers CSP para restringir fontes de scripts

**Acessibilidade**:

- Conformidade WCAG 2.1 AA
- Navegação completa por teclado
- Roles ARIA e rótulos apropriados
- Contraste de cores conforme

**Desempenho**:

- Lazy loading de módulos via `lazy-loader.js`
- Otimizações CSS e assets responsivos
- Service Worker para cache inteligente
- Code splitting e minificação em produção

## 📱 Compatibilidade

### Navegadores Suportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Desktop**: Controles de teclado e mouse
- **Tablets**: Interface de toque otimizada
- **Smartphones**: Design responsivo adaptável

### Acessibilidade

- Navegação completa por teclado (Tab, Setas, Esc)
- Roles ARIA e rótulos para leitores de tela
- Contraste de cores conforme
- Suporte a tecnologia assistiva

## 🌍 Localização

Suporte multilíngue completo:

- **Francês** (idioma padrão)
- **Inglês**
- **Espanhol**

### Gerenciamento de Traduções

**Arquivos de Tradução:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Começar",
  "quiz_correct": "Muito bem!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de Gerenciamento i18n

**`npm run i18n:verify`** - Verificar consistência das chaves de tradução

**`npm run i18n:unused`** - Listar chaves de tradução não utilizadas

**`npm run i18n:compare`** - Comparar arquivos de tradução com fr.json (referência)

Este script (`scripts/compare-translations.cjs`) garante a sincronização de todos os arquivos de idioma:

**Funcionalidades:**

- Detecção de chaves ausentes (presentes em fr.json mas ausentes em outros idiomas)
- Detecção de chaves extras (presentes em outros idiomas mas não em fr.json)
- Identificação de valores vazios (`""`, `null`, `undefined`, `[]`)
- Verificação de consistência de tipos (string vs array)
- Achatamento de estruturas JSON aninhadas para notação de ponto (ex: `arcade.multiMemory.title`)
- Geração de relatório detalhado no console
- Salvamento de relatório JSON em `docs/translations-comparison-report.json`

**Exemplo de Saída:**

```
🔍 Análise comparativa de arquivos de tradução

📚 Idioma de referência: fr.json
✅ fr.json: 335 chaves

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Análise de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de chaves: 335
✅ Nenhuma chave ausente
✅ Nenhuma chave extra
✅ Nenhum valor vazio

📊 RESUMO FINAL
  fr.json: 335 chaves
  en.json: 335 chaves
  es.json: 335 chaves

✅ Todos os arquivos de tradução estão perfeitamente sincronizados!
```

**Cobertura de Traduções:**

- Interface de usuário completa
- Instruções do jogo
- Mensagens de erro e feedback
- Descrições e ajuda contextual
- Conteúdo narrativo do modo Aventura
- Rótulos de acessibilidade e ARIA

## 📊 Armazenamento de Dados

### Dados do Usuário

- Perfis e preferências
- Progressão por modo de jogo
- Pontuações e estatísticas de jogos arcade
- Configurações de personalização

### Recursos Técnicos

- Armazenamento local (localStorage) com fallbacks
- Isolamento de dados por usuário
- Salvamento automático de progressão
- Migração automática de dados antigos

## 🐛 Relatar Problemas

Problemas podem ser relatados via issues do GitHub. Por favor, inclua:

- Descrição detalhada do problema
- Passos para reproduzir
- Navegador e versão
- Capturas de tela se relevantes

## 💝 Apoie o Projeto

**[☕ Faça uma doação via PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a licença AGPL v3. Veja o arquivo `LICENSE` para mais detalhes.

---

_LeapMultix - Aplicação educativa moderna para aprender tabuadas_
