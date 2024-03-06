<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import clsx from "clsx";
  import { Button, Checkbox, Icon } from "$lib/ui";
  import {
    productGetAllSchema,
    type Product,
    type ProductGetAll,
  } from "$lib/schema";
  import { Route, formatToRupiah, handleError } from "$lib/utils";

  type FormattedProduct = Product & {
    buyPriceInRupiah: string;
    totalBuyPriceInRupiah: string;
    sellPriceInRupiah: string;
    totalSellPriceInRupiah: string;
  };

  let products: FormattedProduct[] = [];
  let configProduct: Omit<ProductGetAll["data"], "products"> & {
    currentPageInString: string;
    limitInString: string;
  } = {
    currentPage: 0,
    currentPageInString: "0",
    totalPage: 0,
    from: 0,
    to: 0,
    limit: 0,
    limitInString: "0",
    total: 0,
  };
  $: ({
    currentPage,
    currentPageInString,
    totalPage,
    from,
    to,
    limit,
    limitInString,
    total,
  } = configProduct);

  const formatProduct = (product: Product) => {
    return {
      ...product,
      buyPriceInRupiah: formatToRupiah(product.buyPrice),
      totalBuyPriceInRupiah: formatToRupiah(product.totalBuyPrice),
      sellPriceInRupiah: formatToRupiah(product.sellPrice),
      totalSellPriceInRupiah: formatToRupiah(product.totalSellPrice),
    };
  };

  const getProducts = async () => {
    try {
      const searchParamsProduct = new URLSearchParams(
        Array.from($page.url.searchParams.entries()),
      ).toString();
      const urlApiProduct = `${Route.Api.Product}?${searchParamsProduct}`;
      const response = await fetch(urlApiProduct, {
        method: "GET",
      });

      const productGetAll = productGetAllSchema.parse(await response.json());
      const {
        products: productsRaw,
        currentPage,
        limit,
        ..._configProduct
      } = productGetAll.data;

      products = productsRaw.map((product) => {
        return formatProduct(product);
      });
      configProduct = {
        ..._configProduct,
        currentPage,
        currentPageInString: currentPage.toString(),
        limit,
        limitInString: limit.toString(),
      };
    } catch (error) {
      handleError(error, "Fungsi getProducts, Halaman Produk");
    }
  };

  const productTableTitles: Array<{
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

  let orderByKey: keyof Omit<Product, "id"> | null = null;
  let sortDirection: "ASC" | "DESC" = "DESC";

  const sortProducts = (key: keyof Omit<Product, "id">) => {
    if (key !== orderByKey) {
      orderByKey = key;
      sortDirection = "DESC";
    } else if (sortDirection === "ASC") {
      orderByKey = null;
    } else {
      sortDirection = "ASC";
    }

    products = products.sort((a, b) => {
      const [x, y] =
        orderByKey === null ? [a.id, b.id] : [a[orderByKey], b[orderByKey]];

      if (sortDirection === "ASC") {
        return x > y ? -1 : x < y ? 1 : 0;
      } else {
        return x < y ? -1 : x > y ? 1 : 0;
      }
    });
  };

  const updateProductPage = async (params: { page: string; limit: string }) => {
    const searchParamsProduct = new URLSearchParams(params).toString();
    const urlProduct = `${Route.Product}?${searchParamsProduct}`;
    await goto(urlProduct);

    await getProducts();
  };

  const handleInput = async (
    e: KeyboardEvent & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    param: "page" | "limit",
  ) => {
    if (e.key === "Enter") {
      let value = Number(e.currentTarget.value);
      value = value !== 0 ? value : param === "page" ? 1 : 15;

      const params = {
        page: currentPageInString,
        limit: limitInString,
      };

      if (param === "page") {
        value = value < 1 ? 1 : value > totalPage ? totalPage : value;
      } else {
        value = value < 1 ? 1 : value > 25 ? 25 : value;
      }

      params[param] = value.toString();

      await updateProductPage(params);

      await getProducts();
    }
  };

  const handlePage = async (step: "previous" | "next") => {
    const newPage =
      step === "next"
        ? Math.min(totalPage, currentPage + 1)
        : Math.max(1, currentPage - 1);
    const params = {
      page: newPage.toString(),
      limit: limitInString,
    };
    await updateProductPage(params);

    await getProducts();
  };

  onMount(async () => {
    const { search } = $page.url;

    if (search === "") {
      const params = {
        page: "1",
        limit: "15",
      };
      await updateProductPage(params);

      return;
    }

    await getProducts();
  });
</script>

<svelte:head>
  <title>Admin | Produk</title>
</svelte:head>

<main class="flex w-[calc(100%_-_theme(spacing.sidebar))] flex-col items-start">
  <section class="flex w-full flex-col items-start px-8">
    <header
      class="flex h-[64px] w-full items-center justify-between px-4 text-accent-950"
    >
      <h1 class="text-xl font-bold leading-none">Produk</h1>

      <Button
        props={{
          type: "button",
          text: "Tambah Produk",
          icon: { name: "plus" },
        }}
      />
    </header>

    {#if total > 0}
      <div
        class="flex w-full flex-col items-start overflow-auto text-sm leading-none"
      >
        <div
          class="flex h-8 w-full px-4 font-semibold text-accent-950 shadow-border-b"
        >
          <div
            class="flex w-8 shrink-0 items-center justify-center shadow-border-r"
          >
            <Checkbox />
          </div>

          {#each productTableTitles as { key, text, classes } (key)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class={clsx(
                "flex cursor-pointer items-center justify-between px-4 shadow-border-r",
                "hover:bg-accent-100",
                classes,
              )}
              on:click={() => {
                sortProducts(key);
              }}
            >
              <span>{text}</span>

              {#if orderByKey === key}
                <Icon
                  props={{
                    name:
                      sortDirection === "ASC" ? "arrowDropUp" : "arrowDropDown",
                    classes: clsx("size-5"),
                  }}
                />
              {/if}
            </div>
          {/each}

          <div class="flex w-20 shrink-0 items-center justify-center px-4">
            <span class="text-center">Aksi</span>
          </div>
        </div>

        {#each products as { id, name, quantity, buyPriceInRupiah, totalBuyPriceInRupiah, sellPriceInRupiah, totalSellPriceInRupiah } (id)}
          <div
            class={clsx(
              "flex min-h-8 w-full px-4 shadow-border-b",
              "hover:bg-accent-100",
            )}
          >
            <div
              class="flex w-8 shrink-0 items-center justify-center shadow-border-r"
            >
              <Checkbox />
            </div>

            <div
              class="flex w-[calc(100%_-_(32px_+_160px_+_240px_+_240px_+_200px_+_200px_+_80px))] min-w-[200px] items-center px-4 py-1 shadow-border-r"
            >
              <span class="text-sm">{name}</span>
            </div>

            <div
              class="flex w-[160px] shrink-0 items-center px-4 py-1 shadow-border-r"
            >
              <span>{quantity}</span>
            </div>

            <div
              class="flex w-[240px] shrink-0 items-center px-4 py-1 shadow-border-r"
            >
              <span>{buyPriceInRupiah}</span>
            </div>

            <div
              class="flex w-[200px] shrink-0 items-center px-4 py-1 shadow-border-r"
            >
              <span>{totalBuyPriceInRupiah}</span>
            </div>

            <div
              class="flex w-[240px] shrink-0 items-center px-4 py-1 shadow-border-r"
            >
              <span>{sellPriceInRupiah}</span>
            </div>

            <div
              class="flex w-[200px] shrink-0 items-center px-4 py-1 shadow-border-r"
            >
              <span>{totalSellPriceInRupiah}</span>
            </div>

            <div
              class="flex w-[80px] shrink-0 items-center justify-center gap-1 px-4"
            >
              <div class="rounded bg-accent-200 p-1">
                <Icon
                  props={{
                    name: "edit",
                    classes: clsx("size-4 text-yellow-500"),
                  }}
                />
              </div>

              <div class="rounded bg-accent-200 p-1">
                <Icon
                  props={{
                    name: "delete",
                    classes: clsx("size-4 text-red-500"),
                  }}
                />
              </div>
            </div>
          </div>
        {/each}
      </div>

      <footer
        class="flex w-full items-center justify-between bg-accent-100 px-4 py-2 text-sm leading-none"
      >
        <div class="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="25"
            value={limit}
            class={clsx(
              "flex h-6 w-10 items-center justify-center rounded bg-accent-50 px-2 text-center text-sm font-medium leading-none shadow-border",
            )}
            on:keyup={(e) => {
              handleInput(e, "limit");
            }}
          />

          <span>Produk per halaman</span>

          <span class="font-medium text-accent-950"
            >Menampilkan {from} - {to} produk dari total {total} produk</span
          >
        </div>

        <div class="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={totalPage}
            value={currentPage}
            class={clsx(
              "flex h-6 w-10 items-center justify-center rounded bg-accent-50 px-2 text-center text-sm font-medium leading-none shadow-border",
            )}
            on:keyup={(e) => {
              handleInput(e, "page");
            }}
          />

          <span class="font-medium">dari {totalPage} halaman</span>

          <Button
            props={{
              type: "button",
              variant: "outline",
              icon: {
                name: "chevronLeft",
                classes: clsx("size-5 shrink-0"),
              },
              disabled: currentPage <= 1,
              class: clsx("size-6 p-0"),
            }}
            on:click={() => {
              handlePage("previous");
            }}
          />

          <Button
            props={{
              type: "button",
              variant: "outline",
              icon: {
                name: "chevronRight",
                classes: clsx("size-5 shrink-0"),
              },
              disabled: currentPage >= totalPage,
              class: clsx("size-6 p-0"),
            }}
            on:click={() => {
              handlePage("next");
            }}
          />
        </div>
      </footer>
    {/if}
  </section>
</main>
