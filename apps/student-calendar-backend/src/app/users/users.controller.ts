import { Body, Controller, Get, Patch, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { UsersService } from './users.service';
import { UserId } from '../../decorators/userId.decorator';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {

  }

  @Get('me/tasks')
  getTasksFeed(@UserId() userId: string, @Query('afterDate') afterDate?: Date, @Query('page') page?: number) {
    return this.service.getTasksFeed(userId, afterDate, page);
  }
  @Get('me')
  getMe(@UserId() userId: string): Promise<User> {
    return this.service.getByUserId(userId);
  }


  @Patch('me')
  updateMe(@UserId() userId: string, @Body(ValidationPipe) user: UpdateUserDTO): Promise<User> {
    return this.service.createOrUpdateUser(userId,  user);
  }
}
