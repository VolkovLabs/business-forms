import { Locator } from '@playwright/test';
import { DashboardPage, expect, Panel, PanelEditPage } from '@grafana/plugin-e2e';
import { getLocatorSelectors, LocatorSelectors } from './selectors';
import { TEST_IDS } from '../../src/constants/tests';

const getElementsSelector = getLocatorSelectors(TEST_IDS.formElements);

/**
 * Disabled Element Helper
 */
class DisabledElementHelper {
  private readonly locator: Locator;

  constructor(parentLocator: Locator) {
    this.locator = parentLocator.getByTestId(TEST_IDS.formElements.fieldDisabled);
  }

  private getMsg(message: string): string {
    return `DisabledElement: ${message}`;
  }

  public get() {
    return this.locator;
  }

  public async checkValue(text: string) {
    return expect(this.get(), this.getMsg('Check Text')).toHaveValue(text);
  }
}

/**
 * Number Element Helper
 */
class NumberElementHelper {
  private readonly locator: Locator;

  constructor(parentLocator: Locator) {
    this.locator = parentLocator.getByTestId(TEST_IDS.formElements.fieldNumber);
  }

  private getMsg(message: string): string {
    return `NumberElement: ${message}`;
  }

  public get() {
    return this.locator;
  }

  public async checkValue(text: string) {
    return expect(this.get(), this.getMsg('Check value')).toHaveValue(text);
  }

  public async setValue(value: string) {
    await this.get().fill(value);
    return this.get().blur();
  }

  public async isDisabled() {
    return expect(this.get(), this.getMsg('Number element is Disabled')).toBeDisabled();
  }

  public async isNotDisabled() {
    return expect(this.get(), this.getMsg('Number element is not Disabled')).not.toBeDisabled();
  }
}

/**
 * Select Element Helper
 */
class SelectElementHelper {
  private readonly locator: Locator;
  private readonly page: DashboardPage;

  constructor(parentLocator: Locator, page: DashboardPage) {
    this.locator = parentLocator.getByTestId(TEST_IDS.formElements.fieldSelect);
    this.page = page;
  }

  public get() {
    return this.locator;
  }

  public async setValue(fieldKey) {
    await this.get().click();
    return this.page.getByGrafanaSelector(this.page.ctx.selectors.components.Select.option).getByText(fieldKey).click();
  }
}

/**
 * Elements Helper
 */
class ElementsHelper {
  public selectors: LocatorSelectors<typeof TEST_IDS.formElements>;

  constructor(public readonly locator: Locator) {
    this.selectors = this.getSelectors(locator);
  }

  private getMsg(msg: string): string {
    return `Elements: ${msg}`;
  }

  private getSelectors(locator: Locator) {
    return getElementsSelector(locator);
  }

  public async checkPresence() {
    return expect(this.selectors.root(), this.getMsg('Elements Container Presence')).toBeVisible();
  }

  public async checkElementPresence(elementId: string, elementType: string) {
    return expect(
      this.selectors.element(elementId, elementType),
      this.getMsg(`Element ${elementId} Presence`)
    ).toBeVisible();
  }

  public async checkElementNotPresence(elementId: string, elementType: string) {
    return expect(
      this.selectors.element(elementId, elementType),
      this.getMsg(`Element ${elementId} not Presence`)
    ).not.toBeVisible();
  }

  public async getElement(elementId: string, elementType: string) {
    return this.selectors.element(elementId, elementType);
  }

  public async getDisabledElement(elementId: string, elementType: string) {
    const element = await this.getElement(elementId, elementType);
    return new DisabledElementHelper(element);
  }

  public async getNumberElement(elementId: string, elementType: string) {
    const element = await this.getElement(elementId, elementType);
    return new NumberElementHelper(element);
  }

  public async getSelectElement(elementId: string, elementType: string, dashboardPage: DashboardPage) {
    const element = await this.getElement(elementId, elementType);
    return new SelectElementHelper(element, dashboardPage);
  }
}

/**
 * Submit Button Helper
 */
class SubmitButtonHelper {
  private readonly locator: Locator;

  constructor(parentLocator: Locator) {
    this.locator = parentLocator.getByTestId(TEST_IDS.panel.buttonSubmit);
  }

  private getMsg(message: string): string {
    return `Submit Button: ${message}`;
  }

  public get() {
    return this.locator;
  }

  public async checkPresence() {
    return expect(this.get(), this.getMsg(`Check Submit button Presence`)).toBeVisible();
  }

  public async checkIsDisabled() {
    return expect(this.get(), this.getMsg(`Check Submit button disabled`)).toBeDisabled();
  }

  public async checkIsNotDisabled() {
    return expect(this.get(), this.getMsg(`Check Submit button not disabled`)).not.toBeDisabled();
  }

  public async submit() {
    return this.get().click();
  }
}

/**
 * Reset Button Helper
 */
class ResetButtonHelper {
  private readonly locator: Locator;

  constructor(parentLocator: Locator) {
    this.locator = parentLocator.getByTestId(TEST_IDS.panel.buttonReset);
  }

  private getMsg(message: string): string {
    return `Reset Button: ${message}`;
  }

  public get() {
    return this.locator;
  }

  public async checkPresence() {
    return expect(this.get(), this.getMsg(`Check Reset button Presence`)).toBeVisible();
  }

  public async reset() {
    return this.get().click();
  }
}

/**
 * Panel Editor Helper
 */
class PanelEditorHelper {
  private readonly elementsEditorSelectors: LocatorSelectors<typeof TEST_IDS.formElementsEditor>;

  constructor(
    private readonly locator: Locator,
    private readonly editPage: PanelEditPage
  ) {
    this.elementsEditorSelectors = getLocatorSelectors(TEST_IDS.formElementsEditor)(this.locator);
  }

  public async addElement(id: string, label: string, type: string) {
    await this.elementsEditorSelectors.newElementId().fill(id);
    await this.elementsEditorSelectors.newElementLabel().fill(label);
    await this.elementsEditorSelectors.newElementType().click();
    await this.editPage
      .getByGrafanaSelector(this.editPage.ctx.selectors.components.Select.option)
      .getByText(type)
      .click();
    await this.elementsEditorSelectors.buttonAddElement().click();
    await this.elementsEditorSelectors.buttonSaveChanges().click();
  }
}

/**
 * Panel Helper
 */
export class PanelHelper {
  private readonly locator: Locator;
  private readonly panel: Panel;
  private readonly title: string;
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.panel>;

  constructor(dashboardPage: DashboardPage, panelTitle: string) {
    this.panel = dashboardPage.getPanelByTitle(panelTitle);
    this.title = panelTitle;
    this.locator = this.panel.locator;
    this.selectors = getLocatorSelectors(TEST_IDS.panel)(this.locator);
  }

  private getMsg(msg: string): string {
    return `Panel: ${msg}`;
  }

  public get() {
    return this.locator;
  }

  public getElements() {
    return new ElementsHelper(this.locator);
  }

  public getPanelEditor(locator: Locator, editPage: PanelEditPage) {
    return new PanelEditorHelper(locator, editPage);
  }

  public getSubmitButton() {
    return new SubmitButtonHelper(this.locator);
  }

  public getResetButton() {
    return new ResetButtonHelper(this.locator);
  }

  public async checkIfNoErrors() {
    return expect(this.panel.getErrorIcon(), this.getMsg('Check If No Errors')).not.toBeVisible();
  }

  public async checkPresence() {
    return expect(this.selectors.root(), this.getMsg(`Check ${this.title} Presence`)).toBeVisible();
  }

  public async checkAlertMessage() {
    return expect(this.selectors.infoMessage(), this.getMsg(`Check Alert Message`)).toBeVisible();
  }

  public async checkSectionPresence(name: string) {
    return expect(this.selectors.splitLayoutContent(name), this.getMsg(`Check ${name} Section`)).toBeVisible();
  }

  public async openSection(name: string) {
    return this.selectors.splitLayoutContent(name).click();
  }

  public async checkErrorMessage() {
    return expect(this.selectors.errorMessage(), this.getMsg(`Check Error Message`)).toBeVisible();
  }
}
