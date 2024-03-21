import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Student, Task } from '@prisma/client';
import { UserId } from '../../decorators/userId.decorator';
import { AuthGuard } from '../../guards/auth/auth.guard';

@Controller('classes/:classId/tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  async getByClass(@Param('classId') classId: string): Promise<Task[]> {
    return this.taskService.getByClass(classId);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Task & {student: Student}> {
    return this.taskService.getById(id);
  }

  @Post()
  async create(
    @Param('classId') classId: string,
    @UserId() userId: string,
    @Body()
    newTask: Omit<
      Task,
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'classId'
    >
  ): Promise<Task> {
    return this.taskService.add(classId, userId, newTask);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Param('classId') classId: string,
    @UserId() userId: string,
    @Body()
    taskToUpdate: Partial<
      Omit<Task, 'id' | 'createdBy' | 'classId' | 'createdAt' | 'updatedAt'>
    >
  ): Promise<Task> {
    return this.taskService.update(id, classId, userId, taskToUpdate);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @UserId() userId: string): Promise<boolean> {
    return this.taskService.delete(id, userId);
  }
}
