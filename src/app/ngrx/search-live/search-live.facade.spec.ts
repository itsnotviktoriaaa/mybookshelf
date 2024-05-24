import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { loadSearchLiveBooks, resetSearchLiveBooks } from './';
import { TestBed } from '@angular/core/testing';
import { selectSearchLiveBooks } from './';
import { SearchLiveFacade } from './';

describe('SearchLiveFacade', () => {
  let facade: SearchLiveFacade;
  let store: MockStore;
  const initialState = { searchLive: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchLiveFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(SearchLiveFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadSearchLiveBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const textFromInput = 'Test input';
    const typeFromInput = 'Test type';

    facade.loadSearchLiveBooks(textFromInput, typeFromInput);

    expect(dispatchSpy).toHaveBeenCalledWith(loadSearchLiveBooks({ textFromInput, typeFromInput }));
  });

  it('should dispatch resetSearchLiveBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    facade.resetSearchLiveBooks();

    expect(dispatchSpy).toHaveBeenCalledWith(resetSearchLiveBooks({ data: null }));
  });

  it('should return selected search live books', () => {
    const expectedData: string[] = ['book1', 'book2', 'book3'];
    store.overrideSelector(selectSearchLiveBooks, expectedData);

    let result: string[] | null = null;
    facade.getSearchLiveBooks().subscribe(data => {
      result = data;
      expect(result).toEqual(expectedData);
    });
  });
});
