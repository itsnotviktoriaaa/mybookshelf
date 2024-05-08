import { TransformFavoriteDatePipe } from 'app/shared';

describe('TransformFavoriteDatePipe', () => {
  it('create an instance', () => {
    const pipe = new TransformFavoriteDatePipe();
    expect(pipe).toBeTruthy();
  });
});
