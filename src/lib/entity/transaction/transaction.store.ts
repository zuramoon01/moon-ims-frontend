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
  selectedTransactionIds: Array<Transaction["id"]>;
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
    selectedTransactionIds: [],
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
          ...currentState,
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
    sortProducts: (key: TransactionOrderByKey) => {
      update((currentState) => {
        let {
          config: { orderByKey, sortDirection },
        } = currentState;

        if (key !== orderByKey) {
          orderByKey = key;
          sortDirection = "DESC";
        } else if (sortDirection === "ASC") {
          orderByKey = null;
          sortDirection = "DESC";
        } else {
          sortDirection = "ASC";
        }

        return {
          ...currentState,
          data: currentState.data.sort((a, b) => {
            const [x, y] =
              orderByKey === null
                ? [a.id, b.id]
                : [a[orderByKey], b[orderByKey]];

            if (sortDirection === "ASC") {
              return x < y ? -1 : x > y ? 1 : 0;
            } else {
              return x > y ? -1 : x < y ? 1 : 0;
            }
          }),
          config: {
            ...currentState.config,
            orderByKey,
            sortDirection,
          },
        };
      });
    },
    toggleAllSelectedTransactionId: () => {
      update((currentState) => {
        const { data, selectedTransactionIds } = currentState;

        if (
          selectedTransactionIds.length >= 0 &&
          selectedTransactionIds.length !== data.length
        ) {
          currentState.selectedTransactionIds = data.map(
            (transaction) => transaction.id,
          );
        } else {
          currentState.selectedTransactionIds = [];
        }

        return currentState;
      });
    },
    removeAllSelectedTransactionId: () => {
      update((currentState) => {
        return { ...currentState, selectedTransactionIds: [] };
      });
    },
    toggleSelectedTransactionId: (id: Transaction["id"]) => {
      update((currentState) => {
        const { selectedTransactionIds } = currentState;

        currentState.selectedTransactionIds = selectedTransactionIds.includes(
          id,
        )
          ? selectedTransactionIds.filter(
              (transactionId) => transactionId !== id,
            )
          : [...selectedTransactionIds, id];

        return currentState;
      });
    },
    addSelectedTransactionId: (id: Transaction["id"]) => {
      update((currentState) => {
        const { selectedTransactionIds } = currentState;

        const selectedId = selectedTransactionIds.find(
          (transactionId) => transactionId === id,
        );

        if (selectedId === undefined) {
          currentState.selectedTransactionIds = [...selectedTransactionIds, id];
        }

        return currentState;
      });
    },
    removeSelectedTransactionId: (id: Transaction["id"]) => {
      update((currentState) => {
        currentState.selectedTransactionIds =
          currentState.selectedTransactionIds.filter(
            (transactionId) => transactionId !== id,
          );

        return currentState;
      });
    },
  };
};

export const transactionStore = createTransactionStore();
