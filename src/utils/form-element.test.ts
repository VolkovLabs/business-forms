import { Reorder } from './form-element';

describe('Utils', () => {
  it('Should move element up', () => {
    expect(Reorder([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
  });

  it('Should move element down', () => {
    expect(Reorder([1, 2, 3], 2, 1)).toEqual([1, 3, 2]);
  });

  it('Should not mutate original array', () => {
    const array = [1, 2, 3];
    const result = Reorder(array, 2, 1);

    expect(array !== result).toBeTruthy();
  });
});
