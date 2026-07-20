import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { ToastService } from '../../shared/services/toast/toast.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const loading = inject(LoadingService);
  const toast = inject(ToastService);
  const router = inject(Router);

  // Skip Login & Refresh APIs
  if (req.url.includes('/Auth/login') || req.url.includes('/Auth/refresh')) {
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
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Refresh already running
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(accessToken => {
            const retryRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${accessToken!}`,
                'X-Tenant-Domain': tenant
              }
            });
            return next(retryRequest);
          })
        );
      }

      // Start Refresh
      isRefreshing = true;
      refreshTokenSubject.next(null);
      return auth.refreshAccessToken().pipe(
        switchMap(res => {
          isRefreshing = false;
          auth.setLogin(res);
          refreshTokenSubject.next(res.data.accessToken);
          const retryRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.data.accessToken}`,
              'X-Tenant-Domain': tenant
            }
          });
          return next(retryRequest);
        }),

        catchError(err => {
          isRefreshing = false;
          refreshTokenSubject.next(null);
          auth.logout();
          toast.error('Session expired. Please login again.');
          router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    }),

    finalize(() => {
      loading.hide();
    })
  );
};
