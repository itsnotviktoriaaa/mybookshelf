import { selectCurrentUser } from './auth-firebase.selector';

describe('AuthFirebase Selector', () => {
  it('should select current user from state', () => {
    const initialState = { user: 'testUser' };
    const currentUser = selectCurrentUser.projector(initialState);
    expect(currentUser).toEqual('testUser');
  });
});
