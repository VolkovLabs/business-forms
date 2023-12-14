import { PayloadMode } from './constants';
import { getMigratedOptions } from './migration';
import { PanelOptions } from './types';

describe('Migration', () => {
  it('Should return panel options', () => {
    const options: Partial<PanelOptions> = {
      sync: true,
      initial: {} as any,
      update: {} as any,
    };

    expect(
      getMigratedOptions({
        options: options as any,
      } as any)
    ).toEqual(options);
  });

  describe('3.4.0', () => {
    it('Should normalize requestOptions.updatedOnly', () => {
      expect(
        getMigratedOptions({ options: { initial: { updatedOnly: true }, update: { updatedOnly: true } } } as any)
      ).toEqual({
        initial: {
          payloadMode: PayloadMode.UPDATED,
        },
        update: {
          payloadMode: PayloadMode.UPDATED,
        },
      });
      expect(
        getMigratedOptions({ options: { initial: { updatedOnly: false }, update: { updatedOnly: false } } } as any)
      ).toEqual({
        initial: {
          payloadMode: PayloadMode.ALL,
        },
        update: {
          payloadMode: PayloadMode.ALL,
        },
      });
      expect(
        getMigratedOptions({
          options: {
            initial: { updatedOnly: true, payloadMode: PayloadMode.ALL },
            update: { updatedOnly: true, payloadMode: PayloadMode.ALL },
          },
        } as any)
      ).toEqual({
        initial: {
          payloadMode: PayloadMode.ALL,
        },
        update: {
          payloadMode: PayloadMode.ALL,
        },
      });
    });
  });
});
