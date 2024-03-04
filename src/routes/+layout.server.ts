import { getProducts } from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = () => {
	return {
		products: getProducts(),
	};
};
