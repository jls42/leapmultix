/**
 * @jest-environment node
 *
 * Rapatriement du bucket (pull-from-s3.sh, scripts/check-s3-copy.mjs) : la copie que deploy.sh
 * publie, une fois ses changements défaits, est celle des fichiers suivis de HEAD ; un module
 * modifié dans le bucket, un fichier inconnu de git ou un lien arrêtent tout, et rien n'est
 * écrit dans le dépôt. Seules les images générées (ignorées par git) sont reprises.
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  compareWithGit,
  restoreDeployMetas,
  undoDeployChanges,
} from '../../scripts/check-s3-copy.mjs';
import { versionSite } from '../../scripts/version-module-urls.mjs';

const FAKE_AWS = path.resolve('tests-esm/scripts/fake-aws.cjs');
/**
 * Fichiers texte que deploy.sh publie, dont ceux qu'il transforme (index.html, js/) : les
 * images, que le déploiement ne touche pas, passent par la même comparaison d'empreintes
 * (l'archive complète ferait 870 Mo)
 */
const TEXT_PUBLISHED = [
  'index.html',
  'parents.html',
  'modes.html',
  'pwa.html',
  'offline.html',
  'sw.js',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'css',
  'js',
  'assets/translations',
];
const IMAGE = 'assets/generated-images/essai/image-64.webp';

let tmp;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-s3-copy-'));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

function write(dir, file, content) {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  fs.writeFileSync(path.join(dir, file), content);
}

/** Ce que deploy.sh fait à une copie du site : domaine Plausible, voix, versions */
function deployChanges(copy) {
  const page = path.join(copy, 'index.html');
  const html = fs
    .readFileSync(page, 'utf8')
    .replaceAll('{{PLAUSIBLE_DOMAIN}}', 'jeu.exemple.org')
    .replace(
      '<meta name="leapmultix-voice-base" content="" />',
      '<meta name="leapmultix-voice-base" content="/voice/" />'
    );
  fs.writeFileSync(page, html);
  const source = fs.readFileSync(path.join(copy, 'js/cache-updater.js'), 'utf8');
  const version = /^export const APP_VERSION = '([^']*)';$/m.exec(source)[1];
  versionSite(copy, version);
}

describe('copie du dépôt réel', () => {
  let copy;
  let published;

  beforeEach(() => {
    // Fichiers de HEAD, pas de l'arbre de travail : une modification en cours ne compte pas
    copy = path.join(tmp, 'copie');
    fs.mkdirSync(copy);
    const present = TEXT_PUBLISHED.filter(entry => fs.existsSync(entry));
    const archive = execFileSync('git', ['archive', '--format=tar', 'HEAD', '--', ...present], {
      maxBuffer: 64 * 1024 * 1024,
    });
    execFileSync('tar', ['-x', '-C', copy], { input: archive });
    published = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', '--', ...present], {
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean);
    deployChanges(copy);
    write(copy, IMAGE, 'image générée');
  });

  test('déployée puis défaite : identique à HEAD, fichier par fichier', () => {
    expect(fs.readFileSync(path.join(copy, 'index.html'), 'utf8')).toContain('?v=');
    undoDeployChanges(copy);
    const result = compareWithGit(copy);
    expect(result.different).toEqual([]);
    expect(result.refused).toEqual([]);
    expect(result.restorable).toEqual([IMAGE]);
    expect(result.same.sort()).toEqual(published.sort());
  });

  test('module modifié, fichier inconnu de git, nom piégé : refusés', () => {
    fs.appendFileSync(path.join(copy, 'js/userManager.js'), '\n// ajout\n');
    write(copy, 'js/temoin.test.mjs', 'export {};\n');
    write(copy, 'js/node_modules/paquet/index.js', 'export {};\n');
    write(copy, 'js/ligne\nautre.js', 'export {};\n');
    undoDeployChanges(copy);
    const result = compareWithGit(copy);
    expect(result.different).toEqual(['js/userManager.js']);
    expect(result.refused.sort()).toEqual(
      ['js/ligne\nautre.js', 'js/node_modules/paquet/index.js', 'js/temoin.test.mjs'].sort()
    );
    expect(result.restorable).toEqual([IMAGE]);
  });

  test('lien, même vers un contenu identique ou parmi les images : refusé', () => {
    undoDeployChanges(copy);
    // Un fichier suivi remplacé par un lien vers une copie identique, hors de la copie
    const tracked = path.join(copy, 'js/core/utils.js');
    fs.copyFileSync(tracked, path.join(tmp, 'utils-identique.js'));
    fs.rmSync(tracked);
    fs.symlinkSync(path.join(tmp, 'utils-identique.js'), tracked);
    write(tmp, 'secret.txt', 'secret du poste');
    fs.symlinkSync(
      path.join(tmp, 'secret.txt'),
      path.join(copy, 'assets/generated-images/lien.webp')
    );
    const result = compareWithGit(copy);
    expect(result.refused.sort()).toEqual(
      ['assets/generated-images/lien.webp', 'js/core/utils.js'].sort()
    );
    expect(result.restorable).toEqual([IMAGE]);
  });
});

test('balises de déploiement remises comme dans le dépôt', () => {
  const html = [
    '<meta name="leapmultix-voice-base" content="/voice/" />',
    '<meta name="plausible-domain" content="jeu.exemple.org" />',
  ].join('\n');
  expect(restoreDeployMetas(html)).toBe(
    [
      '<meta name="leapmultix-voice-base" content="" />',
      '<meta name="plausible-domain" content="{{PLAUSIBLE_DOMAIN}}" />',
    ].join('\n')
  );
});

describe('pull-from-s3.sh, avec un faux AWS CLI', () => {
  let repo;
  let bucket;

  const SITE = {
    'index.html': [
      '<meta name="leapmultix-voice-base" content="" />',
      '<meta name="plausible-domain" content="{{PLAUSIBLE_DOMAIN}}" />',
      '<script type="module" src="js/main.js"></script>',
      '',
    ].join('\n'),
    'js/main.js': "import { storage } from './core/storage.js';\nexport { storage };\n",
    'js/core/storage.js': 'export const storage = {};\n',
    'js/cache-updater.js': "export const APP_VERSION = 'v7';\n",
    'css/main.css': 'body { color: #123456; }\n',
  };

  function git(...args) {
    return execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
  }

  beforeEach(() => {
    repo = path.join(tmp, 'depot');
    bucket = path.join(tmp, 'bucket');
    for (const [file, content] of Object.entries(SITE)) write(repo, file, content);
    write(repo, '.gitignore', 'assets/generated-images/\nbin/\naws.log\n');
    for (const file of ['pull-from-s3.sh', 'scripts/check-s3-copy.mjs']) {
      write(repo, file, fs.readFileSync(file));
    }
    write(
      repo,
      'scripts/version-module-urls.mjs',
      fs.readFileSync('scripts/version-module-urls.mjs')
    );
    write(repo, 'bin/aws', `#!/bin/sh\nexec "${process.execPath}" "${FAKE_AWS}" "$@"\n`);
    fs.chmodSync(path.join(repo, 'bin/aws'), 0o755);
    git('init', '-q');
    git('add', '.');
    git('-c', 'user.name=Test', '-c', 'user.email=test@example.org', 'commit', '-q', '-m', 'site');
    // Le bucket : ce que deploy.sh publie, plus une image générée
    for (const [file, content] of Object.entries(SITE)) write(bucket, file, content);
    deployChanges(bucket);
    write(bucket, IMAGE, 'image générée');
  });

  function pull(...args) {
    return spawnSync('bash', ['pull-from-s3.sh', '--config', 'absent.config', ...args], {
      cwd: repo,
      encoding: 'utf8',
      env: {
        PATH: `${path.join(repo, 'bin')}${path.delimiter}${process.env.PATH}`,
        HOME: tmp,
        S3_BUCKET: 'bucket-essai',
        AWS_LOG: path.join(repo, 'aws.log'),
        FAKE_S3_DIR: bucket,
      },
    });
  }

  test('bucket conforme : images générées reprises, fichiers suivis intacts', () => {
    const result = pull();
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(repo, IMAGE), 'utf8')).toBe('image générée');
    expect(git('status', '--porcelain')).toBe('');
  });

  test('module modifié dans le bucket : refus, rien n’est écrit', () => {
    fs.appendFileSync(path.join(bucket, 'js/core/storage.js'), 'globalThis.piege = 1;\n');
    const result = pull();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('js/core/storage.js');
    expect(fs.existsSync(path.join(repo, IMAGE))).toBe(false);
    expect(git('status', '--porcelain')).toBe('');
    expect(fs.readFileSync(path.join(repo, 'js/core/storage.js'), 'utf8')).toBe(
      SITE['js/core/storage.js']
    );
  });

  test('fichier inconnu de git dans le bucket : refus, rien n’est écrit', () => {
    write(bucket, 'js/temoin.test.mjs', 'export {};\n');
    const result = pull();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('js/temoin.test.mjs');
    expect(fs.existsSync(path.join(repo, 'js/temoin.test.mjs'))).toBe(false);
    expect(fs.existsSync(path.join(repo, IMAGE))).toBe(false);
  });

  test('lien dans la copie : refus avant toute réécriture, rien n’est écrit', () => {
    // S3 ne connaît pas les liens : le contrôle se voit en appelant le script sur un dossier
    // qui en contient un, vers un module versionné que la réécriture modifierait
    const outside = "import { storage } from './core/storage.js?v=v7';\n";
    write(tmp, 'ailleurs/main.js', outside);
    const copy = path.join(tmp, 'copie-avec-lien');
    write(copy, 'js/cache-updater.js', SITE['js/cache-updater.js']);
    write(copy, 'index.html', SITE['index.html']);
    fs.symlinkSync(path.join(tmp, 'ailleurs/main.js'), path.join(copy, 'js/main.js'));
    const result = spawnSync(process.execPath, ['scripts/check-s3-copy.mjs', copy, '--restore'], {
      cwd: repo,
      encoding: 'utf8',
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('js/main.js');
    expect(fs.readFileSync(path.join(tmp, 'ailleurs/main.js'), 'utf8')).toBe(outside);
  });

  test('--dry-run : l’option de l’AWS CLI (--dryrun), rien n’est écrit', () => {
    const result = pull('--dry-run');
    expect(result.status).toBe(0);
    const calls = fs
      .readFileSync(path.join(repo, 'aws.log'), 'utf8')
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));
    const sync = calls.find(call => call.command === 's3 sync');
    expect(sync.args).toContain('--dryrun');
    expect(sync.args).not.toContain('--dry-run');
    expect(fs.existsSync(path.join(repo, IMAGE))).toBe(false);
  });
});
