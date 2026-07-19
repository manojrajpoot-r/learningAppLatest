import { Component, signal, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../../core/models/menu/menu.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',

  animations: [
    trigger('expandCollapse', [
      state('open',
        style({
          height: '*',
          opacity: 1
        })
      ),

      state('closed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden'
        })
      ),

      transition(
        'closed <=> open',
        animate('300ms ease-in-out')
      )
    ])

  ]


})





export class Sidebar {
  private router = inject(Router);
  expandedMenu = signal<string | null>(null);
  isCollapsed = signal(false);
  
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      label: 'Users',
      icon: 'people',
      children: [
        {
          label: 'User List',
          icon: 'list',
          route: '/admin/users',
          permission: 'USER_VIEW'
        },
        {
          label: 'Roles',
          icon: 'security',
          route: '/admin/roles',
          permission: 'ROLE_VIEW'

        }
      ]
    },

    {
      label: 'Products',
      icon: 'inventory',
      children: [
        {
          label: 'Category',
          icon: 'category',
          route: '/admin/category',
          permission: 'CATEGORY_VIEW'
        },
        {
          label: 'Product List',
          icon: 'shopping_cart',
          route: '/admin/products',
          permission: 'PRODUCT_VIEW'
        }
      ]
    }

  ];

  toggleMenu(label: string) {
    this.expandedMenu.update(current => current === label ? null : label)
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.menuItems.forEach(item => {
          if (item.children) {
            const match = item.children.some(
              child => url.includes(child.route!)
            );

            if (match) {
              this.expandedMenu.set(item.label);
            }
          }
        });
      });
  }




  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed);
  }
}



