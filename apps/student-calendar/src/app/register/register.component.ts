import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterCardComponent } from './register-card/register-card.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterCardComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {}
