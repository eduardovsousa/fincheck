import { Link } from "react-router-dom";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Spinner } from "../../../../components/Spinner";
import { useSendResetController } from "./useSendResetController";

export function SendReset() {
  const { handleSubmit, register, errors, isPending } =
    useSendResetController();

  return (
    <div>
      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-[-1px]">
          Solicitar reset de senha
        </h1>

        <span className="text-gray-700 tracking-[-0.5px]">
          Informe seu e-mail para enviarmos o código de verificação
        </span>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="my-6 relative w-full">
          <Input
            type="email"
            id="recipient_email"
            placeholder="E-mail"
            error={errors.recipient_email?.message}
            {...register("recipient_email", {
              setValueAs: (value) => value.toLowerCase()
            })}
            className={
              isPending ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
            }
            disabled={isPending}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button
            className={`bg-teal-900 hover:bg-teal-800 ${isPending ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
              } px-6 h-12 rounded-2xl font-medium text-white transition-all flex items-center justify-center w-full`}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Solicitar reset de senha"}
          </Button>
        </div>
      </form>
      <Link
        to="/login"
        replace
        className="text-end flex items-end justify-end text-green-esportes underline"
      >
        Voltar para login
      </Link>
    </div>
  );
}
