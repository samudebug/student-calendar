import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileInfoComponent } from '../profile-info/profile-info.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, ProfileInfoComponent, NotificationsComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {}
