import { useQuery } from "@tanstack/react-query";
import { usersService } from "../services/usersService";

export function useUser() {
  const {
    data,
    isFetching,
    isInitialLoading,
    refetch,
    isError,
    isSuccess,
    remove,
  } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => usersService.me(),
    staleTime: Infinity,
  });

  return {
    user: data ?? [],
    isLoading: isFetching,
    isInitialLoading,
    isError,
    isSuccess,
    remove,
    refetchTransactions: refetch,
  };
}
