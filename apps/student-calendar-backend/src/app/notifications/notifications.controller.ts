import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../guards/apiKey/apiKey.guard';
import { NotificationsService } from './notifications.service';
import { Notification } from '@prisma/client';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { UserId } from '../../decorators/userId.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  @Post('')
  @UseGuards(ApiKeyGuard)
  createNotification(
    @Body() notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return this.notificationsService.sendNotification(notification);
  }

  @Get('')
  @UseGuards(AuthGuard)
  getNotifications(@UserId() userId: string) {
    return this.notificationsService.getNotificationsForClassesFromUser(userId);
  }
}
