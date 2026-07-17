import { Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-sidebar',
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isCollapsed = signal(false);
  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed);
  }
}



