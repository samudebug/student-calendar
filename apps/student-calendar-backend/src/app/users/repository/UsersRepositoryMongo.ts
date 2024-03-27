import { User } from '@prisma/client';
import { IUsersRepository } from './IUsersRepository';
import { PrismaService } from '../../prisma.service';

export class UsersRepositoryMongo implements IUsersRepository {
  constructor(private prismaService: PrismaService) {}
  getByUserId(userId: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
  }
  createOrUpdateUser(
    userId: string,
    user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    return this.prismaService.user.upsert({
      where: {
        userId,
      },
      update: user,
      create: user as Required<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
    });
  }
}
