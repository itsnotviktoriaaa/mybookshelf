import { selectLoadingOfSearchBooks, selectSearchBooks } from './search.selector';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IActiveParamsSearch, ISearch } from '../../modals/user';
import { loadSearchBooks } from './search.actions';
import { TestBed } from '@angular/core/testing';
import { SearchFacade } from './search.facade';

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
    const expectedSearchBooks: ISearch = {
      totalItems: 2,
      items: [
        {
          id: '1',
          thumbnail: 'thumbnail1',
          title: 'Book 1',
          authors: ['Author 1'],
          publishedDate: '2024-01-01',
          publisher: 'Publisher 1',
          categories: ['Category 1'],
          pageCount: 200,
        },
        {
          id: '2',
          thumbnail: 'thumbnail2',
          title: 'Book 2',
          authors: ['Author 2'],
          publishedDate: '2024-02-01',
          publisher: 'Publisher 2',
          categories: ['Category 2'],
          pageCount: 300,
        },
      ],
    };
    store.overrideSelector(selectSearchBooks, expectedSearchBooks);

    let result: ISearch | null = null;
    facade.getSearchBooks().subscribe(data => {
      result = data;
      expect(result).toEqual(expectedSearchBooks);
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
