import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { bankAccountsService } from "../../../../../app/services/bankAccountsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext";

const schema = z.object({
  initialBalance: z.string().nonempty("Saldo inicial é obrigatório"),
  name: z.string().nonempty("Nome da conta é obrigatório"),
  type: z.enum(["CHECKING", "INVESTMENT", "CASH"]),
  color: z.string().nonempty("A cor é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function useNewBankAccountModalController() {
  const { isNewBankAccountModalOpen, closeNewBankAccountModal } =
    useDashboardContext();

  const {
    handleSubmit: hookFormSubmit,
    register,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const { isLoading, mutateAsync } = useMutation(bankAccountsService.create);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
      });

      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });
      toast.success("Conta criada com sucesso!");
      closeNewBankAccountModal();
      reset();
    } catch {
      toast.error("Erro ao criar a conta!");
    }
  });

  return {
    isNewBankAccountModalOpen,
    closeNewBankAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isLoading,
  };
}
