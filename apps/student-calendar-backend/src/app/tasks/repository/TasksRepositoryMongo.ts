import { Task } from "@prisma/client";
import { PrismaService } from "../../prisma.service";
import { ITasksRepository } from "./ITasksRepository";

export class TasksRepositoryMongo implements ITasksRepository {
  constructor(private prismaService: PrismaService) {

  }
  getTasksForClass(classId: string): Promise<{ id: string; name: string; notes: string; deliverDate: Date; createdBy: string; classId: string; createdAt: Date; updatedAt: Date; }[]> {
    return this.prismaService.task.findMany({
      where: {
        classId
      }
    })
  }
  getById(id: string): Promise<{ id: string; name: string; notes: string; deliverDate: Date; createdBy: string; classId: string; createdAt: Date; updatedAt: Date; }> {
    return this.prismaService.task.findFirst({
      where: {
        id
      }
    })
  }
  create(newTask: Omit<{ id: string; name: string; notes: string; deliverDate: Date; createdBy: string; classId: string; createdAt: Date; updatedAt: Date; }, "id" | "createdAt" | "updatedAt">): Promise<{ id: string; name: string; notes: string; deliverDate: Date; createdBy: string; classId: string; createdAt: Date; updatedAt: Date; }> {
    return this.prismaService.task.create({
      data: newTask
    })
  }
  update(id: string, classId: string, createdBy: string, taskToUpdate: Partial<Omit<Task, 'id' | 'createdBy' | 'classId' | 'createdAt' | 'updatedAt'>>): Promise<{ id: string; name: string; notes: string; deliverDate: Date; createdBy: string; classId: string; createdAt: Date; updatedAt: Date; }> {
    return this.prismaService.task.update({
      where: {
        id,
        createdBy,
        classId
      },
      data: taskToUpdate
    });
  }
  async deleteById(id: string, createdBy: string): Promise<boolean> {
    return !!(await this.prismaService.task.delete({
      where: {
        id,
        createdBy
      }
    }))
  }


}
