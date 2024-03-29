import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './repository/IUsersRepository';
import { User } from '@prisma/client';
import { auth } from 'firebase-admin';

@Injectable()
export class UsersService {
  constructor(private repo: IUsersRepository) {

  }

  getByUserId(userId: string) {
    return this.repo.getByUserId(userId);
  }

  async createOrUpdateUser(userId: string, user: Partial<Omit<User, 'id' | 'userId' | 'createdAt'| 'updatedAt'>>) {
    const authUser = await auth().getUser(userId);
    const userToUpdate = {
      displayName: user.name ?? authUser.displayName,

    };
    await auth().updateUser(userId, userToUpdate);
    return this.repo.createOrUpdateUser(userId, {...user, photoUrl: '', userId, fcmToken: ''});
  }
}
