import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { provideStore } from '@ngrx/store';

import { provideEffects } from '@ngrx/effects';
import { usersReducer } from './components/store/users/users.reducer';
import { UserEffects } from './components/store/users/users.effects';
import { authReducer } from './components/store/auth/auth.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './components/store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore({
        users: usersReducer,
        auth: authReducer,
    }),
    provideEffects(UserEffects, AuthEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};
