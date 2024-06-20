import { ConfirmationElementDisplayMode } from '../constants';

/**
 * Modal Column Name
 */
export enum ModalColumnName {
  NAME = 'name',
  OLD_VALUE = 'oldValue',
  NEW_VALUE = 'newValue',
}

/**
 * Modal Options
 */
export interface ModalOptions {
  /**
   * Title
   *
   * @type {string}
   */
  title: string;

  /**
   * Body
   *
   * @type {string}
   */
  body: string;

  /**
   * Columns
   */
  columns: {
    /**
     * Include
     *
     * @type {ModalColumnName[]}
     */
    include: ModalColumnName[];

    /**
     * Name
     *
     * @type {string}
     */
    name: string;

    /**
     * Previous Value
     *
     * @type {string}
     */
    oldValue: string;

    /**
     * New Value
     *
     * @type {string}
     */
    newValue: string;
  };

  /**
   * Confirm Button Text
   *
   * @type {string}
   */
  confirm: string;

  /**
   * Cancel Button Text
   *
   * @type {string}
   */
  cancel: string;

  /**
   * Element Display Mode
   *
   * @type {string}
   */
  elementDisplayMode: ConfirmationElementDisplayMode;
}
