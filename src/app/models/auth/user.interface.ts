import { NotificationStatusEnum } from './notification.enum';

export interface IUser {
  email: string;
  username: string;
  uid?: string;
}

export interface IUserSign extends IUser {
  password: string;
}

export type NotificationType = {
  message: string;
  status:
    | NotificationStatusEnum.ERROR
    | NotificationStatusEnum.SUCCESS
    | NotificationStatusEnum.INFO;
};

export interface IUserInfoFromGoogle {
  info: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}
