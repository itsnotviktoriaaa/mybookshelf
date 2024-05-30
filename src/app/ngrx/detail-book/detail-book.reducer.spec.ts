import { loadDetailBook, loadDetailBookFailure, loadDetailBookSuccess } from './';
import { testDetailBookSmallInfo } from 'app/ngrx';
import { Action } from '@ngrx/store';
import { DetailBookState } from './';
import { detailReducer } from './';

describe('Detail Book Reducer', () => {
  const initialState: DetailBookState = {
    detailBook: null,
    isLoading: false,
  };

  it('should set isLoading to true on loadDetailBook', () => {
    const action = loadDetailBook({ idOfBook: '123' });
    const newState = detailReducer(initialState, action);
    expect(newState.isLoading).toBeTrue();
    expect(newState.detailBook).toBeNull();
  });

  it('should set detailBook and isLoading to false on loadDetailBookSuccess', () => {
    const action = loadDetailBookSuccess({ data: testDetailBookSmallInfo });
    const newState = detailReducer(initialState, action);
    expect(newState.isLoading).toBeFalse();
    expect(newState.detailBook).toEqual(testDetailBookSmallInfo);
  });

  it('should set detailBook to null and isLoading to false on loadDetailBookFailure', () => {
    const action = loadDetailBookFailure({ error: null });
    const newState = detailReducer(initialState, action);
    expect(newState.isLoading).toBeFalse();
    expect(newState.detailBook).toBeNull();
  });

  it('should return the current state on unknown action', () => {
    const unknownAction = {} as Action;
    const newState = detailReducer(initialState, unknownAction);
    expect(newState).toEqual(initialState);
  });
});
