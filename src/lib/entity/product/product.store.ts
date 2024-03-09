import { writable } from "svelte/store";
import type { Product } from "$lib/entity";
import { formatToRupiah } from "$lib/util";

type FormattedProduct = Product & {
  buyPriceInRupiah: string;
  totalBuyPriceInRupiah: string;
  sellPriceInRupiah: string;
  totalSellPriceInRupiah: string;
};

type OrderByKey = keyof Omit<Product, "id">;
type ConfigProduct = {
  currentPage: number;
  totalPage: number;
  from: number;
  to: number;
  limit: number;
  total: number;
};
type DialogProduct = {} & Partial<
  Omit<Product, "totalBuyPrice" | "totalSellPrice">
>;

const createProductStore = () => {
  const { subscribe, update } = writable<{
    data: FormattedProduct[];
    config: ConfigProduct & {
      currentPageInString: string;
      limitInString: string;
      orderByKey: OrderByKey | null;
      sortDirection: "ASC" | "DESC";
    };
    dialog: DialogProduct;
  }>({
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
    dialog: {
      id: undefined,
      name: "",
      quantity: 1,
      buyPrice: undefined,
      sellPrice: undefined,
    },
  });

  const formatProduct = (product: Product): FormattedProduct => {
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
    setProductStore: ({
      products,
      currentPage,
      limit,
      ...config
    }: { products: Product[] } & ConfigProduct) => {
      update((currentState) => {
        return {
          ...currentState,
          data: products.map((product) => {
            return formatProduct(product);
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
    addProduct: (product: Product) => {
      update((currentState) => {
        return {
          ...currentState,
          data: [...currentState.data, formatProduct(product)],
        };
      });
    },
    sortProducts: (key: OrderByKey) => {
      update((currentState) => {
        const {
          data,
          config: { orderByKey, sortDirection },
        } = currentState;

        let newConfig = currentState.config;

        if (key !== orderByKey) {
          newConfig = { ...newConfig, orderByKey: key, sortDirection: "DESC" };
        } else if (sortDirection === "ASC") {
          newConfig.orderByKey = null;
        } else {
          newConfig.sortDirection = "ASC";
        }

        const newData = data.sort((a, b) => {
          const [x, y] =
            orderByKey === null ? [a.id, b.id] : [a[orderByKey], b[orderByKey]];

          if (sortDirection === "ASC") {
            return x > y ? -1 : x < y ? 1 : 0;
          } else {
            return x < y ? -1 : x > y ? 1 : 0;
          }
        });

        return {
          ...currentState,
          data: newData,
          config: newConfig,
        };
      });
    },
    // updateProducts: (products: Product) => {
    //   update((currentState) => {});
    // },
    deleteProduct: (id: Product["id"]) => {
      update((currentState) => {
        return {
          ...currentState,
          data: currentState.data.filter((product) => product.id !== id),
        };
      });
    },
    updateDialog: (dialog: DialogProduct) => {
      update((currentState) => {
        return {
          ...currentState,
          dialog,
        };
      });
    },
  };
};

export const productStore = createProductStore();

export const productTableTitles: Array<{
  key: keyof Omit<Product, "id">;
  text: string;
  classes: string;
}> = [
  {
    key: "name",
    text: "Nama Produk",
    classes:
      " min-w-[200px] w-[calc(100%_-_(32px_+_160px_+_240px_+_240px_+_200px_+_200px_+_80px))]",
  },
  {
    key: "quantity",
    text: "Kuantitas",
    classes: "w-[160px] shrink-0",
  },
  {
    key: "buyPrice",
    text: "Harga Beli Per Satuan",
    classes: "w-[240px] shrink-0",
  },
  {
    key: "totalBuyPrice",
    text: "Total Harga Beli",
    classes: "w-[200px] shrink-0",
  },
  {
    key: "sellPrice",
    text: "Harga Jual Per Satuan",
    classes: "w-[240px] shrink-0",
  },
  {
    key: "totalSellPrice",
    text: "Total Harga Jual",
    classes: "w-[200px] shrink-0",
  },
];
