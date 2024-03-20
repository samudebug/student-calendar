import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Student } from '@prisma/client';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RemoveStudentComponent } from '../../modals/remove-student/remove-student.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {students: Student[], canRemoveStudents: boolean, userId: string, classId: string}, private dialog: MatDialog) {

  }

  openRemove(studentId: string) {
    const dialogRef = this.dialog.open(RemoveStudentComponent, {data: {classId: this.data.classId, studentId}});
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const removedStudentIndex = this.data.students.findIndex((el) => el.userId === studentId);
        if (removedStudentIndex > -1) {
          this.data.students.splice(removedStudentIndex, 1);
        }
      }
    })
  }
}
