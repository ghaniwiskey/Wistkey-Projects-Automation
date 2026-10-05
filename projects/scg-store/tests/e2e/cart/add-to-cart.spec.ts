import { test, expect } from '../../fixtures/pages.fixture';
import { PRODUCT, credentials } from '../../utils/test-data';

// Test case: qa/scg-store/cases/cart/SCG-001-*.md (the "SCG-001:" title prefix links results to it in the Test Manager).
test.describe('Add to cart', () => {
  // Stock is limited (track_inventory on), so never leave units sitting in the test cart.
  test.afterEach(async ({ cartPage }) => {
    await cartPage.removeProduct(PRODUCT.name).catch(() => {});
  });

  test('SCG-001: logged-in user can search a product and add it to cart @smoke', async ({ loginPage, productPage, cartPage }) => {
    const { email, password } = credentials();
    let countBefore = 0;

    await test.step('1. Open store', async () => {
      await loginPage.navigate('/');
      await expect(loginPage.searchInput).toBeVisible();
    });

    await test.step('2. Log in', async () => {
      await loginPage.goto();
      await loginPage.login(email, password);
      // Clear leftovers from earlier runs so stock limits can't fail the test.
      await cartPage.removeProduct(PRODUCT.name);
      countBefore = await cartPage.cartCount();
    });

    await test.step(`3. Search "${PRODUCT.name}"`, async () => {
      await loginPage.searchAndOpenProduct(PRODUCT.name);
    });

    await test.step('4. Product page shows the right item', async () => {
      await productPage.expectLoaded(PRODUCT.name);
      await expect(productPage.sku).toContainText(PRODUCT.sku);
    });

    await test.step('5. Add to cart', async () => {
      await productPage.addToCart();
      await expect(productPage.cartBadge).toHaveText(String(countBefore + 1));
    });

    await test.step('6. Item is in the cart', async () => {
      await cartPage.goto();
      await cartPage.expectContains(PRODUCT.name);
    });
  });
});