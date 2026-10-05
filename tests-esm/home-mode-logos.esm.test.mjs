import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';

describe('logos des modes sur l’accueil', () => {
  test('chaque bouton de mode a un PNG versionné comme source', () => {
    const html = readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    const buttons = [...html.matchAll(/data-mode="([^"]+)"[\s\S]*?<img([\s\S]*?)\/>/g)];
    const modes = buttons.map(match => match[1]);
    expect(modes).toEqual(['discovery', 'quiz', 'challenge', 'adventure', 'arcade', 'chrono']);
    for (const match of buttons) {
      const attrs = match[2];
      const src = attrs.match(/\ssrc="([^"]+)"/)?.[1];
      expect(src).toMatch(/^assets\/images\/arcade\/logo_mode_.+\.png$/);
      expect(existsSync(src)).toBe(true);
      expect(attrs).not.toMatch(/\ssrcset="/);
    }
  });
});
