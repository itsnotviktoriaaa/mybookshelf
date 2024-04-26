import { NotificationStatus } from './notification.enum';

export interface UserInterface {
  email: string;
  username: string;
  uid?: string;
}

export interface UserSignInterface extends UserInterface {
  password: string;
}

export type NotificationType = {
  message: string;
  status: NotificationStatus.error | NotificationStatus.success | NotificationStatus.info;
};

export interface UserInfoFromGoogle {
  info: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}
