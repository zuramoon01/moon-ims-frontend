export const Route = {
  Login: "/masuk",
  Product: "/",
  Transaction: "/transaksi",
  Api: {
    Login: "/api/v1/auth/login",
    Logout: "/api/v1/auth/logout",
    Product: "/api/v1/products",
    Transaction: "/api/v1/transactions",
  },
} as const;
