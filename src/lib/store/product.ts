import { writable } from "svelte/store";
import type { Product } from "$lib/schema";
import { formatToRupiah } from "$lib/utils";

export type ProductStore = Product & {
  buyPriceInRupiah: string;
  totalBuyPriceInRupiah: string;
  sellPriceInRupiah: string;
  totalSellPriceInRupiah: string;
};

const createProductStore = () => {
  const { subscribe, update } = writable<ProductStore[]>([]);

  const formatProduct = (product: Product) => {
    return {
      ...product,
      buyPriceInRupiah: formatToRupiah(product.buyPrice),
      totalBuyPriceInRupiah: formatToRupiah(product.totalBuyPrice),
      sellPriceInRupiah: formatToRupiah(product.sellPrice),
      totalSellPriceInRupiah: formatToRupiah(product.totalSellPrice),
    };
  };

  return {
    subscribe,
    set: (products: Product[]) => {
      update(() => {
        return products.map((product) => {
          return formatProduct(product);
        });
      });
    },
  };
};

export const productStore = createProductStore();

export const productTableTitles: Array<{
  id: keyof Omit<Product, "id">;
  text: string;
  classes: string;
}> = [
  {
    id: "name",
    text: "Nama Produk",
    classes:
      " min-w-[200px] w-[calc(100%_-_(32px_+_160px_+_240px_+_240px_+_200px_+_200px_+_80px))]",
  },
  {
    id: "quantity",
    text: "Kuantitas",
    classes: "w-[160px] shrink-0",
  },
  {
    id: "buyPrice",
    text: "Harga Beli Per Satuan",
    classes: "w-[240px] shrink-0",
  },
  {
    id: "totalBuyPrice",
    text: "Total Harga Beli",
    classes: "w-[200px] shrink-0",
  },
  {
    id: "sellPrice",
    text: "Harga Jual Per Satuan",
    classes: "w-[240px] shrink-0",
  },
  {
    id: "totalSellPrice",
    text: "Total Harga Jual",
    classes: "w-[200px] shrink-0",
  },
];
