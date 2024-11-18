import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Spinner } from "../../../../components/Spinner";
import { useResetController } from "./useResetController";

export function Reset() {
  const { errors, handleSubmit, isPending, register } = useResetController();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 tracking-[-1px]">
        Alterar senha
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-4 space-y-4 lg:mt-5 md:space-y-5"
      >
        <div className="w-full">
          <Input
            minLength={8}
            type="password"
            id="password"
            placeholder="Nova senha"
            error={errors.password?.message}
            {...register("password")}
            required
            className={`${
              isPending ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
            }`}
            disabled={isPending}
          />
        </div>
        <div>
          <Input
            minLength={8}
            type="password"
            id="confirmPassword"
            placeholder="Confirme a nova senha"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            required
            className={`${
              isPending ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
            }`}
            disabled={isPending}
          />
        </div>
        <Button disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "Alterar senha"}
        </Button>
      </form>
    </div>
  );
}
