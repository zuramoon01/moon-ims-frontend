import z from "zod";
import { client } from "$lib/server/db";

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

export const createTableProduct = async () => {
  try {
    await client.query(
      `
				CREATE TABLE IF NOT EXISTS products (
					id         SERIAL PRIMARY KEY,
					name       VARCHAR(255)                NOT NULL,
					quantity   SMALLINT                    NOT NULL DEFAULT 0 CHECK ( kuantitas >= 0 ),
					buy_price  INTEGER                     NOT NULL DEFAULT 0 CHECK ( harga_beli >= 0 ),
					sell_price INTEGER                     NOT NULL DEFAULT 0 CHECK ( harga_jual  >= 0 ),
					created_at TIMESTAMP                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
				);
        	`,
    );
  } catch (error) {
    console.error(error);
  }
};

export const getProducts = async (
  limit = 15,
  offset = 0,
): Promise<Product[]> => {
  try {
    const queryResult = await client.query(
      `
                SELECT
                    id
					, name
                    , quantity
                    , buy_price             AS "buyPrice"
                    , quantity * buy_price  AS "totalBuyPrice"
                    , sell_price            AS "sellPrice"
                    , quantity * sell_price AS "totalSellPrice"
                FROM products
                ORDER BY name DESC
                LIMIT $1 OFFSET $2;
		    `,
      [limit, offset],
    );

    const schemaResult = productsSchema.safeParse(queryResult.rows);

    if (schemaResult.success) {
      return schemaResult.data;
    }

    console.error(schemaResult.error.format());
  } catch (error) {
    console.error(error);
  }

  return [];
};

export const getProductById = async (id: number): Promise<Product[]> => {
  try {
    const queryResult = await client.query<Product>(
      `
                SELECT
                    id
					, name
                    , quantity
                    , buy_price             AS buyPrice
                    , quantity * buy_price  AS totalBuyPrice
                    , sell_price            AS sellPrice
                    , quantity * sell_price AS totalSellPrice
                FROM products
                WHERE id = $1;
		    `,
      [id],
    );

    const schemaResult = productsSchema.safeParse(queryResult.rows);

    if (schemaResult.success) {
      return schemaResult.data;
    }

    console.error(schemaResult.error.format());
  } catch (error) {
    console.error(error);
  }

  return [];
};

export const addProduct = async ({
  name,
  quantity,
  buyPrice,
  sellPrice,
}: Omit<Product, "id" | "totalBuyPrice" | "totalSellPrice">) => {
  try {
    await client.query("BEGIN");

    await client.query(
      `
                INSERT INTO products (name, quantity, buy_price, sell_price)
                VALUES ($1, $2, $3, $4);
		    `,
      [name, quantity, buyPrice, sellPrice],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);
  }
};

export const updateProduct = async ({
  id,
  name,
  quantity,
  buyPrice,
  sellPrice,
}: Omit<Product, "totalBuyPrice" | "totalSellPrice">) => {
  try {
    await client.query("START TRANSACTION");

    await client.query(
      `
                UPDATE products
				SET name	   = $2,
					quantity   = $3,
					buy_price  = $4,
					sell_price = $5,
					updated_at = current_timestamp
				WHERE id = $1;
		    `,
      [id, name, quantity, buyPrice, sellPrice],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);
  }
};

export const deleteProduct = async ({ id }: Pick<Product, "id">) => {
  try {
    await client.query("START TRANSACTION");

    await client.query(
      `
                DELETE
				FROM products
				WHERE id = $1;
		    `,
      [id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);
  }
};
