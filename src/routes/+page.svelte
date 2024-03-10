<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  // prettier-ignore
  import {
    productStore,
    productTableTitles,

    ProductDialog,
    productDialogOpen,
    productDialogPortalled,
    productDialogTrigger,

    productsWithConfigSchema,
    
    type Product,
  } from "$lib/entity";
  import { Button, Checkbox, Icon, addToast } from "$lib/ui";
  import { Route, handleError, messageSchema } from "$lib/util";

  let pageState: "idle" | "loading" = "loading";

  $: ({
    currentPage,
    currentPageInString,
    totalPage,
    from,
    to,
    limitInString,
    total,
    orderByKey,
    sortDirection,
  } = $productStore.config);

  const getProducts = async () => {
    try {
      const searchParamsProduct = new URLSearchParams(
        Array.from($page.url.searchParams.entries()),
      ).toString();

      const urlApiProduct = new URL(
        `${Route.Api.Product}?${searchParamsProduct}`,
        PUBLIC_BACKEND_URL,
      );

      const response = await fetch(urlApiProduct, {
        method: "GET",
      });

      const data = await response.json();

      if (response.status === 400 && data.message) {
        const message = messageSchema.parse(data.message);

        addToast({
          data: {
            state: "Error",
            message: message,
          },
        });
      } else if (response.status === 200 && data.data) {
        const productsWithConfig = productsWithConfigSchema.parse(data.data);

        productStore.setProductStore(productsWithConfig);

        await tick();

        inputLimit = $productStore.config.limitInString;
        inputPage = $productStore.config.currentPageInString;
      }
    } catch (error) {
      handleError(error, "Fungsi getProducts Halaman Produk");
    }
  };

  const deleteProduct = async (id: Product["id"]) => {
    try {
      const searchParamsProduct = new URLSearchParams(
        Array.from($page.url.searchParams.entries()),
      ).toString();

      const urlApiProduct = new URL(
        `${Route.Api.Product}/${id}?${searchParamsProduct}`,
        PUBLIC_BACKEND_URL,
      );

      const response = await fetch(urlApiProduct, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.message) {
        const message = messageSchema.parse(data.message);

        if (response.status === 400) {
          addToast({
            data: {
              state: "Error",
              message,
            },
          });
        } else if (response.status === 200) {
          addToast({
            data: {
              state: "Sukses",
              message,
            },
          });
        }
      }
    } catch (error) {
      handleError(error, "Fungsi getProducts Halaman Produk");
    }
  };

  const updateProductPage = async (params: { page: string; limit: string }) => {
    const searchParamsProduct = new URLSearchParams(params).toString();
    const urlProduct = `${Route.Product}?${searchParamsProduct}`;
    await goto(urlProduct);
  };

  let inputPage = "0";
  let inputLimit = "0";
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

      await tick();
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

    await tick();
  };

  let getProductsInterval: NodeJS.Timeout;

  onMount(async () => {
    const { search } = $page.url;

    if (search === "") {
      const params = {
        page: "1",
        limit: "15",
      };

      await updateProductPage(params);
    }

    await getProducts();

    await tick();

    getProductsInterval = setInterval(
      async () => {
        await getProducts();

        await tick();
      },
      30 * 60 * 1000,
    );

    pageState = "idle";
  });

  onDestroy(() => {
    clearInterval(getProductsInterval);
  });
</script>

<svelte:head>
  <title>Admin | Produk</title>
</svelte:head>

<main class="flex w-[calc(100%_-_theme(spacing.sidebar))] flex-col items-start">
  <section class="flex w-full flex-col items-start px-8">
    <div use:melt={$productDialogPortalled}>
      {#if $productDialogOpen}
        <ProductDialog />
      {/if}
    </div>

    <header
      class="flex h-[64px] w-full items-center justify-between px-4 text-accent-950"
    >
      <h1 class="text-xl font-bold leading-none">Produk</h1>

      <button
        use:melt={$productDialogTrigger}
        class={clsx([
          "flex h-8 items-center justify-center gap-2 rounded bg-accent-950 px-4 py-2 text-sm font-semibold leading-none text-accent-50",
          "hover:bg-accent-800",
          "active:bg-accent-900",
          "focus:bg-accent-900",
          "disabled:cursor-not-allowed disabled:bg-accent-300 disabled:text-accent-600",
          "disabled:hover:bg-accent-950",
          "disabled:active:bg-accent-950",
          "disabled:focus:bg-accent-950",
        ])}
        on:m-click={async (e) => {
          productStore.updateDialog({
            id: undefined,
            name: undefined,
            quantity: 1,
            buyPrice: undefined,
            sellPrice: undefined,
          });

          await tick();
        }}
      >
        <Icon props={{ name: "plus", classes: "size-4 shrink-0" }} />

        Tambah Produk
      </button>
    </header>

    {#if pageState === "loading" || total <= 0}
      <div class="flex w-full items-center justify-center">
        <div
          class="flex size-10 items-center justify-center rounded-full bg-white"
        >
          <div class="size-8 rounded-full bg-black"></div>
        </div>

        <div
          class="top- absolute size-10 rounded-[50%] border border-[#cfd0d1] border-b-[#1c87c9]"
        ></div>
      </div>
    {:else}
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
              on:click={async () => {
                productStore.sortProducts(key);

                await tick();
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

        {#each $productStore.data as { id, name, quantity, buyPrice, buyPriceInRupiah, totalBuyPriceInRupiah, sellPrice, sellPriceInRupiah, totalSellPriceInRupiah } (id)}
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
              <button
                use:melt={$productDialogTrigger}
                class="rounded bg-accent-200 p-1"
                on:m-click={async (e) => {
                  productStore.updateDialog({
                    id,
                    name,
                    quantity,
                    buyPrice,
                    sellPrice,
                  });

                  await tick();
                }}
              >
                <Icon
                  props={{
                    name: "edit",
                    classes: clsx("size-4 text-yellow-500"),
                  }}
                />
              </button>

              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="cursor-pointer rounded bg-accent-200 p-1"
                on:click={() => {
                  deleteProduct(id);
                }}
              >
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
            bind:value={inputLimit}
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
            bind:value={inputPage}
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
