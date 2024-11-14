import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { PlusIcon } from "@radix-ui/react-icons";
import { cn } from "../../../../../app/utils/cn";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { EyeIcon } from "../../../../components/icons/EyeIcon";
import { Spinner } from "../../../../components/Spinner";
import { AccountCard } from "./AccountCard";
import { SliderNavigation } from "./SliderNavigation";
import { useAccountsController } from "./useAccountController";

export function Accounts() {
  const {
    slideState,
    setSlideState,
    windowsWidth,
    areValuesVisible,
    toggleValueVisibily,
    isLoading,
    accounts,
    openNewAccountModal,
  } = useAccountsController();

  const hasAccounts = accounts.length > 0;

  return (
    <div className="bg-teal-900 rounded-2xl w-full h-full px-4 py-8 md:p-10 flex flex-col">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="text-teal-950/50 fill-white w-10 h-10" />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="text-white">
            <span className="tracking-[0.5px] block">Saldo total</span>
            <div className="flex items-center space-x-2">
              <strong
                className={cn(
                  "text-2xl tracking-[-1px]",
                  !areValuesVisible && "blur-md"
                )}
              >
                {!areValuesVisible ? "R$ 000,00" : formatCurrency(100)}
              </strong>
              <button
                onClick={toggleValueVisibily}
                className="w-8 h-8 flex items-center justify-center"
              >
                <EyeIcon open={!areValuesVisible} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end mt-10 md:mt-0">
            {hasAccounts && (
              <div>
                <Swiper
                  spaceBetween={16}
                  slidesPerView={windowsWidth <= 500 ? 1.1 : 2.15}
                  onSlideChange={(swiper) => {
                    setSlideState({
                      isBeginning: swiper.isBeginning,
                      isEnd: swiper.isEnd,
                    });
                  }}
                >
                  <div
                    slot="container-start"
                    className="flex items-center justify-between mb-4"
                  >
                    <strong className="text-white tracking-[-1px] text-lg">
                      Minhas contas
                    </strong>

                    <SliderNavigation
                      isBeginning={slideState.isBeginning}
                      isEnd={slideState.isEnd}
                    />
                  </div>

                  <SwiperSlide>
                    <AccountCard
                      color="#7950F2"
                      name="Nubank"
                      balance={1000.23}
                      type="CASH"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <AccountCard
                      color="#333"
                      name="XP"
                      balance={1000.23}
                      type="INVESTMENT"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <AccountCard
                      color="#0f0"
                      name="Carteira"
                      balance={1000.23}
                      type="CASH"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            )}

            {!hasAccounts && (
              <>
                <div className="mb-4">
                  <strong className="text-white tracking-[-1px] text-lg">
                    Minhas contas
                  </strong>
                </div>

                <button
                  className="mt-4 h-52 rounded-2xl border-dotted border-2 border-teal-600 flex flex-col items-center justify-center gap-4 text-white"
                  onClick={openNewAccountModal}
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
          </div>
        </>
      )}
    </div>
  );
}
