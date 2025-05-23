// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: 'https://lunagazer-api.azurewebsites.net/api',
  refUrl: 'https://lunagazer-api.azurewebsites.net//play/signup',
  webSocketUrl: 'https://lunagazer-api.azurewebsites.net/talpakanhub',
  gameServerUrl: 'https://games.example.com', // Added for casino games
  webSocketConfig: {
    withCredentials: true,
    secure: true,
  },
};
