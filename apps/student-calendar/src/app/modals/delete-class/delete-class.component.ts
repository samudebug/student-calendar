import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClassesService } from '../../services/classes/classes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-class',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-class.component.html',
  styleUrl: './delete-class.component.css',
})
export class DeleteClassComponent {
  loading = false;
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<DeleteClassComponent>,
    private classesService: ClassesService,
    @Inject(MAT_DIALOG_DATA) private data: {id: string}
  ) {}

  async onDelete() {
    try {
      this.loading = true;
      await this.classesService.deleteClass(this.data.id);
      this.classesService.getClasses();
      this.router.navigate(['/', 'classes']);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
      this.dialogRef.close();
    }
  }
}
