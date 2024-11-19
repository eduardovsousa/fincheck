import { useQuery } from "@tanstack/react-query";
import { usersService } from "../services/usersService";

export function useUser() {
  const { data, isFetching, isInitialLoading, refetch } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => usersService.me(),
  });

  return {
    user: data ?? [],
    isLoading: isFetching,
    isInitialLoading,
    refetchTransactions: refetch,
  };
}
