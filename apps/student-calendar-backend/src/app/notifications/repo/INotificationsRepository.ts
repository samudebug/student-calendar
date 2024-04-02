import { Notification } from '@prisma/client';
export abstract class INotificationsRepository {
  abstract createNotification(
    notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Notification>;
  abstract getNotificationsForClasses(
    cuserId: string,
    afterDate?: Date
  ): Promise<Notification[]>;
}
