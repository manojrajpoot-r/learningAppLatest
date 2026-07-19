import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { LoginRequest } from '../../models/login-request/login-request';
import { environment } from '../../../environments/environment';
import { LoginRespone } from '../../models/login-response/login-response';
import { BaseApiService } from '../../../shared/services/base-api/base-api.service';
import { Router } from '@angular/router';
import { signal, computed } from '@angular/core';
import { CurrentUser } from '../../models/current-user/current-user';
import { PermissionService } from '../permission/permission.service';
@Service()
export class AuthService extends BaseApiService {

  private router = inject(Router);
  private permissionService = inject(PermissionService)

  token = signal<string | null>(localStorage.getItem('accessToken'));

  currentUser = signal<CurrentUser | null>(
    localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')!)
      : null
  );


  isLoggedIn = computed(() => !!this.token())

  login(request: LoginRequest) {
    return this.http.post<LoginRespone>(`${this.apiUrl}/Auth/login`, request)
  }

  setLogin(res: LoginRespone) {
    this.token.set(res.data.accessToken);
    this.currentUser.set(res.data.user);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
    this.permissionService.setPermissions(res.data.user.permissions);
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }


}
