import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TasksService } from '../../../services/tasks/tasks.service';
import { TaskElementComponent } from './task-element/task-element.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../../../modals/task-form/task-form.component';
import { Task } from '@prisma/client';
import { AuthService } from '../../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TaskElementComponent,
    InfiniteScrollModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  @Input()
  classId: string;

  tasks$ = this.tasksService.tasks$;
  currentPage = 1;

  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tasksService.getTasks(this.classId, this.currentPage, true);
  }

  openCreate() {
    this.dialog.open(TaskFormComponent, {
      panelClass: ['w-full', 'md:w-1/2'],
      data: { classId: this.classId },
    });
  }

  async openView(taskId: string) {
    const currentTask = await this.tasksService.getTask(this.classId, taskId);
    const currentUser = await firstValueFrom(this.authService.user$);
    this.dialog.open(TaskFormComponent, {
      panelClass: ['w-full', 'md:w-1/2'],
      data: {
        classId: this.classId,
        task: currentTask,
        canEditTask: currentTask.student.userId === currentUser?.uid,
      },
    });
  }

  fetchNextPage() {
    this.currentPage++;
    if (this.currentPage <= this.tasksService.totalPages) {

      this.tasksService.getTasks(this.classId, this.currentPage);
    }
    this.currentPage = Math.min(this.tasksService.totalPages, this.currentPage);
  }
}
