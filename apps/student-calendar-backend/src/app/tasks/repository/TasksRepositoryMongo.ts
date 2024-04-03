import { Class, Student, Task } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { ITasksRepository } from './ITasksRepository';
import { PaginatedResult } from "../../../models/paginatedResult";

export class TasksRepositoryMongo implements ITasksRepository {
  constructor(private prismaService: PrismaService) {}
  async getTasksForClass(classId: string, afterDate?: Date, page = 1): Promise<PaginatedResult<Task>> {
    const total = await this.prismaService.task.count(({
      where: {
        classId,
        deliverDate: {
          gt: afterDate,
        },
      },
      orderBy: {
        deliverDate: 'asc',
      },
    }));
    const results = await this.prismaService.task.findMany({
      where: {
        classId,
        deliverDate: {
          gt: afterDate,
        },
      },
      orderBy: {
        deliverDate: 'asc',
      },
      take: 30,
      skip: (page - 1) * 30
    });
    return {
      total,
      results,
      page
    }
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

  async getByUserId(
    userId: string,
    afterDate?: Date,
    page = 1
  ): Promise<PaginatedResult<(Task & { student: Student; class: Class })>> {
    const total = await this.prismaService.task.count({
      where: {
        class: {
          students: {
            some: {
              userId,
            },
          },
        },
        deliverDate: {
          gte: afterDate,
        },
      },
      orderBy: {
        deliverDate: 'desc',
      },
    })
    const results = await this.prismaService.task.findMany({
      where: {
        class: {
          students: {
            some: {
              userId,
            },
          },
        },
        deliverDate: {
          gte: afterDate,
        },
      },
      orderBy: {
        deliverDate: 'desc',
      },
      include: {
        student: true,
        class: true,
      },
      take: 30,
      skip: (page - 1) * 30
    });
    return {
      total,
      results,
      page
    }
  }
}
