<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import clsx from "clsx";
  import { Button, Checkbox, Icon } from "$lib/ui";
  import { productTableTitles, productStore } from "$lib/store";
  import { productGetAllSchema, type Product } from "$lib/schema";

  let config: Omit<productGetAllSchema["data"], "products">;

  const getProducts = async () => {
    try {
      const response = await fetch(
        `/api/products?${new URLSearchParams(
          Array.from($page.url.searchParams.entries()),
        ).toString()}`,
        {
          method: "GET",
        },
      );

      const productGetAllResults = productGetAllSchema.safeParse(
        await response.json(),
      );

      if (!productGetAllResults.success) {
        console.error(productGetAllResults.error.format());

        return;
      }

      const { products, ...configProduct } = productGetAllResults.data.data;

      productStore.set(products);
      config = configProduct;
    } catch (error) {
      console.log(error);
    }
  };

  let orderByKey: keyof Omit<Product, "id"> | null = null;
  let sort: "ASC" | "DESC" = "DESC";

  const handleInput = async ({
    page,
    limit,
  }: {
    page?: string;
    limit?: string;
  }) => {
    await goto(
      `/?${new URLSearchParams({
        page: page || config.currentPage.toString(),
        limit: limit || config.limit.toString(),
      }).toString()}`,
    );
    await getProducts();
  };

  const handlePage = async (step: "previous" | "next") => {
    await goto(
      step === "previous"
        ? `/?${new URLSearchParams({
            page: Math.max(1, config.currentPage - 1).toString(),
            limit: config.limit.toString(),
          }).toString()}`
        : `/?${new URLSearchParams({
            page: Math.min(config.totalPage, config.currentPage + 1).toString(),
            limit: config.limit.toString(),
          }).toString()}`,
    );
    await getProducts();
  };

  onMount(async () => {
    const { search } = $page.url;

    if (search === "") {
      await goto(
        `/?${new URLSearchParams({
          page: "1",
          limit: "15",
        }).toString()}`,
      );
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

    {#if config && config.total > 0}
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

          {#each productTableTitles as { id, text, classes } (id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class={clsx(
                "flex cursor-pointer items-center justify-between px-4 shadow-border-r",
                "hover:bg-accent-100",
                classes,
              )}
              on:click={() => {
                if (orderByKey !== id) {
                  orderByKey = id;

                  if (sort === "ASC") {
                    sort = "DESC";
                  }
                } else {
                  if (sort === "ASC") {
                    orderByKey = null;
                  } else {
                    sort = sort === "DESC" ? "ASC" : "DESC";
                  }
                }

                productStore.set(
                  $productStore.sort((a, b) => {
                    let x, y;

                    if (orderByKey === null) {
                      [x, y] = [a.id, b.id];
                    } else {
                      [x, y] = [a[orderByKey], b[orderByKey]];
                    }

                    if (sort === "DESC") {
                      if (x < y) {
                        return -1;
                      }
                      if (x > y) {
                        return 1;
                      }
                    } else {
                      if (x < y) {
                        return 1;
                      }
                      if (x > y) {
                        return -1;
                      }
                    }

                    return 0;
                  }),
                );
              }}
            >
              <span>{text}</span>

              {#if orderByKey === id}
                <Icon
                  props={{
                    name: sort === "DESC" ? "arrowDropDown" : "arrowDropUp",
                    classes: "size-5",
                  }}
                />
              {/if}
            </div>
          {/each}

          <div class="flex w-20 shrink-0 items-center justify-center px-4">
            <span class="text-center">Aksi</span>
          </div>
        </div>

        {#each $productStore as { id, name, quantity, buyPriceInRupiah, totalBuyPriceInRupiah, sellPriceInRupiah, totalSellPriceInRupiah } (id)}
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
            type="text"
            value={config.limit}
            class="flex h-6 w-10 items-center justify-center rounded bg-accent-50 px-2 text-center text-sm font-medium leading-none shadow-border"
            on:keyup={(e) => {
              if (e.key === "Enter") {
                handleInput({ limit: e.currentTarget.value });
              }
            }}
          />

          <span>Produk per halaman</span>

          <span class="font-medium text-accent-950"
            >Menampilkan {config.from} - {config.to} produk dari total
            {config.total}
            produk</span
          >
        </div>

        <div class="flex items-center gap-2">
          <input
            type="text"
            value={config.currentPage}
            class="flex h-6 w-10 items-center justify-center rounded bg-accent-50 px-2 text-center text-sm font-medium leading-none shadow-border"
            on:keyup={(e) => {
              if (e.key === "Enter") {
                handleInput({ page: e.currentTarget.value });
              }
            }}
          />

          <span class="font-medium">dari {config.totalPage} halaman</span>

          {#if config.currentPage > 0}
            <Button
              props={{
                type: "button",
                variant: "outline",
                icon: {
                  name: "chevronLeft",
                  classes: clsx("size-5 shrink-0"),
                },
                class: clsx("size-6 p-0"),
              }}
              on:click={() => {
                handlePage("previous");
              }}
            />
          {/if}

          {#if config.currentPage < config.totalPage}
            <Button
              props={{
                type: "button",
                variant: "outline",
                icon: {
                  name: "chevronRight",
                  classes: clsx("size-5 shrink-0"),
                },
                class: clsx("size-6 p-0"),
              }}
              on:click={() => {
                handlePage("next");
              }}
            />
          {/if}
        </div>
      </footer>
    {/if}
  </section>
</main>
