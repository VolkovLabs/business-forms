import { test, expect } from '@grafana/plugin-e2e';
import { ModalHelper, PanelHelper } from './utils';

test.describe('Data Manipulation Panel', () => {
  test('Check grafana version', async ({ grafanaVersion }) => {
    console.log('Grafana version: ', grafanaVersion);
    expect(grafanaVersion).toEqual(grafanaVersion);
  });

  test.describe('Base', () => {
    test('Should display a Form panels with all elements', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard e2e.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Single Form');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const elements = panel.getElements();

      /**
       * Check all elements Presence
       */
      await elements.checkPresence();
      await elements.checkElementPresence('dateTime', 'datetime');
      await elements.checkElementPresence('time', 'time');
      await elements.checkElementPresence('date', 'date');
      await elements.checkElementPresence('amount', 'number');
      await elements.checkElementPresence('updated', 'boolean');
      await elements.checkElementPresence('name', 'string');
      await elements.checkElementPresence('step', 'slider');
      await elements.checkElementPresence('select', 'select');
      await elements.checkElementPresence('radio', 'radio');
      await elements.checkElementPresence('password', 'password');
      await elements.checkElementPresence('disabled', 'disabled');
      await elements.checkElementPresence('link', 'link');
      await elements.checkElementPresence('checkbox', 'checkboxList');

      const panelBoxes = new PanelHelper(dashboardPage, 'Boxes');
      await panelBoxes.checkIfNoErrors();
      await panelBoxes.checkPresence();

      const boxesElements = panelBoxes.getElements();
      await boxesElements.checkPresence();
      await boxesElements.checkElementPresence('file', 'file');
      await boxesElements.checkElementPresence('text', 'textarea');
      await boxesElements.checkElementPresence('readOnlyTextArea', 'disabledTextarea');
      await boxesElements.checkElementPresence('code', 'code');
    });

    test('Should add empty Form panel', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard e2e.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Add new visualization
       */
      const editPage = await dashboardPage.addPanel();
      await editPage.setVisualization('Business Forms');
      await editPage.setPanelTitle('Business Forms Empty');
      await editPage.backToDashboard();

      /**
       * Should add empty visualization without errors
       */
      const panel = new PanelHelper(dashboardPage, 'Business Forms Empty');
      await panel.checkIfNoErrors();
      await panel.checkPresence();
      await panel.checkAlertMessage();
    });

    test('Should add Form panel with base element', async ({ gotoDashboardPage, readProvisionedDashboard, page }) => {
      /**
       * Go To Panels dashboard e2e.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Add new visualization
       */
      const editPage = await dashboardPage.addPanel();
      await editPage.setVisualization('Business Forms');
      await editPage.setPanelTitle('Business Form New');

      const panel = new PanelHelper(dashboardPage, 'Business Form New');
      const editor = panel.getPanelEditor(page.locator('body'), editPage);

      await editor.addElement('string', 'Name', 'String input');

      /**
       * Apply changes and return to dashboard
       */
      await editPage.backToDashboard();

      /**
       * Check Presence
       */
      await panel.checkPresence();
      await panel.checkIfNoErrors();

      const elements = panel.getElements();

      await elements.checkPresence();
      await elements.checkElementPresence('string', 'string');
    });
  });

  test.describe('Initial request', () => {
    test('Should set initial values from Datasource', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Data Source');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const sections = panel.getSections();
      await sections.checkSectionPresence('Current Values');

      const elements = panel.getElements();
      const disabledMaxElement = await elements.getDisabledElement('max', 'disabled');
      const disabledMinElement = await elements.getDisabledElement('min', 'disabled');
      const disabledSpeedElement = await elements.getDisabledElement('speed', 'disabled');

      await disabledMaxElement.checkValue('100');
      await disabledMinElement.checkValue('10');
      await disabledSpeedElement.checkValue('54');
    });

    test('Should set initial values from Query', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */
      const variableParams = new URLSearchParams();
      variableParams.set('var-device', 'device2');

      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid, queryParams: variableParams });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Query');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const sections = panel.getSections();
      await sections.checkSectionPresence('Current Values');

      const elements = panel.getElements();
      const disabledMaxElement = await elements.getDisabledElement('max', 'disabled');
      const disabledMinElement = await elements.getDisabledElement('min', 'disabled');
      const disabledSpeedElement = await elements.getDisabledElement('speed', 'disabled');

      await disabledMaxElement.checkValue('60');
      await disabledMinElement.checkValue('0');
      await disabledSpeedElement.checkValue('10');

      variableParams.set('var-device', 'device1');
      await gotoDashboardPage({ uid: dashboard.uid, queryParams: variableParams });

      await disabledMaxElement.checkValue('100');
      await disabledMinElement.checkValue('10');
      await disabledSpeedElement.checkValue('54');
    });

    test('Should display error for get initial request without URL', async ({
      gotoDashboardPage,
      readProvisionedDashboard,
    }) => {
      /**
       * Go To Panels dashboard e2e.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Empty URL');
      await panel.checkPresence();
      await panel.checkErrorMessage();
    });
  });

  test.describe('Update', () => {
    test('Should update values', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */

      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Data Source');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const sections = panel.getSections();
      await sections.checkSectionPresence('Current Values');
      await sections.checkSectionPresence('New Values');

      const elements = panel.getElements();
      const disabledMaxElement = await elements.getDisabledElement('max', 'disabled');
      const buttons = panel.getButtons();

      await disabledMaxElement.checkValue('100');
      await buttons.checkSubmitButtonPresence();
      await buttons.checkSubmitButtonIsDisabled();

      const numberMaxElement = await elements.getNumberElement('max', 'number');
      await numberMaxElement.checkValue('100');
      await numberMaxElement.setValue('125');

      await buttons.checkSubmitButtonIsNotDisabled();
      await buttons.submit();

      const confirmModal = new ModalHelper(dashboardPage);
      await confirmModal.checkPresence();
      await confirmModal.confirmButtonCheckPresence();
      await confirmModal.cancelButtonCheckPresence();
      await confirmModal.updateValues();

      await buttons.checkSubmitButtonPresence();
      await numberMaxElement.checkValue('125');
      await disabledMaxElement.checkValue('125');

      /**
       * Return to initial
       */
      await numberMaxElement.setValue('100');
      await buttons.submit();
      await confirmModal.updateValues();
    });

    test('Should not update values if cancel', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */

      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Data Source');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const elements = panel.getElements();
      const disabledMaxElement = await elements.getDisabledElement('max', 'disabled');

      const buttons = panel.getButtons();

      await disabledMaxElement.checkValue('100');
      await buttons.checkSubmitButtonPresence();
      await buttons.checkSubmitButtonIsDisabled();

      const numberMaxElement = await elements.getNumberElement('max', 'number');
      await numberMaxElement.setValue('125');

      await buttons.submit();

      const confirmModal = new ModalHelper(dashboardPage);

      await confirmModal.cancelButtonCheckPresence();
      await confirmModal.cancelUpdateValues();
      await confirmModal.checkNotPresence();
      await disabledMaxElement.checkValue('100');
    });

    test('Should reset values without update it', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */

      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Data Source');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const elements = panel.getElements();
      const disabledMaxElement = await elements.getDisabledElement('max', 'disabled');

      const buttons = panel.getButtons();

      await disabledMaxElement.checkValue('100');

      const numberMaxElement = await elements.getNumberElement('max', 'number');
      const numberMinElement = await elements.getNumberElement('min', 'number');
      await numberMaxElement.checkValue('100');
      await numberMinElement.checkValue('10');

      await numberMaxElement.setValue('115');
      await numberMinElement.setValue('15');

      await buttons.reset();

      await numberMaxElement.checkValue('100');
      await numberMinElement.checkValue('10');
    });

    test('Should display error for invalid update request', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Invalid Payload');

      await panel.checkPresence();

      const elements = panel.getElements();
      const numberMaxElement = await elements.getNumberElement('max', 'number');
      await numberMaxElement.setValue('125');

      const buttons = panel.getButtons();
      await buttons.submit();

      const confirmModal = new ModalHelper(dashboardPage);
      await confirmModal.updateValues();

      await panel.checkErrorMessage();
    });
  });

  test.describe('Element change', () => {
    test('Should call element change function', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
      /**
       * Go To Panels dashboard validation.json
       * return dashboardPage
       */

      const dashboard = await readProvisionedDashboard({ fileName: 'validation.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Reset and Validate Elements');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const elements = panel.getElements();
      const facilityElement = await elements.getSelectElement('facility', 'select', dashboardPage);
      const numberElement = await elements.getNumberElement('number', 'number');

      await numberElement.isDisabled();

      await facilityElement.setValue(1);

      await numberElement.isNotDisabled();
    });
  });

  test.describe('Sections', () => {
    test('Should keep section state after refresh dashboard', async ({
      gotoDashboardPage,
      readProvisionedDashboard,
    }) => {
      /**
       * Go To Panels dashboard panels.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Sections');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const elements = panel.getElements();
      await elements.checkElementNotPresence('element1', 'string');

      const sections = panel.getSections();
      await sections.checkSectionPresence('Section 1');

      /**
       * Open section
       */
      await sections.openSection('Section 1');
      await elements.checkElementPresence('element1', 'string');

      await dashboardPage.refreshDashboard();

      /**
       * Element in open section should be visible
       */
      await elements.checkElementPresence('element1', 'string');
    });
  });
});
