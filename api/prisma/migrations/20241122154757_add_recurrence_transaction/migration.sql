/*
  Warnings:

  - Added the required column `recurrenceInterval` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "transaction_recurrence_type" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrenceEnd" TIMESTAMP(3),
ADD COLUMN     "recurrenceInterval" "transaction_recurrence_type" NOT NULL;
