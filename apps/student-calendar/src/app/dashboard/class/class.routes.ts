import { Route } from "@angular/router";

export const classRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component').then((mod) => mod.TasksComponent),
  }
]
