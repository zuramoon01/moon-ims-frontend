import { writable } from "svelte/store";
import type { Transaction, TransactionsWithConfig } from "$lib/entity";
import {
  formatToRupiah,
  type BaseConfig,
  type ExtendedConfig,
} from "$lib/util";

type FormattedTransaction = Transaction & {
  transactionDateFormatted: string;
  totalPriceInRupiah: string;
};

export type TransactionOrderByKey = keyof Omit<Transaction, "id">;

type TransactionStore = {
  data: FormattedTransaction[];
  config: BaseConfig & ExtendedConfig<TransactionOrderByKey>;
};

const createTransactionStore = () => {
  const { subscribe, update } = writable<TransactionStore>({
    data: [],
    config: {
      currentPage: 0,
      currentPageInString: "0",
      totalPage: 0,
      from: 0,
      to: 0,
      limit: 0,
      limitInString: "0",
      total: 0,
      orderByKey: null,
      sortDirection: "DESC",
    },
  });

  const formatTransaction = (
    transaction: Transaction,
  ): FormattedTransaction => {
    return {
      ...transaction,
      transactionDateFormatted: new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "Asia/Jakarta",
      }).format(transaction.transactionDate),
      totalPriceInRupiah: formatToRupiah(transaction.totalPrice),
    };
  };

  return {
    subscribe,
    setTransactionStore: ({
      transactions,
      currentPage,
      limit,
      ...config
    }: TransactionsWithConfig) => {
      update((currentState) => {
        return {
          data: transactions.map((transaction) => {
            return formatTransaction(transaction);
          }),
          config: {
            ...currentState.config,
            ...config,
            currentPage,
            currentPageInString: currentPage.toString(),
            limit,
            limitInString: limit.toString(),
          },
        };
      });
    },
  };
};

export const transactionStore = createTransactionStore();
