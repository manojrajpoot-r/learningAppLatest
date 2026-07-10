import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '../../../core/models/login-request/login-request';
import { LoginRespone } from '../../../core/models/login-response/login-response';
import { Router } from '@angular/router';
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
      isPlatformUser: false
    };
    console.log(request);
    this.authService.login(request).subscribe({
      next: (res) => {
        // localStorage.setItem('accessToken', res.data.accessToken);
        // localStorage.setItem('currentUser', JSON.stringify(res.data.user))
        //signal
        this.authService.setLogin(res);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const message = error.error?.message || 'Something went wrong';
        alert(message);
      }
    });

  }



}
