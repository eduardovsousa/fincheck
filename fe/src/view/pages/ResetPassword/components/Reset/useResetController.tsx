import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRecoveryPassword } from "../../../../../app/hooks/useRecoveryPassword";
import { usersService } from "../../../../../app/services/usersService";
import { SendResetPassword } from "../../../../../app/services/usersService/sendResetPassword";

const schema = z.object({
  password: z
    .string()
    .nonempty("Senha é obrigatória")
    .min(8, "Senha deve conter pelo menos 8 caracteres")
    .refine(
      (value) =>
        (value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/\d/)) ||
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número"
    ),
  confirmPassword: z
    .string()
    .nonempty("Senha é obrigatória")
    .min(8, "Senha deve conter pelo menos 8 caracteres")
    .refine(
      (value) =>
        (value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/\d/)) ||
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número"
    ),
});

type FormData = z.infer<typeof schema>;

interface ResetPasswordError {
  response: { data: { message: string } };
}

export function useResetController() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: SendResetPassword) => {
      return usersService.sendResetPassword(data);
    },
  });

  const { setPage, email } = useRecoveryPassword();

  const handleSubmit = hookFormSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      setIsPending(true);
      await mutateAsync({
        recipient_email: email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setPage("recovered");
    } catch (error) {
      const { message } = (error as ResetPasswordError).response.data;
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  });

  return {
    handleSubmit,
    register,
    errors,
    isPending,
  };
}
