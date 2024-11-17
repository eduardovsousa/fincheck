import { useState } from "react";
import { useDashboardContext } from "../DashboardContext/useDashboardContext";
import { useTransactions } from "../../../../../app/hooks/useTransactions";

export function useTransactionsController() {
  const { areValuesVisible } = useDashboardContext();

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const { transactions, isLoading, isInitialLoading } = useTransactions();

  function handleOpenFiltersModal() {
    setIsFiltersModalOpen(true);
  }

  function handleCloseFiltersModal() {
    setIsFiltersModalOpen(false);
  }

  return {
    areValuesVisible,
    transactions,
    isInitialLoading,
    isLoading,
    isFiltersModalOpen,
    handleOpenFiltersModal,
    handleCloseFiltersModal,
  };
}
