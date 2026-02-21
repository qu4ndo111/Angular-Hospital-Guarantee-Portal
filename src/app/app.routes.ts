import { Routes } from '@angular/router';
import { guestGuard } from './core/guard/guest-guard';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
      },
      {
        path: 'register-account',
        loadComponent: () => import('./features/auth/register-account/register-account').then((m) => m.RegisterAccount)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
