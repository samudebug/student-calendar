import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { UsersService } from './users.service';
import { UserId } from '../../decorators/userId.decorator';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {

  }

  @Get('me')
  getMe(@UserId() userId: string): Promise<User> {
    return this.service.getByUserId(userId);
  }

  @Patch('me')
  updateMe(@UserId() userId: string, @Body() user: Partial<Omit<User, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    return this.service.createOrUpdateUser(userId,  user);
  }
}
