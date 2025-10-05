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

LeapMultix é uma aplicação web educacional, interativa e moderna, destinada a crianças (8 a 12 anos) para dominar as tabuadas de multiplicação. A aplicação oferece **4 modos de jogo clássicos** e **4 minijogos de arcade** numa interface intuitiva, acessível e multilingue.

**Desenvolvido por:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Funcionalidades

### 🎮 Modos de Jogo

- **Modo Descoberta**: Exploração visual e interativa das tabuadas de multiplicação.
- **Modo Quiz**: Perguntas de múltipla escolha com progressão adaptativa.
- **Modo Desafio**: Corrida contra o tempo com diferentes níveis de dificuldade.
- **Modo Aventura**: Progressão narrativa por níveis com um mapa interativo.

### 🕹️ Minijogos Arcade

- **MultiInvaders**: Um Space Invaders educativo - Destrua as respostas erradas.
- **MultiMiam**: Um Pac-Man matemático - Colete as respostas corretas.
- **MultiMemory**: Jogo da memória - Associe multiplicações aos seus resultados.
- **MultiSnake**: Um Snake educativo - Cresça comendo os números corretos.

### 🌍 Funcionalidades Transversais

- **Multiutilizador**: Gestão de perfis individuais com progresso guardado.
- **Multilingue**: Suporte para francês, inglês e espanhol.
- **Personalização**: Avatares, temas de cor, fundos.
- **Acessibilidade**: Navegação por teclado, suporte tátil, conformidade com WCAG 2.1 AA.
- **Responsivo para telemóveis**: Interface otimizada para tablets e smartphones.
- **Sistema de Progressão**: Pontuações, emblemas, desafios diários.

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
npm run serve          # Servidor local
npm run lint           # Verificação do código
npm run test           # Executar todos los testes (CJS)
npm run test:coverage  # Testes com cobertura
npm run test:esm       # Testes ESM (pastas tests-esm/, Jest vm-modules)
npm run test:pwa-offline # Teste offline PWA (requer Puppeteer), após `npm run serve`

# Análise e manutenção
npm run analyze:jsdoc  # Análise da documentação
npm run improve:jsdoc  # Melhoria automática do JSDoc
npm run audit:mobile   # Testes de responsividade móvel
npm run audit:accessibility # Testes de acessibilidade
npm run dead-code      # Deteção de código não utilizado
npm run analyze:globals # Análise de variáveis globais
npm run analyze:dependencies # Análise do uso de dependências
npm run assets:analyze # Análise de ativos responsivos
npm run assets:diff    # Comparação de ativos
npm run i18n:compare   # Comparar traduções (en/es) com fr.json (referência)

# Build & entrega
npm run build          # Build de produção (Rollup) + pós-build (dist/ completo)
npm run serve:dist     # Servir dist/ em http://localhost:5000 (ou porta disponível)
```

## 🏗️ Arquitetura

### Estrutura de Ficheiros

```
leapmultix/
├── index.html              # Ponto de entrada principal
├── js/
│   ├── core/               # Módulos centrais ES6
│   │   ├── GameMode.js     # Classe base dos modos de jogo
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # API de armazenamento
│   │   ├── audio.js        # Gestão de som
│   │   └── utils.js        # Utilitários genéricos
│   ├── components/         # Componentes de UI reutilizáveis
│   │   ├── topBar.js       # Barra de navegação
│   │   ├── infoBar.js      # Barras de informação dos jogos
│   │   ├── dashboard.js    # Painel do utilizador
│   │   └── customization.js # Interface de personalização
│   ├── modes/              # Modos de jogo refatorizados
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Minijogos de arcade
│   ├── multimiam-*.js      # Módulos do jogo Pac-Man
│   ├── multisnake.js       # Jogo Snake educativo
│   ├── main-es6.js         # Ponto de entrada ES6
│   ├── main.js             # Orquestrador principal
│   ├── lazy-loader.js      # Carregamento a pedido
│   └── utils-es6.js        # Utilitários ES6
├── css/                    # Estilos modulares
├── assets/                 # Recursos
│   ├── images/             # Imagens e sprites
│   ├── sounds/             # Efeitos sonoros
│   ├── translations/       # Ficheiros de tradução
│   └── videos/             # Vídeos tutoriais
└── tests/                  # Testes automatizados
```

### Arquitetura Técnica

**Módulos ES6 Modernos**: O projeto utiliza uma arquitetura modular com classes ES6 e importações/exportações nativas.

**Componentes Reutilizáveis**: A interface é construída com componentes de UI centralizados (TopBar, InfoBar, Dashboard).

**Lazy Loading**: Carregamento inteligente de módulos a pedido para otimizar o desempenho.

**Sistema de Armazenamento Unificado**: API centralizada para a persistência dos dados do utilizador.

**Gestão de Áudio Centralizada**: Controlo de som com suporte multilingue e preferências por utilizador.

## 🎯 Modos de Jogo Detalhados

### Modo Descoberta

Interface de exploração visual das tabuadas de multiplicação com:

- Visualização interativa das multiplicações
- Animações e ajudas de memória
- Arrastar e soltar educativo
- Progressão livre por tabuada

### Modo Quiz

Perguntas de múltipla escolha com:

- 10 perguntas por sessão
- Progressão adaptativa com base no sucesso
- Teclado numérico virtual
- Sistema de sequências (série de respostas corretas)

### Modo Desafio

Corrida contra o tempo com:

- 3 níveis de dificuldade (Iniciante, Médio, Difícil)
- Bónus de tempo para respostas corretas
- Sistema de vidas
- Tabela de classificações

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
- Controlo por teclado e tátil
- Classificações individuais por utilizador

## 🛠️ Desenvolvimento

### Arquitetura de Componentes

**GameMode (classe base)**: Todos os modos herdam de uma classe comum com métodos padronizados.

**GameModeManager**: Orquestração centralizada do lançamento e gestão dos modos.

**Componentes de UI**: TopBar, InfoBar, Dashboard e Customization fornecem uma interface consistente.

**Lazy Loading**: Os módulos são carregados a pedido para otimizar o desempenho inicial.

### Testes

O projeto inclui um conjunto completo de testes:

- Testes unitários dos módulos principais
- Testes de integração dos componentes
- Testes dos modos de jogo
- Cobertura de código automatizada

```bash
npm test              # Todos os testes (CJS)
npm test:core         # Testes dos módulos principais
npm test:integration  # Testes de integração
npm test:coverage     # Relatório de cobertura
npm run test:esm      # Testes ESM (ex: components/dashboard) via vm-modules
```

### Build de Produção

- **Rollup**: Agrupa `js/main-es6.js` em ESM com divisão de código e sourcemaps.
- **Terser**: Minificação automática para otimização.
- **Pós-build**: Copia `css/` e `assets/`, os favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e reescreve `dist/index.html` para o ficheiro de entrada com hash (ex: `main-es6-*.js`).
- **Pasta final**: `dist/` pronta para ser servida estaticamente.

```bash
npm run build      # gera dist/
npm run serve:dist # serve dist/ (porta 5000)
```

### Integração Contínua

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + artefacto de cobertura.
- **accessibility**: `npm run audit:accessibility` (não bloqueante).
- **test-esm**: `npm run test:esm` com módulos VM.
- **lighthouse**: Auditoria de desempenho móvel (não bloqueante), relatórios como artefactos.

### PWA (offline e instalação)

- **Service Worker**: Estratégia de rede primeiro com fallback para offline; imagens com cache-first; traduções com stale-while-revalidate; JS/CSS com rede primeiro.
- **Manifest**: Ícones SVG/PNG; instalação possível em telemóveis.
- **Testar offline localmente**:
  1. `npm run serve` e abrir `http://localhost:8080` (ou a porta apresentada).
  2. Desligar a rede e atualizar a página → `offline.html` será exibido.
  3. Teste automatizado (requer Puppeteer): `npm run test:pwa-offline`.

### Padrões de Qualidade

- **ESLint**: Validação do código JavaScript.
- **Prettier**: Formatação automática.
- **JSDoc**: Documentação automática de funções.
- **Acessibilidade**: Conformidade com WCAG 2.1 AA.
- **Desempenho**: Lazy loading, otimizações de CSS.

## 📱 Compatibilidade

### Navegadores Suportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Desktop**: Controlos de teclado e rato.
- **Tablets**: Interface tátil otimizada.
- **Smartphones**: Design responsivo adaptativo.

### Acessibilidade

- Navegação completa por teclado (Tab, setas, Esc).
- Funções ARIA e etiquetas para leitores de ecrã.
- Contrastes de cor conformes.
- Suporte para tecnologias de assistência.

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
  "menu_start": "Começar",
  "quiz_correct": "Parabéns!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Scripts de gestão:**

```bash
npm run i18n:verify  # Verificar chaves em falta/inconsistentes
npm run i18n:unused  # Listar chaves não utilizadas
npm run i18n:compare   # Comparar traduções (en/es) com fr.json (referência)
```

**Cobertura de Traduções:**

- Interface de utilizador completa
- Instruções dos jogos
- Mensagens de erro e feedback
- Descrições e ajuda contextual

## 📊 Armazenamento de Dados

### Dados do Utilizador

- Perfis e preferências
- Progresso por modo de jogo
- Pontuações e estatísticas dos jogos arcade
- Definições de personalização

### Funcionalidades Técnicas

- Armazenamento local (localStorage) com fallbacks.
- Isolamento de dados por utilizador.
- Gravação automática do progresso.
- Migração automática de dados antigos.

## 🐛 Relatar um Problema

Os problemas podem ser relatados através das issues do GitHub. Por favor, inclua:

- Descrição detalhada do problema.
- Passos para o reproduzir.
- Navegador e versão.
- Capturas de ecrã, se relevante.

## 💝 Apoiar o Projeto

**[☕ Doar via PayPal](https://paypal.me/jls)**

## 📄 Licença

Este projeto está licenciado sob a Licença AGPL v3. Consulte o ficheiro `LICENSE` para mais detalhes.

---

_LeapMultix - Uma aplicação educacional moderna para aprender as tabuadas de multiplicação._
