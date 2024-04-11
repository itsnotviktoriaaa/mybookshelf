import { AuthConfig } from 'angular-oauth2-oidc';

export const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/home',
  clientId: '382002706810-teb9davo49276rcigiqil67s79bn77kb.apps.googleusercontent.com',
  scope: 'openid profile email https://www.googleapis.com/auth/books',
};
