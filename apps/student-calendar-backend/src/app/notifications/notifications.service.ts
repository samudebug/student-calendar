import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CloudTasksRepo } from './repo/tasks.repo';
import { NotificationRepo } from './repo/notifications.repo';
import { INotificationsRepository } from './repo/INotificationsRepository';
import { Notification } from '@prisma/client';
import { StudentsService } from '../students/students.service';
import { ClassesService } from '../classes/classes.service';

@Injectable()
export class NotificationsService {
  constructor(
    private taskRepo: CloudTasksRepo,
    private notificationRepo: NotificationRepo,
    private repo: INotificationsRepository,
    private studentService: StudentsService,
    private classesService: ClassesService
  ) { }
  async scheduleNotification(
    requestUrl: string,
    payload: Record<string, any>,
    scheduleTime: Date
  ) {
    return await this.taskRepo.scheduleTask(requestUrl, payload, scheduleTime);
  }

  async deleteNotificationSchedule(notificationName: string) {
    this.taskRepo.deleteTask(notificationName);
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) {
    if (process.env.NODE_ENV === 'test') {
      const currentClass = await this.classesService.getById(notification.classId);
      if (!currentClass) throw new NotFoundException('Class does not exist');
    }
    if (process.env.NODE_ENV !== 'test') {
      try {
        await this.notificationRepo.sendNotificationToTopic(`classes-${notification.classId}`, {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        });
      } catch (error) {
        Logger.error(error);
      }
    }
    return this.repo.createNotification(notification);
  }

  async subscribeToTopic(token: string, topic: string) {
    return this.notificationRepo.subscribeToTopic(token, topic);
  }

  async getNotificationsForClassesFromUser(userId: string, afterDate?: Date, page?: number) {

    return this.repo.getNotificationsForClasses(userId, afterDate, page);
  }
}
