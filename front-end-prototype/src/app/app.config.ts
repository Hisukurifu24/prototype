import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withComponentInputBinding()), provideHttpClient(), provideFirebaseApp(() => initializeApp({"projectId":"tminiapp-unipd","appId":"1:430071646784:web:a9ec78539b8661b40dada5","storageBucket":"tminiapp-unipd.appspot.com","apiKey":"AIzaSyAlibrFDd6upVY8wAliZS4GCdNP14FDu-E","authDomain":"tminiapp-unipd.firebaseapp.com","messagingSenderId":"430071646784","measurementId":"G-WRMNP6THR5"})), provideAnalytics(() => getAnalytics()), ScreenTrackingService, provideAnimationsAsync()]
};
