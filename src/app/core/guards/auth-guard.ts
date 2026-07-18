import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { PermissionService } from '../services/permission/permission.service';
export const permissionGuard: CanActivateFn = (route) => {

  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const permission = route.data['permission'] as string;

  if (permissionService.has(permission)) {
    return true;
  }

  return router.createUrlTree(['/admin/dashboard']);

};
