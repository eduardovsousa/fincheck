import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { User } from "../../../../../app/entities/User";
import { usersService } from "../../../../../app/services/usersService";
import { useDashboardContext } from "../../components/DashboardContext/useDashboardContext";

const schema = z.object({
  firstName: z.string().nonempty("Informe o nome"),
  lastName: z.string().nonempty("Informe o sobrenome"),
  email: z.string().nonempty("Informe o e-mail"),
  phone: z.string().nonempty("Informe o telefone"),
  birthdate: z.date(),
});

type FormData = z.infer<typeof schema>;

export function useEditUserAccountModalController(user: User | null) {
  const {
    handleSubmit: hookFormSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      birthdate: user ? new Date(user.birthdate) : new Date(),
    },
  });

  const {
    userAccountBeingEdited,
    openEditUserAccountModal,
    closeEditUserAccountModal,
    isEditUserAccountModalOpen,
  } = useDashboardContext();

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
  };
}
