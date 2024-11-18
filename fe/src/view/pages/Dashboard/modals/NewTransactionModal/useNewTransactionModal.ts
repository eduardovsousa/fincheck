import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useCategories } from "../../../../../app/hooks/useCategories";
import { transactionsService } from "../../../../../app/services/transactionsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext";

const schema = z.object({
  value: z.string().nonempty("Informe o valor"),
  name: z.string().nonempty("Informe o nome"),
  categoryId: z.string().nonempty("Informe a categoria"),
  bankAccountId: z.string().nonempty("Informe a conta"),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export function useNewTransactionModal() {
  const {
    isNewTransactionModal,
    closeNewTransactionModal,
    newTransactionType,
  } = useDashboardContext();

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
  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();
  const { mutateAsync, isLoading } = useMutation(transactionsService.create);

  const categories = useMemo(() => {
    return categoriesList.filter(
      (category) => category.type === newTransactionType
    );
  }, [categoriesList, newTransactionType]);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        value: currencyStringToNumber(data.value),
        type: newTransactionType!,
        date: data.date.toISOString(),
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });

      toast.success(
        newTransactionType === "EXPENSE"
          ? "Despesa cadastrada com sucesso!"
          : "Receita cadastrada com sucesso!"
      );
      closeNewTransactionModal();
      reset();
    } catch {
      toast.error(
        newTransactionType === "EXPENSE"
          ? "Erro ao cadastrar a despesa"
          : "Erro ao cadastrar a receita"
      );
    }
  });

  return {
    isNewTransactionModal,
    closeNewTransactionModal,
    newTransactionType,
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    categories,
    isLoading,
    mutateAsync,
  };
}
