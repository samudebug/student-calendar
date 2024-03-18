import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { TopBarComponent } from '../components/top-bar/top-bar.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css',
})
export class ClassesComponent {
  constructor(private authService: AuthService) {

  }

  logout() {
    this.authService.logout();
  }
}
