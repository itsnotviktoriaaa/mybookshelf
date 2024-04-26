export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: 'AIzaSyB67xGD4gUa3kfl3rJK4J_ug1x4TJxvXaE',
    authDomain: 'mybookshelff-c1a0f.firebaseapp.com',
    projectId: 'mybookshelff-c1a0f',
    storageBucket: 'mybookshelff-c1a0f.appspot.com',
    messagingSenderId: '555465691254',
    appId: '1:555465691254:web:b7a43bec009264f6154f57',
  },
  oAuthConfig: {
    issuer: 'https://accounts.google.com',
    strictDiscoveryDocumentValidation: false,
    redirectUri: window.location.origin + '/home',
    clientId: '65112255634-ng7630k656779ppmhme8iipohbacudv7.apps.googleusercontent.com',
    scope: 'openid profile email https://www.googleapis.com/auth/books',
    useSilentRefresh: true,
  },
  googleLibraryApi: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/',
  googleVolumeApi: 'https://www.googleapis.com/books/v1/volumes',
};