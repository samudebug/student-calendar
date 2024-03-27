import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../components/top-bar/top-bar.component';
import { RouterModule } from '@angular/router';
import { MessagingService } from '../services/messaging/messaging.service';
import { UsersService } from '../services/users/users.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private messagingService: MessagingService, private userService: UsersService) {

  }
  ngOnInit(): void {
    this.updateToken();
  }

  updateToken() {
    console.log("Requesting permission");
    this.messagingService.requestPermission();
    this.messagingService.getFcmToken()?.then((token) => {
      if (token) {
        this.userService.updateUserInfo({fcmToken: token});
      }
    })
  }
}
