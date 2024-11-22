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
          <div className="text-white flex items-center gap-3">
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

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="tracking-[-0.5px] text-white block">
                Saldo total
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

            <div>
              <span className="tracking-[-0.5px] text-white block">
                Receita futura
              </span>

              <div className="flex items-center gap-2">
                <strong
                  className={cn(
                    "text-xl tracking-[-1px] text-white md:mx-auto",
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

              <div className="flex md:items-center gap-2">
                <strong
                  className={cn(
                    "text-xl tracking-[-1px] text-white md:mx-auto",
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

          <Divider />

          <div className="flex flex-col md:flex-row md:items-center justify-start gap-4">
            <div>
              <span className="tracking-[-0.5px] text-white block">
                Total de receitas futuras
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
              <span className="tracking-[-0.5px] text-white block">
                Total de despesas futuras
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

          <div className="flex-1 flex flex-col justify-end mt-10 md:mt-0">
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
