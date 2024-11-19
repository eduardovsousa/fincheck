import { createContext, useCallback, useState } from "react";
import { BankAccount } from "../../../../../app/entities/BankAccount";

interface DashboardContextProps {
  areValuesVisible: boolean;
  isNewBankAccountModalOpen: boolean;
  isNewTransactionModal: boolean;
  isEditBankAccountModalOpen: boolean;
  accountBeingEdited: null | BankAccount;
  newTransactionType: "INCOME" | "EXPENSE" | null;
  toggleValueVisibily(): void;
  openNewBankAccountModal(): void;
  closeNewBankAccountModal(): void;
  openNewTransactionModal(type: "INCOME" | "EXPENSE"): void;
  closeNewTransactionModal(): void;
  openEditAccountModal(bankAccount: BankAccount): void;
  closeEditBankAccountModal(): void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DashboardContext = createContext({} as DashboardContextProps);

export function DashboardProvicer({ children }: { children: React.ReactNode }) {
  const [areValuesVisible, setAreValuesVisible] = useState(false);
  const [isNewBankAccountModalOpen, setIsNewBankAccountModalOpen] =
    useState(false);
  const [isNewTransactionModal, setIsNewTransactionModal] = useState(false);
  const [newTransactionType, setNewTransactionType] = useState<
    "INCOME" | "EXPENSE" | null
  >(null);
  const [isEditBankAccountModalOpen, setisEditBankAccountModalOpen] =
    useState(false);
  const [accountBeingEdited, setAccountBeingEdited] =
    useState<null | BankAccount>(null);

  const toggleValueVisibily = useCallback(() => {
    setAreValuesVisible((prevState) => !prevState);
  }, []);

  const openNewBankAccountModal = useCallback(() => {
    setIsNewBankAccountModalOpen(true);
  }, []);

  const closeNewBankAccountModal = useCallback(() => {
    setIsNewBankAccountModalOpen(false);
  }, []);

  const openNewTransactionModal = useCallback((type: "INCOME" | "EXPENSE") => {
    setNewTransactionType(type);
    setIsNewTransactionModal(true);
  }, []);

  const closeNewTransactionModal = useCallback(() => {
    setNewTransactionType(null);
    setIsNewTransactionModal(false);
  }, []);

  const openEditAccountModal = useCallback((bankAccount: BankAccount) => {
    setAccountBeingEdited(bankAccount);
    setisEditBankAccountModalOpen(true);
  }, []);

  const closeEditBankAccountModal = useCallback(() => {
    setAccountBeingEdited(null);
    setisEditBankAccountModalOpen(false);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        areValuesVisible,
        toggleValueVisibily,
        isNewBankAccountModalOpen,
        openNewBankAccountModal,
        closeNewBankAccountModal,
        isNewTransactionModal,
        openNewTransactionModal,
        closeNewTransactionModal,
        newTransactionType,
        isEditBankAccountModalOpen,
        openEditAccountModal,
        closeEditBankAccountModal,
        accountBeingEdited,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
