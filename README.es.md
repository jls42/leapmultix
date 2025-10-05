Este README también está disponible en [Francés](./README.md) e [Inglés](./README.en.md).

# LeapMultix

<!-- Insignias (actualizar <owner>/<repo> después de la migración a GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Índice

- [Descripción](#descripción)
- [Funcionalidades](#-funcionalidades)
- [Inicio rápido](#-inicio-rápido)
- [Arquitectura](#-arquitectura)
- [Modos de Juego Detallados](#-modos-de-juego-detallados)
- [Desarrollo](#-desarrollo)
- [Compatibilidad](#-compatibilidad)
- [Localización](#-localización)
- [Almacenamiento de datos](#-almacenamiento-de-datos)
- [Reportar un problema](#-reportar-un-problema)
- [Licencia](#-licencia)

## Descripción

LeapMultix es una aplicación web educativa, interactiva y moderna diseñada para que los niños (de 8 a 12 años) dominen las tablas de multiplicar. La aplicación ofrece **4 modos de juego clásicos** y **4 minijuegos de arcade** en una interfaz intuitiva, accesible y multilingüe.

**Desarrollado por:** Julien LS (contact@jls42.org)

**URL en línea:** https://leapmultix.jls42.org/

## ✨ Funcionalidades

### 🎮 Modos de Juego

- **Modo Descubrimiento**: Exploración visual e interactiva de las tablas de multiplicar.
- **Modo Quiz**: Preguntas de opción múltiple con progresión adaptativa.
- **Modo Desafío**: Carrera contra el tiempo con diferentes niveles de dificultad.
- **Modo Aventura**: Progresión narrativa por niveles con un mapa interactivo.

### 🕹️ Minijuegos Arcade

- **MultiInvaders**: Un Space Invaders educativo - Destruye las respuestas incorrectas.
- **MultiMiam**: Un Pac-Man matemático - Recoge las respuestas correctas.
- **MultiMemory**: Juego de memoria - Asocia multiplicaciones con sus resultados.
- **MultiSnake**: Un Snake educativo - Crece comiendo los números correctos.

### 🌍 Funcionalidades Transversales

- **Multiusuario**: Gestión de perfiles individuales con guardado de progreso.
- **Multilingüe**: Soporte para francés, inglés y español.
- **Personalización**: Avatares, temas de color, fondos de pantalla.
- **Accesibilidad**: Navegación por teclado, soporte táctil, conformidad con WCAG 2.1 AA.
- **Diseño adaptable (Mobile responsive)**: Interfaz optimizada para tabletas y smartphones.
- **Sistema de progresión**: Puntuaciones, insignias, desafíos diarios.

## 🚀 Inicio rápido

### Prerrequisitos

- Node.js (versión 16 o superior)
- Un navegador web moderno

### Instalación

```bash
# Clonar el proyecto
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Instalar las dependencias
npm install

# Iniciar el servidor de desarrollo (opción 1)
npm run serve
# La aplicación estará accesible en http://localhost:8080 (o el siguiente puerto disponible)

# O con Python (opción 2)
python3 -m http.server 8000
# La aplicación estará accesible en http://localhost:8000
```

### Scripts disponibles

```bash
# Desarrollo
npm run serve          # Servidor local
npm run lint           # Verificación del código
npm run test           # Ejecutar todas las pruebas (CJS)
npm run test:coverage  # Pruebas con cobertura
npm run test:esm       # Pruebas ESM (carpetas tests-esm/, Jest vm-modules)
npm run test:pwa-offline # Prueba offline de PWA (requiere Puppeteer), después de `npm run serve`

# Análisis y mantenimiento
npm run analyze:jsdoc  # Análisis de la documentación
npm run improve:jsdoc  # Mejora automática de JSDoc
npm run audit:mobile   # Pruebas de responsividad móvil
npm run audit:accessibility # Pruebas de accesibilidad
npm run dead-code      # Detección de código no utilizado
npm run analyze:globals # Análisis de variables globales
npm run analyze:dependencies # Análisis del uso de dependencias
npm run assets:analyze # Análisis de los assets responsivos
npm run assets:diff    # Comparación de los assets

# Build y entrega
npm run build          # Build de producción (Rollup) + postbuild (dist/ completo)
npm run serve:dist     # Servir dist/ en http://localhost:5000 (o puerto disponible)
```

## 🏗️ Arquitectura

### Estructura de archivos

```
leapmultix/
├── index.html              # Punto de entrada principal
├── js/
│   ├── core/               # Módulos centrales ES6
│   │   ├── GameMode.js     # Clase base de los modos de juego
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # API de almacenamiento
│   │   ├── audio.js        # Gestión del sonido
│   │   └── utils.js        # Utilidades genéricas
│   ├── components/         # Componentes de UI reutilizables
│   │   ├── topBar.js       # Barra de navegación
│   │   ├── infoBar.js      # Barras de información de los juegos
│   │   ├── dashboard.js    # Panel de control del usuario
│   │   └── customization.js # Interfaz de personalización
│   ├── modes/              # Modos de juego refactorizados
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Minijuegos de arcade
│   ├── multimiam-*.js      # Módulos del juego Pac-Man
│   ├── multisnake.js       # Juego Snake educativo
│   ├── main-es6.js         # Punto de entrada ES6
│   ├── main.js             # Orquestador principal
│   ├── lazy-loader.js      # Carga bajo demanda (lazy loading)
│   └── utils-es6.js        # Utilidades ES6
├── css/                    # Estilos modulares
├── assets/                 # Recursos
│   ├── images/             # Imágenes y sprites
│   ├── sounds/             # Efectos de sonido
│   ├── translations/       # Archivos de traducción
│   └── videos/             # Vídeos tutoriales
└── tests/                  # Pruebas automatizadas
```

### Arquitectura técnica

**Módulos ES6 modernos**: El proyecto utiliza una arquitectura modular con clases ES6 e importaciones/exportaciones nativas.

**Componentes reutilizables**: La interfaz está construida con componentes de UI centralizados (TopBar, InfoBar, Dashboard).

**Lazy Loading**: Carga inteligente de módulos bajo demanda para optimizar el rendimiento.

**Sistema de almacenamiento unificado**: API centralizada para la persistencia de los datos del usuario.

**Gestión de audio centralizada**: Control del sonido con soporte multilingüe y preferencias por usuario.

## 🎯 Modos de Juego Detallados

### Modo Descubrimiento

Interfaz de exploración visual de las tablas de multiplicar con:

- Visualización interactiva de las multiplicaciones
- Animaciones y ayudas visuales
- Arrastrar y soltar educativo
- Progresión libre por tabla

### Modo Quiz

Preguntas de opción múltiple con:

- 10 preguntas por sesión
- Progresión adaptativa según los aciertos
- Teclado numérico virtual
- Sistema de racha (serie de respuestas correctas)

### Modo Desafío

Carrera contra el tiempo con:

- 3 niveles de dificultad (Principiante, Medio, Difícil)
- Bonificación de tiempo por respuestas correctas
- Sistema de vidas
- Clasificación de las mejores puntuaciones

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
- Controles por teclado y táctiles
- Clasificaciones individuales por usuario

## 🛠️ Desarrollo

### Arquitectura de los componentes

**GameMode (clase base)**: Todos los modos heredan de una clase común con métodos estandarizados.

**GameModeManager**: Orquestación centralizada del inicio y la gestión de los modos.

**Componentes de UI**: TopBar, InfoBar, Dashboard y Customization proporcionan una interfaz coherente.

**Lazy Loading**: Los módulos se cargan bajo demanda para optimizar el rendimiento inicial.

### Pruebas

El proyecto incluye un conjunto completo de pruebas:

- Pruebas unitarias de los módulos del núcleo
- Pruebas de integración de los componentes
- Pruebas de los modos de juego
- Cobertura de código automatizada

```bash
npm test              # Todas las pruebas (CJS)
npm test:core         # Pruebas de los módulos centrales
npm test:integration  # Pruebas de integración
npm test:coverage     # Informe de cobertura
npm run test:esm      # Pruebas ESM (ej: components/dashboard) vía vm-modules
```

### Build de producción

- **Rollup**: Empaqueta `js/main-es6.js` en ESM con división de código (code-splitting) y sourcemaps.
- **Terser**: Minificación automática para optimización.
- **Post-build**: Copia `css/` y `assets/`, los favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, y reescribe `dist/index.html` para apuntar al archivo de entrada con hash (ej: `main-es6-*.js`).
- **Carpeta final**: `dist/` lista para ser servida estáticamente.

```bash
npm run build      # genera dist/
npm run serve:dist # sirve dist/ (puerto 5000)
```

### Integración Continua

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + artefacto de cobertura.
- **accessibility**: `npm run audit:accessibility` (no bloqueante).
- **test-esm**: `npm run test:esm` con módulos VM.
- **lighthouse**: Auditoría de rendimiento móvil (no bloqueante), informes como artefactos.

### PWA (sin conexión e instalación)

- **Service Worker**: Estrategia de red primero con fallback a sin conexión; imágenes con estrategia de caché primero; traducciones con stale-while-revalidate; JS/CSS con red primero.
- **Manifest**: Iconos SVG/PNG; instalación posible en móviles.
- **Probar sin conexión localmente**:
  1. `npm run serve` y abrir `http://localhost:8080` (o el puerto que se muestre).
  2. Desconectar la red y refrescar la página → se mostrará `offline.html`.
  3. Prueba automatizada (requiere Puppeteer): `npm run test:pwa-offline`.

### Estándares de calidad

- **ESLint**: Validación del código JavaScript.
- **Prettier**: Formateo automático.
- **JSDoc**: Documentación automática de funciones.
- **Accesibilidad**: Conformidad con WCAG 2.1 AA.
- **Rendimiento**: Lazy loading, optimizaciones de CSS.

## 📱 Compatibilidad

### Navegadores soportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Escritorio**: Controles de teclado y ratón.
- **Tabletas**: Interfaz táctil optimizada.
- **Smartphones**: Diseño adaptable (responsive).

### Accesibilidad

- Navegación completa por teclado (Tab, flechas, Esc).
- Roles ARIA y etiquetas para lectores de pantalla.
- Contrastes de color conformes.
- Soporte para tecnologías de asistencia.

## 🌍 Localización

Soporte multilingüe completo:

- **Francés** (idioma por defecto)
- **Inglés**
- **Español**

### Gestión de las traducciones

**Archivos de traducción:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Scripts de gestión:**

```bash
npm run i18n:verify  # Verificar claves faltantes/inconsistentes
npm run i18n:unused  # Listar claves no utilizadas
```

**Cobertura de las traducciones:**

- Interfaz de usuario completa
- Instrucciones de los juegos
- Mensajes de error y de feedback
- Descripciones y ayuda contextual

## 📊 Almacenamiento de datos

### Datos del usuario

- Perfiles y preferencias
- Progreso por modo de juego
- Puntuaciones y estadísticas de los juegos arcade
- Ajustes de personalización

### Funcionalidades técnicas

- Almacenamiento local (localStorage) con fallbacks.
- Aislamiento de los datos por usuario.
- Guardado automático del progreso.
- Migración automática de datos antiguos.

## 🐛 Reportar un problema

Los problemas se pueden reportar a través de las issues de GitHub. Por favor, incluye:

- Descripción detallada del problema.
- Pasos para reproducirlo.
- Navegador y versión.
- Capturas de pantalla si son relevantes.

## 💝 Apoyar el proyecto

**[☕ Hacer una donación a través de PayPal](https://paypal.me/jls)**

## 📄 Licencia

Este proyecto está bajo la licencia AGPL v3. Consulta el archivo `LICENSE` para más detalles.

---

_LeapMultix - Aplicación educativa moderna para el aprendizaje de las tablas de multiplicar._
