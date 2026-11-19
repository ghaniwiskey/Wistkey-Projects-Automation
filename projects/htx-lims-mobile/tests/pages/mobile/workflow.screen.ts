import { expect } from '@mobilewright/test';
import type { Locator } from 'mobilewright';
import { AppScreen } from './app.screen';

/** What mobilewright's driver offers for typing (Screen keeps it private). */
type TypingDriver = { typeText(text: string): Promise<void> };

/**
 * Shared steps of the handheld task screens (Pre Check-in, Check-in, Check-out). The emulator has no RFID reader:
 * tags are typed and the dev build's QA simulation buttons stand in for the reader ("Simulate verify read",
 * "Simulate burst scan", "QA: simulate verify scan"). README > Driving the app without a reader.
 * Every screen read costs ~6 s and a tap ~12 s on this app (README > Speed): steps read as little as possible.
 */
export class WorkflowScreen extends AppScreen {
  /** Tap a button by its text, scrolling down to it first. */
  async tapText(label: string): Promise<void> {
    // scrollIntoViewIfNeeded() misjudges what is on screen in this Compose app (it swiped past a visible tile),
    // so tap first and swipe up only when the element is not there.
    const target = this.text(label).first();
    for (let i = 0; i < 4; i++) {
      if (await target.isVisible().catch(() => false)) return target.tap();
      await this.screen.swipe('up');
    }
    await target.tap({ timeout: 10_000 });
  }

  /** Scroll back to the top of the screen (the input field sits above the item list). */
  async toTop(): Promise<void> {
    await this.screen.swipe('down');
    await this.screen.swipe('down');
  }

  /** Type into the screen's text field (tag ID / item number). The field keeps its old value, so clear it first. */
  async typeInput(value: string): Promise<void> {
    const field: Locator = this.field(0);
    if (!(await field.isVisible().catch(() => false))) await this.toTop();
    if ((await field.getText()).trim()) await field.clear();
    else await field.tap();
    await (this.screen as unknown as { driver: TypingDriver }).driver.typeText(value);
    await this.screen.pressButton('BACK'); // hide the keyboard
  }

  /** Tap a verify button until none is left ("Simulate verify read" / "QA: simulate verify scan"). */
  async verifyAll(label: string, count: number): Promise<void> {
    for (let i = 0; i < count; i++) await this.tapText(label);
  }

  async openTile(tile: string, heading: string): Promise<void> {
    await this.tapText(tile);
    await expect(this.text(heading).first()).toBeVisible({ timeout: 30_000 });
  }

  /** Refresh items: downloads the lists again; an "Items downloaded" dialog follows (OK closes it). */
  async refreshItems(): Promise<void> {
    await this.tapText('Refresh items');
    const dialog = this.text(/^(Items|Data) downloaded$/); // Refresh items shows "Items downloaded"
    await dialog.waitFor({ timeout: 30_000 }).then(() => this.text('OK').tap(), () => undefined);
  }

  /** Back to the Dashboard (Back until its subtitle shows). */
  async goHome(): Promise<void> {
    const home = this.text('Choose a task to get started.');
    for (let i = 0; i < 4 && !(await home.isVisible().catch(() => false)); i++) await this.screen.pressButton('BACK');
    await expect(home).toBeVisible({ timeout: 20_000 });
  }

  async back(): Promise<void> {
    await this.screen.pressButton('BACK');
  }
}

/** Pre Check-in: tags typed by chip code, verified, counted in the review, uploaded. */
export class PreCheckInScreen extends WorkflowScreen {
  async open(): Promise<void> {
    await this.openTile('Pre Check-in', 'Scan item tags one by one');
    await this.refreshItems(); // the list must include items printed since the last download
  }

  async addTag(chipCode: string, itemNo: string): Promise<void> {
    await this.typeInput(chipCode);
    await this.tapText('Add tag');
    await expect(this.text(itemNo).first()).toBeVisible({ timeout: 20_000 });
  }

  /** Verify every typed tag, review, count all (simulated burst scan) and upload. Returns the result text. */
  async verifyCountAndUpload(count: number): Promise<string> {
    await this.verifyAll('Simulate verify read', count);
    await this.tapText('Next · Review items');
    await expect(this.text('PRE CHECK-IN / REVIEW ITEMS')).toBeVisible({ timeout: 20_000 });
    await this.tapText('Simulate burst scan');
    await expect(this.text('✓ All items counted')).toBeVisible({ timeout: 20_000 });
    await this.text('Upload pre check-in').tap();
    const result = this.text(/All \d+ tag\(s\) were pre checked-in\.|were accepted/);
    await expect(result).toBeVisible({ timeout: 60_000 });
    const text = await result.getText();
    await this.text('View result').tap();
    return text;
  }
}

/** Check-in: items found by number, verified, located (default room), counted and uploaded. */
export class CheckInScreen extends WorkflowScreen {
  async open(): Promise<void> {
    await this.openTile('Check-in', 'Items to check in');
    await this.refreshItems();
  }

  async addItem(itemNo: string): Promise<void> {
    await this.typeInput(itemNo);
    await this.tapText('Find item');
    await expect(this.text('Pre Check-in done · Ready for check-in')).toBeVisible({ timeout: 20_000 });
    await this.tapText('Add to check-in');
  }

  async verifyCountAndUpload(count: number): Promise<string> {
    await this.verifyAll('Simulate verify read', count);
    await this.tapText('Next · Review items');
    await expect(this.text('CHECK-IN / REVIEW ITEMS')).toBeVisible({ timeout: 20_000 });
    await this.tapText('Simulate burst scan');
    await expect(this.text(/item\(s\) counted · Ready to upload/)).toBeVisible({ timeout: 20_000 });
    await this.text('Upload check-in').tap();
    const result = this.text(/\d+ item\(s\) checked in\./);
    await expect(result).toBeVisible({ timeout: 60_000 });
    const text = await result.getText();
    await this.text('OK').tap();
    return text;
  }
}

/** Check-out: item found by number, type (Loan / For Use / No Return), due date for Loan, remarks. */
export class CheckOutScreen extends WorkflowScreen {
  async open(): Promise<void> {
    await this.openTile('Check-out', 'Scan item tags');
  }

  /** Android date picker labels days like "Wednesday, November 25, 2026" (today: "Today, ..."). */
  private static dayLabel(d: Date): RegExp {
    const label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return new RegExp(`^(Today, )?${label}$`);
  }

  async addLoan(itemNo: string, due: Date, remarks: string): Promise<void> {
    await this.typeInput(itemNo);
    await this.tapText('Find item');
    await expect(this.text('Add to check-out')).toBeVisible({ timeout: 20_000 });
    await this.text('Select type').tap();
    await this.text('Loan').tap();
    await this.text('When should it come back?').tap();
    if (due.getMonth() !== new Date().getMonth()) await this.screen.getByLabel('Next month').tap();
    await this.text(CheckOutScreen.dayLabel(due)).tap();
    await this.text('OK').tap();
    await this.field(0).tap(); // remarks: the only text field of the dialog
    await (this.screen as unknown as { driver: TypingDriver }).driver.typeText(remarks);
    await this.screen.pressButton('BACK');
    await this.text('Add to list').tap();
    await expect(this.text(`Remarks: ${remarks}`)).toBeVisible({ timeout: 20_000 });
  }

  async verifyAndConfirm(count: number): Promise<string> {
    await this.verifyAll('QA: simulate verify scan', count);
    await this.tapText('Review check-out');
    await expect(this.text('REVIEW CHECK-OUT')).toBeVisible({ timeout: 20_000 });
    await this.text('Confirm check-out').tap();
    const result = this.text(/All \d+ item\(s\) were checked out\.|were accepted/);
    await expect(result).toBeVisible({ timeout: 60_000 });
    const text = await result.getText();
    await this.text('View result').tap();
    return text;
  }
}
