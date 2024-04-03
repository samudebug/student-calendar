import { Class, Student, Task } from "@prisma/client";
import { PaginatedResult } from "../../../models/paginatedResult";

export abstract class ITasksRepository {
  abstract getTasksForClass(classId: string, afterDate?: Date, page?: number): Promise<PaginatedResult<Task>>;
  abstract getById(id: string, classId: string): Promise<Task & {student: Student}>;
  abstract create(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'notificationsId'>): Promise<Task>;
  abstract update(id: string, classId: string, createdBy: string, taskToUpdate: Partial<Omit<Task, 'id' | 'createdBy' | 'classId' | 'createdAt' | 'updatedAt'>>): Promise<Task>;
  abstract deleteById(id: string, createdBy: string): Promise<boolean>;
  abstract getByUserId(userId: string, afterDate?: Date, page?: number): Promise<PaginatedResult<(Task & { student: Student, class: Class })>>
}
