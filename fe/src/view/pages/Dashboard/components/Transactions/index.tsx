import { ChevronDownIcon } from "@radix-ui/react-icons";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { MONTHS } from "../../../../../app/config/constants";
import { cn } from "../../../../../app/utils/cn";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { CategoryIcon } from "../../../../components/icons/categories/CategoryIcon";
import { FilterIcon } from "../../../../components/icons/FilterIcon";
import { TransactionsIcon } from "../../../../components/icons/TransactionsIcon";
import { Spinner } from "../../../../components/Spinner";
import { SliderNavigation } from "./SliderNavigation";
import { SliderOption } from "./SliderOption";
import { useTransactionsController } from "./useTransactionsController";

export function Transactions() {
  const { areValuesVisible, isLoading } = useTransactionsController();

  return (
    <div className="bg-gray-100 rounded-2xl w-full h-full px-4 py-8 md:p-10 flex flex-col">
      {!isLoading ? (
        <>
          <header>
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2">
                <TransactionsIcon />{" "}
                <span className="text-sm text-gray-800 tracking-[-0.5px] font-medium">
                  Transações
                </span>
                <ChevronDownIcon className="text-gray-900" />
              </button>

              <button>
                <FilterIcon />
              </button>
            </div>

            <div className="mt-6 relative">
              <Swiper slidesPerView={3} centeredSlides>
                <SliderNavigation />
                {MONTHS.map((month, index) => (
                  <SwiperSlide key={month}>
                    {({ isActive, isNext, isPrev }) => (
                      <SliderOption
                        isActive={isActive}
                        isNext={isNext}
                        isPrev={isPrev}
                        month={month}
                        index={index}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </header>

          <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
            <div className="bg-white p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <CategoryIcon type="expense" />

                <div className="">
                  <strong className="font-bold tracking-[-0.5px] block">
                    Almoço
                  </strong>
                  <span className="text-sm text-gray-600">01/01/2025</span>
                </div>
              </div>

              <span
                className={cn(
                  "tracking-[-0.5px] font-medium text-red-800",
                  !areValuesVisible && "blur-sm"
                )}
              >
                {!areValuesVisible ? "R$ 000,00" : formatCurrency(135)}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      )}
    </div>
  );
}
