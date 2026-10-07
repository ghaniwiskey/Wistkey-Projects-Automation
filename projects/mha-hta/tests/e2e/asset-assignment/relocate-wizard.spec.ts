import { test, expect } from '../../fixtures/pages.fixture';

// Test case: projects/mha-hta/cases/asset-assignment/HTA-007-*.md
// Read-only: walks the wizard to the location step and leaves without Submit (no transaction, no email).
// Uses the first asset in the Relocate > Choose Asset list (only selectable assets are listed).
test.describe('Asset Assignment', () => {
  test.use({ role: 'logs1' });

  test('HTA-007: logs1 walks the relocate wizard up to the location step @smoke', async ({ assignmentPage, assignmentCreatePage }) => {
    await test.step('1. Open Asset > Assignment', async () => {
      await assignmentPage.goto();
      await expect(assignmentPage.createButton).toBeVisible();
    });

    await test.step('2. Create opens the Start step', async () => {
      await assignmentPage.create();
      await assignmentCreatePage.expectStart();
      await expect(assignmentCreatePage.typeRadio('Assign')).toBeChecked();
      await expect(assignmentCreatePage.typeRadio('Relocate')).toBeVisible();
      await expect(assignmentCreatePage.typeRadio('Assign & Relocate')).toBeVisible();
    });

    await test.step('3. Relocate > Choose Asset', async () => {
      await assignmentCreatePage.chooseType('Relocate');
      await expect(assignmentCreatePage.selectedCount).toHaveText(/^\s*0\s*asset\(s\) selected/);
    });

    let asset = { id: '', group: '' };
    await test.step('4. Select the first asset in the list', async () => {
      asset = await assignmentCreatePage.firstChooseAsset();
      await assignmentCreatePage.searchAsset(asset.id);
      await assignmentCreatePage.selectAsset(asset.id);
      await expect(assignmentCreatePage.selectedCount).toHaveText(/^\s*1\s*asset\(s\) selected/);
      await assignmentCreatePage.next();
    });

    await test.step('Review lists exactly the selected asset', async () => {
      await expect(assignmentCreatePage.stepHeading('Relocate - Review')).toBeVisible();
      await expect(assignmentCreatePage.reviewRows).toHaveCount(1);
      await expect(assignmentCreatePage.reviewRows.first()).toContainText(`Asset ID: ${asset.id}`);
    });

    await test.step('5. Location step is prefilled with the current location', async () => {
      await assignmentCreatePage.next();
      await expect(assignmentCreatePage.locationPanel).toBeVisible();
      await expect(assignmentCreatePage.locationGroup).toHaveText(asset.group);
      await expect(assignmentCreatePage.locationPostalCode).toHaveText(/\d{6}/);
      await expect(assignmentCreatePage.submitButton).toBeVisible();
    });
    // Not submitting: leaving the page abandons the wizard.
  });
});
