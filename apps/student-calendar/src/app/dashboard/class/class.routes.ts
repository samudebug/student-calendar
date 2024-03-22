import { Route } from "@angular/router";
import { TasksComponent } from "./tasks/tasks.component";

export const classRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TasksComponent
  }
]
