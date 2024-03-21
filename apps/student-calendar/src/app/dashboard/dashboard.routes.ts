import { Route } from "@angular/router";
import { ClassComponent } from "./class/class.component";

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
    path: 'classes/:classId',
    component: ClassComponent,
    loadChildren: () => import('./class/class.routes').then(mod => mod.classRoutes),
  }
]
