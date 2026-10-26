import { test } from '../../fixtures/pages.fixture';
import { uniqueNoMatchQuery } from '../../utils/test-data';

// Customer records contain personal details; keep trace and screenshot artifacts disabled.
test.use({ loggedIn: true, trace: 'off', screenshot: 'off' });

test('SCRM-004: CRM customer list loads with search controls @regression', async ({ customersPage }) => {
  await test.step('1. Open the customer list and confirm it loads', async () => {
    await customersPage.goto();
  });
  await test.step('2. Confirm member and remark search controls are available', async () => {
    await customersPage.expectSearchControls();
  });
  await test.step('3. Search for a unique value that should not match a customer', async () => {
    await customersPage.searchForNoMatch(uniqueNoMatchQuery());
  });
});
