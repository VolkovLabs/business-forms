import { FormElementType, PayloadMode } from '../constants';
import { GetPayloadForRequest } from './request';

describe('Request Utils', () => {
  describe('GetPayloadForRequest', () => {
    const elements: any[] = [
      {
        id: 'name',
        type: FormElementType.STRING,
        value: 'John',
      },
      {
        id: 'age',
        type: FormElementType.NUMBER,
        value: 30,
      },
      {
        id: 'password',
        type: FormElementType.DISABLED,
        value: '123',
      },
    ];

    it('Should return values for all elements', () => {
      expect(
        GetPayloadForRequest({
          elements,
          initial: {},
          request: {
            payloadMode: PayloadMode.ALL,
          } as any,
        })
      ).toEqual({
        name: 'John',
        age: 30,
        password: '123',
      });
    });

    it('Should return values for updated elements', () => {
      expect(
        GetPayloadForRequest({
          elements,
          initial: {
            age: 30,
          },
          request: {
            payloadMode: PayloadMode.UPDATED,
          } as any,
        })
      ).toEqual({
        name: 'John',
      });
    });

    it('Should return values for updated elements with deprecated option', () => {
      expect(
        GetPayloadForRequest({
          elements,
          initial: {
            age: 30,
          },
          request: {
            updatedOnly: true,
          } as any,
        })
      ).toEqual({
        name: 'John',
      });
    });

    it('Should return values from getPayload execution', () => {
      expect(
        GetPayloadForRequest({
          elements,
          initial: {
            role: 'admin',
          },
          request: {
            payloadMode: PayloadMode.CUSTOM,
            getPayload: `
              return elements.reduce((acc, element) => ({
                ...acc,
                [element.id]: element.value
              }), initial)
              `,
          } as any,
        })
      ).toEqual({
        name: 'John',
        age: 30,
        password: '123',
        role: 'admin',
      });
    });
  });
});
