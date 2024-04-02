import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { IUsersRepository } from './repository/IUsersRepository';
import { UsersRepositoryMongo } from './repository/UsersRepositoryMongo';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [forwardRef(() => TasksModule)],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: IUsersRepository,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) =>
        new UsersRepositoryMongo(prismaService),
    },
  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
