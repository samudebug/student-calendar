import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { IClassesRepository } from './repository/IClassesRepository';
import { ClassRepositoryMongo } from './repository/ClassesRepositoryMongo';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ClassesController],
  providers: [
    ClassesService,
    {
      provide: IClassesRepository,
      useFactory: (prismaService: PrismaService) => new ClassRepositoryMongo(prismaService),
      inject: [PrismaService]
    },
    PrismaService,
  ],
})
export class ClassesModule {}
