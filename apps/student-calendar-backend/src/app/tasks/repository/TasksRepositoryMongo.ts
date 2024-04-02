import { Student, Task } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { ITasksRepository } from './ITasksRepository';

export class TasksRepositoryMongo implements ITasksRepository {
  constructor(private prismaService: PrismaService) {}
  getTasksForClass(classId: string, afterDate?: Date): Promise<Task[]> {
    return this.prismaService.task.findMany({
      where: {
        classId,
        deliverDate: {
          gt: afterDate,
        },
      },
      orderBy: {
        deliverDate: 'asc',
      },
    });
  }
  getById(id: string, classId: string): Promise<Task & { student: Student }> {
    return this.prismaService.task.findFirst({
      where: {
        id,
        classId,
      },
      include: {
        student: true,
      },
    });
  }
  create(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return this.prismaService.task.create({
      data: newTask,
    });
  }
  update(
    id: string,
    classId: string,
    createdBy: string,
    taskToUpdate: Partial<
      Omit<Task, 'id' | 'createdBy' | 'classId' | 'createdAt' | 'updatedAt'>
    >
  ): Promise<Task> {
    return this.prismaService.task.update({
      where: {
        id,
        createdBy,
        classId,
      },
      data: taskToUpdate,
    });
  }
  async deleteById(id: string, createdBy: string): Promise<boolean> {
    return !!(await this.prismaService.task.delete({
      where: {
        id,
        createdBy,
      },
    }));
  }

  async getByUserId(userId: string, afterDate?: Date): Promise<Task[]> {
    return this.prismaService.task.findMany({
      where: {
        class: {
          students: {
            some: {
              userId
            }
          }
        },
        deliverDate: {
          gte: afterDate
        }
      },
      orderBy: {
        deliverDate: 'desc'
      }
    });
  }
}
