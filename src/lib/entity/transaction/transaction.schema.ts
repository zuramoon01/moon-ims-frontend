import { z } from "zod";

export const transactionSchema = z.object({
  id: z.number(),
  code: z.string(),
  totalStock: z.number(),
  totalPrice: z.number(),
  transactionDate: z.coerce.date(),
});
export const transactionsSchema = z.array(transactionSchema);

export type Transaction = z.infer<typeof transactionSchema>;

export const transactionsWithConfigSchema = z.object({
  transactions: transactionsSchema,
  currentPage: z.number(),
  totalPage: z.number(),
  from: z.number(),
  to: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type TransactionsWithConfig = z.infer<
  typeof transactionsWithConfigSchema
>;

export const searchParamsTransactionSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(25).default(15),
});
export type SearchParamsTransaction = z.infer<
  typeof searchParamsTransactionSchema
>;
