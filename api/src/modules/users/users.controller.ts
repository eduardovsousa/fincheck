import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { UsersService } from './service/users.service';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Put(':userId')
  update(
    @ActiveUserId() userId: string,
    @Body() updateUpdateDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUpdateDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@ActiveUserId() userId: string) {
    return this.usersService.remove(userId);
  }
}
