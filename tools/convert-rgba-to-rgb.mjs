import fs from 'fs';
import path from 'path';

const cssDir = path.resolve('css');

const rgbaRegex =
  /rgba\s*\(\s*([0-9]{1,3}%?)\s*,\s*([0-9]{1,3}%?)\s*,\s*([0-9]{1,3}%?)\s*,\s*([0-9]*\.?[0-9]+%?)\s*\)/g;

function convertRgba(content) {
  return content.replace(rgbaRegex, (_, r, g, b, a) => `rgb(${r} ${g} ${b} / ${a})`);
}

const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
for (const file of files) {
  const filePath = path.join(cssDir, file);
  // eslint-disable-next-line -- filePath is constructed from cssDir and verified .css file name
  const src = fs.readFileSync(filePath, 'utf8');
  const out = convertRgba(src);
  if (out !== src) {
    // eslint-disable-next-line -- filePath is constructed from cssDir and verified .css file name
    fs.writeFileSync(filePath, out, 'utf8');
    console.log(`Updated ${file}`);
  }
}
