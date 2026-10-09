import fs from 'node:fs';
import path from 'node:path';

const cssDir = path.resolve('css');

// Alpha : \d*(?:\.\d+|\d) reconnaît les mêmes nombres que \d*\.?\d+ (« 5 », « .5 », « 0.5 »),
// sans deux répétitions de chiffres côte à côte qui se disputent les mêmes caractères
const rgbaRegex =
  /rgba\s*\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d*(?:\.\d+|\d)%?)\s*\)/g;

function convertRgba(content) {
  return content.replaceAll(rgbaRegex, (_, r, g, b, a) => `rgb(${r} ${g} ${b} / ${a})`);
}

const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
for (const file of files) {
  const filePath = path.join(cssDir, file);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- filePath is constructed from cssDir and verified .css file name
  const src = fs.readFileSync(filePath, 'utf8');
  const out = convertRgba(src);
  if (out !== src) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- filePath is constructed from cssDir and verified .css file name
    fs.writeFileSync(filePath, out, 'utf8');
    console.log(`Updated ${file}`);
  }
}
