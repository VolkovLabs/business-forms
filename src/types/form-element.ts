import { SelectableValue } from '@grafana/data';
import { CodeLanguage, FormElementType } from '../constants';

/**
 * Form Element Base
 */
export interface FormElementBase {
  /**
   * Id
   *
   * @type {string}
   */
  id: string;

  /**
   * Title
   *
   * @type {string}
   */
  title: string;

  /**
   * Type
   *
   * @type {FormElementType}
   */
  type: FormElementType;

  /**
   * Label Width
   *
   * @type {number}
   */
  labelWidth: number;

  /**
   * Width
   *
   * @type {number}
   */
  width: number;

  /**
   * Tooltip
   *
   * @type {string}
   */
  tooltip: string;

  /**
   * Section's Name
   *
   * @type {string}
   */
  section: string;

  /**
   * Unit
   *
   * @type {string}
   */
  unit: string;

  /**
   * Value
   *
   * @type {any}
   */
  value?: any;
}

/**
 * String Options
 */
export interface StringOptions {
  /**
   * Hidden
   *
   * @type {boolean}
   */
  hidden: boolean;

  /**
   * Value
   *
   * @type {string}
   */
  value: string;
}

/**
 * Code Options
 */
export interface CodeOptions {
  /**
   * Height
   *
   * @type {number}
   */
  height: number;

  /**
   * Language
   *
   * @type {CodeLanguage}
   */
  language: CodeLanguage;
}

/**
 * Slider Options
 */
export interface SliderOptions {
  /**
   * Maximum Value
   *
   * @type {number}
   */
  max: number;

  /**
   * Minimum Value
   *
   * @type {number}
   */
  min: number;

  /**
   * Step
   *
   * @type {number}
   */
  step: number;

  /**
   * Value
   *
   * @type {number}
   */
  value: number;
}

/**
 * Number Options
 */
export interface NumberOptions {
  /**
   * Maximum Value
   *
   * @type {number}
   */
  max: number;

  /**
   * Minimum Value
   *
   * @type {number}
   */
  min: number;

  /**
   * Value
   *
   * @type {number}
   */
  value: number;
}

/**
 * Textarea Options
 */
export interface TextareaOptions {
  /**
   * Rows
   *
   * @type {number}
   */
  rows: number;
}

/**
 * Select Options
 */
export interface SelectOptions {
  /**
   * Options
   *
   * @type {SelectableValue[]}
   */
  options?: SelectableValue[];
}

/**
 * Form Element
 */
export type FormElement = FormElementBase &
  (
    | ({ type: FormElementType.STRING } & StringOptions)
    | ({ type: FormElementType.CODE } & CodeOptions)
    | ({ type: FormElementType.SLIDER } & SliderOptions)
    | ({ type: FormElementType.NUMBER } & NumberOptions)
    | ({ type: FormElementType.TEXTAREA } & TextareaOptions)
    | ({ type: FormElementType.SELECT } & SelectOptions)
    | ({ type: FormElementType.RADIO } & SelectOptions)
    | ({ type: FormElementType.DISABLED } & SelectOptions)
    | { type: FormElementType.PASSWORD }
    | { type: FormElementType.DATETIME }
    | { type: FormElementType.SECRET }
    | { type: FormElementType.BOOLEAN }
  );

export type FormElementByType<Type> = Extract<FormElement, { type: Type }>;

// /**
//  * Form Element
//  */
// export interface FormElement {
//   /**
//    * Id
//    *
//    * @type {string}
//    */
//   id: string;
//
//   /**
//    * Title
//    *
//    * @type {string}
//    */
//   title: string;
//
//   /**
//    * Type
//    *
//    * @type {FormElementType}
//    */
//   type: FormElementType;
//
//   /**
//    * Value
//    *
//    * @type {any}
//    */
//   value?: any;
//
//   /**
//    * Unit
//    *
//    * @type {string}
//    */
//   unit?: string;
//
//   /**
//    * Options
//    *
//    * @type {SelectableValue[]}
//    */
//   options?: SelectableValue[];
//
//   /**
//    * Rows
//    *
//    * @type {number}
//    */
//   rows?: number;
//
//   /**
//    * Label Width
//    *
//    * @type {number}
//    */
//   labelWidth: number;
//
//   /**
//    * Width
//    *
//    * @type {number}
//    */
//   width?: number;
//
//   /**
//    * Tooltip
//    *
//    * @type {string}
//    */
//   tooltip: string;
//
//   /**
//    * Section's Name
//    *
//    * @type {string}
//    */
//   section: string;
//
//   /**
//    * Language
//    *
//    * @type {string}
//    */
//   language?: string;
//
//   /**
//    * Hidden
//    *
//    * @type {boolean}
//    */
//   hidden?: boolean;
// }
