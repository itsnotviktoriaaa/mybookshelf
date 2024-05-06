export class CodeMessageHandlerUtil {
  static handlerCodeMessage(message: string | undefined | null, language: string): string {
    let handleMessage: string = 'Something went wrong';

    switch (message) {
      case 'auth/wrong-password':
        switch (language) {
          case 'ru':
            handleMessage = 'Это неправильная почта или пароль';
            break;
          case 'en':
            handleMessage = 'It is a wrong email or password';
            break;
          default:
            handleMessage = 'It is a wrong email or password';
            break;
        }
        break;
      case 'auth/user-not-found':
        switch (language) {
          case 'ru':
            handleMessage = 'Пользователь с данной почтой не существует';
            break;
          case 'en':
            handleMessage = 'User does not exist with this email';
            break;
          default:
            handleMessage = 'User does not exist with this email';
            break;
        }
        break;
      default:
        handleMessage = 'Something went wrong';
        break;
    }

    return handleMessage;
  }
}
