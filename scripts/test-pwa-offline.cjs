#!/usr/bin/env node
/*
 Simple offline PWA test using Puppeteer.
 - Loads the app online to allow SW installation
 - Toggles offline mode
 - Verifies offline fallback page is served
*/

async function main() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch (e) {
    console.error('\nPuppeteer is not installed. Install it first:');
    console.error('  npm i -D puppeteer');
    process.exitCode = 1;
    return;
  }
  const { launch } = puppeteer.default || puppeteer;

  const baseUrl = process.env.PWA_URL || 'http://localhost:8000';
  const browser = await launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // 1) Online: open app and wait service worker
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  // 2) Check SW installed
  const hasSW = await page.evaluate(() => {
    return 'serviceWorker' in navigator;
  });
  if (!hasSW) throw new Error('Service Worker not supported in page');

  // Give SW some time to activate
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 3) Go offline and navigate
  await page.setOfflineMode(true);
  const res = await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  // 4) Verify offline fallback content
  const text = await page.evaluate(() => document.body.innerText || '');
  if (!/hors ligne|offline/i.test(text)) {
    throw new Error('Offline fallback not detected');
  }

  console.log('✅ Offline fallback detected successfully');
  await browser.close();
}

main().catch(err => {
  console.error('❌ PWA offline test failed:', (err && err.message) || err);
  process.exitCode = 1;
});
