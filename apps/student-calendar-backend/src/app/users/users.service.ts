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
      userId,
      name: authUser.displayName ?? "",
      ...user
    };
    await auth().updateUser(userId, {displayName: userToUpdate.name,});
    return this.repo.createOrUpdateUser(userId, {...userToUpdate, photoUrl: ''});
  }
}
