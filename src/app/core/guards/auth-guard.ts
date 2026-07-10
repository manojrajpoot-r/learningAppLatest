import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  //  const isLogIn = authService.getToken();
  // if (isLogIn) {
  //   return true;
  // }
  //signal
  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);

};
