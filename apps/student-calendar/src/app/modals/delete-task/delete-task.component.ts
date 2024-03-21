import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TasksService } from '../../services/tasks/tasks.service';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css',
})
export class DeleteTaskComponent {
  constructor(
    private dialog: MatDialog,
    private tasksService: TasksService,
    @Inject(MAT_DIALOG_DATA) private data: { classId: string, taskId: string }
  ) {}

  async onDelete() {
    const { classId, taskId } = this.data
    await this.tasksService.deleteTask(classId, taskId);
    this.tasksService.getTasks(classId);
    this.dialog.closeAll();
  }
}
