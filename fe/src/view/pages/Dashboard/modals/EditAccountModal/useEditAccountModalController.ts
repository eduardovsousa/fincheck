import { z } from "zod"
import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bankAccountsService } from "../../../../../app/services/bankAccountsService"
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber"
import { useState } from "react"

const schema = z.object({
  initialBalance: z.union([z.string().nonempty('Saldo inicial é obrigatório'),
  z.number()]),
  name: z.string().nonempty('Nome da conta é obrigatório'),
  type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
  color: z.string().nonempty('A cor é obrigatória')
})

type FormData = z.infer<typeof schema>

export function useEditAccountModalController() {
  const { isEditAccountModalOpen, closeEditAccountModal, accountBeingEdited } = useDashboardContext()

  const {
    handleSubmit: hookFormSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: accountBeingEdited?.color,
      name: accountBeingEdited?.name,
      type: accountBeingEdited?.type,
      initialBalance: accountBeingEdited?.currentBalance,
    }
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const queryClient = useQueryClient()
  const { isLoading, mutateAsync: updateAccount } = useMutation(bankAccountsService.update);

  const { isLoading: isLoadingDelete, mutateAsync: removeAccount } = useMutation(bankAccountsService.remove);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateAccount({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
        id: accountBeingEdited!.id,
      });

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
      toast.success("Conta editada com sucesso!");
      closeEditAccountModal();
    } catch {
      toast.error("Erro ao salvar as alterações!");
    }
  });

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true)
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false)
  }

  async function handleDeleteAccount() {
    try {
      await removeAccount(accountBeingEdited!.id)

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
      toast.success("Conta excluída com sucesso!");
      closeEditAccountModal();
    } catch {
      toast.error("Erro ao excluir conta!");
    }
  }

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isLoading,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    handleOpenDeleteModal,
    handleDeleteAccount,
    isLoadingDelete,
  }
}