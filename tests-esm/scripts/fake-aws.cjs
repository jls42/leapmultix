/**
 * Faux AWS CLI du test de deploy.sh : chaque fichier que la commande enverrait est noté dans
 * le fichier AWS_LOG, une ligne JSON par fichier ({ command, file, contentType }).
 * `aws s3 sync --size-only` n'envoie rien : le test se place dans le cas où S3 a déjà, pour
 * chaque fichier, un fichier de même taille. Avec FAKE_AWS_FAIL=cp, les copies échouent.
 */
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const note = entry => fs.appendFileSync(process.env.AWS_LOG, `${JSON.stringify(entry)}\n`);

/** Motif d'un filtre de l'AWS CLI : « * » vaut n'importe quelle suite, « / » compris */
function matches(pattern, file) {
  const parts = pattern.split('*').map(part => part.replaceAll(/[.+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${parts.join('.*')}$`).test(file);
}

/** Filtres --exclude et --include, dans l'ordre : le dernier qui s'applique l'emporte */
function kept(file) {
  let keep = true;
  args.forEach((arg, index) => {
    if ((arg === '--exclude' || arg === '--include') && matches(args[index + 1], file)) {
      keep = arg === '--include';
    }
  });
  return keep;
}

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name)).map(file => `${entry.name}/${file}`)
        : [entry.name]
    );
}

const [service, command, source, target] = args;
if (service === 's3' && command === 'cp') {
  if (process.env.FAKE_AWS_FAIL === 'cp') process.exit(1);
  const option = name => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
  const prefix = target.replace(/^s3:\/\/[^/]+\/?/, '');
  const files = args.includes('--recursive')
    ? walk(source)
        .filter(kept)
        .map(file => path.posix.join(prefix, file))
    : [prefix];
  for (const file of files) note({ command, file, contentType: option('--content-type') });
} else {
  note({ command: `${service} ${command}` });
}
