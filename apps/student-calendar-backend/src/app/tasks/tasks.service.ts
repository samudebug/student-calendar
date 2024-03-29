import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ITasksRepository } from './repository/ITasksRepository';
import { Student, Task } from '@prisma/client';
import { ClassesService } from '../classes/classes.service';
import { StudentsService } from '../students/students.service';
import { differenceInHours, setHours, startOfHour } from 'date-fns';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

const MIN_TIME_FOR_NOTIFICATION = 12;
@Injectable()
export class TasksService {
  constructor(
    private repo: ITasksRepository,
    private classesService: ClassesService,
    private studentService: StudentsService,
    private notificationService: NotificationsService,
    private userService: UsersService
  ) {}

  async getByClass(
    classId: string,
    userId: string,
    afterDate?: Date
  ): Promise<Task[]> {
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException('Class does not exist');
    const isStudentInClass = currentClass.students.some(
      (el) => el.userId === userId
    );
    if (!isStudentInClass)
      throw new UnauthorizedException('Student is not in class');
    return this.repo.getTasksForClass(classId, afterDate);
  }

  async getById(
    id: string,
    classId: string,
    userId: string
  ): Promise<Task & { student: Student }> {
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException('Class does not exist');
    const isStudentInClass = currentClass.students.some(
      (el) => el.userId === userId
    );
    if (!isStudentInClass)
      throw new UnauthorizedException('Student is not in class');
    const task = await this.repo.getById(id, classId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
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
    const student = await this.studentService.getStudentByUserIdAndClassId(
      userId,
      classId
    );
    if (!student)
      throw new UnauthorizedException('Student not in class');
    const result = await this.repo.create({
      ...newTask,
      classId,
      createdBy: student.id,
    });
    if (process.env.NODE_ENV !== 'test') {

      const notificationDate = startOfHour(setHours(result.deliverDate, 8));

      if (
        differenceInHours(notificationDate, new Date()) >=
        MIN_TIME_FOR_NOTIFICATION
      ) {
        await this.notificationService.scheduleNotification(
          `/classes/${classId}/tasks/${result.id}/notify`,
          {
            title: 'Task coming up',
            body: `The task ${result.name} is scheduled to today`,
            data: JSON.stringify({
              taskId: result.id,
            }),
          },
          notificationDate
        );
      }
    }
    return result;
  }

  async update(
    id: string,
    classId: string,
    userId: string,
    taskToUpdate: Partial<
      Omit<Task, 'id' | 'createdBy' | 'classId' | 'createdAt' | 'updatedAt'>
    >
  ) {
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException('Class not found');
    const currentTask = await this.getById(id, classId, userId);
    if (!currentTask) throw new NotFoundException('Task not found');
    const student = await this.studentService.getStudentByUserIdAndClassId(
      userId,
      classId
    );
    const isStudentInClass = await currentClass.students.some(
      (el) => el.id === student.id
    );
    if (!isStudentInClass)
      throw new UnauthorizedException('Student is not in class');
    if (currentTask.createdBy !== student.id)
      throw new UnauthorizedException('User cannot update this task');
    return this.repo.update(id, classId, student.id, taskToUpdate);
  }

  async delete(id: string, classId: string, userId: string) {
    const student = await this.studentService.getStudentByUserIdAndClassId(
      userId,
      classId
    );
    if (!student) throw new UnauthorizedException('Student is not in class');
    const currentTask = await this.getById(id, classId, userId);
    if (currentTask.createdBy !== student.id)
      throw new UnauthorizedException('User cannot delete this task');
    return this.repo.deleteById(id, student.id);
  }

  async notify(id: string, classId: string, payload: Record<string, any>) {
    const currentClass = await this.classesService.getById(classId);
    await Promise.all(
      currentClass.students.map(async ({ userId }) => {
        const user = await this.userService.getByUserId(userId);
        if (user && user.fcmToken)
          return this.notificationService.sendNotification(
            user.fcmToken,
            payload
          );
      })
    );
  }
}
