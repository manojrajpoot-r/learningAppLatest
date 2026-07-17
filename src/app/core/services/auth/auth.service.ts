import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { LoginRequest } from '../../models/login-request/login-request';
import { environment } from '../../../environments/environment';
import { LoginRespone } from '../../models/login-response/login-response';
import { BaseApiService } from '../../../shared/services/base-api/base-api.service';
import { Router } from '@angular/router';
import { signal, computed } from '@angular/core';
import { CurrentUser } from '../../models/current-user/current-user';
@Service()
export class AuthService extends BaseApiService {

  private router = inject(Router);
  //signal
  token = signal<string | null>(localStorage.getItem('accessToken'));
  // getToken() {
  //   return localStorage.getItem('accessToken');
  // }

  currentUser = signal<CurrentUser | null>(
    localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')!)
      : null
  );
  //  getCurrentUser() {
  //     const user = localStorage.getItem('currentUser');
  //     return user ? JSON.parse(user) : null;
  //   }

  //computed signal
  isLoggedIn = computed(() => !!this.token())

  // isLoggedIn() {
  //   return !!localStorage.getItem('accessToken');
  // }



  login(request: LoginRequest) {
    return this.http.post<LoginRespone>(`${this.apiUrl}/Auth/login`, request)
  }

  setLogin(res: LoginRespone) {
    this.token.set(res.data.accessToken);
    this.currentUser.set(res.data.user);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
  }

  hasPermission(permission: string) {
    return this.currentUser()?.permissions.includes(permission) ?? false;
  }

  // hasPermission(permission: string): boolean {
  //   const user = this.getCurrentUser();

  //   if (!user) {
  //     return false;
  //   }
  //   return user.permissions.includes(permission);
  // }
  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // logout() {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('currentUser');
  //   localStorage.clear();
  //   this.router.navigate(['/login']);
  // }
}
