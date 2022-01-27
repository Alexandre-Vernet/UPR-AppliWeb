import { initializeApp } from 'firebase/app';

export const environment = {
    production: false
};


export const firebaseConfig = {
    apiKey: 'AIzaSyBcuJx2dXvKAZQ_REwxuBy2AlkZpQ4lV3I',
    authDomain: 'upr-appliweb.firebaseapp.com',
    projectId: 'upr-appliweb',
    storageBucket: 'upr-appliweb.appspot.com',
    messagingSenderId: '28015055285',
    appId: '1:28015055285:web:343bd454fa005d1d5389fc'
};

initializeApp(firebaseConfig);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
