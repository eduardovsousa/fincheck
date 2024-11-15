import { z } from "zod"
import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bankAccountsService } from "../../../../../app/services/bankAccountsService"
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber"

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

  const queryClient = useQueryClient()
  const { isLoading, mutateAsync } = useMutation(bankAccountsService.update);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
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

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isLoading,
  }
}