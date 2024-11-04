import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersRepository } from 'src/shared/repositories/users.repositories';
import { AuthenticateDto } from './dto/authenticate.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UsersRepository) {}

  async authenticate(authenticateDto: AuthenticateDto) {
    const { email, password } = authenticateDto;

    const user = await this.userRepo.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválida');
    }

    //Generate JWT

    return { user };
  }
}
