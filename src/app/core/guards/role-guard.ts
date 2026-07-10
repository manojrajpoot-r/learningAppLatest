
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  const allowedRoles = route.data['roles'] as string[];

  if (user && allowedRoles.some(role => user.roles.includes(role))) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);

};
