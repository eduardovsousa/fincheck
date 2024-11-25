import "swiper/css";

import { PlusIcon } from "@radix-ui/react-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "../../../../../app/hooks/useAuth";
import { cn } from "../../../../../app/utils/cn";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { Divider } from "../../../../components/Divider";
import { EyeIcon } from "../../../../components/icons/EyeIcon";
import { Spinner } from "../../../../components/Spinner";
import { AccountCard } from "./AccountCard";
import { SliderNavigation } from "./SliderNavigation";
import { useAccountsController } from "./useAccountsController";

export function Accounts() {
  const {
    sliderState,
    setSliderState,
    windowWidth,
    areValuesVisible,
    isLoading,
    accounts,
    openNewBankAccountModal,
    toggleValueVisibily,
    currentBalance,
    monthFutureIncome,
    monthFutureExpense,
    futureExpense,
    futureIncome,
    isLoadingTransactions,
  } = useAccountsController();

  const { user } = useAuth();

  return (
    <div className="bg-teal-900 rounded-2xl w-full h-full px-4 py-8 md:p-8 flex flex-col">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="text-teal-950/50 fill-white w-10 h-10" />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span>
                Olá, <strong>{user?.firstName}</strong>!
              </span>
              <button
                className="w-8 h-8 flex items-center justify-center"
                onClick={toggleValueVisibily}
              >
                <EyeIcon open={!areValuesVisible} />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <span className="tracking-[-0.5px] text-white flex">
                Saldo total
                <div className="group cursor-pointer relative flex items-center justify-center text-center text-xs ml-1.5 mb-2">
                  (?)
                  <div className="opacity-0 bg-black/70 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full px-3 pointer-events-none w-40 md:w-52 transition-all -ml-20 lg:ml-0">
                    Saldo atualizado automaticamente
                  </div>
                </div>
              </span>

              <div className="flex items-center gap-2">
                <strong
                  className={cn(
                    "text-xl tracking-[-1px] text-white",
                    !areValuesVisible && "blur-md"
                  )}
                >
                  {formatCurrency(currentBalance)}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex md:items-center justify-between lg:gap-20 mt-4">
            <div>
              <span className="tracking-[-0.5px] text-white block">
                Receita futura
              </span>

              <div className="flex items-start md:items-center gap-2">
                <strong
                  className={cn(
                    "text-xl tracking-[-1px] text-white",
                    !areValuesVisible && "blur-md"
                  )}
                >
                  {isLoadingTransactions ? (
                    <Spinner className="w-7 h-7" />
                  ) : (
                    formatCurrency(monthFutureIncome)
                  )}
                </strong>
              </div>
            </div>

            <div>
              <span className="tracking-[-0.5px] text-white block">
                Despesa futura
              </span>

              <div className="flex items-start md:items-center gap-2">
                <strong
                  className={cn(
                    "text-xl tracking-[-1px] text-white",
                    !areValuesVisible && "blur-md"
                  )}
                >
                  {isLoadingTransactions ? (
                    <Spinner className="w-7 h-7" />
                  ) : (
                    formatCurrency(monthFutureExpense)
                  )}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex md:items-center justify-between gap-4 lg:gap-20 mt-4">
            <div>
              <span className="tracking-[-0.5px] text-white flex">
                Total de RF
                <div className="group cursor-pointer relative flex items-center justify-center text-center text-xs ml-1.5 mb-2">
                  (?)
                  <div className="opacity-0 bg-black/70 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full px-3 pointer-events-none w-28  transition-all -ml-20 lg:ml-0">
                    Receitas futuras
                  </div>
                </div>
              </span>

              <div className="flex items-start md:items-center gap-2">
                <strong
                  className={cn(
                    "text-xl tracking-[-1px] text-white",
                    !areValuesVisible && "blur-md"
                  )}
                >
                  {formatCurrency(futureIncome)}
                </strong>
              </div>
            </div>

            <div>
              <span className="tracking-[-0.5px] text-white flex">
                Total de DF
                <div className="group cursor-pointer relative flex items-center justify-center text-center text-xs ml-1.5 mb-2">
                  (?)
                  <div className="opacity-0 bg-black/70 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full px-3 pointer-events-none w-32 transition-all -ml-20 lg:ml-0">
                    Despesas futuras
                  </div>
                </div>
              </span>

              <div className="flex items-start md:items-center gap-2">
                <strong
                  className={cn(
                    "text-xl tracking-[-1px] text-white",
                    !areValuesVisible && "blur-md"
                  )}
                >
                  {formatCurrency(futureExpense)}
                </strong>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex-1 flex flex-col justify-end mt-8 md:mt-0">
            {accounts.length === 0 && (
              <>
                <div className="mb-4" slot="container-start">
                  <strong className="text-white tracking-[-1px] text-lg font-bold">
                    Minhas contas
                  </strong>
                </div>

                <button
                  className="mt-4 h-52 rounded-2xl border-2 border-dashed border-teal-600 flex flex-col items-center justify-center gap-4 text-white hover:bg-teal-950/5 transition-colors"
                  onClick={openNewBankAccountModal}
                >
                  <div className="w-11 h-11 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <span className="tracking-[-0.5px] font-medium block w-32 text-center">
                    Cadastre uma nova conta
                  </span>
                </button>
              </>
            )}

            {accounts.length > 0 && (
              <div>
                <Swiper
                  spaceBetween={16}
                  slidesPerView={windowWidth >= 500 ? 2.1 : 1.2}
                  onSlideChange={(swiper) => {
                    setSliderState({
                      isBeginning: swiper.isBeginning,
                      isEnd: swiper.isEnd,
                    });
                  }}
                >
                  <div
                    className="flex items-center justify-between mb-4"
                    slot="container-start"
                  >
                    <strong className="text-white tracking-[-1px] text-lg font-bold">
                      Minhas contas
                    </strong>

                    <SliderNavigation
                      isBeginning={sliderState.isBeginning}
                      isEnd={sliderState.isEnd}
                    />
                  </div>

                  {accounts.map((account) => (
                    <SwiperSlide key={account.id}>
                      <AccountCard data={account} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
