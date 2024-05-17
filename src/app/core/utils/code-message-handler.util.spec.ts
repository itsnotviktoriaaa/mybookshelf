import { CodeMessageHandlerUtil } from './code-message-handler.util';

describe('CodeMessageHandlerUtil', (): void => {
  it('should handle correct message and language', (): void => {
    expect(CodeMessageHandlerUtil.handlerCodeMessage('auth/wrong-password', 'ru')).toEqual(
      'Это неправильная почта или пароль'
    );

    expect(CodeMessageHandlerUtil.handlerCodeMessage('auth/wrong-password', 'en')).toEqual(
      'It is a wrong email or password'
    );

    expect(CodeMessageHandlerUtil.handlerCodeMessage('auth/wrong-password', 'fr')).toEqual(
      'It is a wrong email or password'
    );
  });

  it('should handle incorrect message or language', (): void => {
    const message = 'unknown-code';
    const language = 'fr';
    const expectedMessage = 'Something went wrong';
    expect(CodeMessageHandlerUtil.handlerCodeMessage(message, language)).toEqual(expectedMessage);
  });

  it('should handle specific message codes and languages', (): void => {
    expect(CodeMessageHandlerUtil.handlerCodeMessage('auth/user-not-found', 'en')).toEqual(
      'User does not exist with this email'
    );

    expect(CodeMessageHandlerUtil.handlerCodeMessage('auth/user-not-found', 'ru')).toEqual(
      'Пользователь с данной почтой не существует'
    );

    expect(CodeMessageHandlerUtil.handlerCodeMessage('auth/user-not-found', 'fr')).toEqual(
      'User does not exist with this email'
    );
  });
});
