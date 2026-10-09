# Commandes du dépôt (catalogue complet)

Résumé des commandes courantes : `CLAUDE.md`, section « Commandes ».

## Commandes

Run all commands from the root directory:

```bash
npm install          # Setup dependencies
npm run serve        # Start development server (static preview)
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:core   # Run core functionality tests only
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues automatically
npm run format      # Format code with Prettier
npm run verify      # Run lint + test + test:esm + coverage (quality gate)
```

### Testing Commands

- `npm run test:integration` - Integration tests
- `npm run test:storage` - Storage-specific tests
- `npm run test:esm` - ES module tests (.mjs files)
- `npm run test:verbose` - Detailed test output

### Analysis and Maintenance Commands

- `npm run analyze:dependencies` - Check dependency usage
- `npm run dead-code` - Detect unused code
- `npm run analyze:globals` - Analyze global variables
- `npm run i18n:verify` - Verify internationalization keys
- `npm run i18n:unused` - Generate unused i18n keys report
- `npm run i18n:compare` - Compare translation files (en.json, es.json) with fr.json reference
- `npm run analyze:assets` - Asset analysis and optimization
- `npm run analyze:jsdoc` - Analyze JSDoc coverage
- `npm run improve:jsdoc` - Improve JSDoc coverage
- `npm run verify:cleanup` - Run dead code and globals analysis

### Build and Asset Management

- `npm run build` - Build production bundle with Rollup
- `npm run serve:dist` - Serve production build from dist/
- `npm run assets:generate` - Generate responsive image assets (obligatoire dès qu'un PNG est ajouté/modifié afin de rafraîchir `assets/generated-images/` avant `deploy.sh`)
- `npm run assets:backgrounds` - Convert `img/background_*.png` en WebP (à lancer si tu ajoutes/modifies un fond animé)
- `npm run assets:analyze` - Analyze responsive asset usage
- `npm run assets:diff` - Compare asset changes

### Audit and Quality Checks

- `npm run audit:accessibility` - Accessibility audit
- `npm run audit:mobile` - Mobile responsive audit
- `npm run test:pwa-offline` - Offline end to end (first visit, network cut, reload, every mode and arcade game)

### Service Worker Management

- `npm run sw:disable` - Disable service worker
- `npm run sw:fix` - Fix service worker issues
- `npm run precache:update` - Rewrite the offline precache list in `sw.js` (`scripts/precache-list.mjs`)
