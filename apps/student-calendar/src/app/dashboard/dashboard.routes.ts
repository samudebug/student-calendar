import { Route } from "@angular/router";

export const dashboardRoutes: Route[] = [
  {
    path: 'classes',
    loadComponent: () => import('./classes/classes.component').then((mod) => mod.ClassesComponent)
  }
]
