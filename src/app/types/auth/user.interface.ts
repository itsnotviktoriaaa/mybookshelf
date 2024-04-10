export interface UserInterface {
  email: string;
  username: string;
}

export interface UserSignInterface extends UserInterface {
  password: string;
}

export enum NotificationStatus {
  error,
  success,
  info,
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
