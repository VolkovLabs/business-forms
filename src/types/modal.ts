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
}
