import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    InfiniteScrollModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  notifications$ = this.notificationService.notifications$;
  showBadge = true;
  currentPage = 1;
  constructor(private notificationService: NotificationsService) {}
  ngOnInit(): void {
    this.notificationService.getNotifications();
  }

  fetchNextPage() {
    this.currentPage++;
    if (this.currentPage <= this.notificationService.totalPages) {
      this.notificationService.getNotifications(this.currentPage);
    }
    this.currentPage = Math.min(
      this.notificationService.totalPages,
      this.currentPage
    );
  }
}
