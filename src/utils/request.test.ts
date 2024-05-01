import { FormElementType, PayloadMode } from '../constants';
import { getPayloadForRequest, toFormData, toJson } from './request';

describe('Request Utils', () => {
  const replaceVariables = jest.fn((str) => str);

  /**
   * Files
   */
  const image = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
  const pdf = new File(['(⌐□_□)'], 'chucknorris.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    replaceVariables.mockClear();
  });

  describe('GetPayloadForRequest', () => {
    const elements: any[] = [
      {
        id: 'name',
        type: FormElementType.STRING,
        value: 'John',
        helpers: {
          showIf: () => true,
        },
      },
      {
        id: 'age',
        type: FormElementType.NUMBER,
        value: 30,
        helpers: {
          showIf: () => true,
        },
      },
      {
        id: 'password',
        type: FormElementType.DISABLED,
        value: '123',
        helpers: {
          showIf: () => true,
        },
      },
    ];

    it('Should return values for all elements', async () => {
      expect(
        await getPayloadForRequest({
          elements,
          initial: {},
          request: {
            payloadMode: PayloadMode.ALL,
          } as any,
          replaceVariables,
        })
      ).toEqual({
        name: 'John',
        age: 30,
        password: '123',
      });
    });

    it('Should return values for visible elements', async () => {
      expect(
        await getPayloadForRequest({
          elements: [
            elements[0],
            elements[1],
            {
              ...elements[2],
              helpers: {
                showIf: () => false,
              },
            },
          ],
          initial: {},
          request: {
            payloadMode: PayloadMode.ALL,
          } as any,
          replaceVariables,
        })
      ).toEqual({
        name: 'John',
        age: 30,
      });
    });

    it('Should return values for updated elements', async () => {
      expect(
        await getPayloadForRequest({
          elements,
          initial: {
            age: 30,
          },
          request: {
            payloadMode: PayloadMode.UPDATED,
          } as any,
          replaceVariables,
        })
      ).toEqual({
        name: 'John',
      });
    });

    it('Should return values from getPayload execution', async () => {
      expect(
        await getPayloadForRequest({
          elements,
          initial: {
            role: 'admin',
          },
          request: {
            payloadMode: PayloadMode.CUSTOM,
            getPayload: `
              return context.panel.elements.reduce((acc, element) => ({
                ...acc,
                [element.id]: element.value
              }),  context.panel.initial)
              `,
          } as any,
          replaceVariables,
        })
      ).toEqual({
        name: 'John',
        age: 30,
        password: '123',
        role: 'admin',
      });

      expect(replaceVariables).toHaveBeenCalled();
    });
  });

  describe('To JSON', () => {
    it('Should work for array', async () => {
      const result = await toJson([1, 2, 3], replaceVariables);

      expect(result).toEqual(expect.any(String));
      expect(JSON.parse(result)).toEqual([1, 2, 3]);
    });
    it('Should read files', async () => {
      const payload = {
        name: 'Alex',
        list: [1, 2, 3],
        file: [image, pdf],
      };

      const result = await toJson(payload, replaceVariables);

      expect(result).toEqual(expect.any(String));
      expect(JSON.parse(result)).toEqual({
        ...payload,
        file: expect.arrayContaining([expect.any(String), expect.any(String)]),
      });
    });
  });

  describe('To FormData', () => {
    it('Should append array values', () => {
      const payload = {
        name: 'Alex',
        list: [1, 2, 3],
        file: [image, pdf],
      };

      const result = toFormData(payload, replaceVariables);

      expect(result.get('name')).toEqual(payload.name);
      /**
       * Numbers array
       */
      expect(result.get('list[0]')).toEqual(payload.list[0].toString());
      expect(result.get('list[1]')).toEqual(payload.list[1].toString());

      /**
       * Files array
       */
      expect(result.get('file[0]')).toEqual(payload.file[0]);
      expect(result.get('file[1]')).toEqual(payload.file[1]);
    });
  });
});
