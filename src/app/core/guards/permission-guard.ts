import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
export const permissionGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)
  const permission = route.data['permission'] as string;

  if (authService.hasPermission(permission)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
