import { describe, test, expect, jest } from '@jest/globals';

// Mock i18n.getTranslation to return the key for predictability
jest.unstable_mockModule('../js/i18n.js', () => ({
  getTranslation: k => k,
}));

const { InfoBar } = await import('../js/components/infoBar.js');

describe('ESM: InfoBar labels', () => {
  test('adventure template includes expected label keys', () => {
    const html = InfoBar.createHTML('adventure', {
      score: 0,
      lives: 3,
      progress: '0/10',
      streak: 0,
    });
    expect(html).toContain('data-translate="info_score_label"');
    expect(html).toContain('data-translate="info_lives_label"');
    expect(html).toContain('data-translate="info_progress_label"');
    expect(html).toContain('data-translate="info_streak_label"');
  });
});
/* eslint-env jest, node */
