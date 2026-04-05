// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  mediaUrl: 'http://localhost:3000', // Base URL for uploaded files
  appName: 'Hema DID',
  defaultLanguage: 'en',
  features: {
    enableAnalytics: false,
    enableDebug: true
  }
};