import { QuantityParsePipe } from './quantity-parse.pipe';

describe('QuantityParsePipe', () => {
  it('create an instance', () => {
    const pipe = new QuantityParsePipe();
    expect(pipe).toBeTruthy();
  });
});
