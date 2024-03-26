<script lang="ts">
  import { onDestroy, onMount, setContext, tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { flip } from "svelte/animate";
  import { fade, fly } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import clsx from "clsx";
  import { apiMoonIMS } from "$lib/api";
  import { appStore } from "$lib/store";
  import {
    ProductAddDialog,
    ProductConfirmationDeleteDialog,
    ProductUpdateDialog,
    productStore,
    productTableTitles,
    productsWithConfigSchema,
  } from "$lib/entity";
  import { Button, Checkbox, CircleLoader, Icon, Input } from "$lib/ui";
  import { Route, handleError } from "$lib/util";

  let pageState: "idle" | "loading" = "loading";

  $: ({
    data: products,
    config: {
      currentPage,
      totalPage,
      from,
      to,
      limitInString,
      total,
      orderByKey,
      sortDirection,
    },
    selectedProductIds,
  } = $productStore);

  $: totalProducts = products.length;
  $: totalSelectedProductIds = selectedProductIds.length;

  const getSearchParamsProductString = () => {
    return $page.url.searchParams.toString();
  };

  setContext("productContext", {
    getSearchParamsProductString,
  });

  const updateProductPage = async (params: { page: string; limit: string }) => {
    const searchParamsProduct = new URLSearchParams(params).toString();
    const urlProduct = `${Route.Product}?${searchParamsProduct}`;
    await goto(urlProduct);
  };

  let inputLimit = "0";
  let inputPage = "0";
  const getProducts = async () => {
    pageState = "loading";

    try {
      const searchParamsProductString = getSearchParamsProductString();

      const { status, data } = await apiMoonIMS.get(
        `${Route.Api.Product}?${searchParamsProductString}`,
      );

      if (status !== 200 || !data.data) {
        console.error("getProducts status not 200 or data not found");
        return;
      }

      const productsWithConfig = productsWithConfigSchema.parse(data.data);

      productStore.setProductStore(productsWithConfig);

      await tick();

      inputLimit = $productStore.config.limitInString;
      inputPage = $productStore.config.currentPageInString;
    } catch (error) {
      handleError(error, "Fungsi getProducts Halaman Produk");
    }

    pageState = "idle";
  };

  const handlePage = async (step: "previous" | "next") => {
    pageState = "loading";

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

  const handleSubmitLimit = async () => {
    let value = Number(inputLimit);
    value = value !== 0 ? (value < 1 ? 1 : value > 25 ? 25 : value) : 15;

    inputLimit = value.toString();

    const params = {
      page: inputPage,
      limit: inputLimit,
    };

    await updateProductPage(params);

    await getProducts();
  };

  const handleSubmitPage = async () => {
    let value = Number(inputPage);
    value =
      value !== 0 ? (value < 1 ? 1 : value > totalPage ? totalPage : value) : 1;

    inputPage = value.toString();

    const params = {
      page: inputPage,
      limit: inputLimit,
    };

    await updateProductPage(params);

    await getProducts();
  };

  let getProductsInterval: ReturnType<typeof setInterval>;

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

    getProductsInterval = setInterval(
      async () => {
        await getProducts();
      },
      30 * 60 * 1000,
    );
  });

  onDestroy(() => {
    clearInterval(getProductsInterval);
  });
</script>

<svelte:head>
  <title>Admin | Produk</title>
</svelte:head>

<div
  class={clsx("flex h-full w-full flex-col items-start px-4", "tablet:px-8")}
>
  <header class="flex h-16 w-full shrink-0 items-center justify-between gap-8">
    <div class="flex items-center gap-4">
      <Button
        props={{
          type: "button",
          icon: {
            name: "menu",
          },
          class: "tablet:hidden",
        }}
        on:click={() => {
          appStore.toggleSidebar(true);
        }}
      />

      <h1 class="text-xl font-bold leading-none text-accent-950">Produk</h1>
    </div>

    <ProductAddDialog />
  </header>

  {#if pageState === "loading"}
    <div class="flex w-full items-start justify-center">
      <CircleLoader />
    </div>
  {:else}
    <section
      class="flex max-h-[calc(100dvh_-_4rem)] min-h-[calc(25rem_-_4rem)] w-full flex-col items-start"
    >
      <div class="flex w-full flex-col items-start overflow-auto">
        {#if total > 0}
          <div class="flex min-h-[2.125rem] w-full shrink-0 bg-accent-50">
            <div
              class="flex min-w-8 items-center justify-center shadow-border-inner-br"
            >
              <Checkbox
                props={{
                  state:
                    totalSelectedProductIds === 0
                      ? false
                      : totalSelectedProductIds === totalProducts
                        ? true
                        : "indeterminate",
                }}
                on:click={productStore.toggleAllSelectedProductId}
              />
            </div>

            {#each productTableTitles as { key, text, classes } (key)}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class={clsx(
                  "flex cursor-pointer items-center gap-2 px-4 shadow-border-inner-br",
                  "hover:bg-accent-100",
                  classes,
                )}
                on:click={async () => {
                  productStore.sortProducts(key);

                  await tick();
                }}
              >
                <span class="text-sm leading-none text-accent-950">{text}</span>

                {#if orderByKey === key}
                  <Icon
                    props={{
                      name:
                        sortDirection === "ASC"
                          ? "arrowDropUp"
                          : "arrowDropDown",
                      classes: clsx("size-5"),
                    }}
                  />
                {/if}
              </div>
            {/each}
          </div>
        {/if}

        {#each $productStore.data as { id, name, quantity, buyPrice, buyPriceInRupiah, totalBuyPriceInRupiah, sellPrice, sellPriceInRupiah, totalSellPriceInRupiah } (id)}
          <div
            animate:flip={{
              duration: 300,
              easing: cubicInOut,
            }}
            in:fade={{
              duration: 150,
              easing: cubicInOut,
            }}
            out:fly={{
              duration: 150,
              x: "100%",
              easing: cubicInOut,
            }}
            class={clsx("group/row flex min-h-[2.125rem] w-full shrink-0")}
          >
            <div
              class={clsx(
                "flex min-w-8 items-center justify-center shadow-border-inner-br",
                "hoverable:group-hover/row:bg-accent-100",
              )}
            >
              <Checkbox
                props={{
                  state: $productStore.selectedProductIds.includes(id),
                }}
                on:click={() => {
                  productStore.toggleSelectedProductId(id);
                }}
              />
            </div>

            <div
              class={clsx(
                "flex w-[calc((100%_-_2rem)_/_6_*_2)] min-w-[9.375rem] items-center px-4 py-2 shadow-border-inner-br",
                "hoverable:group-hover/row:bg-accent-100",
              )}
            >
              <ProductUpdateDialog
                props={{
                  id,
                  name,
                  quantity,
                  buyPrice,
                  sellPrice,
                }}
              />
            </div>

            <div
              class={clsx(
                "flex w-[calc((100%_-_2rem)_/_6_*_0.7)] min-w-[9.875rem] items-center px-4 py-2 shadow-border-inner-br",
                "hoverable:group-hover/row:bg-accent-100",
              )}
            >
              <span class="text-sm leading-none text-accent-800"
                >{quantity}</span
              >
            </div>

            <div
              class={clsx(
                "flex w-[calc((100%_-_2rem)_/_6_*_0.9)] min-w-[12.75rem] items-center px-4 py-2 shadow-border-inner-br",
                "hoverable:group-hover/row:bg-accent-100",
              )}
            >
              <span class="text-sm leading-none text-accent-800"
                >{buyPriceInRupiah}</span
              >
            </div>

            <div
              class={clsx(
                "flex w-[calc((100%_-_2rem)_/_6_*_0.75)] min-w-[10.25rem] items-center px-4 py-2 shadow-border-inner-br",
                "hoverable:group-hover/row:bg-accent-100",
              )}
            >
              <span class="text-sm leading-none text-accent-800"
                >{totalBuyPriceInRupiah}</span
              >
            </div>

            <div
              class={clsx(
                "flex w-[calc((100%_-_2rem)_/_6_*_0.9)] min-w-[12.938rem] items-center px-4 py-2 shadow-border-inner-br",
                "hoverable:group-hover/row:bg-accent-100",
              )}
            >
              <span class="text-sm leading-none text-accent-800"
                >{sellPriceInRupiah}</span
              >
            </div>

            <div
              class={clsx(
                "flex w-[calc((100%_-_2rem)_/_6_*_0.75)] min-w-[10.438rem] items-center px-4 py-2 shadow-border-inner-br",
                "hoverable:group-hover/row:bg-accent-100",
              )}
            >
              <span class="text-sm leading-none text-accent-800"
                >{totalSellPriceInRupiah}</span
              >
            </div>
          </div>
        {:else}
          Tidak ada produk
        {/each}
      </div>

      {#if total > 0}
        <footer
          class={clsx(
            "flex min-h-10 w-full shrink-0 flex-wrap items-center justify-between gap-x-8 gap-y-4 bg-accent-100 px-4 py-2",
          )}
        >
          {#if totalSelectedProductIds > 0}
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span
                class="text-nowrap text-sm font-medium leading-none text-accent-950"
                >{totalSelectedProductIds} Produk terpilih</span
              >

              <ProductConfirmationDeleteDialog />
            </div>
          {:else}
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
              <form
                on:submit|preventDefault={handleSubmitLimit}
                class="flex items-center gap-4"
              >
                <Input
                  props={{
                    type: "number",
                    min: "1",
                    max: "25",
                    class: clsx("w-10 items-center px-2 text-center"),
                  }}
                  bind:value={inputLimit}
                />

                <span class="text-nowrap text-sm leading-none"
                  >Produk per halaman</span
                >
              </form>

              <span class="text-sm font-medium leading-none text-accent-950"
                >Menampilkan {from} - {to} produk dari {total} produk</span
              >
            </div>

            <div class="flex items-center gap-4">
              <form
                on:submit|preventDefault={handleSubmitPage}
                class="flex items-center gap-4"
              >
                <Input
                  props={{
                    type: "number",
                    min: "1",
                    max: totalPage,
                    class: clsx("w-10 items-center px-2 text-center"),
                  }}
                  bind:value={inputPage}
                />

                <span class="text-nowrap text-sm font-medium leading-none"
                  >dari {totalPage} halaman</span
                >
              </form>

              <div class="flex items-center gap-4">
                <Button
                  props={{
                    type: "button",
                    variant: "outline",
                    icon: {
                      name: "chevronLeft",
                      classes: clsx("size-5"),
                    },
                    disabled: currentPage <= 1,
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
                      classes: clsx("size-5"),
                    },
                    disabled: currentPage >= totalPage,
                  }}
                  on:click={() => {
                    handlePage("next");
                  }}
                />
              </div>
            </div>
          {/if}
        </footer>
      {/if}
    </section>
  {/if}
</div>
