import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApiInterceptor } from './interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([ApiInterceptor])), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
