import { Notification } from '@prisma/client';
import { PaginatedResult } from '../../../models/paginatedResult';
export abstract class INotificationsRepository {
  abstract createNotification(
    notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Notification>;
  abstract getNotificationsForClasses(
    userId: string,
    afterDate?: Date,
    page?: number
  ): Promise<PaginatedResult<Notification>>;
}
