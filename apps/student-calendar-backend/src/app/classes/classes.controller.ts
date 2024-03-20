import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { UserId } from '../../decorators/userId.decorator';
import { Class } from '@prisma/client';
import { AuthGuard } from '../../guards/auth/auth.guard';

@Controller('classes')
@UseGuards(AuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  getByUser(@UserId() userId: string) {
    return this.classesService.getByUser(userId);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.classesService.getById(id);
  }

  @Post()
  add(
    @UserId() userId: string,
    @Body()
    newClass: Omit<
      Class,
      'id' | 'createdAt' | 'updatedAt' | 'code' | 'createdBy'
    >
  ) {
    return this.classesService.add(userId, newClass);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body()
    classToUpdate: Partial<
      Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'createdBy'>
    >
  ) {
    return this.classesService.updateById(id, userId, classToUpdate);
  }

  @Delete(':id')
  DeleteQueryBuilder(@Param('id') id: string, @UserId() userId: string) {
    return this.classesService.deleteById(id, userId);
  }
}
