import { Injectable } from '@nestjs/common';
import { ValidateBankAccountOwnershipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionType } from '../entities/Transaction';
import { ValidateTransactionOwnershipService } from './validate-category-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnershipService: ValidateTransactionOwnershipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const {
      bankAccountId,
      categoryId,
      date,
      name,
      type,
      value,
      isRecurring,
      recurrenceInterval,
      recurrenceEnd,
    } = createTransactionDto;

    await this.validateEntitiesOwnership({ userId, bankAccountId, categoryId });

    if (isRecurring && recurrenceInterval && recurrenceEnd) {
      const transactions = this.generateRecurringTransactions(
        userId,
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        value,
        recurrenceInterval,
        new Date(recurrenceEnd),
      );

      for (const transaction of transactions) {
        await this.transactionsRepo.create({
          data: transaction,
        });
      }

      return transactions;
    } else {
      return this.transactionsRepo.create({
        data: {
          userId,
          bankAccountId,
          categoryId,
          date,
          name,
          type,
          value,
          isRecurring: false,
        },
      });
    }
  }

  generateRecurringTransactions(
    userId: string,
    bankAccountId: string,
    categoryId: string,
    startDate: string,
    name: string,
    type: string,
    value: number,
    recurrenceInterval?: string,
    recurrenceEnd?: Date,
  ) {
    const transactions = [];
    const currentDate = new Date(startDate);

    recurrenceEnd.setDate(recurrenceEnd.getDate() + 1);

    while (currentDate < recurrenceEnd) {
      transactions.push({
        userId,
        bankAccountId,
        categoryId,
        date: currentDate.toISOString(),
        name,
        type,
        value,
        isRecurring: true,
      });

      if (recurrenceInterval === 'DAILY') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (recurrenceInterval === 'WEEKLY') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (recurrenceInterval === 'MONTHLY') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (recurrenceInterval === 'YEARLY') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }

    return transactions;
  }

  async findAllByUserId(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ) {
    return await this.transactionsRepo.findMany({
      where: {
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1)),
        },
      },
      include: {
        category: { select: { id: true, name: true, icon: true } },
      },
    });
  }

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, date, name, type, value } =
      updateTransactionDto;

    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
    });
    return this.transactionsRepo.update({
      where: { id: transactionId },
      data: {
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        value,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntitiesOwnership({ userId, transactionId });

    await this.transactionsRepo.delete({ where: { id: transactionId } });

    return null;
  }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
  }: {
    userId: string;
    bankAccountId?: string;
    categoryId?: string;
    transactionId?: string;
  }) {
    await Promise.all([
      bankAccountId &&
        this.validateBankAccountOwnershipService.validate(
          userId,
          bankAccountId,
        ),

      categoryId &&
        this.validateCategoryOwnershipService.validate(userId, categoryId),

      transactionId &&
        this.validateTransactionOwnershipService.validate(
          userId,
          transactionId,
        ),
    ]);
  }
}
