import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { PrismaService } from './prisma.service';
import { TasksModule } from './tasks/tasks.module';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from '../middlewares/request.logger.middleware';

@Module({
  imports: [ClassesModule, TasksModule, StudentsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
