import { useDashboardContext } from "../DashboardContext/useDashboardContext";

export function useTransactionsController() {
  const { areValuesVisible } = useDashboardContext();

  return {
    areValuesVisible,
    transactions: [],
    isInitialLoading: false,
    isLoading: false,
  };
}
