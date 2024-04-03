import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ITasksRepository } from './repository/ITasksRepository';
import { Student, Task } from '@prisma/client';
import { ClassesService } from '../classes/classes.service';
import { StudentsService } from '../students/students.service';
import { differenceInHours, isSameDay, setHours, startOfHour } from 'date-fns';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { PaginatedResult } from '../../models/paginatedResult';

const MIN_TIME_FOR_NOTIFICATION = 12;
@Injectable()
export class TasksService {
  constructor(
    private repo: ITasksRepository,
    private classesService: ClassesService,
    private studentService: StudentsService,
    private notificationService: NotificationsService
  ) {}

  async getByClass(
    classId: string,
    userId: string,
    afterDate?: Date,
    page?: number
  ): Promise<PaginatedResult<Task>> {
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException('Class does not exist');
    const isStudentInClass = currentClass.students.some(
      (el) => el.userId === userId
    );
    if (!isStudentInClass)
      throw new UnauthorizedException('Student is not in class');
    return this.repo.getTasksForClass(classId, afterDate, page);
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
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'classId' | 'notificationsId'
    >
  ) {
    const currentClass = await this.classesService.getById(classId);
    if (!currentClass) throw new NotFoundException();
    const student = await this.studentService.getStudentByUserIdAndClassId(
      userId,
      classId
    );
    if (!student) throw new UnauthorizedException('Student not in class');
    const notificationsId = [];
    const result = await this.repo.create({
      ...newTask,
      classId,
      createdBy: student.id,
    });
    if (process.env.NODE_ENV !== 'test') {
      const notificationDate = startOfHour(setHours(newTask.deliverDate, 8));

      if (
        differenceInHours(notificationDate, new Date()) >=
        MIN_TIME_FOR_NOTIFICATION
      ) {
        const notificationId =
          await this.notificationService.scheduleNotification(
            `/notifications/`,
            {
              title: 'Task coming up',
              body: `The task ${newTask.name} is scheduled to today`,
              data: JSON.stringify({
                taskId: result.id,
              }),
              classId,
            },
            notificationDate
          );
        notificationsId.push(notificationId);
        await this.update(result.id, classId, userId, { notificationsId });
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
    let notificationsId = [];
    if (taskToUpdate.notificationsId) {
      notificationsId = taskToUpdate.notificationsId;
    } else {
      notificationsId = currentTask.notificationsId;
    }
    if (process.env.NODE_ENV !== 'test') {
      if (taskToUpdate.deliverDate) {
        if (!isSameDay(currentTask.deliverDate, taskToUpdate.deliverDate)) {
          Logger.log('Is updating task date');
          await Promise.all(
            currentTask.notificationsId.map((id) => {
              try {
                return this.notificationService.deleteNotificationSchedule(id);
              } catch (error) {
                Logger.error(error);
              }
            })
          );
          const notificationDate = startOfHour(
            setHours(taskToUpdate.deliverDate, 8)
          );
          notificationsId = [];
          if (
            differenceInHours(notificationDate, new Date()) >=
            MIN_TIME_FOR_NOTIFICATION
          ) {
            try {
              const notificationId =
                await this.notificationService.scheduleNotification(
                  `/notifications/`,
                  {
                    title: 'Task coming up',
                    body: `The task ${
                      taskToUpdate.name ?? currentTask.name
                    } is scheduled to today`,
                    data: JSON.stringify({
                      taskId: id,
                    }),
                    classId,
                  },
                  notificationDate
                );
              notificationsId.push(notificationId);
            } catch (error) {
              Logger.error(error);
            }
          }
        }
      }
    }
    return this.repo.update(id, classId, student.id, {
      ...taskToUpdate,
      notificationsId,
    });
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
    if (process.env.NODE_ENV !== 'test') {
      await Promise.all(
        currentTask.notificationsId.map((id) => {
          try {
            return this.notificationService.deleteNotificationSchedule(id);
          } catch (error) {
            Logger.error(error);
          }
        })
      );
    }
    return this.repo.deleteById(id, student.id);
  }

  async getByUserId(userId: string, afterDate?: Date, page?: number) {
    return this.repo.getByUserId(userId, afterDate, page);
  }
}
