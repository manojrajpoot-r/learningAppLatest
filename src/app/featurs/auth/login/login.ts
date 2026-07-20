import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '../../../core/models/login-request/login-request';
import { LoginResponse } from '../../../core/models/login-response/login-response';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast/toast.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  //input form
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }


    const request: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,

    };

    this.authService.login(request).subscribe({
      next: (res) => {
        this.authService.setLogin(res);
        this.toast.success(res.message);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        const message = error.error?.message || 'Something went wrong';
        this.toast.error(message);

      }
    });

  }



}
