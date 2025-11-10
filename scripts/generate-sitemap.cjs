#!/usr/bin/env node

/**
 * Script de génération automatique du sitemap.xml
 * Génère le sitemap avec la date du jour et le support multilingue
 * Usage: node scripts/generate-sitemap.cjs
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://leapmultix.jls42.org';
const OUTPUT_PATH = path.join(__dirname, '..', 'sitemap.xml');

// Pages à inclure dans le sitemap
const pages = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    languages: ['fr', 'en', 'es'],
  },
  {
    url: '/modes.html',
    changefreq: 'weekly',
    priority: 0.8,
    languages: ['fr', 'en', 'es'],
  },
  {
    url: '/parents.html',
    changefreq: 'weekly',
    priority: 0.7,
    languages: ['fr', 'en', 'es'],
  },
  {
    url: '/pwa.html',
    changefreq: 'weekly',
    priority: 0.6,
    languages: ['fr', 'en', 'es'],
  },
];

// Fonction pour obtenir la date du jour au format YYYY-MM-DD
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Fonction pour générer le sitemap XML
function generateSitemap() {
  const lastmod = getCurrentDate();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  pages.forEach(page => {
    const fullUrl = `${BASE_URL}${page.url}`;

    xml += `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
`;

    // Ajouter les liens multilingues
    if (page.languages && page.languages.length > 0) {
      page.languages.forEach(lang => {
        xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${fullUrl}" />
`;
      });
      // Ajouter x-default
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${fullUrl}" />
`;
    }

    xml += `  </url>
`;
  });

  xml += `</urlset>
`;

  return xml;
}

// Fonction principale
function main() {
  try {
    console.log('🚀 Génération du sitemap.xml...');

    const sitemapContent = generateSitemap();

    // Écrire le fichier
    fs.writeFileSync(OUTPUT_PATH, sitemapContent, 'utf8');

    console.log(`✅ Sitemap généré avec succès : ${OUTPUT_PATH}`);
    console.log(`📅 Date de dernière modification : ${getCurrentDate()}`);
    console.log(`📄 Nombre de pages : ${pages.length}`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap :', error.message);
    process.exit(1);
  }
}

// Exécution
main();
