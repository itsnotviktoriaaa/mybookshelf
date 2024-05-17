import { ReduceLetterPipe } from './reduce-letter.pipe';

describe('ReduceLetterPipe', () => {
  let pipe: ReduceLetterPipe;
  const stringExample =
    "Here should be a big text with some examples and etc. Cate Blanchett is my favourite actress, especially when I have watch a movie, which named is Carol. It is the best movie, this Carol's acting is incredible thing, This ringing silence, gazes between two main characters. She is like a leonine, uncanny actress.";

  const smallStringExample = 'Victoria';

  beforeEach((): void => {
    pipe = new ReduceLetterPipe();
  });

  it('create an instance', (): void => {
    expect(pipe).toBeTruthy();
  });

  it('should return value if value is falsy', (): void => {
    const result: string = pipe.transform('', 'book-name');

    expect(result).toBe('');
  });

  it('should exist quantity possible letter in book-name', (): void => {
    pipe.transform(stringExample, 'book-name');
    const result: number = pipe.quantityPossibleLetter;

    expect(result).toBe(16);
  });

  it('should exist quantity possible letter in book-author', (): void => {
    pipe.transform(stringExample, 'book-author');
    const result: number = pipe.quantityPossibleLetter;

    expect(result).toBe(18);
  });

  it('should exist quantity possible letter in author', (): void => {
    pipe.transform(stringExample, 'author');
    const result: number = pipe.quantityPossibleLetter;

    expect(result).toBe(281);
  });

  it('should have reducing in book-name', (): void => {
    const result: string = pipe.transform(stringExample, 'book-name');

    expect(result).toBe('Here should be ...');
  });

  it('should have reducing in book-author', (): void => {
    const result: string = pipe.transform(stringExample, 'book-author');

    expect(result).toBe('Here should be a ...');
  });

  it('should have reducing in author', (): void => {
    const result: string = pipe.transform(stringExample, 'author');

    expect(result).toBe(
      "Here should be a big text with some examples and etc. Cate Blanchett is my favourite actress, especially when I have watch a movie, which named is Carol. It is the best movie, this Carol's acting is incredible thing, This ringing silence, gazes between two main characters. She is..."
    );
  });

  it('should not have reducing in book-name', (): void => {
    const result: string = pipe.transform(smallStringExample, 'book-name');

    expect(result).toBe('Victoria');
  });

  it('should not have reducing in book-author', (): void => {
    const result: string = pipe.transform(smallStringExample, 'book-author');

    expect(result).toBe('Victoria');
  });

  it('should not have reducing in author', (): void => {
    const result: string = pipe.transform(smallStringExample, 'author');

    expect(result).toBe('Victoria');
  });
});
