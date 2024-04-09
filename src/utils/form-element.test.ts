import { FormElementType } from '../constants';
import { ButtonVariant } from '../types';
import { applyLabelStyles, convertToElementValue, getButtonVariant, reorder } from './form-element';

/**
 * Mock @emotion/css
 */
jest.mock('@emotion/css', () => ({
  css: jest.fn(() => 'css-test'),
  keyframes: jest.fn((styles) => `keyframes-${styles}`),
}));

describe('Utils', () => {
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
          {
            original: 'abc',
            expected: 'abc',
          },
          {
            original: 123,
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
            expected: [],
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
});
