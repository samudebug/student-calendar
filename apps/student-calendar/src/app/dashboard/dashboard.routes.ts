import { Route } from "@angular/router";
import { ClassComponent } from "./class/class.component";
import { ClassesComponent } from "./classes/classes.component";
import { JoinClassComponent } from "../modals/join-class/join-class.component";
import { classRoutes } from "./class/class.routes";
import { FeedComponent } from "./feed/feed.component";

export const dashboardRoutes: Route[] = [
  {
    path: 'classes',
    component: ClassesComponent
  },
  {
    path: 'feed',
    component: FeedComponent
  },
  {
    path: 'classes/invite/:code',
    loadComponent: () => import('./join-class/join-class-page.component').then((mod) => mod.JoinClassPageComponent)
  },
  {
    path: 'classes/:classId',
    component: ClassComponent,
    children: classRoutes
  }
]
