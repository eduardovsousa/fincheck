import { useState } from "react";
import { useWindownWidth } from "../../../../../app/hooks/useWindownWidth";
import { useDashboardContext } from "../DashboardContext/useDashboardContext";

export function useAccountsController() {
  const windowsWidth = useWindownWidth();
  const { areValuesVisible, toggleValueVisibily } = useDashboardContext();

  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  return {
    slideState,
    setSlideState,
    windowsWidth,
    areValuesVisible,
    toggleValueVisibily,
    accounts: [],
    isLoading: false,
  };
}
