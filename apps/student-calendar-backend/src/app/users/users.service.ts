import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './repository/IUsersRepository';
import { User } from '@prisma/client';
import { auth } from 'firebase-admin';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class UsersService {
  constructor(private repo: IUsersRepository, private taskService: TasksService) {

  }

  getByUserId(userId: string) {
    return this.repo.getByUserId(userId);
  }

  async createOrUpdateUser(userId: string, user: Partial<Omit<User, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    const authUser = await auth().getUser(userId);
    const userToUpdate = {
      displayName: user.name ?? authUser.displayName,

    };
    await auth().updateUser(userId, userToUpdate);
    return this.repo.createOrUpdateUser(userId, { ...user, photoUrl: '', userId, fcmToken: user.fcmToken ?? '' });
  }


  async getTasksFeed(userId: string, afterDate?: Date, page?: number) {
    return this.taskService.getByUserId(userId, afterDate, page);
  }


}
