import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { UserId } from '../../decorators/userId.decorator';
import { Class } from '@prisma/client';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { CreateClassDTO } from './dto/create-class.dto';
import { UpdateClassDTO } from './dto/update-class.dto';

@Controller('classes')
@UseGuards(AuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  getByUser(@UserId() userId: string, @Query('page') page?: number) {
    return this.classesService.getByUser(userId, page);
  }

  @Get('invite/:code')
  addStudentToClass(@UserId() userId: string, @Param('code') code: string) {
    return this.classesService.useInviteCode(code, userId);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.classesService.getById(id);
  }

  @Post()
  add(
    @UserId() userId: string,
    @Body(ValidationPipe)
    newClass: CreateClassDTO
  ) {
    return this.classesService.add(userId, newClass);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body(ValidationPipe)
    classToUpdate: UpdateClassDTO
  ) {
    return this.classesService.updateById(id, userId, classToUpdate);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserId() userId: string) {

    return this.classesService.deleteById(id, userId);
  }

  @Delete(':id/students/:studentId')
  removeStudentFromClass(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.classesService.removeStudentFromClass(id, studentId);
  }

}
