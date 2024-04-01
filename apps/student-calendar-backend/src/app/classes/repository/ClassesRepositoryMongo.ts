import { Class, Student } from '@prisma/client';
import { IClassesRepository } from './IClassesRepository';
import { PrismaService } from '../../prisma.service';

export class ClassRepositoryMongo implements IClassesRepository {
  constructor(private prismaService: PrismaService) {}
  async removeStudentFromClass(classId: string, studentId: string): Promise<boolean> {
    return !!(await this.prismaService.student.deleteMany({
      where: {
        classId,
        userId: studentId
      }
    }))
  }
  getByCode(code: string): Promise<Class & {students: Student[]}> {
    return this.prismaService.class.findUnique({
      where: {
        code,
      },
      include: {
        students: true
      }
    });
  }
  addStudentToClass(
    classId: string,
    {
      userId,
      name,
      photoUrl,
    }: { userId: string; name: string; photoUrl: string }
  ) {
    return this.prismaService.class.update({
      where: {
        id: classId,
      },
      data: {
        students: {
          create: {
            userId,
            name,
            photoUrl,
          },
        },
      },
    });
  }
  async deleteById(id: string): Promise<boolean> {
    return !!(await this.prismaService.class.delete({
      where: {
        id,
      },
    }));
  }
  add(
    { name, code, createdBy }: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>,
    {
      userId,
      name: userName,
      photoUrl,
    }: { userId: string; name: string; photoUrl: string }
  ): Promise<Class> {
    return this.prismaService.class.create({
      data: {
        name,
        code,
        createdBy,
        students: {
          create: {
            userId: userId,
            name: userName,
            photoUrl: photoUrl,
          },
        },
      },
    });
  }
  updateById(
    id: string,
    userId: string,
    {
      name,
    }: Omit<Class, 'id' | 'createdAt' | 'updateAt' | 'code' | 'createdBy'>
  ) {
    return this.prismaService.class.update({
      where: {
        id,
        createdBy: userId,
      },
      data: {
        name,
      },
    });
  }
  getByUser(userId: string): Promise<Class[]> {
    return this.prismaService.class.findMany({
      where: {
        students: {
          some: {
            userId,
          },
        },
      },
    });
  }
  getById(id: string): Promise<Class & {students: Student[]}> {
    return this.prismaService.class.findFirst({
      where: {
        id,
      },
      include: {
        students: true
      }
    });
  }
}
