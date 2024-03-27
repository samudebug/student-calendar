import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Class, Student } from '@prisma/client';
import { ClassesService } from '../../services/classes/classes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DeleteClassComponent } from '../../modals/delete-class/delete-class.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { AuthService } from '../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.css',
})
export class ClassComponent {
  class: Class & { students: Student[] };
  @Input()
  set classId(classId: string) {
    this.setClass(classId);
  }

  constructor(
    private classesService: ClassesService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  async setClass(classId: string) {
    this.class = await this.classesService.getClass(classId);
  }

  openDelete() {
    this.dialog.open(DeleteClassComponent, { data: { id: this.class.id } });
  }

  async openStudents() {
    const user = await firstValueFrom(this.authService.user$);
    const dialogRef = this.dialog.open(StudentListComponent, {
      width: '50%',
      data: {
        students: this.class.students,
        canRemoveStudents: this.class.createdBy === user?.uid,
        userId: user?.uid,
        classId: this.class.id,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setClass(this.class.id);
    });
  }

  goBack() {
    this.router.navigate(['/', 'classes']);
  }

  get inviteUrl() {
    return `${environment.baseurl}/classes/invite/${this.class.code}`;
  }

  copy(text: string) {
    navigator.clipboard.writeText(text);
  }
}
