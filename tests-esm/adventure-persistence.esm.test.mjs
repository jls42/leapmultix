import { describe, test, expect, beforeAll, jest } from '@jest/globals';

// Mock UserState to avoid depending on full UserManager/Storage stack
const userStore = {
  preferredOperator: '×',
  adventureProgressByOperator: {},
};
jest.unstable_mockModule('../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => userStore,
    updateUserData: u => Object.assign(userStore, u),
  },
}));

// Import after mocks
const { AdventureMode } = await import('../js/modes/AdventureMode.js');

beforeAll(() => {
  // Minimal DOM container for GameMode base (not strictly required here)
  document.body.innerHTML = '<div id="game"></div>';
});

describe('ESM: Adventure persistence', () => {
  test('saves progress with stars and marks level completed', () => {
    const adv = new AdventureMode();
    adv.currentLevel = adv.adventureLevels[0]; // level id 1
    adv.saveAdventureProgress(3);

    expect(userStore.adventureProgressByOperator).toBeDefined();
    expect(userStore.adventureProgressByOperator['×']).toBeDefined();
    expect(userStore.adventureProgressByOperator['×'][1]).toBeDefined();
    expect(userStore.adventureProgressByOperator['×'][1].stars).toBe(3);
    expect(userStore.adventureProgressByOperator['×'][1].completed).toBe(true);
  });

  test('loads progress and computes total stars', () => {
    const adv2 = new AdventureMode();
    adv2.loadAdventureProgress();
    const total = adv2.calculateTotalStars();
    expect(total).toBeGreaterThanOrEqual(3);
    // level 1 should be marked completed
    expect(adv2.adventureLevels[0].completed).toBe(true);
  });

  test('shows next level button when totalStars meets requirement', () => {
    const adv = new AdventureMode();
    // Simulate current level 1 finished and enough stars to unlock level 2 (requires 2)
    adv.currentLevel = adv.adventureLevels[0];
    adv.totalStars = 3; // >= 2 required for level 2
    const html = adv.getNextLevelButton();
    expect(typeof html).toBe('string');
    expect(html).toContain('data-action="adventure-start-level"');
    expect(html).toContain('data-level="2"');
  });
});
/* eslint-env jest, node */
