import type { ProductOrderByKey } from "$lib/entity";

export const productTableTitles: Array<{
  key: ProductOrderByKey;
  text: string;
  classes: string;
}> = [
  {
    key: "name",
    text: "Nama Produk",
    classes: "w-[calc((100%_-_2rem)_/_6_*_2)] min-w-[9.375rem]",
  },
  {
    key: "quantity",
    text: "Jumlah Produk",
    classes: "w-[calc((100%_-_2rem)_/_6_*_0.7)] min-w-[9.875rem]",
  },
  {
    key: "buyPrice",
    text: "Harga Beli Per Satuan",
    classes: "w-[calc((100%_-_2rem)_/_6_*_0.9)] min-w-[12.75rem]",
  },
  {
    key: "totalBuyPrice",
    text: "Total Harga Beli",
    classes: "w-[calc((100%_-_2rem)_/_6_*_0.75)] min-w-[10.25rem]",
  },
  {
    key: "sellPrice",
    text: "Harga Jual Per Satuan",
    classes: "w-[calc((100%_-_2rem)_/_6_*_0.9)] min-w-[12.938rem]",
  },
  {
    key: "totalSellPrice",
    text: "Total Harga Jual",
    classes: "w-[calc((100%_-_2rem)_/_6_*_0.75)] min-w-[10.438rem]",
  },
];
