import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { useAuth } from "../../app/hooks/useAuth";
import { EditUserAccountModal } from "../pages/Dashboard/modals/EditUserAccountModal";
import { useEditUserAccountModalController } from "../pages/Dashboard/modals/EditUserAccountModal/useEditUserAccountModalController";
import { DropdownMenu } from "./DropdownMenu";

export function UserMenu() {
  const { signout, user } = useAuth();
  const {
    userAccountBeingEdited,
    isEditUserAccountModalOpen,
    closeEditUserAccountModal,
    openEditUserAccountModal,
  } = useEditUserAccountModalController(user!);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div className="rounded-full bg-teal-50 w-12 h-12 flex items-center justify-center border border-teal-100 cursor-pointer">
            <span className="text-sm tracking-[-0.5px] text-teal-900 font-medium">
              {user?.firstName?.charAt(0).toUpperCase()}
              {user?.lastName?.charAt(0).toUpperCase()}
            </span>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          aria-describedby="dialog-description"
          className="w-44"
        >
          <DropdownMenu.Item
            onSelect={() => openEditUserAccountModal(user!)}
            className="flex items-center justify-between"
          >
            Configurações
            <GearIcon className="w-4 h-4" />
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={signout}
            className="flex items-center justify-between"
          >
            Sair
            <ExitIcon className="w-4 h-4" />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {userAccountBeingEdited && (
        <EditUserAccountModal
          user={userAccountBeingEdited}
          open={isEditUserAccountModalOpen}
          onClose={closeEditUserAccountModal}
        />
      )}
    </>
  );
}
