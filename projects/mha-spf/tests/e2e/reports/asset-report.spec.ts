import { test, expect, readXlsxDownload } from '../../fixtures/pages.fixture';

const REPORT_STATUSES = ['AVAILABLE', 'LOAN', 'MAINTENANCE', 'NEW', 'PROGRESS', 'TRANSFER'];

test.describe('Reports', () => {
  test.use({ role: 'logs1' });

  // Test case: projects/mha-spf/cases/reports/SPF-024-*.md
  test('SPF-024: asset listing (detailed) report filters the unit\'s assets and exports them to excel @regression', async ({ assetReportPage }) => {
    test.slow();
    let asset = { id: '', costCentre: '' };

    await test.step('1. The report lists the unit\'s assets', async () => {
      await assetReportPage.goto();
      expect(await assetReportPage.totalRecords()).toBeGreaterThan(0);
      asset = await assetReportPage.firstRow(); // the asset to search: the first one listed, not a fixed ID
    });

    await test.step('2. Status filter leaves out retired, disposed and rejected', async () => {
      await expect(assetReportPage.statusOptions).toHaveText(REPORT_STATUSES);
    });

    await test.step('3. Search the first listed asset', async () => {
      await assetReportPage.search(asset.id);
      await expect(assetReportPage.rows).toHaveCount(1);
      await expect(assetReportPage.row(asset.id)).toContainText(asset.costCentre);
    });

    await test.step('4. Export has the header and exactly that asset', async () => {
      const { name, rows } = await readXlsxDownload(await assetReportPage.export(), test.info().outputPath());
      expect(name).toMatch(/^AssetListingDetailedReport_\d{14}\.xlsx$/);
      const [header, ...data] = rows;
      expect(header).toEqual(expect.arrayContaining(['Asset ID', 'Asset Description', 'Cost Centre', 'Asset Status']));
      expect(data).toHaveLength(1);
      const cell = (column: string) => data[0][header.indexOf(column)];
      expect(cell('Asset ID')).toBe(asset.id);
      expect(cell('Cost Centre')).toBe(asset.costCentre);
      expect(REPORT_STATUSES).toContain(cell('Asset Status'));
    });
  });
});
