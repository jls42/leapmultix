import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import { launch as launchChrome } from 'chrome-launcher';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SEO_REPORT_BASE_URL || 'https://leapmultix.jls42.org';
const REPORT_DIR = path.join(__dirname, '..', 'analysis', 'seo-reports');

const pages = [
  { slug: 'home', label: 'Accueil SPA', path: '/' },
  { slug: 'modes', label: 'Page statique Modes', path: '/modes.html' },
  { slug: 'parents', label: 'Page statique Parents', path: '/parents.html' },
  { slug: 'pwa', label: 'Page statique PWA', path: '/pwa.html' },
];

const resolveUrl = pagePath => {
  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  if (pagePath === '/' || pagePath === '') {
    return base || '/';
  }
  return `${base}${pagePath}`;
};

const formatScore = category => {
  if (!category || typeof category.score !== 'number') {
    return 'N/A';
  }
  return String(Math.round(category.score * 100));
};

async function ensureReportDirectory() {
  await fs.mkdir(REPORT_DIR, { recursive: true });
}

async function runAudit(page) {
  const url = resolveUrl(page.path);
  console.log(`\n🚀 Audit Lighthouse : ${page.label} (${url})`);

  const chrome = await launchChrome({
    chromeFlags: ['--headless=new', '--no-sandbox'],
  });

  try {
    const options = {
      logLevel: 'error',
      output: 'json',
      port: chrome.port,
    };

    const runnerResult = await lighthouse(url, options);
    const { lhr, report } = runnerResult;
    const reportPath = path.join(REPORT_DIR, `${page.slug}.json`);

    await fs.writeFile(reportPath, report, 'utf8');

    const { categories } = lhr;
    console.log(`  Performance       : ${formatScore(categories.performance)}`);
    console.log(`  Accessibilité     : ${formatScore(categories.accessibility)}`);
    console.log(`  Bonnes pratiques  : ${formatScore(categories['best-practices'])}`);
    console.log(`  SEO               : ${formatScore(categories.seo)}`);
    if (categories.pwa) {
      console.log(`  PWA               : ${formatScore(categories.pwa)}`);
    }
    console.log(`  → Rapport JSON : ${reportPath}`);
  } finally {
    await chrome.kill();
  }
}

async function main() {
  await ensureReportDirectory();
  for (const page of pages) {
    // eslint-disable-next-line no-await-in-loop -- audits doivent être séquentiels pour éviter les conflits de port
    await runAudit(page);
  }
  console.log(`\n✅ Rapports enregistrés dans ${REPORT_DIR}`);
  console.log('ℹ️  Définissez SEO_REPORT_BASE_URL pour auditer un environnement spécifique.');
}

try {
  await main();
} catch (error) {
  console.error('❌ Échec du rapport SEO :', error);
  process.exit(1);
}
