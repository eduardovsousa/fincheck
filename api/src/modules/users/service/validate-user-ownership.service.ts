import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class ValidateUserOwnershipService {
  constructor(private readonly userRepo: UsersRepository) {}

  async validate(userId: string) {
    const user = await this.userRepo.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
