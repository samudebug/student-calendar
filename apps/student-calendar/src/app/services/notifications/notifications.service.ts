import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { startOfDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '@prisma/client';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  constructor(private api: ApiService) { }

  async getNotifications() {
    const afterDate = startOfDay(new Date());
    const notifications = await this.api.get<Notification[]>('/notifications', {params: {afterDate: afterDate.toISOString()}});
    this.notificationsSubject.next(notifications);
  }
}
