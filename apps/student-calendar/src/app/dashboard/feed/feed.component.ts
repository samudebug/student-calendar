import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { TaskElementComponent } from '../class/tasks/task-element/task-element.component';
import { Class, Student, Task } from '@prisma/client';
import { FeedService } from '../../services/feed/feed.service';
import { TasksService } from '../../services/tasks/tasks.service';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../../modals/task-form/task-form.component';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    TaskElementComponent,
    MatProgressSpinnerModule,
    InfiniteScrollModule
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  mockDate = new Date();
  feed$ = this.feedService.feed$;
  loading = true;
  currentPage = 1;
  constructor(
    private feedService: FeedService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFeed();
  }

  async getFeed() {
    await this.feedService.getFeed();
    this.loading = false;
  }

  async openView(task: Task & { student: Student; class: Class }) {
    const currentUser = await firstValueFrom(this.authService.user$);
    this.dialog.open(TaskFormComponent, {
      panelClass: ['w-full', 'md:w-1/2'],
      data: {
        classId: task.classId,
        task: task,
        canEditTask: task.student.userId === currentUser?.uid,
      },
    });
  }

  fetchNextPage() {
    if (!this.loading) {
      this.currentPage++;
      if (this.currentPage <= this.feedService.totalPages) {
        this.feedService.getFeed(this.currentPage);
      }
      this.currentPage = Math.min(
        this.feedService.totalPages,
        this.currentPage
      );
    }
  }
}
