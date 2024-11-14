import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext"

export function useNewAccountModal() {
  const { isNewAccountModal, closeNewAccountModal } = useDashboardContext()

  return {
    isNewAccountModal,
    closeNewAccountModal
  }
}