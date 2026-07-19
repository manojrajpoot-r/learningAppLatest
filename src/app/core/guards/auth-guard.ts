import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Agar user logged in hai
  if (authService.isLoggedIn()) {
    return true;
  }

  // Login page par redirect
  return router.createUrlTree(['/login']);
};
