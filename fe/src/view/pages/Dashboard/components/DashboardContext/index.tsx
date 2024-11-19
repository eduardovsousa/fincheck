import { createContext, useCallback, useState } from "react";
import { BankAccount } from "../../../../../app/entities/BankAccount";
import { User } from "../../../../../app/entities/User";

interface DashboardContextProps {
  areValuesVisible: boolean;
  isNewBankAccountModalOpen: boolean;
  isNewTransactionModal: boolean;
  isEditBankAccountModalOpen: boolean;
  isEditUserAccountModalOpen: boolean;
  bankAccountBeingEdited: null | BankAccount;
  userAccountBeingEdited: null | User;
  newTransactionType: "INCOME" | "EXPENSE" | null;
  toggleValueVisibily(): void;
  openNewBankAccountModal(): void;
  closeNewBankAccountModal(): void;
  openNewTransactionModal(type: "INCOME" | "EXPENSE"): void;
  closeNewTransactionModal(): void;
  openEditBankAccountModal(bankAccount: BankAccount): void;
  closeEditBankAccountModal(): void;
  openEditUserAccountModal(userAccount: User): void;
  closeEditUserAccountModal(): void;
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
  const [bankAccountBeingEdited, setBankAccountBeingEdited] =
    useState<null | BankAccount>(null);
  const [userAccountBeingEdited, setUserAccountBeingEdited] =
    useState<null | User>(null);
  const [isEditUserAccountModalOpen, setIsEditUserAccountModalOpen] =
    useState(false);

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

  const openEditBankAccountModal = useCallback((bankAccount: BankAccount) => {
    setBankAccountBeingEdited(bankAccount);
    setisEditBankAccountModalOpen(true);
  }, []);

  const closeEditBankAccountModal = useCallback(() => {
    setBankAccountBeingEdited(null);
    setisEditBankAccountModalOpen(false);
  }, []);

  const openEditUserAccountModal = useCallback((userAccount: User) => {
    setUserAccountBeingEdited(userAccount);
    setIsEditUserAccountModalOpen(true);
  }, []);

  const closeEditUserAccountModal = useCallback(() => {
    setUserAccountBeingEdited(null);
    setIsEditUserAccountModalOpen(false);
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
        openEditBankAccountModal,
        closeEditBankAccountModal,
        bankAccountBeingEdited,
        isEditUserAccountModalOpen,
        userAccountBeingEdited,
        openEditUserAccountModal,
        closeEditUserAccountModal,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
