import { test, expect } from '@grafana/plugin-e2e';
import { ModalHelper, PanelHelper } from './utils';
import { FormElementType } from '../src/types/form-element';

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
      await elements.checkElementPresence('dateTime', FormElementType.DATETIME);
      await elements.checkElementPresence('time', FormElementType.TIME);
      await elements.checkElementPresence('date', FormElementType.DATE);
      await elements.checkElementPresence('amount', FormElementType.NUMBER);
      await elements.checkElementPresence('updated', FormElementType.BOOLEAN);
      await elements.checkElementPresence('name', FormElementType.STRING);
      await elements.checkElementPresence('step', FormElementType.SLIDER);
      await elements.checkElementPresence('select', FormElementType.SELECT);
      await elements.checkElementPresence('radio', FormElementType.RADIO);
      await elements.checkElementPresence('password', FormElementType.PASSWORD);
      await elements.checkElementPresence('disabled', FormElementType.DISABLED);
      await elements.checkElementPresence('link', FormElementType.LINK);
      await elements.checkElementPresence('checkbox', FormElementType.CHECKBOX_LIST);
      await elements.checkElementPresence('colorRGB', FormElementType.COLOR_PICKER);
      await elements.checkElementPresence('colorHEX', FormElementType.COLOR_PICKER);

      const panelBoxes = new PanelHelper(dashboardPage, 'Boxes');
      await panelBoxes.checkIfNoErrors();
      await panelBoxes.checkPresence();

      const boxesElements = panelBoxes.getElements();
      await boxesElements.checkPresence();
      await boxesElements.checkElementPresence('file', FormElementType.FILE);
      await boxesElements.checkElementPresence('text', FormElementType.TEXTAREA);
      await boxesElements.checkElementPresence('readOnlyTextArea', FormElementType.DISABLED_TEXTAREA);
      await boxesElements.checkElementPresence('code', FormElementType.CODE);
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
      await elements.checkElementPresence('string', FormElementType.STRING);
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
      await sections.checkElementsCountInSection('Current Values', 3);

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
      await sections.checkElementsCountInSection('Current Values', 3);

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

    test('Should add Form panel with base element and initial req should be executed as expected', async ({
      gotoDashboardPage,
      readProvisionedDashboard,
      page,
    }) => {
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
      const initialSectionEditor = await editor.getOptionsSections('Initial Request');
      await initialSectionEditor.checkSectionPresence();

      const editorInitialCode = await initialSectionEditor.getCodeEditorElement(page);
      await editorInitialCode.checkPresence();
      await editorInitialCode.clearText();
      await editorInitialCode.setText(`context.panel.patchFormValue({string: 'test'})`);

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
      await elements.checkElementPresence('string', FormElementType.STRING);

      const stringElement = await elements.getStringElement('string', FormElementType.STRING);
      await stringElement.isNotDisabled();
      await stringElement.checkValue('test');
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
      await sections.checkElementsCountInSection('Current Values', 3);
      await sections.checkElementsCountInSection('New Values', 3);

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

    test('Should update values via Text area with new lines in payload', async ({
      gotoDashboardPage,
      readProvisionedDashboard,
      page,
    }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */

      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Scroll down by 950
       * To get panel by title, panel should be in the view
       */
      await page.evaluate(() => window.scrollBy(0, 950));

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Data Source Update Text Area');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const sections = panel.getSections();
      await sections.checkSectionPresence('Current Values');
      await sections.checkSectionPresence('New Values');
      await sections.checkElementsCountInSection('Current Values', 4);
      await sections.checkElementsCountInSection('New Values', 4);

      const elements = panel.getElements();
      const disabledTextAreaElement = await elements.getDisabledTextAreaElement(
        'option1',
        FormElementType.DISABLED_TEXTAREA
      );
      const buttons = panel.getButtons();

      await disabledTextAreaElement.checkValue('option1');
      await buttons.checkSubmitButtonPresence();
      await buttons.checkSubmitButtonIsDisabled();

      const textAreaElement = await elements.getTextAreaElement('option2', FormElementType.TEXTAREA);
      await textAreaElement.checkValue('option1');
      await textAreaElement.setValue('option1\noption2\n');

      await buttons.checkSubmitButtonIsNotDisabled();
      await buttons.submit();

      const confirmModal = new ModalHelper(dashboardPage);
      await confirmModal.checkPresence();
      await confirmModal.confirmButtonCheckPresence();
      await confirmModal.cancelButtonCheckPresence();
      await confirmModal.updateValues();

      await panel.checkNoErrorMessage();

      await buttons.checkSubmitButtonPresence();
      await disabledTextAreaElement.checkValue('option1\noption2\n');

      /**
       * Return to initial
       */
      await textAreaElement.setValue('option1');
      await buttons.submit();
      await confirmModal.updateValues();
    });

    test('Should update values via Code Editor area with new lines in payload', async ({
      gotoDashboardPage,
      readProvisionedDashboard,
      page,
    }) => {
      /**
       * Go To Panels dashboard datasource.json
       * return dashboardPage
       */

      const dashboard = await readProvisionedDashboard({ fileName: 'datasource.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Scroll down by 1600
       * To get panel by title, panel should be in the view
       */
      await page.evaluate(() => window.scrollBy(0, 1600));

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Data Source Update Code Editor');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const sections = panel.getSections();
      await sections.checkSectionPresence('Current Values');
      await sections.checkSectionPresence('New Values');
      await sections.checkElementsCountInSection('Current Values', 4);
      await sections.checkElementsCountInSection('New Values', 5);

      const elements = panel.getElements();
      const disabledTextAreaElement = await elements.getDisabledTextAreaElement(
        'option1',
        FormElementType.DISABLED_TEXTAREA
      );
      const buttons = panel.getButtons();

      await disabledTextAreaElement.checkValue('option1');
      await buttons.checkSubmitButtonPresence();
      await buttons.checkSubmitButtonIsDisabled();

      const codeEditorElement = await elements.getCodeEditorElement('code', FormElementType.CODE, page);
      await codeEditorElement.checkPresence();
      await codeEditorElement.setText('\noption2\noption3');

      await buttons.checkSubmitButtonIsNotDisabled();
      await buttons.submit();

      const confirmModal = new ModalHelper(dashboardPage);
      await confirmModal.checkPresence();
      await confirmModal.confirmButtonCheckPresence();
      await confirmModal.cancelButtonCheckPresence();
      await confirmModal.updateValues();

      await panel.checkNoErrorMessage();

      await buttons.checkSubmitButtonPresence();
      await disabledTextAreaElement.checkValue('option1\noption2\noption3');

      /**
       * Return to initial
       */
      await codeEditorElement.clearText();
      await codeEditorElement.setText('option1');
      await buttons.submit();
      await confirmModal.updateValues();
      await disabledTextAreaElement.checkValue('option1');
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
      await sections.checkElementsCountInSection('Section 1', 1);
      await elements.checkElementPresence('element1', FormElementType.STRING);

      await dashboardPage.refreshDashboard();

      /**
       * Element in open section should be visible
       */
      await elements.checkElementPresence('element1', FormElementType.STRING);
    });
  });
});
