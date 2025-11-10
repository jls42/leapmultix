# Feuille de Route SEO pour LeapMultix - Plan Complet pour IA Développeur

**Version** : 2.0
**Date de création** : 2025-11-09
**Dernière mise à jour** : 2025-11-09
**Statut** : En cours - Phase 1

---

## 📋 CONTEXTE DU PROJET

**Projet** : LeapMultix - Application Web Progressive éducative
**URL Production** : https://leapmultix.jls42.org/
**URL Blog Principal** : https://jls42.org/ (bon référencement existant)
**Repository** : `/home/haxix/git/zoemath/leapmultix/`
**Objectif** : Appliquer les mêmes stratégies SEO que jls42.org pour améliorer le référencement de LeapMultix

**Description** : Application éducative gratuite pour apprendre les tables de multiplication avec 5 modes de jeu, support multilingue (FR/EN/ES), mini-jeux d'arcade et PWA.

---

## 🎯 OBJECTIFS SEO GLOBAUX

1. Atteindre un score Lighthouse SEO de 95-100/100
2. Apparaître dans les rich snippets Google (structured data)
3. Optimiser le partage social (Facebook, Twitter, LinkedIn)
4. Améliorer l'indexation et le crawling (robots.txt, sitemap.xml)
5. Augmenter le CTR depuis les résultats de recherche
6. Créer un maillage interne avec jls42.org

---

## 📊 ÉTAT ACTUEL vs CIBLE

### Ce qui EXISTE déjà ✅

- PWA manifest.json complet
- Favicons multiples
- Meta viewport et theme-color
- Service Worker fonctionnel
- Système i18n (fr/en/es)
- Architecture ES6 modules

### Ce qui MANQUE ❌

- Meta description
- Open Graph tags (Facebook/LinkedIn)
- Twitter Cards
- Structured data JSON-LD
- robots.txt (403 actuellement)
- sitemap.xml (403 actuellement)
- Canonical URL
- Image sociale optimisée (1200x630px)
- Contenu textuel SEO visible
- Performance hints (preload, prefetch)

---

## 🗂️ ARCHITECTURE DU PROJET

```
leapmultix/
├── index.html (SPA principale)
├── manifest.json (PWA)
├── sw.js (Service Worker)
├── js/
│   ├── main.js
│   ├── i18n.js
│   └── core/, modes/, components/
├── css/ (20+ fichiers CSS)
├── assets/
│   ├── icons/ (panda-16.png → panda-512.png)
│   ├── images/
│   └── social/ (À CRÉER pour image 1200x630)
├── translations/
│   ├── fr.json
│   ├── en.json
│   └── es.json
├── scripts/ (scripts npm)
└── tests/
```

---

## 📅 PLAN D'EXÉCUTION EN 3 PHASES

---

# 🚀 PHASE 1 : Quick Wins Immédiats (1-2 jours)

**Objectif** : Mettre en place les fondations SEO essentielles avec impact immédiat

## Tâches Phase 1

### 1.1 Enrichir les Meta Tags de Base dans index.html

**Fichier** : `/home/haxix/git/zoemath/leapmultix/index.html`

**Objectifs** :

- Remplacer le `<title>` existant (ligne ~4) par un titre optimisé SEO
- Ajouter meta description (150-160 caractères)
- Ajouter meta robots avec directives complètes
- Ajouter meta author
- Ajouter canonical URL

**Spécifications** :

- **Title** : 60-70 caractères max, inclure "LeapMultix", "Tables de Multiplication", "Gratuit", "Éducatif"
- **Description** : Mentionner 5 modes de jeu, multilingue FR/EN/ES, CE1-6e, gratuit, open source
- **Robots** : `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
- **Canonical** : `https://leapmultix.jls42.org/`

**Critères de validation** :

- [ ] Title présent et optimisé (curl | grep title)
- [ ] Meta description 150-160 caractères
- [ ] Meta robots avec directives complètes
- [ ] Canonical URL définie

---

### 1.2 Créer l'Image Sociale Optimisée

**Fichier** : `/assets/social/leapmultix-social-card.webp` (À CRÉER)

**Objectifs** :

- Créer une image 1200x630px pour Open Graph/Twitter
- Format WebP ou PNG (< 300 KB)
- Design cohérent avec l'identité visuelle de LeapMultix

**Spécifications techniques** :

- Dimensions : **1200x630 pixels** (exactement, non négociable)
- Format : WebP (préféré) ou PNG
- Poids : < 1 MB (idéalement < 300 KB)
- Qualité : 80-90% si WebP

**Contenu visuel suggéré** :

- Logo panda LeapMultix (180-200px hauteur)
- Titre "LeapMultix" (grande police, lisible)
- Sous-titre "Apprends les tables de multiplication en t'amusant !"
- Badges "5 modes • Gratuit • FR/EN/ES"
- Fond cohérent avec thème app (#0a0a0a + accents)

**Outils disponibles** : Canva, Figma, Photopea, ImageMagick

**Critères de validation** :

- [ ] Fichier créé à `/assets/social/leapmultix-social-card.webp`
- [ ] Dimensions exactes 1200x630px
- [ ] Poids < 300 KB
- [ ] Accessible via URL https://leapmultix.jls42.org/assets/social/leapmultix-social-card.webp

⚠️ **PRIORITÉ HAUTE** : Cette image DOIT être créée AVANT l'étape 1.3

---

### 1.3 Ajouter les Meta Tags Open Graph et Twitter Card

**Fichier** : `/home/haxix/git/zoemath/leapmultix/index.html`

**Objectifs** :

- Optimiser le partage sur Facebook, LinkedIn (Open Graph)
- Optimiser le partage sur Twitter/X (Twitter Cards)
- Ajouter microdata Schema.org (itemprop)

**Spécifications Open Graph** :

- og:type = "website"
- og:url = URL canonique
- og:site_name = "LeapMultix"
- og:title = Version courte du titre
- og:description = Version courte description
- og:image = URL complète de l'image sociale (1200x630)
- og:image:width = "1200"
- og:image:height = "630"
- og:image:alt = Description de l'image
- og:locale = "fr_FR" (principal)
- og:locale:alternate = "en_US" et "es_ES"

**Spécifications Twitter Card** :

- twitter:card = "summary_large_image"
- twitter:site = "@JLSX42"
- twitter:creator = "@JLSX42"
- twitter:url, twitter:title, twitter:description, twitter:image, twitter:image:alt

**Spécifications Schema.org Microdata** :

- itemprop="name", "description", "url", "image"

**Critères de validation** :

- [ ] 11 meta tags Open Graph présents
- [ ] 7 meta tags Twitter Card présents
- [ ] 4 meta itemprop Schema.org présents
- [ ] Image sociale référencée avec URL absolue
- [ ] Handle Twitter correct : @JLSX42

---

### 1.4 Ajouter Structured Data JSON-LD

**Fichier** : `/home/haxix/git/zoemath/leapmultix/index.html`

**Objectifs** :

- Implémenter schema.org WebApplication
- Implémenter schema.org Organization
- Permettre les rich snippets dans Google

**Spécifications WebApplication** :

- @type = "WebApplication"
- applicationCategory = "EducationalApplication"
- operatingSystem = "Web Browser"
- Inclure offers (price: 0, priceCurrency: EUR)
- Inclure author (Person, lien vers jls42.org)
- Inclure inLanguage ["fr-FR", "en-US", "es-ES"]
- Inclure featureList (5 modes, 4 mini-jeux, multilingue, PWA, etc.)
- Inclure aggregateRating (exemple initial)
- Inclure license (AGPL-3.0)

**Spécifications Organization** :

- @type = "Organization"
- Liens sameAs vers GitHub et jls42.org
- founder = Person (jls42)

**Format** : 2 blocs `<script type="application/ld+json">` séparés dans le `<head>`

**Critères de validation** :

- [ ] 2 blocs JSON-LD présents dans <head>
- [ ] WebApplication schema complet
- [ ] Organization schema complet
- [ ] JSON valide (pas d'erreur syntaxe)
- [ ] Validation sur https://validator.schema.org/

---

### 1.5 Créer robots.txt (VERSION RÉVISÉE)

**Fichier** : `/robots.txt` (racine du projet)

**Objectifs** :

- Guider les crawlers des moteurs de recherche
- Référencer le sitemap.xml
- NE PAS bloquer /js/ et /css/ (besoin de Google pour Mobile-Friendly Test)

**Spécifications** :

```
User-agent: *
Allow: /

Disallow: /tests/
Disallow: /scripts/
Disallow: /node_modules/
Disallow: /offline.html

Sitemap: https://leapmultix.jls42.org/sitemap.xml

Crawl-delay: 1
```

**⚠️ IMPORTANT** :

- **NE PAS** inclure `Disallow: /js/` ou `Disallow: /css/`
- Raison : Google en a besoin pour évaluer le rendu (Mobile-Friendly Test, Core Web Vitals)
- Référence : Google Webmaster Guidelines 2015+

**Critères de validation** :

- [ ] Fichier créé à la racine
- [ ] /js/ et /css/ accessibles aux crawlers
- [ ] Sitemap référencé
- [ ] Accessible via https://leapmultix.jls42.org/robots.txt (pas 403)
- [ ] Content-Type: text/plain

---

### 1.6 Créer sitemap.xml avec Support Multilingue

**Fichier** : `/sitemap.xml` (racine du projet)

**Objectifs** :

- Déclarer les URLs du site aux moteurs de recherche
- Supporter les 3 langues (fr/en/es)
- Mettre à jour automatiquement la date de modification

**Spécifications** :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://leapmultix.jls42.org/</loc>
    <lastmod>YYYY-MM-DD (date du jour)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="https://leapmultix.jls42.org/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://leapmultix.jls42.org/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://leapmultix.jls42.org/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://leapmultix.jls42.org/" />
  </url>
</urlset>
```

**⚠️ AUTOMATISATION RECOMMANDÉE** :

- Créer script `/scripts/generate-sitemap.cjs`
- Calculer `lastmod` automatiquement avec `new Date().toISOString().split('T')[0]`
- Ajouter commande npm `build:sitemap`

**Critères de validation** :

- [ ] Fichier XML valide
- [ ] Namespace xmlns correct
- [ ] Date lastmod actuelle (pas hardcodée à 2025-11-09)
- [ ] 4 balises xhtml:link pour multilingue
- [ ] Accessible via https://leapmultix.jls42.org/sitemap.xml
- [ ] Content-Type: application/xml ou text/xml

---

### 1.7 Ajouter Contenu Textuel SEO Visible

**Fichier** : `/home/haxix/git/zoemath/leapmultix/index.html`

**Objectifs** :

- Ajouter 100-150 mots de contenu visible AVANT exécution JS
- Intégrer dans le système i18n existant
- Enrichir avec mots-clés naturels

**Spécifications** :

- Insérer après `<p data-translate="user_selection_desc">` (ligne ~178)
- Utiliser attribut `data-translate="app_intro"`
- Texte français en dur dans HTML (fallback si JS désactivé)
- Style : `margin-top: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;`

**Contenu suggéré** :

- Mentionner "tables de multiplication", "éducatif", "CE1-6e"
- 5 modes de jeu
- Gratuit, multilingue (FR/EN/ES)
- Mini-jeux d'arcade
- 100-150 mots

**Traductions à ajouter** :

- `/translations/fr.json` : clé "app_intro"
- `/translations/en.json` : clé "app_intro"
- `/translations/es.json` : clé "app_intro"

**Critères de validation** :

- [ ] Bloc HTML ajouté dans index.html
- [ ] Texte français visible AVANT exécution JS
- [ ] 3 traductions ajoutées (fr/en/es)
- [ ] 100-150 mots par traduction
- [ ] Mots-clés naturellement intégrés
- [ ] Test avec JS désactivé : texte français visible

---

### 1.8 Ajouter Performance Hints

**Fichier** : `/home/haxix/git/zoemath/leapmultix/index.html`

**Objectifs** :

- Réduire le temps de connexion à Plausible Analytics
- Précharger les ressources critiques pour améliorer LCP
- Améliorer Core Web Vitals

**Spécifications** :
Insérer après `<meta name="theme-color">` (ligne ~9) :

- `<link rel="dns-prefetch" href="https://plausible.io" />`
- `<link rel="preconnect" href="https://plausible.io" crossorigin />`
- `<link rel="preload" href="/assets/icons/panda-512.png" as="image" />`
- `<link rel="preload" href="/assets/social/leapmultix-social-card.webp" as="image" />`

**Critères de validation** :

- [ ] 4 balises de performance ajoutées
- [ ] dns-prefetch et preconnect pour Plausible
- [ ] preload pour logo et image sociale
- [ ] Pas d'erreur console réseau

---

### 1.9 Configuration AWS S3 pour robots.txt et sitemap.xml

**Objectif** : Rendre robots.txt et sitemap.xml accessibles publiquement

**Problème actuel** : 403 Forbidden sur ces fichiers

**Solutions possibles** :

**Option A - AWS CLI** :

```bash
aws s3 cp robots.txt s3://BUCKET_NAME/robots.txt \
  --acl public-read \
  --content-type "text/plain" \
  --cache-control "public, max-age=86400"

aws s3 cp sitemap.xml s3://BUCKET_NAME/sitemap.xml \
  --acl public-read \
  --content-type "application/xml" \
  --cache-control "public, max-age=86400"
```

**Option B - Console AWS S3** :

1. Upload fichiers
2. Permissions → Public read
3. Metadata → Content-Type correct

**Option C - Bucket Policy** :
Ajouter policy permettant GetObject public sur robots.txt et sitemap.xml

**Critères de validation** :

- [ ] https://leapmultix.jls42.org/robots.txt accessible (200 OK)
- [ ] https://leapmultix.jls42.org/sitemap.xml accessible (200 OK)
- [ ] Content-Type correct (text/plain et application/xml)
- [ ] Pas de 403 Forbidden

---

### 1.10 Validation Complète Phase 1

**Objectif** : S'assurer que toutes les optimisations fonctionnent correctement

**Checklist de validation** :

#### A. Structured Data

- [ ] Google Rich Results Test : https://search.google.com/test/rich-results
  - WebApplication schema détecté
  - Organization schema détecté
  - Aucune erreur
- [ ] Schema.org Validator : https://validator.schema.org/
  - JSON-LD valide

#### B. Social Media

- [ ] Facebook Sharing Debugger : https://developers.facebook.com/tools/debug/
  - Image 1200x630 affichée
  - Titre et description corrects
  - Aucun warning
- [ ] Twitter Card Validator : https://cards-dev.twitter.com/validator
  - summary_large_image détecté
  - @JLSX42 présent
  - Image affichée
- [ ] LinkedIn Post Inspector : https://www.linkedin.com/post-inspector/
  - Preview correct

#### C. Technique

- [ ] robots.txt accessible et valide
- [ ] sitemap.xml accessible et valide XML
- [ ] Google Mobile-Friendly Test : https://search.google.com/test/mobile-friendly
  - Page mobile-friendly
  - Ressources CSS/JS accessibles
- [ ] Lighthouse SEO Audit (Chrome DevTools)
  - SEO : 95-100/100
  - Accessibility : 90+/100
  - Performance : 85+/100

#### D. Contenu

- [ ] Test contenu visible sans JS (désactiver JS dans DevTools)
  - Texte app_intro visible en français
- [ ] Test meta tags (curl)
  ```bash
  curl -s https://leapmultix.jls42.org/ | grep -E '<meta|<title|<link rel="canonical"'
  ```

**Critères de succès Phase 1** :

- [ ] 100% des validations A, B, C, D passées
- [ ] Score Lighthouse SEO ≥ 95/100
- [ ] Rich snippets détectés par Google
- [ ] Partage social optimal sur 3 plateformes

---

# 📈 PHASE 2 : Optimisations Avancées (1 semaine)

**Objectif** : Enrichir le contenu SEO et améliorer l'engagement

## Tâches Phase 2

### 2.1 Créer une Page FAQ avec Structured Data

**Fichiers** :

- `/home/haxix/git/zoemath/leapmultix/index.html` (nouvelle slide)
- `/translations/fr.json`, `/en.json`, `/es.json`

**Objectifs** :

- Ajouter slide9 avec FAQ
- Implémenter FAQPage schema.org
- Apparaître dans "People Also Ask" de Google

**Spécifications** :

- Créer div id="slide9" avec style display:none
- Utiliser microdata Schema.org dans le HTML (itemscope, itemprop)
- Minimum 5 questions/réponses
- Questions suggérées :
  1. À quel âge est destiné LeapMultix ?
  2. LeapMultix est-il vraiment gratuit ?
  3. Puis-je utiliser LeapMultix hors ligne ?
  4. Quels sont les modes de jeu disponibles ?
  5. Fonctionne-t-il sur mobile/tablette ?
- Ajouter JSON-LD FAQPage dans <head>
- Ajouter bouton FAQ dans menu principal (slide0)

**Critères de validation** :

- [ ] Slide9 créée et fonctionnelle
- [ ] Microdata Schema.org valide
- [ ] JSON-LD FAQPage dans <head>
- [ ] 5+ questions traduites (fr/en/es)
- [ ] Validation sur Google Rich Results Test

---

### 2.2 Maillage Interne avec jls42.org

**Objectifs** :

- Créer article de blog sur jls42.org présentant LeapMultix
- Ajouter liens bidirectionnels jls42.org ↔ leapmultix

**Spécifications article blog** :

- Titre : "LeapMultix : Mon Nouveau Projet Open Source pour les Tables de Multiplication"
- Contenu : 800-1200 mots
- Inclure : Screenshots, stack technique, lien vers app
- URL canonique vers article
- Backlink de qualité vers https://leapmultix.jls42.org/

**Spécifications LeapMultix** :

- Créer slide "Ressources" ou "À propos"
- Liens vers :
  - Article blog jls42.org
  - Repository GitHub
  - Auteur jls42.org

**Critères de validation** :

- [ ] Article publié sur jls42.org
- [ ] Lien vers LeapMultix présent
- [ ] Slide Ressources créée sur LeapMultix
- [ ] Liens bidirectionnels fonctionnels

---

### 2.3 Optimiser manifest.json pour PWA

**Fichier** : `/manifest.json`

**Objectifs** :

- Ajouter screenshots pour app stores
- Enrichir catégories et metadata

**Spécifications** :

- Ajouter array "screenshots" avec 2 images min :
  - Wide (1920x1080) : Écran d'accueil
  - Narrow (1080x1920) : Mode Arcade mobile
- Vérifier "categories" : ["education", "games", "kids"]
- Ajouter "dir": "ltr", "lang": "fr"
- Icons avec "purpose": "any maskable"

**Critères de validation** :

- [ ] Screenshots créés et ajoutés
- [ ] Manifest valide (Lighthouse PWA audit)
- [ ] Métadonnées complètes

---

### 2.4 Critical CSS Inline (OPTIONNEL - Risqué)

**⚠️ ATTENTION** : Optimisation avancée, tester en environnement de dev d'abord

**Objectif** : Réduire First Contentful Paint

**Spécifications** :

- Extraire CSS critiques (above-the-fold)
- Inline dans <head> via <style>
- Déférer le reste des CSS

**Outil** : npm package "critical"

**Critères de validation** :

- [ ] Tests en environnement de dev OK
- [ ] Aucune régression visuelle
- [ ] FCP amélioré de 10%+

---

# 🎯 PHASE 3 : Stratégie Long Terme (Mensuel)

**Objectif** : Créer des points d'entrée SEO multiples et mesurer l'impact

## Tâches Phase 3

### 3.1 Créer Pages Statiques Dédiées

**Fichiers à créer** :

- `/modes.html` (Présentation 5 modes)
- `/parents.html` (Guide parents/enseignants)
- `/pwa.html` (Pourquoi installer l'app)
- `/privacy.html` (Politique confidentialité)

**Objectifs** :

- Multiplier les points d'entrée SEO
- Cibler des mots-clés spécifiques par page
- Pages 100% crawlables (pas de dépendance JS)

**Spécifications par page** :

- 300-500 mots de contenu unique
- H1 unique avec mot-clé principal
- H2/H3 pour structure
- Reprendre meta tags complets (OG, Twitter, JSON-LD)
- Liens vers app SPA (index.html)
- Navigation cohérente

**Critères de validation** :

- [ ] 4 pages statiques créées
- [ ] Contenu unique et optimisé
- [ ] Meta tags complets par page
- [ ] Lighthouse SEO 95+/100 par page

---

### 3.2 Automatiser Génération du Sitemap

**Fichier** : `/scripts/generate-sitemap.cjs`

**Objectifs** :

- Générer sitemap.xml automatiquement
- Inclure toutes les pages (index + statiques)
- Mettre à jour lastmod automatiquement

**Spécifications** :

- Script Node.js
- Lire liste de pages depuis array
- Calculer date du jour
- Générer XML valide avec xhtml:link multilingue
- Commande npm : `build:sitemap`

**Pages à inclure** :

- / (priority 1.0)
- /modes.html (priority 0.8)
- /parents.html (priority 0.7)
- /pwa.html (priority 0.6)
- /privacy.html (priority 0.5)

**Critères de validation** :

- [ ] Script fonctionnel
- [ ] Génère XML valide
- [ ] Date auto-calculée
- [ ] Toutes pages incluses

---

### 3.3 Google Search Console & Plausible Setup

**Objectifs** :

- Créer propriété Search Console dédiée
- Configurer objectifs Plausible
- Soumettre sitemap

**Actions Search Console** :

1. Ajouter propriété https://leapmultix.jls42.org
2. Vérifier via DNS ou HTML
3. Soumettre sitemap.xml
4. Configurer alertes

**Actions Plausible** :

1. Vérifier domaine configuré (deploy.config)
2. Créer Goals :
   - Création profil utilisateur
   - Lancement mode Quiz
   - Lancement mode Arcade
   - Installation PWA
3. Configurer UTM tracking

**Critères de validation** :

- [ ] Search Console actif
- [ ] Sitemap soumis et indexé
- [ ] Plausible Goals configurés
- [ ] Premiers événements trackés

---

### 3.4 Script SEO Report Automatique

**Fichier** : `/scripts/seo-report.mjs`

**Objectifs** :

- Automatiser audits Lighthouse
- Détecter régressions SEO
- Générer rapports JSON

**Spécifications** :

- Utiliser npm packages : lighthouse, chrome-launcher
- Audit 4 catégories : performance, accessibility, seo, best-practices
- Générer rapport JSON
- Console log des scores
- Commande npm : `seo:report`

**Critères de validation** :

- [ ] Script fonctionnel
- [ ] Rapport JSON généré
- [ ] Scores affichés en console
- [ ] Intégrable au CI/CD

---

### 3.5 Rituel Mensuel d'Optimisation

**Objectif** : Maintenir et améliorer le SEO de manière continue

**Checklist mensuelle** :

#### Semaine 1 : Analyse

- [ ] Consulter Search Console (top 20 requêtes, CTR, positions)
- [ ] Identifier opportunités (requêtes position 5-20 → optimiser pour top 3)
- [ ] Analyser Core Web Vitals

#### Semaine 2 : Contenu

- [ ] Publier 1 article sur jls42.org lié à LeapMultix
- [ ] Mettre à jour FAQ (1-2 nouvelles questions)
- [ ] Enrichir pages statiques (+50-100 mots)

#### Semaine 3 : Technique

- [ ] Run `npm run seo:report`
- [ ] Vérifier scores Lighthouse (objectif : tous ≥ 90)
- [ ] Corriger régressions éventuelles

#### Semaine 4 : Netlinking

- [ ] Contacter 1-2 sites éducatifs pour partenariats
- [ ] Partager sur réseaux sociaux (Twitter @JLSX42, LinkedIn)
- [ ] Créer contenu partageable (infographies, PDF)

**Critères de succès mensuel** :

- [ ] Checklist 100% complétée
- [ ] Au moins 1 article publié
- [ ] Scores Lighthouse maintenus ou améliorés
- [ ] Trafic organique en croissance

---

## 📊 MÉTRIQUES DE SUCCÈS GLOBALES

### Indicateurs Techniques

- [ ] Lighthouse SEO : 95-100/100
- [ ] Lighthouse Performance : 85-100/100
- [ ] Lighthouse Accessibility : 90-100/100
- [ ] Core Web Vitals : Tous "Good"
- [ ] Mobile-Friendly Test : Pass
- [ ] Rich Results : WebApplication + Organization + FAQ détectés

### Indicateurs Business

- [ ] Impressions Google Search : +50% en 3 mois
- [ ] CTR moyen : > 3%
- [ ] Positions moyennes : < 15
- [ ] Partages sociaux : +20% en 3 mois
- [ ] Trafic organique : +30% en 3 mois
- [ ] Backlinks : +5 de qualité en 6 mois

---

## 🔍 RÉFÉRENCES ET BONNES PRATIQUES

### Outils de Validation

1. Google Rich Results Test : https://search.google.com/test/rich-results
2. Facebook Sharing Debugger : https://developers.facebook.com/tools/debug/
3. Twitter Card Validator : https://cards-dev.twitter.com/validator
4. Schema.org Validator : https://validator.schema.org/
5. LinkedIn Post Inspector : https://www.linkedin.com/post-inspector/
6. Google Mobile-Friendly : https://search.google.com/test/mobile-friendly
7. PageSpeed Insights : https://pagespeed.web.dev/

### Documentation Officielle

- Google Search Central : https://developers.google.com/search
- Schema.org : https://schema.org/
- Open Graph Protocol : https://ogp.me/
- Twitter Cards : https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- Web.dev (Core Web Vitals) : https://web.dev/vitals/

### Best Practices 2025

- Ne PAS bloquer /js/ et /css/ dans robots.txt (Google en a besoin)
- Préférer JSON-LD à microdata pour structured data
- Images sociales : 1200x630px (Open Graph optimal)
- Meta description : 150-160 caractères
- Title : 60-70 caractères max
- Contenu visible AVANT exécution JS (crawlabilité)
- Sitemap avec hreflang pour multilingue
- Canonical URL pour éviter duplicate content

---

## 🎯 ORDRE D'EXÉCUTION STRICT

### Phase 1 (Ordre critique)

1. Meta tags base → 2. Image sociale → 3. Meta OG/Twitter → 4. JSON-LD → 5. robots.txt → 6. sitemap.xml → 7. Contenu SEO → 8. Performance hints → 9. AWS S3 → 10. Validation

### Phase 2 (Ordre flexible)

FAQ → Maillage → Manifest → Critical CSS (optionnel)

### Phase 3 (Ordre flexible)

Pages statiques → Script sitemap → Search Console/Plausible → Script SEO report → Rituel mensuel

---

## ✅ CHECKLIST GLOBALE DE PROGRESSION

### Phase 1 - Fondations (1-2 jours)

- [ ] 1.1 Meta tags base
- [ ] 1.2 Image sociale 1200x630
- [ ] 1.3 Meta OG/Twitter
- [ ] 1.4 JSON-LD structured data
- [ ] 1.5 robots.txt
- [ ] 1.6 sitemap.xml
- [ ] 1.7 Contenu SEO visible
- [ ] 1.8 Performance hints
- [ ] 1.9 AWS S3 config
- [ ] 1.10 Validation complète

### Phase 2 - Optimisations (1 semaine)

- [ ] 2.1 FAQ + FAQPage schema
- [ ] 2.2 Maillage jls42.org
- [ ] 2.3 Manifest PWA optimisé
- [ ] 2.4 Critical CSS (optionnel)

### Phase 3 - Long Terme (Mensuel)

- [ ] 3.1 Pages statiques (4)
- [ ] 3.2 Script génération sitemap
- [ ] 3.3 Search Console + Plausible
- [ ] 3.4 Script SEO report
- [ ] 3.5 Rituel mensuel actif

---

## 📝 NOTES IMPORTANTES POUR L'IA DÉVELOPPEUR

1. **Ordre d'exécution** : Respecter strictement l'ordre Phase 1 (1→10) pour éviter dépendances manquantes
2. **Image sociale** : DOIT être créée AVANT les meta OG/Twitter (étape 1.2 avant 1.3)
3. **robots.txt** : NE JAMAIS bloquer /js/ et /css/ (besoin de Google pour Mobile-Friendly Test)
4. **sitemap.xml** : Utiliser date dynamique (script) plutôt que hardcoder la date
5. **Contenu SEO** : Texte brut en HTML = crawlable sans JS (fallback automatique)
6. **Validation** : Chaque phase DOIT être 100% validée avant de passer à la suivante
7. **AWS S3** : Vérifier permissions publiques et Content-Type pour robots/sitemap
8. **Twitter handle** : @JLSX42 (pas @jls42)
9. **Tests** : Toujours tester en environnement de dev avant production
10. **Progressivité** : Phase 1 = quick wins, Phase 2 = optimisations, Phase 3 = stratégie long terme

---

## 📅 HISTORIQUE DES MODIFICATIONS

| Date       | Version | Auteur      | Modifications                                                      |
| ---------- | ------- | ----------- | ------------------------------------------------------------------ |
| 2025-11-09 | 2.0     | Claude Code | Création initiale du plan complet avec feedback développeur junior |

---

**Ce document est auto-suffisant et peut être utilisé dans un contexte vide pour reprendre le projet à tout moment.**
