import { test, expect, QA_PREFIX } from '../../fixtures/pages.fixture';

// Creates a group under the first cost centre the form offers and deletes it again. Leftover groups of
// earlier runs (short name starting with the QA prefix) are deleted before and after.
test.describe('Settings > Group (writes)', () => {
  test.use({ role: 'logs1' });

  test.beforeEach(async ({ groupPage }) => {
    test.slow();
    await groupPage.deleteMatching(QA_PREFIX);
  });

  test.afterEach(async ({ groupPage }) => {
    await groupPage.deleteMatching(QA_PREFIX);
  });

  // Test case: projects/mha-hta/cases/settings/HTA-035-*.md
  test('HTA-035: logs1 creates, edits and deletes a group @regression @writes', async ({ groupPage }) => {
    // Name (Short) allows 25 characters: "QA auto g<base36 time>" stays below that.
    const code = `${QA_PREFIX} g${Date.now().toString(36)}`;
    let costCentre = '';

    await test.step('1. An empty form shows the three required messages', async () => {
      await groupPage.goto();
      await groupPage.openCreate();
      await groupPage.clickSave();
      await expect(groupPage.costCentreRequired).toBeVisible();
      await expect(groupPage.codeRequired).toBeVisible();
      await expect(groupPage.nameRequired).toBeVisible();
    });

    await test.step('2. Create the group under the first cost centre offered', async () => {
      costCentre = await groupPage.firstCostCentre();
      await groupPage.pickCostCentre(costCentre);
      await groupPage.shortName.fill(code);
      await groupPage.longName.fill(`${code} long`);
      expect(await groupPage.save()).toBe('Group has been successfully created.');
      await groupPage.find(code);
      await expect(groupPage.row(code)).toHaveCount(1);
      await expect(groupPage.row(code)).toContainText(costCentre.split(' - ')[0]);
      await expect(groupPage.row(code)).toContainText(`${code} long`);
    });

    await test.step('3. Change Name (Long)', async () => {
      await groupPage.open(code);
      await expect(groupPage.longName).toHaveValue(`${code} long`);
      await groupPage.longName.fill(`${code} edited`);
      expect(await groupPage.save()).toBe('Group has been successfully updated.');
      await groupPage.find(code);
      await expect(groupPage.row(code)).toContainText(`${code} edited`);
    });

    await test.step('4-5. Delete it after the confirmation; the search finds nothing', async () => {
      await groupPage.open(code);
      const [asked, message] = await groupPage.delete();
      expect(asked).toContain('Are you sure?');
      expect(message).toBe('Group has been successfully deleted');
      await groupPage.find(code);
      await expect(groupPage.info).toHaveText('Showing no records');
    });
  });
});
