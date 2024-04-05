import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { IUsersRepository } from './repository/IUsersRepository';
import { UsersRepositoryMongo } from './repository/UsersRepositoryMongo';
import { TasksModule } from '../tasks/tasks.module';
import { ClassesModule } from '../classes/classes.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [forwardRef(() => TasksModule), ClassesModule, NotificationsModule],
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
export class UsersModule { }
