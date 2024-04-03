import { Notification } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { INotificationsRepository } from './INotificationsRepository';
import { PaginatedResult } from '../../../models/paginatedResult';

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
  async getNotificationsForClasses(
    userId: string,
    afterDate?: Date,
    page = 1
  ): Promise<PaginatedResult<Notification>> {
    const total = await this.prismaService.notification.count({
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
    const results = await this.prismaService.notification.findMany({
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
      take: 30,
      skip: (page - 1) * 30
    });
    return {
      total,
      results,
      page
    }
  }
}
