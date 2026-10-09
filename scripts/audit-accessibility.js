/**
 * Script d'audit d'accessibilité Phase 8.1
 * Analyse l'état actuel de l'accessibilité de LeapMultix
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

class AccessibilityAuditor {
  constructor() {
    this.results = {
      htmlFiles: [],
      cssFiles: [],
      jsFiles: [],
      accessibility: {
        semanticHTML: { score: 0, issues: [] },
        keyboardNavigation: { score: 0, issues: [] },
        ariaLabels: { score: 0, issues: [] },
        colorContrast: { score: 0, issues: [] },
        focusManagement: { score: 0, issues: [] },
        screenReader: { score: 0, issues: [] },
      },
      recommendations: [],
    };
  }

  // Analyser les fichiers HTML
  analyzeHTML(filePath) {
    // eslint-disable-next-line -- filePath is from controlled HTML file analysis
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    const analysis = {
      file: fileName,
      semantic: this.checkSemanticHTML(content),
      ariaLabels: this.checkAriaLabels(content),
      headings: this.checkHeadingStructure(content),
      forms: this.checkFormAccessibility(content),
      images: this.checkImageAccessibility(content),
      links: this.checkLinkAccessibility(content),
    };

    this.results.htmlFiles.push(analysis);
    return analysis;
  }

  // Vérifier le HTML sémantique
  checkSemanticHTML(content) {
    const issues = [];
    let score = 100;

    // Vérifier les éléments sémantiques
    const semanticElements = ['nav', 'main', 'section', 'article', 'aside', 'header', 'footer'];
    const usedElements = semanticElements.filter(el => content.includes(`<${el}`));

    if (usedElements.length < 3) {
      issues.push("Peu d'éléments HTML5 sémantiques utilisés");
      score -= 20;
    }

    // Vérifier les divs excessives
    const divCount = (content.match(/<div/g) || []).length;
    const totalElements = (content.match(/<\w+/g) || []).length;

    if (divCount / totalElements > 0.5) {
      issues.push("Usage excessif de <div> au lieu d'éléments sémantiques");
      score -= 15;
    }

    // Vérifier les boutons vs liens
    const buttonSpans = (content.match(/<span[^>]*onclick/g) || []).length;
    if (buttonSpans > 0) {
      issues.push(`${buttonSpans} éléments cliquables non-boutons détectés`);
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier les étiquettes ARIA
  checkAriaLabels(content) {
    const issues = [];
    let score = 100;

    // Vérifier aria-label
    const ariaLabels = (content.match(/aria-label=/g) || []).length;
    const buttons = (content.match(/<button/g) || []).length;

    if (buttons > 0 && ariaLabels < buttons * 0.5) {
      issues.push('Beaucoup de boutons sans aria-label');
      score -= 25;
    }

    // Vérifier aria-describedby
    const ariaDescribed = (content.match(/aria-describedby=/g) || []).length;
    const inputs = (content.match(/<input/g) || []).length;

    if (inputs > 0 && ariaDescribed === 0) {
      issues.push('Aucun champ avec aria-describedby pour aide contextuelle');
      score -= 15;
    }

    // Vérifier role
    const roleAttributes = (content.match(/role=/g) || []).length;
    if (roleAttributes === 0) {
      issues.push('Aucun attribut role personnalisé');
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier la structure des titres
  checkHeadingStructure(content) {
    const issues = [];
    let score = 100;

    const headings = [];
    const HEADING_RES = [/<h1/g, /<h2/g, /<h3/g, /<h4/g, /<h5/g, /<h6/g];
    for (let i = 1; i <= 6; i++) {
      const re = HEADING_RES[i - 1];
      const matches = content.match(re);
      if (matches) headings.push({ level: i, count: matches.length });
    }

    if (headings.length === 0) {
      issues.push('Aucun titre (h1-h6) trouvé');
      score -= 50;
    } else {
      // Vérifier h1 unique
      const h1Count = headings.find(h => h.level === 1)?.count || 0;
      if (h1Count === 0) {
        issues.push('Aucun h1 trouvé');
        score -= 20;
      } else if (h1Count > 1) {
        issues.push('Plusieurs h1 trouvés');
        score -= 15;
      }

      // Vérifier la hiérarchie
      const levels = headings.map(h => h.level).sort((a, b) => a - b);
      if (levels.length > 1 && levels[1] - levels[0] > 1) {
        issues.push('Hiérarchie de titres non respectée');
        score -= 15;
      }
    }

    return { score: Math.max(0, score), issues, headings };
  }

  // Vérifier l'accessibilité des formulaires
  checkFormAccessibility(content) {
    const issues = [];
    let score = 100;

    const inputs = (content.match(/<input/g) || []).length;
    const labels = (content.match(/<label/g) || []).length;

    if (inputs > 0) {
      if (labels < inputs * 0.8) {
        issues.push('Beaucoup de champs sans <label> associé');
        score -= 30;
      }

      // Vérifier required et aria-required
      const requiredFields = (content.match(/required/g) || []).length;
      const ariaRequired = (content.match(/aria-required/g) || []).length;

      if (requiredFields > 0 && ariaRequired === 0) {
        issues.push('Champs requis sans aria-required');
        score -= 15;
      }

      // Vérifier les types d'input
      const emailInputs = (content.match(/type="email"/g) || []).length;
      const numberInputs = (content.match(/type="number"/g) || []).length;

      if (emailInputs === 0 && numberInputs === 0 && inputs > 3) {
        issues.push("Types d'input génériques - optimisation possible");
        score -= 10;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier l'accessibilité des images
  checkImageAccessibility(content) {
    const issues = [];
    let score = 100;

    const images = (content.match(/<img/g) || []).length;
    const altTexts = (content.match(/alt=/g) || []).length;

    if (images > 0) {
      if (altTexts < images * 0.9) {
        issues.push(`${images - altTexts} images sans attribut alt`);
        score -= 40;
      }

      // Vérifier les alt vides (décoratives)
      const emptyAlts = (content.match(/alt=""/g) || []).length;
      if (emptyAlts === 0 && images > 5) {
        issues.push('Toutes les images ont alt - vérifier les images décoratives');
        score -= 5;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier l'accessibilité des liens
  checkLinkAccessibility(content) {
    const issues = [];
    let score = 100;

    // Vérifier les liens vagues
    const vagueLinks = (content.match(/>(cliquer ici|ici|lire plus|more|click here)/gi) || [])
      .length;
    if (vagueLinks > 0) {
      issues.push(`${vagueLinks} liens avec texte vague`);
      score -= 20;
    }

    // Vérifier target="_blank" sans rel
    const externalLinks = (content.match(/target="_blank"(?![^>]*rel=)/g) || []).length;
    if (externalLinks > 0) {
      issues.push(`${externalLinks} liens externes sans rel="noopener"`);
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  // Analyser les fichiers CSS pour contraste et responsive
  analyzeCSS(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    const analysis = {
      file: fileName,
      colorContrast: this.checkColorContrast(content),
      responsiveDesign: this.checkResponsiveDesign(content),
      focusStyles: this.checkFocusStyles(content),
    };

    this.results.cssFiles.push(analysis);
    return analysis;
  }

  // Vérifier le contraste des couleurs
  checkColorContrast(content) {
    const issues = [];
    let score = 100;

    // Rechercher les couleurs claires sur fond clair
    const lightColors = content.match(/#[f-f][f-f][f-f]|white|#fff/gi);
    const darkColors = content.match(/#[0-3][0-3][0-3]|black|#000/gi);

    if (lightColors && !darkColors) {
      issues.push('Beaucoup de couleurs claires - vérifier le contraste');
      score -= 20;
    }

    // Vérifier les couleurs uniquement (sans autre indication)
    const colorOnlyRules = content.match(/color:\s*[^;]*;(?![^}]*border|background)/g);
    if (colorOnlyRules && colorOnlyRules.length > 5) {
      issues.push('Information transmise uniquement par la couleur');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier le design responsive
  checkResponsiveDesign(content) {
    const issues = [];
    let score = 100;

    const mediaQueries = (content.match(/@media/g) || []).length;
    if (mediaQueries === 0) {
      issues.push('Aucune media query trouvée');
      score -= 40;
    } else if (mediaQueries < 3) {
      issues.push('Peu de media queries - responsive limité');
      score -= 20;
    }

    // Vérifier les unités fixes
    const fixedUnits = (content.match(/\d+px/g) || []).length;
    const relativeUnits = (content.match(/\d+(em|rem|%|vw|vh)/g) || []).length;

    if (fixedUnits > relativeUnits * 2) {
      issues.push("Usage excessif d'unités fixes (px)");
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier les styles de focus
  checkFocusStyles(content) {
    const issues = [];
    let score = 100;

    const focusRules = (content.match(/:focus/g) || []).length;
    const outlineNone = (content.match(/outline:\s*none/g) || []).length;

    if (focusRules === 0) {
      issues.push('Aucun style :focus personnalisé');
      score -= 30;
    }

    if (outlineNone > 0 && focusRules <= outlineNone) {
      issues.push('outline:none sans alternative focus');
      score -= 40;
    }

    // Vérifier :focus-visible
    const focusVisible = (content.match(/:focus-visible/g) || []).length;
    if (focusVisible === 0) {
      issues.push(':focus-visible non utilisé (navigation clavier)');
      score -= 20;
    }

    return { score: Math.max(0, score), issues };
  }

  // Analyser les fichiers JavaScript pour fonctionnalités accessibles
  analyzeJS(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    const analysis = {
      file: fileName,
      keyboardSupport: this.checkKeyboardSupport(content),
      ariaManagement: this.checkAriaManagement(content),
      screenReaderSupport: this.checkScreenReaderSupport(content),
    };

    this.results.jsFiles.push(analysis);
    return analysis;
  }

  // Vérifier le support clavier
  checkKeyboardSupport(content) {
    const issues = [];
    let score = 100;

    const keyboardEvents = (content.match(/(keydown|keyup|keypress)/g) || []).length;
    const clickEvents = (content.match(/(click|onclick)/g) || []).length;

    if (clickEvents > 0 && keyboardEvents < clickEvents * 0.3) {
      issues.push("Beaucoup d'événements click sans équivalent clavier");
      score -= 30;
    }

    // Vérifier tabindex
    const tabIndexUsage = (content.match(/tabIndex|tabindex/g) || []).length;
    if (tabIndexUsage === 0) {
      issues.push('Aucune gestion de tabindex');
      score -= 20;
    }

    // Vérifier focus()
    const focusCalls = (content.match(/\.focus\(\)/g) || []).length;
    if (focusCalls === 0) {
      issues.push('Aucun appel à focus() pour navigation');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier la gestion ARIA dynamique
  checkAriaManagement(content) {
    const issues = [];
    let score = 100;

    const ariaUpdates = (content.match(/setAttribute.*aria-/g) || []).length;
    if (ariaUpdates === 0) {
      issues.push('Aucune mise à jour dynamique ARIA');
      score -= 25;
    }

    // Vérifier aria-live
    const ariaLive = (content.match(/aria-live/g) || []).length;
    if (ariaLive === 0) {
      issues.push('Aucune région aria-live pour annonces');
      score -= 20;
    }

    return { score: Math.max(0, score), issues };
  }

  // Vérifier le support lecteur d'écran
  checkScreenReaderSupport(content) {
    const issues = [];
    let score = 100;

    // Vérifier sr-only ou visually-hidden
    const srOnly = (content.match(/(sr-only|visually-hidden|screen-reader)/g) || []).length;
    if (srOnly === 0) {
      issues.push("Aucun texte caché pour lecteurs d'écran");
      score -= 30;
    }

    // Vérifier announce ou speak
    const announcements = (content.match(/(announce|speak|aria-live)/g) || []).length;
    if (announcements === 0) {
      issues.push("Aucun système d'annonce vocal");
      score -= 25;
    }

    return { score: Math.max(0, score), issues };
  }

  // Calculer le score global et générer le rapport
  generateReport() {
    console.log("🔍 AUDIT D'ACCESSIBILITÉ LEAPMULTIX\n");
    console.log('📊 ANALYSE DES FICHIERS :');
    // eslint-disable-next-line security/detect-object-injection
    const htmlCount = Number(this.results.htmlFiles.length || 0); // Safe: numeric count, not HTML content
    console.log(`- ${htmlCount} fichiers HTML analysés`);
    console.log(`- ${this.results.cssFiles.length} fichiers CSS analysés`);
    console.log(`- ${this.results.jsFiles.length} fichiers JS analysés\n`);

    // Calculer scores par catégorie
    this.calculateCategoryScores();

    // Afficher scores
    console.log("🎯 SCORES D'ACCESSIBILITÉ :");
    Object.entries(this.results.accessibility).forEach(([category, data]) => {
      const status = data.score >= 80 ? '✅' : data.score >= 60 ? '⚠️' : '❌';
      console.log(`${status} ${category}: ${data.score}/100`);
    });

    // Score global
    const globalScore =
      Object.values(this.results.accessibility).reduce((sum, cat) => sum + cat.score, 0) /
      Object.keys(this.results.accessibility).length;

    console.log(`\n🏆 SCORE GLOBAL: ${Math.round(globalScore)}/100`);

    // Recommandations prioritaires
    this.generateRecommendations();

    // Sauvegarde rapport
    this.saveReport(globalScore);

    return globalScore;
  }

  calculateCategoryScores() {
    // HTML Sémantique
    const semanticScores = this.results.htmlFiles.map(f => (f.semantic || {}).score || 0);
    this.results.accessibility.semanticHTML.score =
      semanticScores.length > 0
        ? Math.round(semanticScores.reduce((a, b) => a + b, 0) / semanticScores.length)
        : 0;

    // ARIA
    const ariaScores = this.results.htmlFiles.map(f => f.ariaLabels.score);
    this.results.accessibility.ariaLabels.score =
      ariaScores.length > 0
        ? Math.round(ariaScores.reduce((a, b) => a + b, 0) / ariaScores.length)
        : 0;

    // Contraste
    const contrastScores = this.results.cssFiles.map(f => f.colorContrast.score);
    this.results.accessibility.colorContrast.score =
      contrastScores.length > 0
        ? Math.round(contrastScores.reduce((a, b) => a + b, 0) / contrastScores.length)
        : 0;

    // Focus
    const focusScores = this.results.cssFiles.map(f => f.focusStyles.score);
    this.results.accessibility.focusManagement.score =
      focusScores.length > 0
        ? Math.round(focusScores.reduce((a, b) => a + b, 0) / focusScores.length)
        : 0;

    // Clavier
    const keyboardScores = this.results.jsFiles.map(f => f.keyboardSupport.score);
    this.results.accessibility.keyboardNavigation.score =
      keyboardScores.length > 0
        ? Math.round(keyboardScores.reduce((a, b) => a + b, 0) / keyboardScores.length)
        : 0;

    // Lecteur d'écran
    const srScores = this.results.jsFiles.map(f => f.screenReaderSupport.score);
    this.results.accessibility.screenReader.score =
      srScores.length > 0 ? Math.round(srScores.reduce((a, b) => a + b, 0) / srScores.length) : 0;
  }

  generateRecommendations() {
    console.log('\n🎯 RECOMMANDATIONS PRIORITAIRES :');

    if (this.results.accessibility.semanticHTML.score < 70) {
      console.log('1. 🏗️ Améliorer HTML sémantique (nav, main, section, article)');
    }

    if (this.results.accessibility.ariaLabels.score < 70) {
      console.log('2. 🏷️ Ajouter aria-label, aria-describedby aux contrôles');
    }

    if (this.results.accessibility.keyboardNavigation.score < 70) {
      console.log('3. ⌨️ Implémenter navigation clavier complète');
    }

    if (this.results.accessibility.focusManagement.score < 70) {
      console.log('4. 🎯 Améliorer styles focus et gestion focus()');
    }

    if (this.results.accessibility.screenReader.score < 70) {
      console.log("5. 🗣️ Ajouter support lecteurs d'écran (aria-live, sr-only)");
    }

    if (this.results.accessibility.colorContrast.score < 70) {
      console.log('6. 🎨 Vérifier/améliorer contraste des couleurs');
    }
  }

  saveReport(globalScore) {
    const reportPath = 'analysis/accessibility-audit.json';
    const htmlCount =
      // eslint-disable-next-line security/detect-object-injection
      this.results.htmlFiles && this.results.htmlFiles.length ? this.results.htmlFiles.length : 0;
    const cssCount =
      this.results.cssFiles && this.results.cssFiles.length ? this.results.cssFiles.length : 0;
    const jsCount =
      this.results.jsFiles && this.results.jsFiles.length ? this.results.jsFiles.length : 0;
    const summary = {
      date: new Date().toISOString(),
      globalScore: Math.round(globalScore),
      scores: this.results.accessibility,
      files: {
        htmlCount,
        cssCount,
        jsCount,
      },
      topIssues: this.getTopIssues(),
    };

    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    console.log(`\n📄 Rapport détaillé sauvé: ${reportPath}`);
  }

  getTopIssues() {
    const allIssues = [];

    // Collecter toutes les issues
    this.results.htmlFiles.forEach(file => {
      Object.values(file).forEach(analysis => {
        if (analysis.issues) {
          allIssues.push(...analysis.issues.map(issue => ({ file: file.file, issue })));
        }
      });
    });

    return allIssues.slice(0, 10); // Top 10
  }

  // Méthode principale d'audit
  async runAudit() {
    console.log("🚀 Démarrage audit d'accessibilité...\n");

    // Analyser fichiers HTML
    const htmlFiles = ['index.html'];
    htmlFiles.forEach(file => {
      // eslint-disable-next-line -- file is from predefined htmlFiles array
      if (fs.existsSync(file)) {
        this.analyzeHTML(file);
      }
    });

    // Analyser fichiers CSS principaux
    const cssFiles = ['css/general.css', 'css/arcade.css', 'css/quiz.css'];
    cssFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.analyzeCSS(file);
      }
    });

    // Analyser fichiers JS principaux
    const jsFiles = ['js/main.js', 'js/userManager.js', 'js/components/topBar.js'];
    jsFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.analyzeJS(file);
      }
    });

    // Générer rapport final
    return this.generateReport();
  }
}

// Exécution si script appelé directement (environnement Node ESM)
if (
  typeof process !== 'undefined' &&
  import.meta &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const auditor = new AccessibilityAuditor();
  auditor
    .runAudit()
    .then(score => {
      console.log(`\n✅ Audit terminé avec score global: ${score}/100`);

      if (score >= 80) {
        console.log('🎉 Excellente accessibilité !');
      } else if (score >= 60) {
        console.log('⚠️ Accessibilité correcte, améliorations possibles');
      } else {
        console.log('🚨 Accessibilité insuffisante, corrections nécessaires');
      }
    })
    .catch(console.error);
}

export { AccessibilityAuditor };
