import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Class, Student, Task } from '@prisma/client';
import { format, isSameDay, startOfDay } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private api: ApiService) { }

  async getFeed(): Promise<{ date: string, tasks: (Task & { student: Student, class: Class })[]}[]> {
    const afterDate = startOfDay(new Date());
    const tasksFeed = await this.api.get<(Task & { student: Student, class: Class })[]>('/users/me/tasks', {params: {afterDate: afterDate.toISOString()}});
    const result: { [key: string]: (Task & { student: Student, class: Class })[] } = {};
    tasksFeed.forEach((task) => {
      let key = format(task.deliverDate, 'EEEE, MMM d');
      if (isSameDay(task.deliverDate, new Date())) {
        key = 'Today';
      }
      if (!Object.keys(result).includes(key)) {
        result[key] = [];
      }
      result[key].push(task);
    });
    return Object.keys(result).map((key) => {
      return {
        date: key,
        tasks: result[key]
      }
    });
  }
}
