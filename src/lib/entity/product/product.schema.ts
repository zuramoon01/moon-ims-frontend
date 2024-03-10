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

export type Product = z.infer<typeof productSchema>;
export type NewOrUpdateProduct = Omit<
  Product,
  "id" | "totalBuyPrice" | "totalSellPrice"
>;

export const productsWithConfigSchema = z.object({
  products: productsSchema,
  currentPage: z.number(),
  totalPage: z.number(),
  from: z.number(),
  to: z.number(),
  limit: z.number(),
  total: z.number(),
});

export const searchParamsProductSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(25).default(15),
});
export type SearchParamsProduct = z.infer<typeof searchParamsProductSchema>;
