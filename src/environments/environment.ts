// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://devxxx.azurewebsites.net/api',
  refUrl: 'http://localhost:4200/play/signup',
  webSocketUrl: 'https://devxxx.azurewebsites.net/talpakanhub',
  gameServerUrl: 'https://games.example.com', // Added for casino games
  // baseUrl: 'https://dev.classmatex.com/api',
  // refUrl: 'https://dev.classmatex.com/auth/register',
  // webSocketUrl: 'https://dev.classmatex.com',
  // webSocketConfig: {
  //   withCredentials: true,
  //   secure: true,
  // },
};

/*
 * For easier debugging in developmsent mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
