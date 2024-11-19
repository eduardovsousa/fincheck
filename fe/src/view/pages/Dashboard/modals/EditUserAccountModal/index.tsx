import { Controller } from "react-hook-form";
import { User } from "../../../../../app/entities/User";
import { formatPhone } from "../../../../../app/utils/formatPhone";
import { Button } from "../../../../components/Button";
import { ConfirmDeleteModal } from "../../../../components/ConfirmDeleteModal";
import { DatePickerInput } from "../../../../components/DatePickerInput";
import { TrashIcon } from "../../../../components/icons/TrashIcon";
import { Input } from "../../../../components/Input";
import { Modal } from "../../../../components/Modal";
import { useEditUserAccountModalController } from "./useEditUserAccountModalController";

interface EditUserAccountModalProps {
  user: User | null;
  open: boolean;
  onClose(): void;
}

export function EditUserAccountModal({
  onClose,
  open,
  user,
}: EditUserAccountModalProps) {
  const {
    handleSubmit,
    errors,
    control,
    register,
    isLoading,
    handleOpenDeleteAccountModal,
    isDeleteAccountModalOpen,
    handleCloseDeleteAccountModal,
    handleDeleteTransaction,
    isLoadingDeleteAccount,
  } = useEditUserAccountModalController(user);

  if (isDeleteAccountModalOpen) {
    return (
      <ConfirmDeleteModal
        title={`Tem certeza que deseja excluir essa conta?`}
        description="Essa ação não poderá ser desfeita! Todos os registros serão deletado."
        onClose={handleCloseDeleteAccountModal}
        onConfirm={handleDeleteTransaction}
        isLoading={isLoadingDeleteAccount}
      />
    );
  }

  return (
    <Modal
      title="Editar conta"
      open={open}
      onClose={onClose}
      rightAction={
        <button onClick={handleOpenDeleteAccountModal}>
          <TrashIcon className="w-6 h-6 text-red-900" />
        </button>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="mt-10 flex flex-col gap-4">
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

          <Controller
            control={control}
            name="birthdate"
            defaultValue={new Date()}
            render={({ field: { value, onChange } }) => (
              <DatePickerInput
                error={errors.birthdate?.message}
                value={value}
                onChange={onChange}
                placeholder="Data de Nascimento"
              />
            )}
          />

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

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Salvar
        </Button>
      </form>
    </Modal>
  );
}
