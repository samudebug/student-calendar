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
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Student, Task } from '@prisma/client';
import { UserId } from '../../decorators/userId.decorator';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { PaginatedResult } from '../../models/paginatedResult';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Controller('classes/:classId/tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  @UseGuards(AuthGuard)
  async getByClass(
    @Param('classId') classId: string,
    @UserId() userId: string,
    @Query('afterDate') afterDate?: Date,
    @Query('page') page?: number
  ): Promise<PaginatedResult<Task>> {
    return this.taskService.getByClass(classId, userId, afterDate, page);
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
    @Body(ValidationPipe)
    newTask: CreateTaskDTO
  ): Promise<Task> {
    return this.taskService.add(classId, userId, newTask);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Param('classId') classId: string,
    @UserId() userId: string,
    @Body(ValidationPipe)
    taskToUpdate: UpdateTaskDTO
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
