import { httpClient } from "../httpClient";

export interface CreateTransactionsProps {
  bankAccountId: string;
  categoryId: string;
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}


export async function create(params: CreateTransactionsProps) {
  const { data } = await httpClient.post(
    "/transactions",
    params
  );

  return data;
}
