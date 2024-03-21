import { Route } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { DashboardComponent } from './dashboard/dashboard.component';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((mod) => mod.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(
        (mod) => mod.RegisterComponent
      ),
  },
  {
    path: '',
    component: DashboardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((mod) => mod.dashboardRoutes),
  },
];
