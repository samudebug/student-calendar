import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { PrismaService } from './prisma.service';
import { TasksModule } from './tasks/tasks.module';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from '../middlewares/request.logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ClassesModule, TasksModule, StudentsModule, UsersModule, ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 200,
  }]),],
  controllers: [AppController],
  providers: [AppService, PrismaService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
