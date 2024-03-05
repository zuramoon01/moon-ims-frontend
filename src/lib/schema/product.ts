import { z } from "zod";

export const productSchema = z.object({
	id: z.number(),
	name: z.string(),
	quantity: z.number(),
	buyPrice: z.number(),
	totalBuyPrice: z.number(),
	sellPrice: z.number(),
	totalSellPrice: z.number(),
});
export const productsSchema = z.array(productSchema);
export const productGetAllSchema = z.object({
	data: z.object({
		products: productsSchema,
		currentPage: z.number(),
		totalPage: z.number(),
		from: z.number(),
		to: z.number(),
		limit: z.number(),
		total: z.number(),
	}),
});

export type Product = z.infer<typeof productSchema>;
export type productGetAllSchema = z.infer<typeof productGetAllSchema>;
