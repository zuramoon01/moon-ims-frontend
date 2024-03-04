import { writable } from "svelte/store";
import type { Product } from "$lib/server/db";
import { formatToRupiah } from "$lib/utils";

export type ProductStore = Product & {
	buyPriceInRupiah: string;
	totalBuyPriceInRupiah: string;
	sellPriceInRupiah: string;
	totalSellPriceInRupiah: string;
};

const createProducts = () => {
	const { subscribe, set, update } = writable<ProductStore[]>([]);

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
		setProducts: (products: Product[]) => {
			set(products.map((product) => formatProduct(product)));
		},
		addProduct: (product: Product) => {
			update((currentProducts) => {
				return [...currentProducts, formatProduct(product)];
			});
		},
		updateProduct: (updatedProduct: Product) => {
			update((currentProducts) => {
				return currentProducts.map((currentProduct) => {
					if (currentProduct.id === updatedProduct.id) {
						return formatProduct(updatedProduct);
					}

					return currentProduct;
				});
			});
		},
		deleteProduct: (idProduct: Product["id"]) => {
			update((currentProducts) => {
				return currentProducts.filter(
					(currentProduct) => currentProduct.id !== idProduct,
				);
			});
		},
	};
};

export const productsStore = createProducts();
