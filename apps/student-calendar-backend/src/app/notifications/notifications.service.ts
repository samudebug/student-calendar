import { Injectable } from '@nestjs/common';
import { CloudTasksRepo } from './repo/tasks.repo';
import { NotificationRepo } from './repo/notifications.repo';

@Injectable()
export class NotificationsService {
  constructor(
    private taskRepo: CloudTasksRepo,
    private notificationRepo: NotificationRepo
  ) {}
  async scheduleNotification(
    requestUrl: string,
    payload: Record<string, any>,
    scheduleTime: Date
  ) {
    return await this.taskRepo.scheduleTask(requestUrl, payload, scheduleTime);
  }

  sendNotification(token: string, message: Record<string, any>) {
    return this.notificationRepo.sendNotification(token, message);
  }
}
