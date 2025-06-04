// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: 'https://luna.allinoneconsole.live/api',
  refUrl: 'https://lunagazer.live/play/signup',
  webSocketUrl: 'https://luna.allinoneconsole.live/talpakanhub',
  gameServerUrl: 'https://games.example.com', // Added for casino games
  webSocketConfig: {
    withCredentials: true,
    secure: true,
  },
};
