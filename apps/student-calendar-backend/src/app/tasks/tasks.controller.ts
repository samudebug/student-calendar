import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Student, Task } from '@prisma/client';
import { UserId } from '../../decorators/userId.decorator';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { ApiKeyGuard } from '../../guards/apiKey/apiKey.guard';

@Controller('classes/:classId/tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  @UseGuards(AuthGuard)
  async getByClass(
    @Param('classId') classId: string,
    @UserId() userId: string,
    @Query('afterDate') afterDate?: Date
  ): Promise<Task[]> {
    return this.taskService.getByClass(classId, userId, afterDate);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(
    @Param('id') id: string,
    @Param('classId') classId: string,
    @UserId() userId: string
  ): Promise<Task & { student: Student }> {
    return this.taskService.getById(id, classId, userId);
  }

  @Post()
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async delete(
    @Param('id') id: string,
    @UserId() userId: string,
    @Param('classId') classId: string
  ): Promise<boolean> {
    return this.taskService.delete(id, classId, userId);
  }
}
