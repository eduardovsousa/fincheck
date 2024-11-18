import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useState } from "react";
import { useRecoveryPassword } from "../../../../../app/hooks/useRecoveryPassword";
import { authService } from "../../../../../app/services/authService";
import { SendResetEmailParams } from "../../../../../app/services/authService/sendResetEmail";

const schema = z.object({
  recipient_email: z
    .string()
    .nonempty("E-mail é obrigatório")
    .email("Informe um e-mail válido")
    .min(1)
    .toLowerCase(),
});

type FormData = z.infer<typeof schema>;

export function useSendResetController() {
  const { setPage, setEmail } = useRecoveryPassword();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: SendResetEmailParams) => {
      await authService.sendResetEmail(data);
    },
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    setIsPending(true);
    try {
      setEmail(data.recipient_email);
      const em = data.recipient_email;
      await mutateAsync({ recipient_email: em });
      setPage("otp");
    } catch {
      setPage("otp");
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
