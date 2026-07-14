import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading/loading.service';
import { catchError, throwError, finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const loading = inject(LoadingService);
  const toast = inject(ToastService);
  const router = inject(Router);
  loading.show();
  const token = auth.token();
  const tenant = 'ecom.saas.com';

  const request = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Tenant-Domain': tenant
      }
    })
    : req;

  return next(request).pipe(
    catchError(error => {
      switch (error.status) {
        case 401:
          toast.error('Session Expired');
          router.navigate(['/login']);
          break;
        case 403:
          toast.warning('Access Denied');
          break;
        case 500:
          toast.error('Server Error');
          break;
      }
      return throwError(() => error);
    }),

    finalize(() => {
      loading.hide();
    })

  );

};
