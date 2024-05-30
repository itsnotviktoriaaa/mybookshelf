import { selectLoadingOfSearchBooks, selectSearchBooks } from './search.selector';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IActiveParamsSearch, ISearch } from 'app/models';
import { loadSearchBooks } from './search.actions';
import { TestBed } from '@angular/core/testing';
import { SearchFacade } from './search.facade';
import { mockSearch } from 'app/ngrx';

describe('SearchFacade', () => {
  let facade: SearchFacade;
  let store: MockStore;
  const initialState = {
    search: {
      searchBooks: null,
      loading: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchFacade, provideMockStore({ initialState })],
    });
    facade = TestBed.inject(SearchFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadSearchBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const params: IActiveParamsSearch = {
      q: 'angular',
      maxResults: 40,
      startIndex: 0,
    };

    facade.loadSearchBooks(params);
    expect(dispatchSpy).toHaveBeenCalledWith(loadSearchBooks({ params }));
  });

  it('should return search books from store', () => {
    store.overrideSelector(selectSearchBooks, mockSearch);

    let result: ISearch | null = null;
    facade.getSearchBooks().subscribe(data => {
      result = data;
      expect(result).toEqual(mockSearch);
    });
  });

  it('should return loading state from store', () => {
    const expectedLoadingState = true;
    store.overrideSelector(selectLoadingOfSearchBooks, expectedLoadingState);

    let result: boolean = false;
    facade.getLoadingOfSearchBooks().subscribe(data => {
      result = data;
      expect(result).toEqual(expectedLoadingState);
    });
  });
});
