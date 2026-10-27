import { test, expect, isoDate, listDate, unique } from '../../fixtures/pages.fixture';
import type { Announcement } from '@shared/mha-ats/pages/settings-admin.page';

// Agency Admin settings. Each write test edits an existing record found at runtime and puts the original
// values back (announcements cannot be deleted; cost centres and templates are shared by every user).
test.describe('Settings (Agency Admin)', () => {
  test.use({ role: 'agency-admin' });

  test.describe('announcement (writes)', () => {
    let formUrl: string | undefined;
    let original: Announcement | undefined;

    test.afterEach(async ({ announcementPage }) => {
      if (!formUrl || !original) return;
      await announcementPage.openForm(formUrl);
      if ((await announcementPage.content.inputValue()) !== original.content) await announcementPage.save(original);
    });

    // Test case: projects/mha-hta/cases/settings/HTA-049-*.md
    test('HTA-049: a header announcement for today shows on the login page @regression @writes', async ({ announcementPage, otherSession }) => {
      test.slow();
      const content = unique('announcement');
      const today = new Date();

      await test.step('1. Open the first HEADER announcement that has ended', async () => {
        formUrl = await announcementPage.openFirstEndedHeader();
        test.skip(!formUrl, 'No HEADER announcement has ended (the test reuses one: announcements cannot be deleted)');
        original = await announcementPage.read();
      });

      await test.step('2. Set the QA content for today only', async () => {
        expect(await announcementPage.save({ content, start: isoDate(today), end: isoDate(today) })).toBe('Announcement has been updated.');
        await announcementPage.goto();
        await expect(announcementPage.row('HEADER', listDate(today), listDate(today))).toHaveCount(1);
      });

      await test.step('3. The login page (logged-out session) shows the banner', async () => {
        await otherSession.loginPage.goto();
        await expect(otherSession.loginPage.announcement(content)).toBeVisible();
      });

      await test.step('4. Put the original back: the banner is gone', async () => {
        await announcementPage.openForm(formUrl as string);
        expect(await announcementPage.save(original as Announcement)).toBe('Announcement has been updated.');
        await otherSession.loginPage.goto();
        await expect(otherSession.loginPage.announcement(content)).toHaveCount(0);
      });
    });
  });

  test.describe('cost centre', () => {
    let formUrl: string | undefined;
    let building: string | undefined;

    test.afterEach(async ({ costCentrePage }) => {
      if (!formUrl || building === undefined) return;
      await costCentrePage.openForm(formUrl);
      if ((await costCentrePage.building.inputValue()) !== building) {
        await costCentrePage.building.fill(building);
        await costCentrePage.save();
      }
    });

    // Test case: projects/mha-hta/cases/settings/HTA-050-*.md
    test('HTA-050: agency admin updates a cost centre and name is required @regression @writes', async ({ costCentrePage }) => {
      const code = await costCentrePage.firstCode();
      const changed = 'QA';

      await test.step(`1. Open cost centre ${code}: the code is read-only`, async () => {
        formUrl = await costCentrePage.open(code);
        building = await costCentrePage.building.inputValue();
        await expect(costCentrePage.code).not.toBeEditable();
      });

      await test.step('2. An empty Name is refused', async () => {
        await costCentrePage.name.fill('');
        await costCentrePage.clickSave();
        await expect(costCentrePage.nameRequired).toBeVisible();
        await expect(costCentrePage.alert).toBeHidden();
        await costCentrePage.reloadForm();
        await expect(costCentrePage.name).not.toHaveValue('');
      });

      await test.step('3-4. Building change is saved', async () => {
        await costCentrePage.building.fill(`${building} ${changed}`.trim());
        expect(await costCentrePage.save()).toBe('Cost Center has been successfully updated.');
        await costCentrePage.reloadForm();
        await expect(costCentrePage.building).toHaveValue(`${building} ${changed}`.trim());
      });

      await test.step('5. Put the original Building back', async () => {
        await costCentrePage.building.fill(building as string);
        expect(await costCentrePage.save()).toBe('Cost Center has been successfully updated.');
        await costCentrePage.reloadForm();
        await expect(costCentrePage.building).toHaveValue(building as string);
      });
    });

    // Test case: projects/mha-hta/cases/settings/HTA-051-*.md
    test('HTA-051: cost centre search finds a cost centre by its description @regression', async ({ costCentrePage }) => {
      const code = await costCentrePage.firstCode();
      let description = '';

      await test.step(`1. Read the description of ${code}`, async () => {
        await costCentrePage.open(code);
        description = await costCentrePage.description.inputValue();
        expect(description).toMatch(/\S/);
      });

      await test.step('2. Searching the code lists it', async () => {
        await costCentrePage.goto();
        await costCentrePage.search(code);
        await expect(costCentrePage.row(code)).toHaveCount(1);
      });

      await test.step(`3. Searching the description "${description}" lists it (BUG-001)`, async () => {
        test.fail(true, 'BUG-001: the Cost Centre keyword box does not match descriptions (also mha-spf BUG-012)');
        await costCentrePage.search(description);
        await expect(costCentrePage.row(code)).toHaveCount(1);
      });
    });
  });

  test.describe('email template (writes)', () => {
    let formUrl: string | undefined;
    let remarks: string | undefined;

    test.afterEach(async ({ emailTemplatePage }) => {
      if (!formUrl || remarks === undefined) return;
      await emailTemplatePage.openForm(formUrl);
      if ((await emailTemplatePage.remarks.inputValue()) !== remarks) {
        await emailTemplatePage.remarks.fill(remarks);
        await emailTemplatePage.save();
      }
    });

    // Test case: projects/mha-hta/cases/settings/HTA-052-*.md
    test('HTA-052: agency admin updates an email template and subject is required @regression @writes', async ({ emailTemplatePage }) => {
      const note = unique('remark');
      let subject = '';

      await test.step('1. Open the first template', async () => {
        formUrl = await emailTemplatePage.openFirst();
        remarks = await emailTemplatePage.remarks.inputValue();
        subject = await emailTemplatePage.subject.inputValue();
      });

      await test.step('2. An empty Email Subject is refused', async () => {
        await emailTemplatePage.subject.fill('');
        await emailTemplatePage.clickSave();
        await expect(emailTemplatePage.subjectRequired).toBeVisible();
        await expect(emailTemplatePage.alert).toBeHidden();
        await emailTemplatePage.reloadForm();
        await expect(emailTemplatePage.subject).toHaveValue(subject);
      });

      await test.step('3-4. Remarks change is saved, Subject unchanged', async () => {
        await emailTemplatePage.remarks.fill(note);
        expect(await emailTemplatePage.save()).toBe('Email template has been saved.');
        await emailTemplatePage.reloadForm();
        await expect(emailTemplatePage.remarks).toHaveValue(note);
        await expect(emailTemplatePage.subject).toHaveValue(subject);
      });

      await test.step('5. Put the original Remarks back', async () => {
        await emailTemplatePage.remarks.fill(remarks as string);
        expect(await emailTemplatePage.save()).toBe('Email template has been saved.');
        await emailTemplatePage.reloadForm();
        await expect(emailTemplatePage.remarks).toHaveValue(remarks as string);
      });
    });
  });
});
