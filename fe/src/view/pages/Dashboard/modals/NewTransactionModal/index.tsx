import { ACCOUNTS_TYPES } from "../../../../../app/config/constants";
import { Button } from "../../../../components/Button";
import { DatePickerInput } from "../../../../components/DatePickerInput";
import { Input } from "../../../../components/Input";
import { InputCurrency } from "../../../../components/InputCurrency";
import { Modal } from "../../../../components/Modal";
import { Select } from "../../../../components/Select";
import { useNewTransactionModal } from "./useNewTransactionModal";

export function NewTransactionModal() {
  const {
    isNewTransactionModal,
    closeNewTransactionModal,
    newTransactionType,
  } = useNewTransactionModal();

  const isExpense = newTransactionType === "EXPENSE";

  return (
    <Modal
      title={`Nova ${isExpense ? "Despesa" : "Receita"}`}
      open={isNewTransactionModal}
      onClose={closeNewTransactionModal}
    >
      <form>
        <div>
          <span className="text-gray-600 text-xs tracking-[-0.5px]">
            Valor da {isExpense ? "despesa" : "receita"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-lg tracking-[-0.5px]">R$</span>
            <InputCurrency />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <Input
            type="text"
            name="name"
            placeholder={`Nome da ${isExpense ? "despesa" : "receita"}`}
          />

          <Select placeholder="Categoria" options={ACCOUNTS_TYPES} />

          <Select
            placeholder={isExpense ? "Pagar com" : "Receber com"}
            options={ACCOUNTS_TYPES}
          />

          <DatePickerInput />
        </div>

        <Button type="submit" className="w-full mt-6">
          Criar
        </Button>
      </form>
    </Modal>
  );
}
