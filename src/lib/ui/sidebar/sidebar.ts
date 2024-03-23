import type { LinkProps } from "$lib/ui";
import { Route } from "$lib/util";

export const navs: Array<LinkProps> = [
  {
    text: "Produk",
    href: Route.Product,
    icon: { name: "inventory" },
  },
  {
    text: "Transaksi",
    href: Route.Transaction,
    icon: { name: "receipt" },
  },
];
