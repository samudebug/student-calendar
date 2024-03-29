import { Student, Task } from "@prisma/client";

export abstract class ITasksRepository {
  abstract getTasksForClass(classId: string, afterDate?: Date): Promise<Task[]>;
  abstract getById(id: string, classId: string): Promise<Task & {student: Student}>;
  abstract create(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  abstract update(id: string, classId: string, createdBy: string, taskToUpdate: Partial<Omit<Task, 'id' | 'createdBy' | 'classId' | 'createdAt' | 'updatedAt'>>): Promise<Task>;
  abstract deleteById(id: string, createdBy: string): Promise<boolean>;

}
