import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { LayoutService } from '../../../shared/services/layout/layout.service';
import { ConfirmService } from '../../../shared/services/confirm/confirm.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenu,
    MatMenuTrigger
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);
  public layoutService = inject(LayoutService);
  private confirm = inject(ConfirmService);
  showDropdown = false;


  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  logout() {
    this.confirm.open({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.authService.logout();
      }
    });
  }
}
