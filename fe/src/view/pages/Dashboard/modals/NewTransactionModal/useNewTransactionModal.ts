import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext"

export function useNewTransactionModal() {
  const { isNewTransactionModal, closeNewTransactionModal, newTransactionType } = useDashboardContext()

  return {
    isNewTransactionModal,
    closeNewTransactionModal,
    newTransactionType,
  }
}