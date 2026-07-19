import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { PermissionService } from '../services/permission/permission.service';
export const permissionGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)
  const permissionService = inject(PermissionService);
  const permission = route.data['permission'] as string;
   
  if (permissionService.has(permission)) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};
