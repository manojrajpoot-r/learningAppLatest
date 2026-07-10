import { Routes } from '@angular/router';
import { Login } from './featurs/auth/login/login';
import { Dashboard } from './featurs/admin/dashboard/dashboard';
import { Home } from './frontend/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Users } from './featurs/admin/users/users';
import { roleGuard } from './core/guards/role-guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [
  {
    path: '',
    //component: Home
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'users',
    component: Users,
    canActivate: [authGuard, permissionGuard],
    data: {
      permission: 'USER_VIEW'
    }

  },


  //always down
  {
    path: '**',
    redirectTo: 'login'
  }

];
