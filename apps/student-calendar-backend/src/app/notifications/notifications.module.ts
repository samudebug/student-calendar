import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CloudTasksRepo } from './repo/tasks.repo';
import { NotificationRepo } from './repo/notifications.repo';

@Module({
  providers: [NotificationsService, CloudTasksRepo, NotificationRepo],
  exports: [NotificationsService]
})
export class NotificationsModule {}
