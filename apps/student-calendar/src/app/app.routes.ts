import { ActivatedRouteSnapshot, Route, RouterState, RouterStateSnapshot } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo,  } from '@angular/fire/auth-guard';
import { DashboardComponent } from './dashboard/dashboard.component';
const redirectUnauthorizedToLogin = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => redirectUnauthorizedTo(`/login?redirectTo=${state.url}`);

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
    redirectTo: '/feed',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    loadChildren: () => import('./dashboard/dashboard.routes').then((mod) => mod.dashboardRoutes),
  },
];
