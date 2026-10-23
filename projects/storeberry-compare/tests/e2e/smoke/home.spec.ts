import { test } from '../../fixtures/pages.fixture';

test.describe('Home', () => {
  test('SBF-001: home page loads @smoke', async ({ homePage }) => {
    await test.step('1. Open the home page', async () => {
      await homePage.goto();
    });
    await test.step('2. Page has a title and visible content', async () => {
      await homePage.expectLoaded();
    });
  });
});
