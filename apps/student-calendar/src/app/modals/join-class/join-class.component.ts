import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClassesService } from '../../services/classes/classes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-class',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './join-class.component.html',
  styleUrl: './join-class.component.css',
})
export class JoinClassComponent {
  codeField = this.fb.control('', [
    Validators.required,
    Validators.pattern(new RegExp('^[A-Z|0-9]{5}$')),
  ]);
  loading = false;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<JoinClassComponent>, private dialog: MatDialog, private classesService: ClassesService, private router: Router) {}

  async onSubmit() {
    if (this.codeField.invalid) return;
    const code = this.codeField.value;
    if (code == null) return;
    try {
      this.loading = true;
      this.codeField.disable();
      const joinedClass = await this.classesService.joinClass(code);
      if (joinedClass) {
        this.router.navigate(['/', 'classes', joinedClass.id]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
      this.codeField.enable();
      this.codeField.patchValue('');
      this.dialogRef.close();
    }
  }
}
