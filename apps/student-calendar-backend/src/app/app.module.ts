import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { PrismaService } from './prisma.service';
import { TasksModule } from './tasks/tasks.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [ClassesModule, TasksModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
