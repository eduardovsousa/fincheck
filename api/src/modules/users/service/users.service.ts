import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { UpdateUserDto } from '../update-user.dto';
import { ValidateUserOwnershipService } from './validate-user-ownership.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly validateUserOwnershipService: ValidateUserOwnershipService,
  ) {}

  async getUserById(userId: string) {
    const user = await this.usersRepo.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        birthdate: true,
        phone: true,
        email: true,
        id: true,
      },
    });

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, phone, birthdate, email } = updateUserDto;

    await this.validateUserOwnershipService.validate(userId);
    return this.usersRepo.update({
      where: { id: userId },
      data: { firstName, lastName, phone, birthdate, email },
    });
  }

  async remove(userId: string) {
    await this.validateUserOwnershipService.validate(userId);

    await this.usersRepo.delete({ where: { id: userId } });

    return null;
  }
}
