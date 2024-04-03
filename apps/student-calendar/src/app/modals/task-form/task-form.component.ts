import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TasksService } from '../../services/tasks/tasks.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '@prisma/client';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { startOfDay } from 'date-fns';
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  taskForm = this.fb.group({
    name: ['', [Validators.required]],
    deliverDate: [new Date(), [Validators.required]],
    notes: ['', []],
  });
  loading = false;
  isEditing = false;
  minDate = startOfDay(new Date())
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { classId: string; canEditTask?: boolean; task?: Task },
    private taskService: TasksService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.data.task) {
      this.taskForm.patchValue(this.data.task);
    }
  }

  async onSubmit() {
    try {
      this.loading = true;
      if (this.taskForm.invalid) {
        this.loading = false;
        return;
      }
      this.taskForm.disable();
      const { name, deliverDate, notes } = this.taskForm.value;
      if (name == null || deliverDate == null || notes == null) {
        this.loading = false;
        this.taskForm.enable();
      }
      if (this.isEditing) {
        await this.taskService.updateTask(
          this.data.classId,
          this.data.task!.id,
          { name: name!, deliverDate: deliverDate!, notes: notes! }
        );
      } else {
        await this.taskService.createTask(this.data.classId, {
          name: name!,
          deliverDate: deliverDate!,
          notes: notes!,
        });
      }
      this.dialogRef.close();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
      this.taskForm.enable();
    }
  }

  async openDelete() {
    this.dialog.open(DeleteTaskComponent, {
      data: { classId: this.data.classId, taskId: this.data.task?.id },
    });
  }
}
