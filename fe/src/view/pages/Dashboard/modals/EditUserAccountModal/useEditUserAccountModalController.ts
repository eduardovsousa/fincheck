import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { User } from "../../../../../app/entities/User";
import { useAuth } from "../../../../../app/hooks/useAuth";
import { usersService } from "../../../../../app/services/usersService";
import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext";

const schema = z.object({
  firstName: z.string().nonempty("Informe o nome"),
  lastName: z.string().nonempty("Informe o sobrenome"),
  email: z.string().nonempty("Informe o e-mail"),
  phone: z.string().nonempty("Informe o telefone"),
  birthdate: z.union([z.string(), z.date()]),
});

type FormData = z.infer<typeof schema>;

export function useEditUserAccountModalController(user: User | null) {
  const {
    handleSubmit: hookFormSubmit,
    register,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      birthdate: user?.birthdate,
    },
  });

  const {
    userAccountBeingEdited,
    openEditUserAccountModal,
    closeEditUserAccountModal,
    isEditUserAccountModalOpen,
  } = useDashboardContext();

  const { signout } = useAuth();

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  const { isLoading, mutateAsync: updateUser } = useMutation(
    usersService.update
  );
  const queryClient = useQueryClient();

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateUser({
        ...data,
        id: user!.id,
      });

      queryClient.invalidateQueries({ queryKey: ["users", "me"] });

      toast.success("Dados atualizados com sucesso!");
      closeEditUserAccountModal();
    } catch {
      toast.error("Erro ao atualizar usuário");
    }
  });

  function handleOpenDeleteAccountModal() {
    setIsDeleteAccountModalOpen(true);
  }

  function handleCloseDeleteAccountModal() {
    setIsDeleteAccountModalOpen(false);
  }

  const { isLoading: isLoadingDeleteAccount, mutateAsync: removeTransaction } =
    useMutation(usersService.remove);

  async function handleDeleteTransaction() {
    try {
      await removeTransaction(user!.id);

      toast.success(`Conta excluída com sucesso!`);
      handleCloseDeleteAccountModal();
      signout();
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    } catch {
      toast.error(`Erro ao excluir conta!`);
    }
  }

  return {
    handleSubmit,
    openEditUserAccountModal,
    closeEditUserAccountModal,
    isEditUserAccountModalOpen,
    userAccountBeingEdited,
    isLoading,
    register,
    control,
    errors,
    handleOpenDeleteAccountModal,
    handleCloseDeleteAccountModal,
    isDeleteAccountModalOpen,
    handleDeleteTransaction,
    isLoadingDeleteAccount,
    setValue,
  };
}
