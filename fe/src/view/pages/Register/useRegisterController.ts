import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../../../app/hooks/useAuth";
import { authService } from "../../../app/services/authService";
import { SingupParams } from "../../../app/services/authService/signup";
import { capitalizeFirstLetter } from "../../../app/utils/capitalizeFirstLetter";

interface RegisterError {
  response: { data: { message: string } };
}

const schema = z.object({
  firstName: z
    .string()
    .nonempty("Nome é obrigatório")
    .min(2, "Informe um nome válido"),
  lastName: z
    .string()
    .nonempty("Sobrenome é obrigatório")
    .min(2, "Informe um sobrenome válido"),
  email: z
    .string()
    .nonempty("E-mail é obrigatório")
    .email("Informe um e-mail válido")
    .min(1),
  phone: z
    .string()
    .nonempty("Telefone é obrigatório")
    .min(14, "Informe um telefone válido")
    .max(15, "Informe um telefone válido"),
  birthdate: z.string(),
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

export function useRegisterController() {
  const {
    handleSubmit: hookFormSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: SingupParams) => {
      return authService.signup({
        ...data,
        email: data.email.toLowerCase(),
        firstName: capitalizeFirstLetter(data.firstName),
        lastName: capitalizeFirstLetter(data.lastName),
      });
    },
  });

  const { signin } = useAuth();

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { accessToken } = await mutateAsync(data);

      signin(accessToken);
    } catch (error) {
      const { message } = (error as RegisterError).response.data;
      toast.error(message);
    }
  });

  return {
    handleSubmit,
    register,
    errors,
    isLoading,
    control,
  };
}
