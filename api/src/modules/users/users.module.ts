import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { ValidateUserOwnershipService } from './service/validate-user-ownership.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ValidateUserOwnershipService],
})
export class UsersModule {}
