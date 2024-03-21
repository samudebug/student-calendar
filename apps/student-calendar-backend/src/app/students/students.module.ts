import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { IStudentRepository } from './repo/IStudentRepository';
import { PrismaService } from '../prisma.service';
import { StudentRepositoryMongo } from './repo/StudentRepositoryMongo';

@Module({
  providers: [StudentsService, {
    provide: IStudentRepository,
    useFactory: (prismaService: PrismaService) => new StudentRepositoryMongo(prismaService),
    inject: [PrismaService]
  }, PrismaService],
  exports: [StudentsService]
})
export class StudentsModule {}
