import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ITasksRepository } from './repository/ITasksRepository';
import { Student, Task } from '@prisma/client';
import { ClassesService } from '../classes/classes.service';
import { StudentsService } from '../students/students.service';

@Injectable()
export class TasksService {
  constructor(
    private repo: ITasksRepository,
    private classesService: ClassesService,
    private studentService: StudentsService
  ) {}

  async getByClass(classId: string): Promise<Task[]> {
    return this.repo.getTasksForClass(classId);
  }

  async getById(id: string): Promise<Task & {student: Student}> {
    return this.repo.getById(id);
  }

  async add(
    classId: string,
    userId: string,
    newTask: Omit<
      Task,
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'classId'
    >
  ) {
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException();
    const student = await this.studentService.getStudentByUserId(userId);
    const isStudentInClass = currentClass.students.some(
      (el) => el.id === student.id
    );
    if (!isStudentInClass) throw new UnauthorizedException();
    return this.repo.create({ ...newTask, classId, createdBy: student.id });
  }

  async update(
    id: string,
    classId: string,
    userId: string,
    taskToUpdate: Partial<
      Omit<Task, 'id' | 'createdBy' | 'classId' | 'createdAt' | 'updatedAt'>
    >
  ) {
    const currentTask = await this.getById(id);
    if (!currentTask) throw new NotFoundException('Task not found');
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException('Class not found');
    const student = await this.studentService.getStudentByUserId(userId);
    const isStudentInClass = await currentClass.students.some(
      (el) => el.id === student.id
    );
    if (!isStudentInClass)
      throw new UnauthorizedException('Student is not in class');
    if (currentTask.createdBy !== student.id)
      throw new UnauthorizedException('User cannot update this task');
    return this.repo.update(id, classId, student.id, taskToUpdate);
  }

  async delete(id: string, userId: string) {
    return this.repo.deleteById(id, userId);
  }
}
