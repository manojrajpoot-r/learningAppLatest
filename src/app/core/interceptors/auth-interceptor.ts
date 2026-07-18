import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { catchError, throwError, finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const loading = inject(LoadingService);
  const toast = inject(ToastService);
  const router = inject(Router);

  // Skip Login API
  if (req.url.includes('/Auth/login')) {
    return next(req);
  }

  loading.show();

  const token = auth.token();
  const tenant = window.location.hostname;

  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Tenant-Domain': tenant
      }
    });
  }

  return next(request).pipe(
    catchError(error => {
      if (error.status === 401) {
        auth.logout();
        toast.error('Session Expired');
      }
      return throwError(() => error);
    }),

    finalize(() => {
      loading.hide();
    })
  );

};
