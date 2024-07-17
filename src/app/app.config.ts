import { ApplicationConfig, provideZoneChangeDetection,  LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch  } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
registerLocaleData(localeEs, 'es');
export const appConfig: ApplicationConfig = {
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch()), provideAnimationsAsync(),  provideToastr()]
};
