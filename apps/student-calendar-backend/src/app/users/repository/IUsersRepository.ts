import { User } from "@prisma/client";

export abstract class IUsersRepository {
  abstract getByUserId(userId: string): Promise<User>;
  abstract createOrUpdateUser(userId: string, user: Partial<Omit<User, 'id'  | 'createdAt' | 'updatedAt'>>);
}
