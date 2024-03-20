import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { ClassesService } from '../../services/classes/classes.service';

@Component({
  selector: 'app-create-class',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInput, MatButtonModule],
  templateUrl: './create-class.component.html',
  styleUrl: './create-class.component.css',
})
export class CreateClassComponent {
  nameField = this.fb.control('', [Validators.required]);
  loading = false;
  constructor(private fb: FormBuilder, private classesService: ClassesService, private dialogRef: MatDialogRef<CreateClassComponent>) {

  }

  async onSubmit() {
    if (this.nameField.invalid) return;
    const name = this.nameField.value;
    if (name == null) return;
    try {
      this.loading = true;
      this.nameField.disable();
      await this.classesService.createClass({name});
      this.dialogRef.close();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
      this.nameField.enable();
      this.nameField.patchValue('');
    }
  }
}
