import { Controller } from "react-hook-form";
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
    control,
    errors,
    handleSubmit,
    register,
    accounts,
    categories,
    isLoading,
    watch,
  } = useNewTransactionModal();

  const isExpense = newTransactionType === "EXPENSE";
  const isRecurring = watch("isRecurring");

  return (
    <Modal
      title={`Nova ${isExpense ? "Despesa" : "Receita"}`}
      open={isNewTransactionModal}
      onClose={closeNewTransactionModal}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <span className="text-gray-600 text-xs tracking-[-0.5px]">
            Valor da {isExpense ? "despesa" : "receita"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-lg tracking-[-0.5px]">R$</span>
            <Controller
              control={control}
              name="value"
              defaultValue="0"
              render={({ field: { onChange, value } }) => (
                <InputCurrency
                  error={errors.value?.message}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <Input
            type="text"
            placeholder={`Nome da ${isExpense ? "despesa" : "receita"}`}
            error={errors.name?.message}
            {...register("name")}
          />

          <Controller
            control={control}
            name="categoryId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Categoria"
                onChange={onChange}
                error={errors.categoryId?.message}
                value={value}
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            )}
          />

          <Controller
            control={control}
            name="bankAccountId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder={isExpense ? "Pagar com" : "Receber com"}
                onChange={onChange}
                error={errors.bankAccountId?.message}
                value={value}
                options={accounts.map((account) => ({
                  value: account.id,
                  label: account.name,
                }))}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            defaultValue={new Date()}
            render={({ field: { value, onChange } }) => (
              <DatePickerInput
                error={errors.date?.message}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="isRecurring"
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-2 my-1">
              <input
                type="checkbox"
                id="isRecurring"
                className="accent-green-900"
                onChange={(e) => onChange(e.target.checked)}
                checked={value}
              />
              <label htmlFor="isRecurring" className="text-gray-600">
                Transação recorrente
              </label>
            </div>
          )}
        />

        {isRecurring && (
          <div className="flex gap-3">
            <Controller
              control={control}
              name="recurrenceInterval"
              defaultValue="MONTHLY"
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Intervalo de recorrência"
                  onChange={onChange}
                  className="w-48"
                  value={value}
                  options={[
                    { value: "DAILY", label: "Diariamente" },
                    { value: "WEEKLY", label: "Semanalmente" },
                    { value: "MONTHLY", label: "Mensalmente" },
                    { value: "YEARLY", label: "Anualmente" },
                  ]}
                />
              )}
            />

            <Controller
              control={control}
              name="recurrenceEnd"
              defaultValue={undefined}
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  error={errors.recurrenceEnd?.message}
                  value={value}
                  onChange={onChange}
                  className="w-36"
                  placeholder="Data de término"
                />
              )}
            />
          </div>
        )}

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Criar
        </Button>
      </form>
    </Modal>
  );
}
