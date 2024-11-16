import { useMemo, useState } from "react";
import { useWindownWidth } from "../../../../../app/hooks/useWindownWidth";
import { useDashboardContext } from "../DashboardContext/useDashboardContext";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";

export function useAccountsController() {
  const windowWidth = useWindownWidth();
  const { areValuesVisible, toggleValueVisibily, openNewAccountModal } = useDashboardContext();

  const [sliderState, setSliderState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const { accounts, isFetching } = useBankAccounts();


  const currentBalance = useMemo(() => {

    return accounts.reduce((total, account) => total + account.currentBalance, 0)
  }, [accounts])

  return {
    sliderState,
    setSliderState,
    windowWidth,
    areValuesVisible,
    toggleValueVisibily,
    accounts,
    isLoading: isFetching,
    openNewAccountModal,
    currentBalance
  };
}
