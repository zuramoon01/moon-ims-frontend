import type { TransactionOrderByKey } from "$lib/entity";

export const transactionTableTitles: Array<{
  key: TransactionOrderByKey;
  text: string;
  classes: string;
}> = [
  {
    key: "code",
    text: "Kode",
    classes:
      "w-[calc((100%_-_2rem)_/_4_*_0.8)] min-w-[8.125rem] shadow-border-inner-br",
  },
  {
    key: "totalStock",
    text: "Total Stok",
    classes:
      "w-[calc((100%_-_2rem)_/_4_*_0.4)] min-w-[6.188rem] shadow-border-inner-br",
  },
  {
    key: "totalPrice",
    text: "Total Harga",
    classes:
      "w-[calc((100%_-_2rem)_/_4_*_1.2)] min-w-[9.688rem] shadow-border-inner-br",
  },
  {
    key: "transactionDate",
    text: "Tanggal Transaksi",
    classes:
      "w-[calc((100%_-_2rem)_/_4_*_1.6)] min-w-[9.5rem] shadow-border-inner-b",
  },
];
