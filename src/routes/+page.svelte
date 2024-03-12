<script lang="ts">
  import { onDestroy, onMount, setContext, tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import {
    productStore,
    productTableTitles,
    ProductAddOrUpdateDialog,
    productAddOrUpdateDialogTrigger,
    productAddOrUpdateDialogOpen,
    productAddOrUpdateDialogPortalled,
    ProductConfirmationDeleteDialog,
    productConfirmationDeleteDialogTrigger,
    productConfirmationDeleteDialogOpen,
    productConfirmationDeleteDialogPortalled,
    productsWithConfigSchema,
  } from "$lib/entity";
  import { apiMoonIMS, appStore, handleError, Route } from "$lib/util";
  import { Button, Checkbox, CircleLoader, Icon } from "$lib/ui";

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

  $: ({ showSidebar } = $appStore);

  $: totalProducts = $productStore.data.length;
  $: totalSelectedProductIds = $productStore.selectedProductIds.length;
  let footerHeight = 0;

  const generateSearchParamsProduct = () => {
    return new URLSearchParams(
      Array.from($page.url.searchParams.entries()),
    ).toString();
  };

  setContext("productContext", {
    generateSearchParamsProduct,
  });

  const getProducts = async () => {
    pageState = "loading";

    try {
      const searchParamsProduct = generateSearchParamsProduct();

      const { status, data } = await apiMoonIMS.get(
        `${Route.Api.Product}?${searchParamsProduct}`,
      );

      if (status === 200 && data.data) {
        const productsWithConfig = productsWithConfigSchema.parse(data.data);

        productStore.setProductStore(productsWithConfig);

        await tick();

        inputLimit = $productStore.config.limitInString;
        inputPage = $productStore.config.currentPageInString;
      }
    } catch (error) {
      handleError(error, "Fungsi getProducts Halaman Produk");
    }

    pageState = "idle";
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
    }
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

<div use:melt={$productAddOrUpdateDialogPortalled}>
  {#if $productAddOrUpdateDialogOpen}
    <ProductAddOrUpdateDialog />
  {/if}
</div>

<div use:melt={$productConfirmationDeleteDialogPortalled}>
  {#if $productConfirmationDeleteDialogOpen}
    <ProductConfirmationDeleteDialog />
  {/if}
</div>

<div class={clsx("flex w-full flex-col items-start px-4", "md:px-8")}>
  <header class="flex h-16 w-full items-center justify-between gap-8">
    <h1 class="text-xl font-bold leading-none text-accent-950">Produk</h1>

    <div use:melt={$productAddOrUpdateDialogTrigger}>
      <Button
        props={{
          icon: { name: "plus" },
          class: clsx(
            showSidebar ? "min-[572px]:hidden" : "min-[379px]:hidden",
          ),
        }}
      />
      <Button
        props={{
          text: "Tambah Produk",
          icon: { name: "plus" },
          class: clsx(
            showSidebar ? "max-[571px]:hidden" : "max-[378px]:hidden",
          ),
        }}
      />
    </div>
  </header>

  {#if pageState === "loading" || total <= 0}
    <div class="flex w-full items-start justify-center">
      <CircleLoader props={{}} />
    </div>
  {:else}
    <section
      class="flex w-full flex-col items-start overflow-auto"
      style={`
        max-height: calc(100vh - (64px + ${footerHeight}px));
      `}
    >
      <div class="sticky left-0 top-0 flex min-h-[34px] w-full bg-accent-50">
        <div
          class="flex min-w-8 items-center justify-center shadow-border-inner-br"
        >
          <Checkbox
            props={{
              value:
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
                    sortDirection === "ASC" ? "arrowDropUp" : "arrowDropDown",
                  classes: clsx("size-5"),
                }}
              />
            {/if}
          </div>
        {/each}
      </div>

      {#each $productStore.data as { id, name, quantity, buyPrice, buyPriceInRupiah, totalBuyPriceInRupiah, sellPrice, sellPriceInRupiah, totalSellPriceInRupiah } (id)}
        <div
          transition:fade={{
            duration: 500,
            easing: cubicInOut,
          }}
          class={clsx("flex min-h-[34px] w-full", "hover:bg-accent-100")}
        >
          <div
            class="flex min-w-8 items-center justify-center shadow-border-inner-br"
          >
            <Checkbox
              props={{
                value: $productStore.selectedProductIds.includes(id),
              }}
              on:click={() => {
                productStore.toggleSelectedProductId(id);
              }}
            />
          </div>

          <div
            use:melt={$productAddOrUpdateDialogTrigger}
            on:m-click={async () => {
              productStore.updateDialog({
                id,
                name,
                quantity,
                buyPrice,
                sellPrice,
              });

              await tick();
            }}
            class="flex w-[calc((100%_-_32px)_/_6_*_2)] min-w-[150px] cursor-pointer items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800">{name}</span>
          </div>

          <div
            class="flex w-[calc((100%_-_32px)_/_6_*_0.7)] min-w-[158px] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800">{quantity}</span>
          </div>

          <div
            class="flex w-[calc((100%_-_32px)_/_6_*_0.9)] min-w-[204px] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{buyPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_32px)_/_6_*_0.75)] min-w-[164px] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalBuyPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_32px)_/_6_*_0.9)] min-w-[207px] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{sellPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_32px)_/_6_*_0.75)] min-w-[167px] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalSellPriceInRupiah}</span
            >
          </div>
        </div>
      {/each}
    </section>

    <footer
      bind:clientHeight={footerHeight}
      class={clsx(
        "flex min-h-10 w-full flex-wrap items-center justify-between gap-x-8 gap-y-4 overflow-auto bg-accent-100 px-4 py-2",
      )}
    >
      {#if totalSelectedProductIds > 0}
        <div
          use:melt={$productConfirmationDeleteDialogTrigger}
          class="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span
            class="text-nowrap text-sm font-medium leading-none text-accent-950"
            >{totalSelectedProductIds} Produk terpilih</span
          >

          <Button
            props={{
              text: "Hapus",
              variant: "danger",
              class: clsx("px-3 py-1 text-xs"),
            }}
          />
        </div>
      {:else}
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <div class="flex items-center gap-x-2">
            <input
              type="number"
              min="1"
              max="25"
              bind:value={inputLimit}
              class={clsx(
                "flex h-6 w-10 items-center justify-center rounded bg-accent-50 px-2 text-center text-sm font-medium leading-none shadow-border-inner",
              )}
              on:keyup={(e) => {
                handleInput(e, "limit");
              }}
            />

            <span class="text-nowrap text-sm leading-none"
              >Produk per halaman</span
            >
          </div>

          <span class="text-sm font-medium leading-none text-accent-950"
            >Menampilkan {from} - {to} produk dari {total} produk</span
          >
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={totalPage}
              bind:value={inputPage}
              class={clsx(
                "flex h-6 w-10 items-center justify-center rounded bg-accent-50 px-2 text-center text-sm font-medium leading-none shadow-border-inner",
              )}
              on:keyup={(e) => {
                handleInput(e, "page");
              }}
            />

            <span class="text-nowrap text-sm font-medium leading-none"
              >dari {totalPage} halaman</span
            >
          </div>

          <div class="flex items-center gap-2">
            <Button
              props={{
                type: "button",
                variant: "outline",
                icon: {
                  name: "chevronLeft",
                  classes: clsx("size-5"),
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
                  classes: clsx("size-5"),
                },
                disabled: currentPage >= totalPage,
                class: clsx("size-6 p-0"),
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
</div>
