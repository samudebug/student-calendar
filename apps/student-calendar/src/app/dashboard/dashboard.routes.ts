import { Route } from "@angular/router";

export const dashboardRoutes: Route[] = [
  {
    path: 'classes',
    loadComponent: () => import('./classes/classes.component').then((mod) => mod.ClassesComponent)
  },
  {
    path: 'classes/invite/:code',
    loadComponent: () => import('./join-class/join-class-page.component').then((mod) => mod.JoinClassPageComponent),
  },
  {
    path: 'classes/:id',
    loadComponent: () => import('./class/class.component').then((mod) => mod.ClassComponent),
  }
]
