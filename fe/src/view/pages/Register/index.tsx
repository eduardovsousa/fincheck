import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { formatPhone } from "../../../app/utils/formatPhone";
import { Button } from "../../components/Button";
import { DatePickerInput } from "../../components/DatePickerInput";
import { Input } from "../../components/Input";
import { useRegisterController } from "./useRegisterController";

export function Register() {
  const { errors, handleSubmit, register, isLoading, control } =
    useRegisterController();

  return (
    <>
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-[-1px]">
          Crie sua conta
        </h1>
        <p className="space-x-2">
          <span className="text-gray-700 tracking-[-0.5px]">
            Já possui uma conta?
          </span>
          <Link
            to="/login"
            className="text-teal-900 font-medium tracking-[-0.5px]"
          >
            Fazer Login
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-[60px] flex flex-col gap-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Nome"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            placeholder="Sobrenome"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <div className="flex space-x-2 w-full">
          <Controller
            control={control}
            name="birthdate"
            defaultValue={new Date()}
            render={({ field: { value, onChange } }) => (
              <DatePickerInput
                className="w-full"
                error={errors.birthdate?.message}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="flex space-x-2">
          <Input
            type="email"
            className="lowercase"
            placeholder="E-mail"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            minLength={14}
            maxLength={15}
            placeholder="(xx) 9xxxx-xxxx"
            {...register("phone")}
            error={errors.phone?.message}
            onChange={(e) => {
              e.target.value = formatPhone(e.target.value);
            }}
          />
        </div>
        <div className="flex space-x-2">
          <Input
            type="password"
            placeholder="Senha"
            {...register("password")}
            error={errors.password?.message}
          />{" "}
          <Input
            type="password"
            placeholder="Confirme a senha"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button type="submit" className="mt-2" isLoading={isLoading}>
          Criar conta
        </Button>
      </form>
    </>
  );
}
