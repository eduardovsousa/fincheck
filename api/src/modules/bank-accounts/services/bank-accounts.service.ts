import { Injectable } from '@nestjs/common';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccounrtsRepo: BankAccountsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
  ) {}

  async create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { color, initialBalance, name, type } = createBankAccountDto;

    return await this.bankAccounrtsRepo.create({
      data: {
        userId,
        color,
        initialBalance,
        name,
        type,
      },
    });
  }

  async findAllByUserId(userId: string) {
    const bankAccounts = await this.bankAccounrtsRepo.findMany({
      where: { userId },
      include: {
        transactions: {
          select: {
            type: true,
            value: true,
            date: true, // Incluindo a data das transações
          },
        },
      },
    });

    const currentDate = new Date();
    const currentMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const currentMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    return bankAccounts.map(
      ({ transactions, futureIncome, futureExpense, ...bankAccount }) => {
        const totalTransactions = transactions.reduce((acc, transaction) => {
          const transactionDate = new Date(transaction.date);

          if (transactionDate <= currentDate) {
            return (
              acc +
              (transaction.type === 'INCOME'
                ? transaction.value
                : -transaction.value)
            );
          }

          if (
            transactionDate >= currentMonthStart &&
            transactionDate <= currentMonthEnd
          ) {
            return (
              acc +
              (transaction.type === 'INCOME'
                ? transaction.value
                : -transaction.value)
            );
          }

          return acc;
        }, 0);

        const futureIncomeTotal = transactions.reduce((acc, transaction) => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate > currentDate && transaction.type === 'INCOME') {
            return acc + transaction.value;
          }
          return acc;
        }, 0);

        const futureExpenseTotal = transactions.reduce((acc, transaction) => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate > currentDate && transaction.type === 'EXPENSE') {
            return acc + transaction.value;
          }
          return acc;
        }, 0);

        const updatedFutureIncome = (futureIncome || 0) + futureIncomeTotal;
        const updatedFutureExpense = (futureExpense || 0) + futureExpenseTotal;

        const currentBalance = bankAccount.initialBalance + totalTransactions;

        return {
          ...bankAccount,
          currentBalance,
          futureIncome: updatedFutureIncome,
          futureExpense: updatedFutureExpense,
        };
      },
    );
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    const { color, initialBalance, name, type } = updateBankAccountDto;

    return this.bankAccounrtsRepo.update({
      where: { id: bankAccountId },
      data: {
        color,
        initialBalance,
        name,
        type,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    await this.bankAccounrtsRepo.delete({
      where: { id: bankAccountId },
    });

    return null;
  }
}
