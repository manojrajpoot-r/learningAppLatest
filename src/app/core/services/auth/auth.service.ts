import { HttpClient } from '@angular/common/http';
import { Service, inject, DestroyRef } from '@angular/core';
import { LoginRequest } from '../../models/login-request/login-request';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../models/login-response/login-response';
import { BaseApiService } from '../../../shared/services/base-api/base-api.service';
import { Router } from '@angular/router';
import { signal, computed } from '@angular/core';
import { CurrentUser } from '../../models/current-user/current-user';
import { PermissionService } from '../permission/permission.service';
import { IdleService } from '../idle/idle.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Service()
export class AuthService extends BaseApiService {

  private router = inject(Router);
  private permissionService = inject(PermissionService)
  private idleService = inject(IdleService);
  token = signal<string | null>(localStorage.getItem('accessToken'));
  refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));
  private destroyRef = inject(DestroyRef);

  constructor() {
    super();
    this.idleService.timeout$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.logout();
      });
  }

  currentUser = signal<CurrentUser | null>(
    localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')!)
      : null
  );


  isLoggedIn = computed(() => !!this.token())

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, request)
  }

  setLogin(res: LoginResponse) {
    this.token.set(res.data.accessToken);
    this.refreshToken.set(res.data.refreshToken);
    this.currentUser.set(res.data.user);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
    this.permissionService.setPermissions(res.data.permissions);
    this.idleService.start();
  }


  logout(removeStorage = true) {
    if (removeStorage) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('permissions');
    }
    this.token.set(null);
    this.refreshToken.set(null);
    this.currentUser.set(null);
    this.idleService.stop();
    this.router.navigate(['/admin/login']);
  }

  refreshAccessToken() {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/Auth/refresh`,
      {
        refreshToken: this.refreshToken()
      }
    );
  }



}
