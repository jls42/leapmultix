<details>
<summary>Este documento también está disponible en otros idiomas</summary>

- [Français](./README.md)
- [English](./README.en.md)
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

<!-- Badges (actualizar <owner>/<repo> después de la migración a GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#-características)
- [Inicio Rápido](#-inicio-rápido)
- [Arquitectura](#-arquitectura)
- [Modos de Juego Detallados](#-modos-de-juego-detallados)
- [Desarrollo](#-desarrollo)
- [Compatibilidad](#-compatibilidad)
- [Localización](#-localización)
- [Almacenamiento de Datos](#-almacenamiento-de-datos)
- [Reportar un Problema](#-reportar-un-problema)
- [Licencia](#-licencia)

## Descripción

LeapMultix es una moderna aplicación web educativa interactiva diseñada para que los niños (8–12 años) dominen las 4 operaciones aritméticas: multiplicación (×), suma (+), resta (−) y división (÷). La aplicación ofrece **5 modos de juego** y **4 minijuegos arcade** en una interfaz intuitiva, accesible y multilingüe.

**Soporte multioperación:** Los modos Cuestionario y Desafío permiten practicar todas las operaciones. Los modos Descubrimiento, Aventura y Arcade se centran en la multiplicación.

**Desarrollado por:** Julien LS (contact@jls42.org)

**URL en línea:** https://leapmultix.jls42.org/

## ✨ Características

### 🎮 Modos de Juego

- **Modo Descubrimiento**: Exploración visual e interactiva de las tablas de multiplicar
- **Modo Cuestionario** ⭐: Preguntas de opción múltiple compatibles con las 4 operaciones (×, +, −, ÷) y progresión adaptativa
- **Modo Desafío** ⭐: Carrera contrarreloj con las 4 operaciones (×, +, −, ÷) y diferentes niveles de dificultad
- **Modo Aventura**: Progresión narrativa por niveles con mapa interactivo (multiplicación)

⭐ = Soporte completo para las 4 operaciones aritméticas

### 🕹️ Minijuegos Arcade

- **MultiInvaders**: Space Invaders educativo - Destruye las respuestas incorrectas (multiplicación)
- **MultiMiam**: Pac-Man matemático - Recolecta las respuestas correctas (multiplicación)
- **MultiMemory**: Juego de memoria - Asocia multiplicaciones con sus resultados
- **MultiSnake**: Snake educativo - Crece comiendo los números correctos (multiplicación)

### ➕ Soporte Multioperación

LeapMultix va más allá de la simple multiplicación al ofrecer un entrenamiento completo en las 4 operaciones aritméticas:

| Modo           | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| Cuestionario   | ✅  | ✅  | ✅  | ✅  |
| Desafío        | ✅  | ✅  | ✅  | ✅  |
| Descubrimiento | ✅  | ❌  | ❌  | ❌  |
| Aventura       | ✅  | ❌  | ❌  | ❌  |
| Arcade         | ✅  | ❌  | ❌  | ❌  |

**Nota:** El soporte de operaciones para los modos Descubrimiento, Aventura y Arcade está previsto para una versión futura.

### 🌍 Funcionalidades Transversales

- **Multiusuario**: Gestión de perfiles individuales con progreso guardado
- **Multilingüe**: Soporte para francés, inglés y español
- **Personalización**: Avatares, temas de color, fondos
- **Accesibilidad**: Navegación por teclado, soporte táctil, conformidad con WCAG 2.1 AA
- **Responsive móvil**: Interfaz optimizada para tabletas y teléfonos inteligentes
- **Sistema de progresión**: Puntuaciones, insignias, desafíos diarios

## 🚀 Inicio Rápido

### Requisitos previos

- Node.js (versión 16 o superior)
- Un navegador web moderno

### Instalación

```bash
# Clonar el proyecto
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo (opción 1)
npm run serve
# La aplicación será accesible en http://localhost:8080 (o el siguiente puerto disponible)

# O con Python (opción 2)
python3 -m http.server 8000
# La aplicación será accesible en http://localhost:8000
```

### Scripts disponibles

```bash
# Desarrollo
npm run serve          # Servidor local (http://localhost:8080)
npm run lint           # Verificar código con ESLint
npm run lint:fix       # Corregir automáticamente problemas de ESLint
npm run format:check   # Verificar formato del código (SIEMPRE antes de commit)
npm run format         # Formatear código con Prettier
npm run verify         # Quality gate: lint + test + coverage

# Pruebas
npm run test           # Ejecutar todas las pruebas (CJS)
npm run test:watch     # Pruebas en modo watch
npm run test:coverage  # Pruebas con informe de cobertura
npm run test:core      # Pruebas de módulos core solamente
npm run test:integration # Pruebas de integración
npm run test:storage   # Pruebas del sistema de almacenamiento
npm run test:esm       # Pruebas ESM (carpeta tests-esm/, Jest vm-modules)
npm run test:verbose   # Pruebas con salida detallada
npm run test:pwa-offline # Prueba offline PWA (requiere Puppeteer), después de `npm run serve`

# Análisis y mantenimiento
npm run analyze:jsdoc  # Análisis de documentación
npm run improve:jsdoc  # Mejora automática de JSDoc
npm run audit:mobile   # Pruebas de respuesta móvil
npm run audit:accessibility # Pruebas de accesibilidad
npm run dead-code      # Detección de código no utilizado
npm run analyze:globals # Análisis de variables globales
npm run analyze:dependencies # Análisis de uso de dependencias
npm run verify:cleanup # Análisis combinado (dead code + globals)

# Gestión de assets
npm run assets:generate    # Generar imágenes responsivas
npm run assets:backgrounds # Convertir fondos a WebP
npm run assets:analyze     # Análisis de assets responsivos
npm run assets:diff        # Comparación de assets

# Internacionalización
npm run i18n:verify    # Verificar consistencia de claves de traducción
npm run i18n:unused    # Listar claves de traducción no utilizadas
npm run i18n:compare   # Comparar traducciones (en/es) con fr.json (referencia)

# Build y entrega
npm run build          # Build de producción (Rollup) + postbuild (dist/ completo)
npm run serve:dist     # Servir dist/ en http://localhost:5000 (o puerto disponible)

# PWA y Service Worker
npm run sw:disable     # Deshabilitar service worker
npm run sw:fix         # Corregir problemas de service worker
```

## 🏗️ Arquitectura

### Estructura de archivos

```
leapmultix/
├── index.html              # Punto de entrada principal
├── js/
│   ├── core/               # Módulos centrales ES6
│   │   ├── GameMode.js     # Clase base de modos
│   │   ├── GameModeManager.js # Gestión de modos de juego
│   │   ├── storage.js      # API de almacenamiento LocalStorage
│   │   ├── audio.js        # Gestión de sonido
│   │   ├── utils.js        # Utilidades genéricas (fuente canónica)
│   │   ├── eventBus.js     # Comunicación por eventos
│   │   ├── userState.js    # Gestión de sesión de usuario
│   │   ├── mainInit.js     # Inicialización DOM-ready
│   │   ├── theme.js        # Sistema de temas
│   │   ├── userUi.js       # Utilidades de interfaz de usuario
│   │   ├── parental.js     # Controles parentales
│   │   ├── adventure-data.js # Datos del modo Aventura
│   │   ├── mult-stats.js   # Estadísticas de multiplicación
│   │   ├── challenge-stats.js # Estadísticas de desafío
│   │   └── daily-challenge.js # Gestión de desafíos diarios
│   ├── components/         # Componentes UI reutilizables
│   │   ├── topBar.js       # Barra de navegación
│   │   ├── infoBar.js      # Barras de información de juegos
│   │   ├── dashboard.js    # Tablero de usuario
│   │   └── customization.js # Interfaz de personalización
│   ├── modes/              # Modos de juego
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minijuegos arcade
│   │   ├── arcade.js       # Orquestador principal arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Juego de memoria (31 KB)
│   │   ├── arcade-multimiam.js # Integración Multimiam
│   │   ├── arcade-multisnake.js # Integración Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilidades compartidas
│   │   ├── arcade-message.js, arcade-points.js # Componentes UI
│   │   └── arcade-scores.js # Gestión de puntuaciones
│   ├── multimiam/          # Juego Pac-Man (arquitectura descompuesta)
│   │   ├── multimiam.js    # Controlador principal
│   │   ├── multimiam-engine.js # Motor de juego (15 KB)
│   │   ├── multimiam-renderer.js # Sistema de renderizado (9 KB)
│   │   ├── multimiam-controls.js # Gestión de controles (7 KB)
│   │   ├── multimiam-questions.js # Generación de preguntas (6 KB)
│   │   └── multimiam-ui.js # Elementos de interfaz
│   ├── multisnake.js       # Juego Snake (38 KB)
│   ├── navigation/         # Sistema de navegación
│   │   ├── slides.js       # Navegación por diapositivas (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Soporte de teclado
│   ├── ui/                 # Interfaz de usuario y feedback
│   │   ├── uiUtils.js      # Utilidades de interfaz
│   │   ├── ui-feedback.js  # Mecanismos de feedback
│   │   ├── touch-support.js # Soporte táctil (7 KB)
│   │   ├── virtual-keyboard.js # Teclado virtual
│   │   ├── coin-display.js, coin-effects.js # Sistema de monedas
│   │   ├── notifications.js # Sistema de notificaciones
│   │   └── badges.js       # Sistema de insignias
│   ├── media/              # Gestión de medios
│   │   ├── VideoManager.js # Gestión de reproducción de video (12 KB)
│   │   └── responsive-image-loader.js # Carga de imágenes (9 KB)
│   ├── orchestration/      # Orquestación y carga
│   │   ├── mode-orchestrator.js # Cambio de modos
│   │   ├── lazy-loader.js  # Carga dinámica (10 KB)
│   │   └── game-cleanup.js # Limpieza de estado
│   ├── utils/              # Utilidades
│   │   ├── utils-es6.js    # Agregador principal (5 KB)
│   │   ├── main-helpers.js # Helpers de la aplicación
│   │   ├── helpers.js      # Funciones helpers legacy
│   │   ├── stats-utils.js  # Utilidades de estadísticas
│   │   ├── difficulty.js   # Gestión de dificultad
│   │   └── questionGenerator.js # Generación de preguntas
│   ├── storage/            # Almacenamiento y estado
│   │   ├── storage.js      # Wrapper de almacenamiento legacy
│   │   └── userManager.js  # Gestión multiusuario (19 KB)
│   ├── i18n/               # Internacionalización
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Almacenamiento de traducciones
│   ├── security/           # Seguridad y manejo de errores
│   │   ├── security-utils.js # Protección XSS, saneamiento
│   │   ├── error-handlers.js # Manejo global de errores
│   │   └── logger.js       # Sistema de registro (logging)
│   ├── accessibility/      # Accesibilidad
│   │   ├── accessibility.js # Características de accesibilidad
│   │   └── speech.js       # Soporte de síntesis de voz
│   ├── integration/        # Integración y análisis
│   │   ├── plausible-init.js # Analítica Plausible
│   │   ├── cache-updater.js # Gestión de caché (10 KB)
│   │   └── imports.js      # Utilidades de importación
│   ├── main-es6.js         # Punto de entrada ES6
│   ├── main.js             # Orquestador principal
│   ├── bootstrap.js        # Configuración de manejadores de eventos ES6
│   └── game.js             # Gestión de estado y desafíos diarios
├── css/                    # Estilos modulares
├── assets/                 # Recursos
│   ├── images/             # Imágenes y sprites
│   ├── generated-images/   # Imágenes responsivas generadas
│   ├── sounds/             # Efectos de sonido
│   ├── translations/       # Archivos de traducción (fr, en, es)
│   └── videos/             # Videos tutoriales
├── tests/                  # Pruebas automatizadas
│   ├── __tests__/          # Pruebas unitarias y de integración
│   └── tests-esm/          # Pruebas ESM (.mjs)
├── scripts/                # Scripts de mantenimiento
│   ├── compare-translations.cjs # Comparación de traducciones
│   └── cleanup-i18n-keys.cjs # Limpieza de claves i18n
└── dist/                   # Build de producción (generado)
```

### Arquitectura técnica

**Módulos ES6 Modernos**: El proyecto utiliza una arquitectura modular con clases ES6 e importaciones/exportaciones nativas.

**Componentes Reutilizables**: Interfaz construida con componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Carga inteligente de módulos bajo demanda a través de `lazy-loader.js` para optimizar el rendimiento inicial.

**Sistema de Almacenamiento Unificado**: API centralizada para la persistencia de datos de usuario a través de LocalStorage con alternativas.

**Gestión de Audio Centralizada**: Control de sonido con soporte multilingüe y preferencias por usuario.

**Bus de Eventos**: Comunicación por eventos desacoplada entre componentes para una arquitectura mantenible.

**Navegación por Diapositivas**: Sistema de navegación basado en diapositivas numeradas (slide0, slide1, etc.) con `goToSlide()`.

**Seguridad**: Protección XSS y saneamiento a través de `security-utils.js` para todas las manipulaciones del DOM.

## 🎯 Modos de Juego Detallados

### Modo Descubrimiento

Interfaz de exploración visual de las tablas de multiplicar con:

- Visualización interactiva de multiplicaciones
- Animaciones y ayudas mnemotécnicas
- Arrastrar y soltar educativo
- Progresión libre por tabla

### Modo Cuestionario

Preguntas de opción múltiple con:

- 10 preguntas por sesión
- Progresión adaptativa según el éxito
- Teclado numérico virtual
- Sistema de racha (serie de respuestas correctas)

### Modo Desafío

Carrera contrarreloj con:

- 3 niveles de dificultad (Principiante, Medio, Difícil)
- Bonificación de tiempo por respuestas correctas
- Sistema de vidas
- Clasificación de mejores puntuaciones

### Modo Aventura

Progresión narrativa con:

- 12 niveles temáticos desbloqueables
- Mapa interactivo con progresión visual
- Historia inmersiva con personajes
- Sistema de estrellas y recompensas

### Minijuegos Arcade

Cada minijuego ofrece:

- Elección de dificultad y personalización
- Sistema de vidas y puntuación
- Controles táctiles y de teclado
- Clasificaciones individuales por usuario

## 🛠️ Desarrollo

### Flujo de trabajo de desarrollo

**IMPORTANTE: Nunca hacer commit directamente en main**

El proyecto utiliza un flujo de trabajo basado en ramas de funcionalidad:

1. **Crear una rama**:

   ```bash
   git checkout -b feat/nombre-de-la-funcionalidad
   # o
   git checkout -b fix/nombre-del-bug
   ```

2. **Desarrollar y probar**:

   ```bash
   npm run format:check  # SIEMPRE verificar el formato primero
   npm run format        # Formatear si es necesario
   npm run lint          # Verificar la calidad del código
   npm run test          # Ejecutar las pruebas
   npm run test:coverage # Verificar la cobertura
   ```

3. **Hacer commit en la rama**:

   ```bash
   git add .
   git commit -m "feat: descripción de la funcionalidad"
   ```

4. **Hacer push y crear una Pull Request**:
   ```bash
   git push -u origin feat/nombre-de-la-funcionalidad
   ```

**Estilo de commit**: Conciso, modo imperativo (ej: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Asegurar que `npm run lint`, `npm test` y `npm run test:coverage` pasen antes de cada commit

### Arquitectura de componentes

**GameMode (clase base)**: Todos los modos heredan de una clase común con métodos estandarizados.

**GameModeManager**: Orquestación centralizada del lanzamiento y gestión de modos.

**Componentes UI**: TopBar, InfoBar, Dashboard y Customization proporcionan una interfaz coherente.

**Lazy Loading**: Los módulos se cargan bajo demanda para optimizar el rendimiento inicial.

**Bus de Eventos**: Comunicación desacoplada entre componentes a través del sistema de eventos.

### Pruebas

El proyecto incluye un conjunto completo de pruebas:

- Pruebas unitarias de módulos core
- Pruebas de integración de componentes
- Pruebas de modos de juego
- Cobertura de código automatizada

```bash
npm test              # Todas las pruebas (CJS)
npm test:core         # Pruebas de módulos centrales
npm test:integration  # Pruebas de integración
npm test:coverage     # Informe de cobertura
npm run test:esm      # Pruebas ESM (ej: components/dashboard) vía vm-modules
```

### Build de producción

- **Rollup**: Empaqueta `js/main-es6.js` en ESM con code-splitting y sourcemaps
- **Terser**: Minificación automática para optimización
- **Post-build**: Copia `css/` y `assets/`, los favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, y reescribe `dist/index.html` hacia el archivo de entrada con hash (ej: `main-es6-*.js`)
- **Carpeta final**: `dist/` listo para ser servido estáticamente

```bash
npm run build      # genera dist/
npm run serve:dist # sirve dist/ (puerto 5000)
```

### Integración Continua

**GitHub Actions**: Pipeline automatizado en `.github/workflows/ci.yml`

El pipeline CI/CD se ejecuta automáticamente en cada push y pull request:

**Trabajos principales**:

1. **build-test**: Trabajo principal de validación
   - Instalación de dependencias: `npm ci`
   - Verificación de formato: `npm run format:check`
   - Análisis estático: `npm run lint`
   - Pruebas unitarias: `npm run test`
   - Auditoría de seguridad: `npm audit`
   - Generación del artefacto de cobertura

2. **accessibility**: Auditoría de accesibilidad (no bloqueante)
   - Ejecuta `npm run audit:accessibility`
   - Genera informe de accesibilidad WCAG 2.1 AA

3. **test-esm**: Pruebas de módulos ES6
   - Ejecuta `npm run test:esm` con Jest VM modules
   - Valida importaciones/exportaciones ES6

4. **lighthouse**: Auditoría de rendimiento (no bloqueante)
   - Auditoría de rendimiento móvil
   - Generación de artefactos de informes Lighthouse
   - Métricas Core Web Vitals

**Insignias de calidad**:

- Estado de CI Build (GitHub Actions)
- Calificación CodeFactor
- Insignia Codacy
- Quality Gate SonarCloud

### PWA (Progressive Web App)

LeapMultix es una PWA completa con soporte offline y posibilidad de instalación.

**Service Worker** (`sw.js`):

- Navegación: Network-first con fallback offline a `offline.html`
- Imágenes: Cache-first para optimizar el rendimiento
- Traducciones: Stale-while-revalidate para actualización en segundo plano
- JS/CSS: Network-first para servir siempre la última versión
- Gestión automática de versiones vía `cache-updater.js`

**Manifiesto** (`manifest.json`):

- Iconos SVG y PNG para todos los dispositivos
- Instalable en móvil (Añadir a pantalla de inicio)
- Configuración standalone para experiencia tipo app
- Soporte de temas y colores

**Probar el modo offline localmente**:

1. Iniciar el servidor de desarrollo:

   ```bash
   npm run serve
   ```

   Abrir `http://localhost:8080` (o el puerto mostrado)

2. Prueba manual:
   - Cortar la red en las DevTools (Pestaña Network → Offline)
   - Refrescar la página → se muestra `offline.html`

3. Prueba automatizada (Requiere Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Scripts de gestión del Service Worker**:

```bash
npm run sw:disable  # Deshabilitar el service worker
npm run sw:fix      # Corregir problemas de caché
```

### Estándares de calidad

**Herramientas de calidad de código**:

- **ESLint**: Configuración moderna con flat config (`eslint.config.js`), soporte ES2022
- **Prettier**: Formateo automático de código (`.prettierrc`)
- **Stylelint**: Validación CSS (`.stylelintrc.json`)
- **JSDoc**: Documentación automática de funciones con análisis de cobertura

**Reglas de código importantes**:

- Eliminar variables y parámetros no utilizados (`no-unused-vars`)
- Usar manejo de errores específico (no catch vacíos)
- Evitar `innerHTML` a favor de funciones de `security-utils.js`
- Mantener complejidad cognitiva < 15 para funciones
- Extraer funciones complejas en helpers más pequeños

**Seguridad**:

- **Protección XSS**: Usar funciones de `security-utils.js`:
  - `appendSanitizedHTML()` en lugar de `innerHTML`
  - `createSafeElement()` para crear elementos seguros
  - `setSafeMessage()` para contenido de texto
- **Scripts externos**: Atributo `crossorigin="anonymous"` obligatorio
- **Validación de entradas**: Siempre sanitizar datos externos
- **Política de Seguridad de Contenido (CSP)**: Cabeceras CSP para restringir fuentes de scripts

**Accesibilidad**:

- Conformidad WCAG 2.1 AA
- Navegación completa por teclado
- Roles ARIA y etiquetas apropiadas
- Contrastes de color conformes

**Rendimiento**:

- Lazy loading de módulos vía `lazy-loader.js`
- Optimizaciones CSS y assets responsivos
- Service Worker para almacenamiento en caché inteligente
- Code splitting y minificación en producción

## 📱 Compatibilidad

### Navegadores soportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Escritorio**: Controles de teclado y ratón
- **Tabletas**: Interfaz táctil optimizada
- **Smartphones**: Diseño responsivo adaptable

### Accesibilidad

- Navegación completa por teclado (Tab, flechas, Esc)
- Roles ARIA y etiquetas para lectores de pantalla
- Contrastes de color conformes
- Soporte de tecnologías de asistencia

## 🌍 Localización

Soporte multilingüe completo:

- **Francés** (idioma predeterminado)
- **Inglés**
- **Español**

### Gestión de traducciones

**Archivos de traducción:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Comenzar",
  "quiz_correct": "¡Bien hecho!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de gestión i18n

**`npm run i18n:verify`** - Verificar consistencia de claves de traducción

**`npm run i18n:unused`** - Listar claves de traducción no utilizadas

**`npm run i18n:compare`** - Comparar archivos de traducción con fr.json (referencia)

Este script (`scripts/compare-translations.cjs`) asegura la sincronización de todos los archivos de idioma:

**Características:**

- Detección de claves faltantes (presentes en fr.json pero ausentes en otros idiomas)
- Detección de claves adicionales (presentes en otros idiomas pero no en fr.json)
- Identificación de valores vacíos (`""`, `null`, `undefined`, `[]`)
- Verificación de consistencia de tipos (string vs array)
- Aplanamiento de estructuras JSON anidadas a notación de puntos (ej: `arcade.multiMemory.title`)
- Generación de informe detallado en consola
- Guardado del informe JSON en `docs/translations-comparison-report.json`

**Ejemplo de salida:**

```
🔍 Análisis comparativo de archivos de traducción

📚 Idioma de referencia: fr.json
✅ fr.json: 335 claves

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Análisis de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de claves: 335
✅ Ninguna clave faltante
✅ Ninguna clave adicional
✅ Ningún valor vacío

📊 RESUMEN FINAL
  fr.json: 335 claves
  en.json: 335 claves
  es.json: 335 claves

✅ ¡Todos los archivos de traducción están perfectamente sincronizados!
```

**Cobertura de traducciones:**

- Interfaz de usuario completa
- Instrucciones de juegos
- Mensajes de error y retroalimentación
- Descripciones y ayuda contextual
- Contenido narrativo del modo Aventura
- Etiquetas de accesibilidad y ARIA

## 📊 Almacenamiento de Datos

### Datos de usuario

- Perfiles y preferencias
- Progreso por modo de juego
- Puntuaciones y estadísticas de juegos arcade
- Configuraciones de personalización

### Funcionalidades técnicas

- Almacenamiento local (localStorage) con alternativas
- Aislamiento de datos por usuario
- Guardado automático del progreso
- Migración automática de datos antiguos

## 🐛 Reportar un Problema

Los problemas pueden reportarse a través de las issues de GitHub. Por favor incluya:

- Descripción detallada del problema
- Pasos para reproducirlo
- Navegador y versión
- Capturas de pantalla si son relevantes

## 💝 Apoyar el proyecto

**[☕ Donar vía PayPal](https://paypal.me/jls)**

## 📄 Licencia

Este proyecto está bajo la licencia AGPL v3. Ver el archivo `LICENSE` para más detalles.

---

_LeapMultix - Aplicación educativa moderna para el aprendizaje de las tablas de multiplicar_
