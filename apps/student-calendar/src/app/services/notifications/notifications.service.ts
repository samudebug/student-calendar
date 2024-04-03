import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { startOfDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '@prisma/client';
import { PaginatedResult } from '../../models/paginatedResult';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  totalPages = 1;

  constructor(private api: ApiService) { }

  async getNotifications(page?: number) {
    const afterDate = startOfDay(new Date());
    const pageToFetch = Math.min(this.totalPages, page ?? 1);

    const notifications = await this.api.get<PaginatedResult<Notification>>('/notifications', {params: {afterDate: afterDate.toISOString(), page: pageToFetch.toString()}});
    this.totalPages = Math.ceil(notifications.total / 30);
    const oldNotifs = this.notificationsSubject.value;
    this.notificationsSubject.next(oldNotifs.concat(notifications.results));
  }
}
