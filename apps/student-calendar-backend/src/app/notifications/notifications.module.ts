import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CloudTasksRepo } from './repo/tasks.repo';
import { NotificationRepo } from './repo/notifications.repo';
import { PrismaService } from '../prisma.service';
import { INotificationsRepository } from './repo/INotificationsRepository';
import { NotificationsRepositoryMongo } from './repo/NotificationsRepositoryMongo';
import { NotificationsController } from './notifications.controller';
import { StudentsModule } from '../students/students.module';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [StudentsModule, ClassesModule],
  providers: [
    NotificationsService,
    CloudTasksRepo,
    NotificationRepo,
    PrismaService,
    {
      provide: INotificationsRepository,
      useFactory: (prismaService: PrismaService) =>
        new NotificationsRepositoryMongo(prismaService),
      inject: [PrismaService],
    },
  ],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
