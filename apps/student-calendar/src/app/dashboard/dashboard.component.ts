import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../components/top-bar/top-bar.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MessagingService } from '../services/messaging/messaging.service';
import { UsersService } from '../services/users/users.service';
import { MatTabsModule } from '@angular/material/tabs';
import { filter } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent, MatTabsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private messagingService: MessagingService,
    private userService: UsersService,
    private router: Router
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const lastElement = event.url.split('/').pop();
        if (lastElement === 'feed') {
          this.shouldShowTabs = true;
          this.activeLink = 'Feed';

        } else if (lastElement === 'classes') {
          this.shouldShowTabs = true;
          this.activeLink = 'Classes';

        } else {
          this.shouldShowTabs = false;
        }
      }
    })
  }
  links = ['Feed', 'Classes'];
  activeLink = 'Feed';
  shouldShowTabs = true;
  ngOnInit(): void {
    this.updateToken();
  }

  updateToken() {
    console.log('Requesting permission');
    this.messagingService.requestPermission();
    this.messagingService.getFcmToken()?.then((token) => {
      if (token) {
        this.userService.updateUserInfo({ fcmToken: token });
      }
    });
  }
}
