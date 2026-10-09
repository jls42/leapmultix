/**
 * Script d'audit mobile et responsive Phase 8.3
 * Analyse l'état actuel de l'expérience mobile et responsive de LeapMultix
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

class MobileResponsiveAuditor {
  constructor() {
    this.results = {
      htmlFiles: [],
      cssFiles: [],
      responsive: {
        viewport: { score: 0, issues: [] },
        breakpoints: { score: 0, issues: [] },
        touchTargets: { score: 0, issues: [] },
        mobileFriendly: { score: 0, issues: [] },
        gestures: { score: 0, issues: [] },
        performance: { score: 0, issues: [] },
      },
      recommendations: [],
    };
  }

  async runCompleteAudit() {
    console.log('📱 AUDIT MOBILE & RESPONSIVE - LeapMultix Phase 8.3');
    console.log('====================================================\n');

    try {
      // Analyser les fichiers HTML
      await this.analyzeHTMLFiles();

      // Analyser les fichiers CSS
      await this.analyzeCSSFiles();

      // Générer le score global et recommandations
      this.generateGlobalScore();
      this.generateRecommendations();

      // Sauvegarder le rapport
      this.saveReport();

      console.log('\n✅ Audit mobile terminé avec succès !');
      console.log('📄 Rapport détaillé : analysis/mobile-responsive-audit.json');
    } catch (error) {
      console.error("❌ Erreur pendant l'audit :", error.message);
    }
  }

  async analyzeHTMLFiles() {
    console.log('🔍 Analyse des fichiers HTML...');

    const htmlFiles = ['index.html'];

    for (const file of htmlFiles) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- file is from predefined htmlFiles array, not user input
      if (!fs.existsSync(file)) continue;

      // eslint-disable-next-line security/detect-non-literal-fs-filename -- file is from predefined htmlFiles array, not user input
      const content = fs.readFileSync(file, 'utf8');
      this.results.htmlFiles.push(file);

      // Vérifier viewport meta tag
      this.checkViewportTag(content);

      // Vérifier touch targets
      this.checkTouchTargets(content);

      // Vérifier gestes tactiles
      this.checkTouchGestures(content);

      // Vérifier mobile-friendly elements
      this.checkMobileFriendlyElements(content);
    }
  }

  checkViewportTag(content) {
    const issues = [];
    let score = 100;

    // Vérifier présence viewport tag
    const viewportMatch = content.match(/<meta\s+name="viewport"[^>]*>/i);
    if (!viewportMatch) {
      issues.push('Meta viewport tag manquant');
      score -= 50;
    } else {
      const viewport = viewportMatch[0];

      // Vérifier width=device-width
      if (!viewport.includes('width=device-width')) {
        issues.push('viewport manque width=device-width');
        score -= 20;
      }

      // Vérifier initial-scale
      if (!viewport.includes('initial-scale=1')) {
        issues.push('viewport manque initial-scale=1');
        score -= 15;
      }

      // Vérifier user-scalable (ne devrait pas être no pour accessibilité)
      if (viewport.includes('user-scalable=no')) {
        issues.push("user-scalable=no nuit à l'accessibilité");
        score -= 25;
      }
    }

    this.results.responsive.viewport = { score: Math.max(0, score), issues };
  }

  // --- Fonctions d'aide pour l'audit ---

  _getBtnSmHeight(cssContent) {
    const btnSmRule = cssContent.match(/\.btn-sm\s*\{[^}]*\}/s);
    let baseHeight = 0;
    if (btnSmRule) {
      const heightMatch = btnSmRule[0].match(/min-height:\s*(\d+)px/);
      if (heightMatch) {
        baseHeight = Number.parseInt(heightMatch[1], 10);
      }
    }

    let heightInMedia = 0;
    const mediaQueries = cssContent.match(/@media[^{]+\{[^}]*\.btn-sm[^}]*\}/gs) || [];
    for (const mq of mediaQueries) {
      if (mq.includes('max-width')) {
        const heightMatch = mq.match(/min-height:\s*(\d+)px/);
        if (heightMatch) {
          heightInMedia = Math.max(heightInMedia, Number.parseInt(heightMatch[1], 10));
        }
      }
    }
    return Math.max(baseHeight, heightInMedia);
  }

  checkTouchTargets(content) {
    const issues = [];
    let score = 100;

    // 1. Vérifier la taille de .btn-sm via analyse CSS
    try {
      const generalCSS = fs.readFileSync(path.join('css', 'general.css'), 'utf8');
      const finalMinHeight = this._getBtnSmHeight(generalCSS);

      if (finalMinHeight > 0 && finalMinHeight < 44) {
        issues.push(
          `La taille min-height de .btn-sm est de ${finalMinHeight}px, ce qui est inférieur aux 44px recommandés.`
        );
        score -= 30;
      }
    } catch (error) {
      console.warn(
        'Audit CSS pour .btn-sm a échoué, fallback sur la méthode de base:',
        error.message
      );
      const smallButtons = (content.match(/btn-sm/g) || []).length;
      if (smallButtons > 0) {
        issues.push(`${smallButtons} boutons "btn-sm" potentiellement trop petits pour tactile`);
        score -= Math.min(30, smallButtons * 5);
      }
    }

    // 2. Vérifier les liens courts
    const inlineLinks = (content.match(/<a[^>]*>[^<]{1,10}<\/a>/g) || []).length;
    if (inlineLinks > 5) {
      issues.push(`${inlineLinks} liens courts potentiellement difficiles à toucher`);
      score -= 15;
    }

    // 3. Vérifier les types d'input tactiles
    const inputs = (content.match(/<input[^>]*>/g) || []).length;
    if (inputs > 0) {
      const emailInputs = (content.match(/type="email"/g) || []).length;
      const numberInputs = (content.match(/type="number"/g) || []).length;
      const telInputs = (content.match(/type="tel"/g) || []).length;

      const tactileTypes = emailInputs + numberInputs + telInputs;
      if (tactileTypes < inputs * 0.3) {
        issues.push("Peu d'inputs utilisent les types tactiles (email, number, tel)");
        score -= 20;
      }
    }

    this.results.responsive.touchTargets = { score: Math.max(0, score), issues };
  }

  checkTouchGestures(content) {
    const issues = [];
    let score = 100;

    // Vérifier support touch events
    const touchEvents = (content.match(/(touchstart|touchend|touchmove)/g) || []).length;
    if (touchEvents === 0) {
      issues.push('Aucun event tactile détecté (touchstart, touchend, touchmove)');
      score -= 40;
    }

    // Vérifier hover effects (problématiques sur mobile)
    const hoverEffects = (content.match(/:hover/g) || []).length;
    if (hoverEffects > 10) {
      issues.push("Beaucoup d'effets :hover (problématiques sur tactile)");
      score -= 20;
    }

    // Vérifier double-click/double-tap
    const doubleClickEvents = (content.match(/dblclick/g) || []).length;
    if (doubleClickEvents > 0) {
      issues.push('Events dblclick détectés (difficiles sur tactile)');
      score -= 25;
    }

    this.results.responsive.gestures = { score: Math.max(0, score), issues };
  }

  checkMobileFriendlyElements(content) {
    const issues = [];
    let score = 100;

    // Vérifier tables responsives
    const tables = (content.match(/<table[^>]*>/g) || []).length;
    const responsiveTables = (content.match(/table-responsive/g) || []).length;

    if (tables > 0 && responsiveTables < tables) {
      issues.push(`${tables - responsiveTables} tables sans classe responsive`);
      score -= 20;
    }

    // Vérifier images responsives
    const images = (content.match(/<img[^>]*>/g) || []).length;
    const responsiveImages = (content.match(/img-responsive|img-fluid/g) || []).length;

    if (images > 5 && responsiveImages < images * 0.7) {
      issues.push("Beaucoup d'images sans classes responsive");
      score -= 25;
    }

    // Vérifier navigation mobile (burger menu, etc.) - Note: analyse statique.
    const navToggle =
      content.includes('navbar-toggle') ||
      content.includes('menu-toggle') ||
      content.includes('burger-menu-btn') || // Ajout de la classe spécifique
      content.includes('burger');
    if (!navToggle) {
      issues.push('Pas de navigation mobile (burger menu) détectée (analyse statique)');
      score -= 30;
    }

    this.results.responsive.mobileFriendly = { score: Math.max(0, score), issues };
  }

  async analyzeCSSFiles() {
    console.log('🎨 Analyse des fichiers CSS...');

    const cssDir = 'css';
    if (!fs.existsSync(cssDir)) return;

    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));

    for (const file of cssFiles) {
      const filePath = path.join(cssDir, file);
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- filePath is constructed from cssDir and verified .css file
      const content = fs.readFileSync(filePath, 'utf8');
      this.results.cssFiles.push(file);

      // Analyser breakpoints et media queries
      this.analyzeBreakpoints(content, file);

      // Analyser performance mobile
      this.analyzeMobilePerformance(content, file);
    }
  }

  analyzeBreakpoints(content, filename) {
    const issues = [];
    let score = 100;

    // Vérifier media queries
    const mediaQueries = content.match(/@media[^{]+\{/g) || [];
    const mqCount = mediaQueries.length;

    if (mqCount === 0) {
      issues.push(`${filename}: Aucune media query trouvée`);
      score -= 50;
    } else {
      // Vérifier breakpoints standards
      const mobileFirst = mediaQueries.some(mq => mq.includes('min-width'));
      const desktopFirst = mediaQueries.some(mq => mq.includes('max-width'));

      if (!mobileFirst && desktopFirst) {
        // Changé en simple avertissement sans impact sur le score
        issues.push(`${filename}: Approche desktop-first (recommandé: mobile-first)`);
      }

      // Vérifier breakpoints communs
      const commonBreakpoints = ['320px', '480px', '768px', '1024px', '1200px'];
      const usedBreakpoints = commonBreakpoints.filter(bp => content.includes(bp));

      if (usedBreakpoints.length < 2) {
        issues.push(`${filename}: Peu de breakpoints standards utilisés`);
        score -= 25;
      }

      // Vérifier orientation
      const orientationQueries = content.includes('orientation:');
      if (!orientationQueries) {
        issues.push(`${filename}: Pas de gestion orientation portrait/landscape`);
        score -= 15;
      }
    }

    // Accumuler les scores (moyenne pondérée)
    if (this.results.responsive.breakpoints.score === 0) {
      this.results.responsive.breakpoints = { score: Math.max(0, score), issues };
    } else {
      const currentScore = this.results.responsive.breakpoints.score;
      this.results.responsive.breakpoints.score = Math.round((currentScore + score) / 2);
      this.results.responsive.breakpoints.issues.push(...issues);
    }
  }

  analyzeMobilePerformance(content, filename) {
    const issues = [];
    let score = 100;

    // Vérifier animations coûteuses
    const animations = (content.match(/@keyframes|animation:|transition:/g) || []).length;
    if (animations > 20) {
      issues.push(`${filename}: Beaucoup d'animations (impact performance mobile)`);
      score -= 15;
    }

    // Vérifier box-shadows complexes
    const complexShadows = (content.match(/box-shadow:[^;]{50,}/g) || []).length;
    if (complexShadows > 5) {
      issues.push(`${filename}: Ombres complexes (coûteuses sur mobile)`);
      score -= 10;
    }

    // Vérifier transforms 3D (peuvent être coûteux)
    const transforms3D = (content.match(/transform.*3d|translateZ|rotateX|rotateY/g) || []).length;
    if (transforms3D > 10) {
      issues.push(`${filename}: Beaucoup de transforms 3D (attention performance)`);
      score -= 10;
    }

    // Vérifier will-change (optimisation GPU)
    const willChange = (content.match(/will-change:/g) || []).length;
    if (willChange === 0 && animations > 5) {
      issues.push(`${filename}: Animations sans will-change (optimisation GPU)`);
      score -= 15;
    }

    // Accumuler les scores
    if (this.results.responsive.performance.score === 0) {
      this.results.responsive.performance = { score: Math.max(0, score), issues };
    } else {
      const currentScore = this.results.responsive.performance.score;
      this.results.responsive.performance.score = Math.round((currentScore + score) / 2);
      this.results.responsive.performance.issues.push(...issues);
    }
  }

  generateGlobalScore() {
    const categories = this.results.responsive;
    const scores = Object.values(categories).map(cat => cat.score);
    const globalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    console.log('\n📊 RÉSULTATS AUDIT MOBILE & RESPONSIVE');
    console.log('=====================================');
    console.log(`🎯 SCORE GLOBAL : ${globalScore}/100`);

    if (globalScore >= 90) {
      console.log('🎉 Excellent ! Interface très mobile-friendly');
    } else if (globalScore >= 70) {
      console.log('👍 Bon ! Quelques améliorations possibles');
    } else if (globalScore >= 50) {
      console.log('⚠️  Correct, mais optimisations nécessaires');
    } else {
      console.log('🚨 Améliorations urgentes requises');
    }

    console.log('\n📈 SCORES PAR CATÉGORIE :');
    console.log(`- 📱 Viewport & Meta : ${categories.viewport.score}/100`);
    console.log(`- 🎯 Touch Targets : ${categories.touchTargets.score}/100`);
    console.log(`- 📐 Breakpoints : ${categories.breakpoints.score}/100`);
    console.log(`- 👆 Gestes Tactiles : ${categories.gestures.score}/100`);
    console.log(`- 📱 Mobile-Friendly : ${categories.mobileFriendly.score}/100`);
    console.log(`- ⚡ Performance : ${categories.performance.score}/100`);

    this.results.globalScore = globalScore;
  }

  generateRecommendations() {
    console.log('\n🎯 RECOMMANDATIONS PRIORITAIRES :');

    const categories = this.results.responsive;
    let priority = 1;

    if (categories.viewport.score < 70) {
      console.log(`${priority++}. 📱 Améliorer meta viewport et configuration mobile`);
    }

    if (categories.touchTargets.score < 70) {
      console.log(`${priority++}. 🎯 Optimiser taille des éléments tactiles (min 44x44px)`);
    }

    if (categories.breakpoints.score < 70) {
      console.log(`${priority++}. 📐 Ajouter/améliorer breakpoints responsive`);
    }

    if (categories.gestures.score < 70) {
      console.log(`${priority++}. 👆 Implémenter support gestes tactiles`);
    }

    if (categories.mobileFriendly.score < 70) {
      console.log(`${priority++}. 📱 Améliorer éléments mobile-friendly (navigation, images)`);
    }

    if (categories.performance.score < 70) {
      console.log(`${priority++}. ⚡ Optimiser performance mobile (animations, GPU)`);
    }

    // Recommandations spécifiques
    console.log('\n💡 AMÉLIORATIONS SPÉCIFIQUES :');
    Object.entries(categories).forEach(([category, data]) => {
      if (data.issues.length > 0) {
        console.log(`\n${category.toUpperCase()} :`);
        data.issues.forEach(issue => console.log(`  - ${issue}`));
      }
    });
  }

  saveReport() {
    const reportDir = 'analysis';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const report = {
      date: new Date().toISOString(),
      globalScore: this.results.globalScore,
      categories: this.results.responsive,
      recommendations: this.results.recommendations,
      filesAnalyzed: {
        html: this.results.htmlFiles,
        css: this.results.cssFiles,
      },
      nextSteps: [
        'Implémenter les améliorations prioritaires',
        'Tester sur vraies appareils mobiles',
        'Valider avec DevTools responsive mode',
        'Mesurer performance mobile avec Lighthouse',
      ],
    };

    fs.writeFileSync(
      path.join(reportDir, 'mobile-responsive-audit.json'),
      JSON.stringify(report, null, 2)
    );
  }
}

// Exécution si script appelé directement (Node context)
if (
  typeof globalThis !== 'undefined' &&
  globalThis.process !== undefined &&
  import.meta &&
  import.meta.url === pathToFileURL(path.resolve(globalThis.process.argv[1])).href
) {
  const auditor = new MobileResponsiveAuditor();
  auditor.runCompleteAudit().catch(error => {
    console.error(error);
    globalThis.process.exitCode = 1;
  });
}

export default MobileResponsiveAuditor;
