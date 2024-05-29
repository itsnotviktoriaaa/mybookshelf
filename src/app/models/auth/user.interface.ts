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
    | NotificationStatusEnum.error
    | NotificationStatusEnum.success
    | NotificationStatusEnum.info;
};

export interface IUserInfoFromGoogle {
  info: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}
