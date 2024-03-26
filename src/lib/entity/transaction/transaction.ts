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
      "w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[9.375rem] shadow-border-inner-br",
  },
  {
    key: "totalStock",
    text: "Total Stok",
    classes:
      "w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[9.875rem] shadow-border-inner-br",
  },
  {
    key: "totalPrice",
    text: "Total Harga",
    classes:
      "w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[12.75rem] shadow-border-inner-br",
  },
  {
    key: "transactionDate",
    text: "Tanggal Transaksi",
    classes:
      "w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[10.25rem] shadow-border-inner-b",
  },
];
