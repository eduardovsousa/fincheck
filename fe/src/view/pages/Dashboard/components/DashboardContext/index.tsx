import { createContext, useCallback, useState } from "react";

interface DashboardContextProps {
  areValuesVisible: boolean;
  isNewAccountModalOpen: boolean;
  isNewTransactionModal: boolean;
  newTransactionType: "INCOME" | "EXPENSE" | null;
  toggleValueVisibily(): void;
  openNewAccountModal(): void;
  closeNewAccountModal(): void;
  openNewTransactionModal(type: "INCOME" | "EXPENSE"): void;
  closeNewTransactionModal(): void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DashboardContext = createContext({} as DashboardContextProps);

export function DashboardProvicer({ children }: { children: React.ReactNode }) {
  const [areValuesVisible, setAreValuesVisible] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isNewTransactionModal, setIsNewTransactionModal] = useState(false);
  const [newTransactionType, setNewTransactionType] = useState<
    "INCOME" | "EXPENSE" | null
  >(null);

  const toggleValueVisibily = useCallback(() => {
    setAreValuesVisible((prevState) => !prevState);
  }, []);

  const openNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(true);
  }, []);

  const closeNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(false);
  }, []);

  const openNewTransactionModal = useCallback((type: "INCOME" | "EXPENSE") => {
    setNewTransactionType(type);
    setIsNewTransactionModal(true);
  }, []);

  const closeNewTransactionModal = useCallback(() => {
    setNewTransactionType(null);
    setIsNewTransactionModal(false);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        areValuesVisible,
        toggleValueVisibily,
        isNewAccountModalOpen,
        openNewAccountModal,
        closeNewAccountModal,
        isNewTransactionModal,
        openNewTransactionModal,
        closeNewTransactionModal,
        newTransactionType,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
