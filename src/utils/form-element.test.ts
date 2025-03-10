/* eslint-disable no-console */
import { css, keyframes } from '@emotion/css';

import { OptionsSource } from '../constants';
import { ButtonVariant, FormElementType } from '../types';
import {
  applyAcceptedFiles,
  applyLabelStyles,
  convertElementsToPayload,
  convertToElementValue,
  formatElementValue,
  getButtonVariant,
  getElementWithNewType,
  patchFormValueHandler,
  reorder,
  setFormValueHandler,
  toLocalFormElement,
  toNumberValue,
} from './form-element';

/**
 * Mock @emotion/css
 */
const cssMock = () => 'css-test';
const keyframesMock = (styles: string) => `keyframes-${styles}`;

jest.mock('@emotion/css', () => ({
  css: jest.fn(),
  keyframes: jest.fn(),
}));

describe('Utils', () => {
  const logError = jest.fn();
  const logInfo = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'error');
    jest.spyOn(console, 'log');

    jest.mocked(console.error).mockImplementation(logError);
    jest.mocked(console.log).mockImplementation(logInfo);

    jest.mocked(css).mockImplementation(cssMock);
    jest.mocked(keyframes).mockImplementation(keyframesMock as any);
  });

  /**
   * Restore original console
   */
  afterAll(() => {
    jest.mocked(console.error).mockRestore();
    jest.mocked(console.log).mockRestore();
  });

  describe('Reorder', () => {
    it('Should move element up', () => {
      expect(reorder([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
    });

    it('Should move element down', () => {
      expect(reorder([1, 2, 3], 2, 1)).toEqual([1, 3, 2]);
    });

    it('Should not mutate original array', () => {
      const array = [1, 2, 3];
      const result = reorder(array, 2, 1);

      expect(array !== result).toBeTruthy();
    });
  });

  describe('ConvertToElementValue', () => {
    it.each([
      {
        name: 'Should convert value for string element',
        element: {
          type: FormElementType.STRING,
        },
        testCases: [
          {
            original: 'abc',
            expected: 'abc',
          },
          {
            original: 123,
            expected: '123',
          },
          {
            original: undefined,
            expected: '',
          },
          {
            original: null,
            expected: '',
          },
        ],
      },
      {
        name: 'Should convert value for number element',
        element: {
          type: FormElementType.NUMBER,
        },
        testCases: [
          {
            original: 123,
            expected: 123,
          },
          {
            original: '123.12',
            expected: 123.12,
          },
          {
            original: 'abc',
            expected: 0,
          },
          {
            original: undefined,
            expected: 0,
          },
          {
            original: null,
            expected: 0,
          },
        ],
      },
      {
        name: 'Should convert value for file element',
        element: {
          type: FormElementType.FILE,
        },
        testCases: [
          {
            original: ['a, b', 'c'],
            expected: [],
          },
        ],
      },
      {
        name: 'Should convert value for boolean element',
        element: {
          type: FormElementType.BOOLEAN,
        },
        testCases: [
          {
            original: true,
            expected: true,
          },
          {
            original: false,
            expected: false,
          },
          {
            original: 'true',
            expected: true,
          },
          {
            original: 'false',
            expected: true,
          },
        ],
      },
      {
        name: 'Should keep original value for select element',
        element: {
          type: FormElementType.SELECT,
        },
        testCases: [
          {
            original: true,
            expected: true,
          },
        ],
      },
      {
        name: 'Should convert value for datetime element',
        element: {
          type: FormElementType.DATETIME,
        },
        testCases: [
          /**
           * Not a number string return undefined
           */
          {
            original: 'abc',
            expected: undefined,
          },

          /**
           * Correct String date format return date format
           */
          {
            original: '2024-06-05T03:00:00.000Z',
            expected: '2024-06-05T03:00:00.000Z',
          },

          /**
           * Weird number convert to 1970-01-01 date
           */
          {
            original: 123,
            expected: '1970-01-01T00:00:00.123Z',
          },

          /**
           * Convert Number Timestamp return date format
           */
          {
            original: 1717200000000,
            expected: '2024-06-01T00:00:00.000Z',
          },

          /**
           * Weird string return undefined
           */
          {
            original: '1717200000000',
            expected: undefined,
          },

          /**
           * Unix format number convert to 1970-01-01 date
           */
          {
            original: 2147234605,
            expected: '1970-01-25T20:27:14.605Z',
          },

          /**
           * Weird Unix format String return undefined
           */
          {
            original: '2084076205',
            expected: undefined,
          },
        ],
      },
      {
        name: 'Should convert value for TIME element',
        element: {
          type: FormElementType.TIME,
        },
        testCases: [
          /**
           * Not a number string return ''
           */
          {
            original: 'abc',
            expected: undefined,
          },

          /**
           * Correct String date format return date format
           */
          {
            original: '2024-06-05T03:00:00.000Z',
            expected: '2024-06-05T03:00:00.000Z',
          },

          /**
           * Weird number convert to 1970-01-01 date
           */
          {
            original: 123,
            expected: '1970-01-01T00:00:00.123Z',
          },

          /**
           * Convert Number Timestamp return date format
           */
          {
            original: 1717200000000,
            expected: '2024-06-01T00:00:00.000Z',
          },

          /**
           * Weird string return ''
           */
          {
            original: '1717200000000',
            expected: undefined,
          },

          /**
           * Unix format number convert to 1970-01-01 date
           */
          {
            original: 2147234605,
            expected: '1970-01-25T20:27:14.605Z',
          },

          /**
           * Weird Unix format String return ''
           */
          {
            original: '2084076205',
            expected: undefined,
          },
        ],
      },
      {
        name: 'Should keep original array value for checkbox list element',
        element: {
          type: FormElementType.CHECKBOX_LIST,
        },
        testCases: [
          {
            original: [true],
            expected: [true],
          },
        ],
      },
      {
        name: 'Should convert no array value for checkbox list element',
        element: {
          type: FormElementType.CHECKBOX_LIST,
        },
        testCases: [
          {
            original: true,
            expected: [true],
          },
        ],
      },
      {
        name: 'Should convert value for code element',
        element: {
          type: FormElementType.CODE,
        },
        testCases: [
          {
            original: 'line1',
            expected: 'line1',
          },
        ],
      },
      {
        name: 'Should convert value for code element and replace new lines',
        element: {
          type: FormElementType.CODE,
        },
        testCases: [
          {
            original: 'line1\n',
            expected: 'line1\\n',
          },
        ],
      },
      {
        name: 'Should convert value for code element if none-string',
        element: {
          type: FormElementType.CODE,
        },
        testCases: [
          {
            original: 15,
            expected: '15',
          },
        ],
      },
      {
        name: 'Should convert value for code element if no value',
        element: {
          type: FormElementType.CODE,
        },
        testCases: [
          {
            original: '',
            expected: '',
          },
        ],
      },
      {
        name: 'Should convert value for code element if value is undefined',
        element: {
          type: FormElementType.CODE,
        },
        testCases: [
          {
            original: undefined,
            expected: '',
          },
        ],
      },
      {
        name: 'Should convert value for textarea element',
        element: {
          type: FormElementType.TEXTAREA,
        },
        testCases: [
          {
            original: 'line1',
            expected: 'line1',
          },
        ],
      },
      {
        name: 'Should convert value for textarea element and replace new lines',
        element: {
          type: FormElementType.TEXTAREA,
        },
        testCases: [
          {
            original: 'line1\n',
            expected: 'line1\\n',
          },
        ],
      },
      {
        name: 'Should convert value for textarea element if none-string',
        element: {
          type: FormElementType.TEXTAREA,
        },
        testCases: [
          {
            original: 15,
            expected: '15',
          },
        ],
      },
    ])('$name', ({ element, testCases }) => {
      testCases.forEach(({ original, expected }) => {
        expect(convertToElementValue(element as never, original)).toEqual({
          ...element,
          value: expected,
        });
      });
    });
  });

  describe('GetButtonVariant', () => {
    it('Should return allowed variants', () => {
      expect(getButtonVariant(ButtonVariant.DESTRUCTIVE)).toEqual(ButtonVariant.DESTRUCTIVE);
      expect(getButtonVariant(ButtonVariant.PRIMARY)).toEqual(ButtonVariant.PRIMARY);
      expect(getButtonVariant(ButtonVariant.SECONDARY)).toEqual(ButtonVariant.SECONDARY);
    });

    it('Should filter not allowed variant', () => {
      expect(getButtonVariant(ButtonVariant.CUSTOM)).toBeUndefined();
      expect(getButtonVariant(ButtonVariant.HIDDEN)).toBeUndefined();
    });
  });

  describe('applyAcceptedFiles', () => {
    it('should return undefined if acceptFiles is empty', () => {
      const result = applyAcceptedFiles('');
      expect(result).toBeUndefined();
    });

    it('should convert acceptFiles string to an object with file extensions as keys and values as arrays', () => {
      const acceptFiles = '.csv, .png, .txt, .json';
      const result = applyAcceptedFiles(acceptFiles);

      expect(result).toEqual({
        csv: ['.csv'],
        png: ['.png'],
        txt: ['.txt'],
        json: ['.json'],
      });
    });

    it('should handle leading/trailing spaces in acceptFiles string', () => {
      const acceptFiles = '  .csv, .png ,  .txt ,.json  ';
      const result = applyAcceptedFiles(acceptFiles);

      expect(result).toEqual({
        csv: ['.csv'],
        png: ['.png'],
        txt: ['.txt'],
        json: ['.json'],
      });
    });

    it('should append trimmedValue to existing array when extension already exists', () => {
      const acceptFiles = '.csv, .png, .csv';
      const result = applyAcceptedFiles(acceptFiles);

      expect(result).toEqual({
        csv: ['.csv', '.csv'],
        png: ['.png'],
      });
    });
  });

  /**
   * Test toNumberValue function
   */
  describe('toNumberValue', () => {
    it('Should convert non-empty string to number', () => {
      expect(toNumberValue('123')).toEqual(123);
      expect(toNumberValue('0')).toEqual(0);
      expect(toNumberValue('-456')).toEqual(-456);
    });

    it('Should return null for empty string', () => {
      expect(toNumberValue('')).toBeNull();
    });
  });

  describe('formatElementValue', () => {
    const date = new Date('2022-02-02');

    it.each([
      {
        element: {
          type: FormElementType.PASSWORD,
        },
        name: 'password',
        value: '123',
        expectedResult: '*********',
      },
      {
        element: {
          type: FormElementType.DATETIME,
          isUseLocalTime: true,
        },
        name: 'datetime',
        value: date.toISOString(),
        /**
         * None UTC format
         */
        expectedResult: '2022-02-02T00:00:00.000+00:00',
      },
      {
        element: {
          type: FormElementType.DATETIME,
          isUseLocalTime: false,
        },
        name: 'datetime',
        value: date.toISOString(),
        /**
         * UTC format
         */
        expectedResult: date.toISOString(),
      },
      {
        element: {
          type: FormElementType.DATETIME,
        },
        name: 'datetime with no value',
        value: undefined,
        expectedResult: '',
      },
      {
        element: {
          type: FormElementType.TIME,
        },
        name: 'time',
        value: date.toISOString(),
        expectedResult: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      },
      {
        element: {
          type: FormElementType.TIME,
        },
        name: 'time with no value',
        value: undefined,
        expectedResult: '',
      },
      {
        element: {
          type: FormElementType.NUMBER,
        },
        name: 'number',
        value: 15,
        expectedResult: '15',
      },
      {
        element: {
          type: FormElementType.NUMBER,
        },
        name: 'number with no value',
        value: undefined,
        expectedResult: '',
      },
      {
        element: {
          type: FormElementType.TEXTAREA,
        },
        name: 'Text area',
        value: 'line1\\nline2',
        expectedResult: 'line1\nline2',
      },
      {
        element: {
          type: FormElementType.TEXTAREA,
        },
        name: 'Text area',
        value: 'line1',
        expectedResult: 'line1',
      },
      {
        element: {
          type: FormElementType.TEXTAREA,
        },
        name: 'Text area',
        value: 'line1',
        expectedResult: 'line1',
      },
      {
        element: {
          type: FormElementType.TEXTAREA,
        },
        name: 'Text area',
        value: '',
        expectedResult: '',
      },
    ])('Should format value for $name', ({ element, expectedResult, value }) => {
      expect(formatElementValue(element as any, value)).toEqual(expectedResult);
    });
  });

  /**
   * Test applyLabelStyles function
   */
  describe('applyLabelStyles', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return the expected CSS styles', () => {
      const result = applyLabelStyles('white', 'blue');
      expect(result).toEqual('css-test');
    });
  });

  describe('toLocalFormElement', () => {
    it('Should log error messages when there is an error in showIf function', () => {
      const element = {
        uid: 'test-1',
        type: FormElementType.BOOLEAN,
        disableIf: null,
        showIf: `const newValue = 'string'

        if (newValue && ) {

        } `,
      } as any;

      const localElement = toLocalFormElement(element);
      localElement.helpers.showIf({ elements: [] });

      expect(logError).toHaveBeenCalled();
      expect(logError).toHaveBeenCalledWith('Code Error', expect.any(Error));
    });

    it('Should call replaceVariables if passed for showIf helper', () => {
      const replaceVariables = jest.fn((value: string) => value);
      const element = {
        showIf: `const showIf = 'string'`,
      } as any;

      const localElement = toLocalFormElement(element, replaceVariables);
      localElement.helpers.showIf({ elements: [] });

      expect(replaceVariables).toHaveBeenCalled();
      expect(replaceVariables).toHaveBeenCalledWith(`const showIf = 'string'`);
    });

    it('Should log error messages when there is an error in disableIf function', () => {
      const element = {
        disableIf: `const newValue = 'string'

        if (newValue && ) {

        } `,
      } as any;

      const localElement = toLocalFormElement(element);
      localElement.helpers.disableIf({ elements: [] });

      expect(logError).toHaveBeenCalled();
      expect(logError).toHaveBeenCalledWith('Code Error', expect.any(Error));
    });

    it('Should call replaceVariables if passed for disableIf helper', () => {
      const replaceVariables = jest.fn((value: string) => value);
      const element = {
        disableIf: `const disableIf = 'string'`,
      } as any;

      const localElement = toLocalFormElement(element, replaceVariables);
      localElement.helpers.disableIf({ elements: [] });

      expect(replaceVariables).toHaveBeenCalled();
      expect(replaceVariables).toHaveBeenCalledWith(`const disableIf = 'string'`);
    });

    it('Should log error messages when there is an error in getOptions function', () => {
      const replaceVariables = jest.fn((value: string) => value);
      const element = {
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.CODE,
        getOptions: `const newValue = 'string'

        if (newValue && ) {

        } `,
      } as any;

      const localElement = toLocalFormElement(element, replaceVariables);
      localElement.helpers.getOptions({ elements: [], data: {} as any });

      expect(logError).toHaveBeenCalled();
      expect(logError).toHaveBeenCalledWith('Code Error', expect.any(Error));
    });

    it('Should call replaceVariables if passed for getOptions helper', () => {
      const replaceVariables = jest.fn((value: string) => value);
      const element = {
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.CODE,
        getOptions: `const option = 'string'`,
      } as any;

      const localElement = toLocalFormElement(element, replaceVariables);
      localElement.helpers.getOptions({ elements: [], data: {} as any });

      expect(replaceVariables).toHaveBeenCalled();
      expect(replaceVariables).toHaveBeenCalledWith(`const option = 'string'`);
    });

    it('Should not call replaceVariables if passed for getOptions helper with empty value', () => {
      const replaceVariables = jest.fn((value: string) => value);
      const element = {
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.CODE,
        getOptions: '',
      } as any;

      const localElement = toLocalFormElement(element, replaceVariables);
      localElement.helpers.getOptions({ elements: [], data: {} as any });

      expect(replaceVariables).not.toHaveBeenCalled();
    });
  });

  describe('formValueHandler', () => {
    it('Should return object with current values', () => {
      const elements = [
        {
          name: 'test 1',
          id: 'tst1',
          value: '',
        },
        {
          name: 'test 2',
          id: 'tst2',
          value: true,
        },
        {
          name: 'test 3',
          id: 'tst3',
          value: [],
        },
        {
          name: 'test 4',
          id: 'tst4',
          value: ['value1'],
        },
        {
          name: 'test 5',
          id: 'tst5',
          value: {},
        },
        {
          name: 'test 6',
          id: 'tst6',
        },
      ] as any;

      const result = convertElementsToPayload(elements);

      expect(result).toEqual({
        tst1: '',
        tst2: true,
        tst3: [],
        tst4: ['value1'],
        tst5: {},
        tst6: undefined,
      });
    });

    it('Should return correct Element values based on passed object', () => {
      const elements = [
        {
          name: 'test 1',
          id: 'tst1',
          value: '',
        },
        {
          name: 'test 2',
          id: 'tst2',
          value: true,
        },
        {
          name: 'test 3',
          id: 'tst3',
          value: [],
        },
        {
          name: 'test 4',
          id: 'tst4',
          value: ['value1'],
        },
        {
          name: 'test 5',
          id: 'tst5',
          value: {},
        },
        {
          name: 'test 6',
          id: 'tst6',
          value: 1,
        },
      ] as any;

      const objectvalues = {
        tst1: 'Value 1',
        tst3: ['value 1'],
        tst6: 0,
      } as any;

      const result = patchFormValueHandler(elements, objectvalues);

      expect(result).toEqual([
        {
          name: 'test 1',
          id: 'tst1',
          value: 'Value 1',
        },
        {
          name: 'test 2',
          id: 'tst2',
          value: true,
        },
        {
          name: 'test 3',
          id: 'tst3',
          value: ['value 1'],
        },
        {
          name: 'test 4',
          id: 'tst4',
          value: ['value1'],
        },
        {
          name: 'test 5',
          id: 'tst5',
          value: {},
        },
        {
          name: 'test 6',
          id: 'tst6',
          value: 0,
        },
      ]);
    });
  });

  describe('setFormValueHandler', () => {
    it('Should return correct Element values based on passed object', () => {
      const initialelements = [
        {
          name: 'test 1',
          id: 'tst1',
          value: '',
        },
        {
          name: 'test 2',
          id: 'tst2',
          value: true,
        },
        {
          name: 'test 3',
          id: 'tst3',
          value: [],
        },
        {
          name: 'test 4',
          id: 'tst4',
          value: ['value1'],
        },
        {
          name: 'test 5',
          id: 'tst5',
          value: {},
        },
        {
          name: 'test 6',
          id: 'tst6',
          value: 1,
        },
        {
          name: 'test 7',
          id: 'tst7',
          value: 0,
        },
      ] as any;

      const elements = [
        {
          name: 'test 1',
          id: 'tst1',
          value: 'Value 2',
        },
        {
          name: 'test 2',
          id: 'tst2',
          value: false,
        },
        {
          name: 'test 3',
          id: 'tst3',
          value: [],
        },
        {
          name: 'test 4',
          id: 'tst4',
          value: ['value1'],
        },
        {
          name: 'test 5',
          id: 'tst5',
          value: {},
        },
        {
          name: 'test 6',
          id: 'tst6',
          value: 1,
        },
        {
          name: 'test 7',
          id: 'tst7',
          value: 15,
        },
        {
          name: 'test 8',
          id: 'tst8',
          value: 15,
        },
      ] as any;

      const objectvalues = {
        tst1: 'Value 1',
        tst3: ['value 1'],
        tst6: 0,
      } as any;

      const result = setFormValueHandler(elements, initialelements, objectvalues);

      expect(result).toEqual([
        {
          name: 'test 1',
          id: 'tst1',
          value: 'Value 1',
        },
        {
          name: 'test 2',
          id: 'tst2',
          value: true,
        },
        {
          name: 'test 3',
          id: 'tst3',
          value: ['value 1'],
        },
        {
          name: 'test 4',
          id: 'tst4',
          value: ['value1'],
        },
        {
          name: 'test 5',
          id: 'tst5',
          value: {},
        },
        {
          name: 'test 6',
          id: 'tst6',
          value: 0,
        },
        {
          name: 'test 7',
          id: 'tst7',
          value: 0,
        },
        {
          name: 'test 8',
          id: 'tst8',
          value: '',
        },
      ]);
    });
  });

  describe('getElementWithNewType', () => {
    const baseElement = {
      uid: '1',
      id: 'element1',
      labelWidth: 100,
      width: 300,
      value: 'initialValue',
      title: 'Test Element',
      tooltip: 'This is a tooltip',
      section: 'Test Section',
      unit: 'unit',
      helpers: {},
      options: [],
      optionsSource: 'source',
      queryOptions: undefined,
    };
    it.each([
      {
        name: 'STRING',
        newType: FormElementType.STRING,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.STRING,
          value: '',
          hidden: false,
        }),
      },
      {
        name: 'SLIDER',
        newType: FormElementType.SLIDER,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.SLIDER,
        }),
      },
      {
        name: 'NUMBER',
        newType: FormElementType.NUMBER,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.NUMBER,
        }),
      },
      {
        name: 'DATETIME',
        newType: FormElementType.DATETIME,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          isUseLocalTime: false,
          type: FormElementType.DATETIME,
        }),
      },
      {
        name: 'TIME',
        newType: FormElementType.TIME,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.TIME,
        }),
      },
      {
        name: 'DATE',
        newType: FormElementType.DATE,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.DATE,
        }),
      },
      {
        name: 'TIME',
        newType: FormElementType.SELECT,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.SELECT,
        }),
      },
      {
        name: 'DATE',
        newType: FormElementType.PASSWORD,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.PASSWORD,
        }),
      },
      {
        name: 'COLOR',
        newType: FormElementType.COLOR_PICKER,
        element: baseElement,
        expected: expect.objectContaining({
          uid: baseElement.uid,
          id: baseElement.id,
          type: FormElementType.COLOR_PICKER,
        }),
      },
    ])('$name', ({ element, newType, expected }) => {
      expect(getElementWithNewType(element as any, newType)).toEqual(expected);
    });
  });
});
