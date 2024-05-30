import { setUserAction } from './';

describe('AuthFirebase Actions', () => {
  it('should create setUserAction correctly', () => {
    const user = 'testUser';
    const action = setUserAction({ user });
    expect(action.type).toEqual('[User] Set User');
    expect(action.user).toEqual(user);
  });
});
