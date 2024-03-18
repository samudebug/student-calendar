import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'tarefas-app-exemplo',
          appId: '1:215554073421:web:d5574560896f61b3fc4d04',
          databaseURL: 'https://tarefas-app-exemplo.firebaseio.com',
          storageBucket: 'tarefas-app-exemplo.appspot.com',
          apiKey: 'AIzaSyDBW9A4n7cSGlHGy-bxH13e-g1alcJJuMI',
          authDomain: 'tarefas-app-exemplo.firebaseapp.com',
          messagingSenderId: '215554073421',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
  ],
};
