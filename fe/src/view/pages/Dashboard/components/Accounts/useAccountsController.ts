import { useMemo, useState } from "react";
import { useWindownWidth } from "../../../../../app/hooks/useWindownWidth";
import { useDashboardContext } from "../DashboardContext/useDashboardContext";
import { useQuery } from "@tanstack/react-query";
import { bankAccountsService } from "../../../../../app/services/bankAccountsService";

export function useAccountsController() {
  const windowWidth = useWindownWidth();
  const { areValuesVisible, toggleValueVisibily, openNewAccountModal } = useDashboardContext();

  const [sliderState, setSliderState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const { data, isFetching } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: bankAccountsService.getAll,
    staleTime: Infinity,
  });

  const currentBalance = useMemo(() => {
    if (!data) return 0;

    return data.reduce((total, account) => total + account.currentBalance, 0)
  },[data])

  return {
    sliderState,
    setSliderState,
    windowWidth,
    areValuesVisible,
    toggleValueVisibily,
    accounts: data ?? [],
    isLoading: isFetching,
    openNewAccountModal,
    currentBalance
  };
}
