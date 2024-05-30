import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { AuthFirebaseFacade } from './';
import { selectCurrentUser } from './';
import { setUserAction } from './';

describe('AuthFirebaseFacade', () => {
  let facade: AuthFirebaseFacade;
  let store: MockStore;
  const initialState = { user: null };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthFirebaseFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(AuthFirebaseFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch setUserAction with user value', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const user = 'testUser';

    facade.setUser(user);
    expect(dispatchSpy).toHaveBeenCalledWith(setUserAction({ user }));
  });

  it('should return current user value', (done: DoneFn) => {
    const user = 'testUser';
    store.overrideSelector(selectCurrentUser, user);

    facade.getCurrentUser().subscribe(result => {
      expect(result).toEqual(user);
      done();
    });
  });
});
