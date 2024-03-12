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

export type DialogProduct = Partial<
  Omit<Product, "totalBuyPrice" | "totalSellPrice">
>;

type ProductStore = {
  data: Array<FormattedProduct>;
  config: ConfigProduct & {
    currentPageInString: string;
    limitInString: string;
    orderByKey: OrderByKey | null;
    sortDirection: "ASC" | "DESC";
  };
  dialog: DialogProduct;
  selectedProductIds: Array<Product["id"]>;
};

const createProductStore = () => {
  const { subscribe, update } = writable<ProductStore>({
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
      name: undefined,
      quantity: 1,
      buyPrice: undefined,
      sellPrice: undefined,
    },
    selectedProductIds: [],
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
    sortProducts: (key: OrderByKey) => {
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
    updateDialog: (dialog: DialogProduct) => {
      update((currentState) => {
        return {
          ...currentState,
          dialog,
        };
      });
    },
    toggleAllSelectedProductId: () => {
      update((currentState) => {
        const { data, selectedProductIds } = currentState;

        if (
          selectedProductIds.length >= 0 &&
          selectedProductIds.length !== data.length
        ) {
          currentState.selectedProductIds = data.map((product) => product.id);
        } else {
          currentState.selectedProductIds = [];
        }

        return currentState;
      });
    },
    removeAllSelectedProductId: () => {
      update((currentState) => {
        return { ...currentState, selectedProductIds: [] };
      });
    },
    toggleSelectedProductId: (id: Product["id"]) => {
      update((currentState) => {
        const { selectedProductIds } = currentState;

        currentState.selectedProductIds = selectedProductIds.includes(id)
          ? selectedProductIds.filter((productId) => productId !== id)
          : [...selectedProductIds, id];

        return currentState;
      });
    },
    addSelectedProductId: (id: Product["id"]) => {
      update((currentState) => {
        const { selectedProductIds } = currentState;

        const selectedId = selectedProductIds.find(
          (productId) => productId === id,
        );

        if (selectedId === undefined) {
          currentState.selectedProductIds = [...selectedProductIds, id];
        }

        return currentState;
      });
    },
    removeSelectedProductId: (id: Product["id"]) => {
      update((currentState) => {
        currentState.selectedProductIds =
          currentState.selectedProductIds.filter(
            (productId) => productId !== id,
          );

        return currentState;
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
    classes: "w-[calc((100%_-_32px)_/_6_*_2)] min-w-[150px]",
  },
  {
    key: "quantity",
    text: "Jumlah Produk",
    classes: "w-[calc((100%_-_32px)_/_6_*_0.7)] min-w-[158px]",
  },
  {
    key: "buyPrice",
    text: "Harga Beli Per Satuan",
    classes: "w-[calc((100%_-_32px)_/_6_*_0.9)] min-w-[204px]",
  },
  {
    key: "totalBuyPrice",
    text: "Total Harga Beli",
    classes: "w-[calc((100%_-_32px)_/_6_*_0.75)] min-w-[164px]",
  },
  {
    key: "sellPrice",
    text: "Harga Jual Per Satuan",
    classes: "w-[calc((100%_-_32px)_/_6_*_0.9)] min-w-[207px]",
  },
  {
    key: "totalSellPrice",
    text: "Total Harga Jual",
    classes: "w-[calc((100%_-_32px)_/_6_*_0.75)] min-w-[167px]",
  },
];
