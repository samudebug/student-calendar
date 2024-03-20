import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClassesService } from '../../services/classes/classes.service';

@Component({
  selector: 'app-remove-student',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './remove-student.component.html',
  styleUrl: './remove-student.component.css',
})
export class RemoveStudentComponent {
  constructor(
    private classesService: ClassesService,
    private dialogRef: MatDialogRef<RemoveStudentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { classId: string; studentId: string }
  ) {}
  async onRemove() {
    try {
      await this.classesService.removeStudentFromClass(
        this.data.classId,
        this.data.studentId
      );
      this.dialogRef.close(true);
    } catch (error) {
      console.log(error);
    }
  }
}
