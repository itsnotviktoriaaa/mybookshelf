import { setUserAction } from './auth-firebase.actions';
import { userReducer } from './auth-firebase.reducer';

describe('AuthFirebase Reducer', () => {
  it('should set user correctly', () => {
    const initialState = { user: null };
    const user = 'testUser';

    const newState = userReducer(initialState, setUserAction({ user }));
    expect(newState.user).toEqual(user);
  });
});
