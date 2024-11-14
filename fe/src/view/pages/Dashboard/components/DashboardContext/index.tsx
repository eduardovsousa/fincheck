import { createContext, useCallback, useState } from "react";

interface DashboardContextProps {
  areValuesVisible: boolean;
  isNewAccountModal: boolean;
  toggleValueVisibily(): void;
  openNewAccountModal(): void;
  closeNewAccountModal(): void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DashboardContext = createContext({} as DashboardContextProps);

export function DashboardProvicer({ children }: { children: React.ReactNode }) {
  const [areValuesVisible, setAreValuesVisible] = useState(false);
  const [isNewAccountModal, setIsNewAccountModal] = useState(false);

  const toggleValueVisibily = useCallback(() => {
    setAreValuesVisible((prevState) => !prevState);
  }, []);

  const openNewAccountModal = useCallback(() => {
    setIsNewAccountModal(true);
  }, []);

  const closeNewAccountModal = useCallback(() => {
    setIsNewAccountModal(false);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        areValuesVisible,
        toggleValueVisibily,
        isNewAccountModal,
        openNewAccountModal,
        closeNewAccountModal,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
