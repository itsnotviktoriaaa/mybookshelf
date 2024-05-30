import { setUserAction } from './';
import { userReducer } from './';

describe('AuthFirebase Reducer', () => {
  it('should set user correctly', () => {
    const initialState = { user: null };
    const user = 'testUser';

    const newState = userReducer(initialState, setUserAction({ user }));
    expect(newState.user).toEqual(user);
  });
});
