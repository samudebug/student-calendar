import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  emailField = this.fb.control('', [Validators.required, Validators.email]);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private snackBar: MatSnackBar
  ) {}
  async onSubmit() {
    if (!this.emailField.valid) return;
    const email = this.emailField.value;
    if (email == null) return;
    await this.authService.sendResetPasswordEmail(email);
    this.snackBar.open(
      'An email has been sent with your password reset link',
      undefined,
      { duration: 3000 }
    );
    this.dialogRef.close();
  }
}
