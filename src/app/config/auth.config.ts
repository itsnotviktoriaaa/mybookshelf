import { AuthConfig } from 'angular-oauth2-oidc';

export const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/home',
  clientId: '65112255634-ng7630k656779ppmhme8iipohbacudv7.apps.googleusercontent.com',
  scope: 'openid profile email https://www.googleapis.com/auth/books',
  useSilentRefresh: true,
};
