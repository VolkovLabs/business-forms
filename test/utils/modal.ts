import { Locator } from '@playwright/test';
import { DashboardPage, expect } from '@grafana/plugin-e2e';
import { getLocatorSelectors, LocatorSelectors } from './selectors';
import { TEST_IDS } from '../../src/constants/tests';

/**
 * Modal Helper
 */
export class ModalHelper {
  private readonly locator: Locator;
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.panel>;

  constructor(dashboardPage: DashboardPage) {
    this.locator = dashboardPage.ctx.page.getByRole('dialog');
    this.selectors = getLocatorSelectors(TEST_IDS.panel)(this.locator);
  }

  private getMsg(msg: string): string {
    return `Panel: ${msg}`;
  }

  public get() {
    return this.locator;
  }

  public async checkPresence() {
    return expect(this.get(), this.getMsg(`Check Modal Presence`)).toBeVisible();
  }

  public async checkNotPresence() {
    return expect(this.get(), this.getMsg(`Check Modal Not Presence`)).not.toBeVisible();
  }

  public async confirmButtonCheckPresence() {
    return expect(
      this.get().getByRole('button', { name: 'Confirm' }),
      this.getMsg(`Check Confirm button Presence`)
    ).toBeVisible();
  }

  public async cancelButtonCheckPresence() {
    return expect(
      this.get().getByRole('button', { name: 'Cancel' }),
      this.getMsg(`Check Cancel button Presence`)
    ).toBeVisible();
  }

  public async updateValues() {
    return this.get().getByRole('button', { name: 'Confirm' }).click();
  }

  public async cancelUpdateValues() {
    return this.get().getByRole('button', { name: 'Cancel' }).click();
  }
}
