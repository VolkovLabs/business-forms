import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants/tests';

test.describe('Data Manipulation Panel', () => {
  test('Check grafana version', async ({ grafanaVersion }) => {
    console.log('Grafana version: ', grafanaVersion);
    expect(grafanaVersion).toEqual(grafanaVersion);
  });

  test('Should display a Form', async ({ gotoDashboardPage, dashboardPage, page }) => {
    /**
     * Go To E2E dashboard
     * return dashboardPage
     */
    await gotoDashboardPage({ uid: 'ddab9faf-2c15-431a-a047-9a7a6a0aed71' });

    /**
     * Find panel by title with chart
     * Should be visible
     */
    await expect(dashboardPage.getPanelByTitle('Single Form').locator).toBeVisible();

    await page.waitForTimeout(2500);
    /**
     * Check and compare image
     */
    await expect(
      dashboardPage.getPanelByTitle('Single Form').locator.getByTestId(TEST_IDS.panel.root)
    ).toHaveScreenshot('actual-screenshot.png', { maxDiffPixelRatio: 0.1 });
  });
});
