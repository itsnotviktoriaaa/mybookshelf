import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ISearchSmall } from '../../models/personal-library';
import { selectAuthor } from './author.selector';
import { TestBed } from '@angular/core/testing';
import { AuthorFacade } from './author.facade';
import { loadAuthor } from './author.actions';

describe('AuthorFacade', () => {
  let facade: AuthorFacade;
  let store: MockStore;
  const initialState = { author: null };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(AuthorFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadAuthor action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const author = 'Test Author';
    const idOfBook = '123';

    facade.loadAuthor(author, idOfBook);
    expect(dispatchSpy).toHaveBeenCalledWith(loadAuthor({ author, idOfBook }));
  });

  it('should return selected author detail', () => {
    const expectedData: ISearchSmall = {
      totalItems: 1,
      items: [{ id: '1', thumbnail: 'url', title: 'title' }],
    };
    store.overrideSelector(selectAuthor, expectedData);

    facade.getDetailBook().subscribe(data => {
      expect(data).toEqual(expectedData);
    });
  });
});
