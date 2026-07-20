import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './frontend/home/home';
import { Toast } from './shared/components/toast/toast';
import { ConfirmDialog } from './shared/components/confirm-dialog/confirm-dialog';
import { Loading } from './shared/components/loading/loading';
import { IdleService } from './core/services/idle/idle.service';
import { AuthService } from './core/services/auth/auth.service';
import { StorageService } from './core/services/storage/storage.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Toast, ConfirmDialog, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private idle = inject(IdleService);
  private auth = inject(AuthService);
  private storage = inject(StorageService);
  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.idle.start();
    }
  }



}
