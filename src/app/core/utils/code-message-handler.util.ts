export class CodeMessageHandlerUtil {
  static handlerCodeMessage(message: string | undefined | null): string {
    let handleMessage: string = 'Something went wrong';

    switch (message) {
      case 'auth/wrong-password':
        handleMessage = 'It is a wrong email or password';
        break;
      case 'auth/user-not-found':
        handleMessage = 'User does not exist with this email';
        break;
    }
    return handleMessage;
  }
}
