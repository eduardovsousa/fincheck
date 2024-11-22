export interface Transaction {
  id: string;
  name: string;
  categoryId: string;
  bankAccountId: string;
  value: number;
  date: string;
  type: "INCOME" | "EXPENSE";
  isRecurring?: boolean;
  recurrenceInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  recurrenceEnd?: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
}
