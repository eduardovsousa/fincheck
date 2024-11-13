import { useState } from "react";
import { useWindownWidth } from "../../../../../app/hooks/useWindownWidth";

export function useAccountsController() {
  const windowsWidth = useWindownWidth();

  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  return {
    slideState,
    setSlideState,
    windowsWidth,
  };
}
