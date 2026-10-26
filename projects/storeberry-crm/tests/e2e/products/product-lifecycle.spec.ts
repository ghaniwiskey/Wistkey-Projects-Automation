import { test } from '../../fixtures/pages.fixture';
import { uniqueProductName } from '../../utils/test-data';

test.use({ loggedIn: true });

test('SCRM-002: create, update, and terminate a hidden CRM product @regression @writes @final', async ({ productsPage }) => {
  test.skip(
    process.env.SCRM_002_RUN_APPROVED !== 'true' || !process.argv.some((arg) => arg.includes('SCRM-002')),
    'This permanently terminates its test product. Obtain explicit approval, target only SCRM-002, and set SCRM_002_RUN_APPROVED=true for that run.',
  );

  const productName = uniqueProductName();
  const updatedName = `${productName}-UPDATED`;
  // The existing staging scenario uses a nominal HKD 1.00 price; the product is hidden and is never ordered.
  const price = '1.00';
  let lifecycleFinished = false;

  try {
    await test.step('1. Create a uniquely named hidden physical product', async () => {
      await productsPage.goto();
      const categoryAvailable = await productsPage.createHiddenProduct(productName, price);
      test.skip(!categoryAvailable, 'The existing General product category is not available in staging.');
    });

    await test.step('2. Verify saved details and update the product name', async () => {
      await productsPage.openProduct(productName);
      await productsPage.expectProductDetails(productName, price);
      await productsPage.updateProductName(productName, updatedName);
      await productsPage.openProduct(updatedName);
      await productsPage.expectProductDetails(updatedName, price);
    });

    await test.step('3. Terminate the test product and confirm it is no longer active', async () => {
      await productsPage.goto();
      await productsPage.terminateActiveProduct(updatedName);
      await productsPage.openTerminatedProducts();
      await productsPage.expectProductInTerminatedList(updatedName);
    });
    lifecycleFinished = true;
  } finally {
    if (!lifecycleFinished) await productsPage.cleanupActiveTestProduct([productName, updatedName]);
  }
});
