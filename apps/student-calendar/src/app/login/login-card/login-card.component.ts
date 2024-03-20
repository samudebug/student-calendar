import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { ForgotPasswordComponent } from '../../modals/forgot-password/forgot-password.component';

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.css',
})
export class LoginCardComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor(private fb: FormBuilder, private authService: AuthService, private dialog: MatDialog) {}

  async onSubmit() {
    const { email, password } = this.loginForm.value;
    if (email == null || password == null) return;
    await this.authService.login(email, password);
  }

  async openForgotPassword() {
    this.dialog.open(ForgotPasswordComponent)
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
