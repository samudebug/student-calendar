import { Notification } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { INotificationsRepository } from './INotificationsRepository';

export class NotificationsRepositoryMongo implements INotificationsRepository {
  constructor(private prismaService: PrismaService) { }
  createNotification({
    body,
    classId,
    title,
    data
  }: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    return this.prismaService.notification.create({
      data: {
        title,
        body,
        classId,
        data
      },
    });
  }
  getNotificationsForClasses(
    userId: string,
    afterDate?: Date
  ): Promise<Notification[]> {
    return this.prismaService.notification.findMany({
      where: {
        class: {
          students: {
            some: {
              userId
            }
          }
        },
        createdAt: {
          gte: afterDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
