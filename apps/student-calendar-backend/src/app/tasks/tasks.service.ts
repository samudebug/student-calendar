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

  async getByClass(classId: string): Promise<Task[]> {
    return this.repo.getTasksForClass(classId);
  }

  async getById(id: string): Promise<Task & { student: Student }> {
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
    const student = await this.studentService.getStudentByUserIdAndClassId(
      userId,
      classId
    );
    const isStudentInClass = currentClass.students.some(
      (el) => el.id === student.id
    );
    if (!isStudentInClass)
      throw new UnauthorizedException('Student not in class');
    const result = await this.repo.create({
      ...newTask,
      classId,
      createdBy: student.id,
    });
    const notificationDate = startOfHour(setHours(result.deliverDate, 8));

    if (differenceInHours(notificationDate, new Date()) >= MIN_TIME_FOR_NOTIFICATION) {
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
    const currentTask = await this.getById(id);
    if (!currentTask) throw new NotFoundException('Task not found');
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException('Class not found');
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
    const currentTask = await this.getById(id);
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
          return this.notificationService.sendNotification(user.fcmToken, payload);
      })
    );
  }
}
