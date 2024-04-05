import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './repository/IUsersRepository';
import { User } from '@prisma/client';
import { auth } from 'firebase-admin';
import { TasksService } from '../tasks/tasks.service';
import { ClassesService } from '../classes/classes.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private repo: IUsersRepository,
    private taskService: TasksService,
    private classeService: ClassesService,
    private notificationService: NotificationsService
  ) {}

  getByUserId(userId: string) {
    return this.repo.getByUserId(userId);
  }

  async createOrUpdateUser(
    userId: string,
    user: Partial<Omit<User, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ) {
    const authUser = await auth().getUser(userId);
    const userToUpdate = {
      displayName: user.name ?? authUser.displayName,
    };
    await auth().updateUser(userId, userToUpdate);
    if (user.fcmToken) {
      let totalPages = 1;
      let currentPage = 1;
      while (currentPage <= totalPages) {
        const classes = await this.classeService.getByUser(userId, currentPage);
        classes.results.forEach((currentClass) =>
          this.notificationService.subscribeToTopic(
            user.fcmToken,
            `classes-${currentClass.id}`
          )
        );
        totalPages = Math.ceil(classes.total / 30);
        currentPage++;
      }
    }
    return this.repo.createOrUpdateUser(userId, {
      ...user,
      photoUrl: '',
      userId,
      fcmToken: user.fcmToken ?? '',
    });
  }

  async getTasksFeed(userId: string, afterDate?: Date, page?: number) {
    return this.taskService.getByUserId(userId, afterDate, page);
  }
}
