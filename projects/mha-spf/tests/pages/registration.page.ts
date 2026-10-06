import { Page, Locator, expect } from '@playwright/test';
import { WizardPage } from './wizard.page';

export type RegistrationType = 'Register' | 'Complete Register' | 'Reject';

const TYPE_IDS: Record<RegistrationType, string> = {
  Register: 'type_register',
  'Complete Register': 'type_loc',
  Reject: 'type_reject',
};

export type RegistrationLocation = {
  group: string;
  postalQuery: string;
  /** Full option text, e.g. "819645 - 35 AIRPORT BOULEVARD AIRPORT POLICE STATION SINGAPORE 819645". */
  postalOption: string;
  /** Leave all of block/level/roomNo/remarks empty for a partial registration (status PROGRESS). */
  block?: string;
  level?: string;
  roomNo?: string;
  remarks?: string;
};

/**
 * Asset > Registration (/Asset/Registration), one wizard for three flows:
 * - Register (NEW/TRANSFER): Start > Asset > Review > Locate & Assign > Asset Sensitivity > RFID Tag > End
 * - Complete Register (PROGRESS): Start > Asset > Review > Location > End
 * - Reject (NEW/TRANSFER/PROGRESS): Start > Asset > Review > Reason > End
 * The page holds a copy of the location fields per flow, so every field locator keeps only visible ones.
 */
export class RegistrationPage extends WizardPage {
  readonly locationRemarks: Locator;
  readonly sensitivityNo: Locator;
  readonly tagPrintingNo: Locator;
  readonly tagTypeNa: Locator;
  readonly rejectReason: Locator;

  constructor(page: Page) {
    super(page);
    this.locationRemarks = page.locator('textarea[name="LocRemarks"]').filter({ visible: true });
    this.sensitivityNo = page.locator('label[for="sensitivity_no"]').filter({ visible: true });
    this.tagPrintingNo = page.locator('label[for="tag_print_no"]').filter({ visible: true });
    // After Tag Printing NO the Tag Type choices collapse to a single "NA" option.
    this.tagTypeNa = page.locator('label').filter({ hasText: /^\s*NA\s*$/ }).filter({ visible: true });
    this.rejectReason = page.locator('select[name="Reason"]').filter({ visible: true });
  }

  get building(): Locator {
    return this.page.locator('input[name="Building"]').filter({ visible: true });
  }

  field(name: 'Block' | 'Level' | 'RoomNo'): Locator {
    return this.page.locator(`input[name="${name}"]`).filter({ visible: true });
  }

  async goto(): Promise<void> {
    await this.navigate('Asset/Registration');
    await expect(this.stepHeading('Register - Start')).toBeVisible();
  }

  async start(type: RegistrationType): Promise<void> {
    await this.goto();
    await this.radioCard(TYPE_IDS[type]).click();
    await this.nextToChooseAsset(`${type} - Choose Asset`);
  }

  async fillLocation(loc: RegistrationLocation): Promise<void> {
    await this.pickSelect2(this.page, 'subLocList', loc.group);
    await this.searchSelect2(this.page, 'PostalCode', loc.postalQuery, loc.postalOption);
    // Picking a postal code fills Building/Address by XHR; type the rest after that.
    await expect(this.building).toHaveValue(/\S/);
    if (loc.block !== undefined) await this.field('Block').fill(loc.block);
    if (loc.level !== undefined) await this.field('Level').fill(loc.level);
    if (loc.roomNo !== undefined) await this.field('RoomNo').fill(loc.roomNo);
    if (loc.remarks !== undefined) await this.locationRemarks.fill(loc.remarks);
  }

  /**
   * Register one asset (no FALO assignee = assigned to yourself, Sensitivity NO, no tag printing:
   * there is no RFID printer on UAT). Returns the End-step message.
   */
  async register(assetId: string, loc: RegistrationLocation): Promise<string> {
    await this.start('Register');
    await this.pickAsset(assetId);
    // The location, sensitivity and tag steps are all headed "Register - Locate & Assign".
    await expect(this.stepHeading('Register - Locate & Assign')).toBeVisible();
    await this.fillLocation(loc);
    await this.next();
    await expect(this.sensitivityNo).toBeVisible(); // default NO
    await this.next();
    await this.tagPrintingNo.click();
    await expect(this.tagTypeNa).toBeVisible();
    return this.submit();
  }

  /** Complete Register up to its Location step (location prefilled from the partial registration). */
  async openCompleteRegister(assetId: string): Promise<void> {
    await this.start('Complete Register');
    await this.pickAsset(assetId);
    await expect(this.stepHeading('Complete Register - Location')).toBeVisible();
  }

  /** Selected value of the visible Group / NPC / Base and Postal Code dropdowns. */
  get groupValue(): Locator {
    return this.page.locator('[id^="select2-subLocList"][id$="-container"]').filter({ visible: true });
  }

  get postalCodeValue(): Locator {
    return this.page.locator('[id^="select2-PostalCode"][id$="-container"]').filter({ visible: true });
  }

  async finishCompleteRegister(remarks: string): Promise<string> {
    // The step prefills the location by XHR and would overwrite anything typed earlier.
    await expect(this.building).toHaveValue(/\S/);
    await this.locationRemarks.fill(remarks);
    return this.submit();
  }

  async reject(assetId: string, reason: string): Promise<string> {
    await this.start('Reject');
    await this.pickAsset(assetId);
    await expect(this.stepHeading('Reject - Reason')).toBeVisible();
    await this.rejectReason.selectOption({ label: reason });
    return this.submit();
  }
}
