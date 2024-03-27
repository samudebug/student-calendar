import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Student, Task } from '@prisma/client';
import { startOfDay, subDays } from 'date-fns';
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private api: ApiService) {}

  async getTasks(classId: string) {
    this.tasksSubject.next([]);
    const afterDate = startOfDay(subDays(new Date(), 1));
    const tasks = await this.api.get<Task[]>(`/classes/${classId}/tasks`, {
      params: { afterDate: afterDate.toISOString() },
    });
    this.tasksSubject.next(tasks);
  }

  async createTask(
    classId: string,
    body: { name: string; deliverDate: Date; notes: string }
  ) {
    await this.api.post(`/classes/${classId}/tasks`, body);
    this.getTasks(classId);
  }

  async updateTask(
    classId: string,
    taskId: string,
    body: Partial<{ name: string; deliverDate: Date; notes: string }>
  ) {
    await this.api.patch(`/classes/${classId}/tasks/${taskId}`, body);
    this.getTasks(classId);
  }

  async getTask(classId: string, taskId: string) {
    return this.api.get<Task & { student: Student }>(
      `/classes/${classId}/tasks/${taskId}`
    );
  }

  async deleteTask(classId: string, taskId: string) {
    return this.api.delete(`/classes/${classId}/tasks/${taskId}`);
  }
}
