import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { MONTHS } from "../../../../../app/config/constants";
import { cn } from "../../../../../app/utils/cn";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { formatDate } from "../../../../../app/utils/formatDate";
import emptyStateImage from "../../../../../assets/empty-state.svg";
import { CategoryIcon } from "../../../../components/icons/categories/CategoryIcon";
import { FilterIcon } from "../../../../components/icons/FilterIcon";
import { Spinner } from "../../../../components/Spinner";
import { FiltersModal } from "./FiltersModal";
import { SliderNavigation } from "./SliderNavigation";
import { SliderOption } from "./SliderOption";
import { TransactionTypeDropdown } from "./TransactionTypeDropdown";
import { useTransactionsController } from "./useTransactionsController";

export function Transactions() {
  const {
    areValuesVisible,
    isInitialLoading,
    transactions,
    isLoading,
    isFiltersModalOpen,
    handleCloseFiltersModal,
    handleOpenFiltersModal,
    handleChangeMonth,
    filters,
  } = useTransactionsController();

  const hasTransactions = transactions.length > 0;

  return (
    <div className="bg-gray-100 rounded-2xl w-full h-full px-4 py-8 md:p-10 flex flex-col">
      {isInitialLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      )}

      {!isInitialLoading && (
        <>
          <FiltersModal
            open={isFiltersModalOpen}
            onClose={handleCloseFiltersModal}
          />

          <header>
            <div className="flex items-center justify-between">
              <TransactionTypeDropdown />
              <button onClick={handleOpenFiltersModal}>
                <FilterIcon />
              </button>
            </div>

            <div className="mt-6 relative">
              <Swiper
                slidesPerView={3}
                centeredSlides
                initialSlide={filters.month}
                onSlideChange={(swiper) => {
                  if (swiper.realIndex === filters.month) return;
                  handleChangeMonth(swiper.realIndex);
                }}
              >
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
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner className="w-10 h-10" />
              </div>
            )}

            {!hasTransactions && !isLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <img src={emptyStateImage} alt="Nenhuma transição encontrada" />
                <p className="text-gray-700">
                  Não encontramos nenhuma transição!
                </p>
              </div>
            )}

            {hasTransactions &&
              !isLoading &&
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white p-4 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex-1 flex items-center gap-3">
                    <CategoryIcon
                      type={
                        transaction.type === "EXPENSE" ? "expense" : "income"
                      }
                      category={transaction.category?.icon}
                    />

                    <div className="">
                      <strong className="font-bold tracking-[-0.5px] block">
                        {transaction.name}
                      </strong>
                      <span className="text-sm text-gray-600">
                        {formatDate(new Date(transaction.date))}
                      </span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "tracking-[-0.5px] font-medium",
                      transaction.type === "EXPENSE"
                        ? "text-red-800"
                        : "text-green-800",
                      !areValuesVisible && "blur-sm"
                    )}
                  >
                    {!areValuesVisible
                      ? "R$ 000,00"
                      : `${
                          transaction.type === "EXPENSE" ? "-" : "+"
                        } ${formatCurrency(transaction.value)}`}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
