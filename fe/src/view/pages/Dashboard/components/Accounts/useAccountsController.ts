import { useMemo, useState } from "react";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useWindownWidth } from "../../../../../app/hooks/useWindownWidth";
import { useDashboardContext } from "../DashboardContext/useDashboardContext";
import { useTransactionsController } from "../Transactions/useTransactionsController";

export function useAccountsController() {
  const windowWidth = useWindownWidth();
  const { areValuesVisible, toggleValueVisibily, openNewBankAccountModal } =
    useDashboardContext();
  const { accounts, isFetching } = useBankAccounts();
  const { transactions, isLoading: isLoadingTransactions } =
    useTransactionsController();

  const [sliderState, setSliderState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const currentBalance = useMemo(() => {
    return accounts.reduce(
      (total, account) => total + account.currentBalance,
      0
    );
  }, [accounts]);

  const { monthFutureIncome, monthFutureExpense, futureIncome, futureExpense } =
    useMemo(() => {
      const currentDate = new Date();

      const monthIncome = transactions.reduce((total, transaction) => {
        if (
          transaction.type === "INCOME" &&
          new Date(transaction.date) >= currentDate
        ) {
          total += transaction.value;
        }
        return total;
      }, 0);

      const monthExpense = transactions.reduce((total, transaction) => {
        if (
          transaction.type === "EXPENSE" &&
          new Date(transaction.date) >= currentDate
        ) {
          total += transaction.value;
        }
        return total;
      }, 0);

      const income = accounts.reduce((total, account) => {
        return total + (account.futureIncome || 0);
      }, 0);

      const expense = accounts.reduce((total, account) => {
        return total + (account.futureExpense || 0);
      }, 0);

      return {
        monthFutureIncome: monthIncome,
        monthFutureExpense: monthExpense,
        futureIncome: income,
        futureExpense: expense,
      };
    }, [accounts, transactions]);

  return {
    sliderState,
    setSliderState,
    windowWidth,
    areValuesVisible,
    toggleValueVisibily,
    accounts,
    isLoading: isFetching,
    isLoadingTransactions,
    openNewBankAccountModal,
    currentBalance,
    monthFutureIncome,
    monthFutureExpense,
    futureIncome,
    futureExpense,
  };
}
