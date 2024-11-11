import { Global, Module } from '@nestjs/common';
import { UsersRepository } from '../database/repositories/users.repositories';
import { PrismaService } from './prisma.service';
import { BankAccountsRepository } from './repositories/bank-accounts.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { TransactionsRepository } from './repositories/transactions.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
    TransactionsRepository,
  ],
  exports: [
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
    TransactionsRepository,
  ],
})
export class DatabaseModule {}
