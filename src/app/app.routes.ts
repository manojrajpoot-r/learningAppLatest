import { Routes } from '@angular/router';
import { Login } from './featurs/auth/login/login';
import { Dashboard } from './featurs/admin/dashboard/dashboard';
import { Users } from './featurs/admin/users/users';
import { AdminLayout } from './layouts/admin-layout/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth-guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  },


  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: Login
      },


      {
        path: '',
        component: AdminLayout,
        canActivate: [authGuard],
        children: [

          {

            path: 'dashboard',
            component: Dashboard
          },


          {
            path: 'users',
            component: Users,
            canActivate: [permissionGuard],
            data: {
              permission: 'USER_VIEW'
            }
          }

        ]
      }

    ]
  },


  {
    path: '**',
    redirectTo: 'admin/login'
  }

];
