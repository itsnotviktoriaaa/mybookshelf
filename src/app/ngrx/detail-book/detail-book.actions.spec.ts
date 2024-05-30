import { loadDetailBook, loadDetailBookSuccess, loadDetailBookFailure } from './';
import { testDetailBookSmallInfo } from 'app/ngrx';

describe('Author Actions', () => {
  it('should create the loadDetailBook action', () => {
    const idOfBook = '123';
    const action = loadDetailBook({ idOfBook });

    expect(action.type).toEqual('[Detail Book] Load Detail Book');
    expect(action.idOfBook).toEqual(idOfBook);
  });

  it('should create the loadDetailBookSuccess action', () => {
    const action = loadDetailBookSuccess({ data: testDetailBookSmallInfo });

    expect(action.type).toEqual('[Detail Book] Load Detail Books Success');
    expect(action.data).toEqual(testDetailBookSmallInfo);
  });

  it('should create the loadDetailBookFailure action', () => {
    const error = null;
    const action = loadDetailBookFailure({ error });

    expect(action.type).toEqual('[Detail Book] Load Detail Books Failure');
    expect(action.error).toEqual(null);
  });
});
