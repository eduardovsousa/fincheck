import { Global, Module } from '@nestjs/common';
import { UsersRepository } from '../database/repositories/users.repositories';
import { PrismaService } from './prisma.service';
import { CategoriesRepository } from './repositories/categories.repositories';

@Global()
@Module({
  providers: [PrismaService, UsersRepository, CategoriesRepository],
  exports: [UsersRepository, CategoriesRepository],
})
export class DatabaseModule {}
