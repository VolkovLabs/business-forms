import { e2e } from '@grafana/e2e';
import { TestIds } from '../../src/constants';

/**
 * Dashboard
 */
const json = require('../../provisioning/dashboards/e2e.json');
const testedPanel = json.panels[0];

/**
 * Selector
 */
const getTestIdSelector = (testId: string) => `[data-testid="${testId}"]`;

/**
 * Panel
 */
describe('Viewing a panel with a Form', () => {
  beforeEach(() => {
    e2e.flows.openDashboard({
      uid: json.uid,
    });
  });

  it('Should display a Form', () => {
    const currentPanel = e2e.components.Panels.Panel.title(testedPanel.title);
    currentPanel.should('be.visible');

    /**
     * Form
     */
    const form = currentPanel.find(getTestIdSelector(TestIds.panel.root));
    form.should('be.visible');

    /**
     * Screenshot
     */
    form.screenshot(testedPanel.title);
    e2e().compareScreenshots({ name: testedPanel.title, threshold: 0.05 });
  });
});
