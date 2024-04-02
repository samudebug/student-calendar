import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { StudentsModule } from '../students/students.module';
import { ClassesModule } from '../classes/classes.module';
import { ITasksRepository } from './repository/ITasksRepository';
import { PrismaService } from '../prisma.service';
import { TasksRepositoryMongo } from './repository/TasksRepositoryMongo';

import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [StudentsModule, ClassesModule, NotificationsModule, forwardRef(() => UsersModule)],
  providers: [
    TasksService,
    {
      provide: ITasksRepository,
      useFactory: (prismaService: PrismaService) =>
        new TasksRepositoryMongo(prismaService),
      inject: [PrismaService],
    },
    PrismaService,
  ],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
