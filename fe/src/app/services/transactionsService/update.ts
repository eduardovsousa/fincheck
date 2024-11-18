import { httpClient } from "../httpClient";

export interface UpdateTransactionsProps {
  id: string;
  bankAccountId: string;
  categoryId: string;
  name: string;
  value: number;
  date: string;
  type: "INCOME" | "EXPENSE";
}

export async function update({ id, ...params }: UpdateTransactionsProps) {
  const { data } = await httpClient.put(`/transactions/${id}`, params);

  return data;
}
