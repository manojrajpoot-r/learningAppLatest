import { Component, inject } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutService } from '../../../shared/services/layout/layout.service';
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Header, Footer, Sidebar, MatSidenavModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  public layoutService = inject(LayoutService);
}





