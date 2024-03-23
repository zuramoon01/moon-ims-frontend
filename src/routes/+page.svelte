<script lang="ts">
  import { onDestroy, onMount, setContext, tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { flip } from "svelte/animate";
  import { fade, fly } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import clsx from "clsx";
  import {
    productStore,
    productTableTitles,
    productsWithConfigSchema,
    ProductAddOrUpdateDialog,
    productAddOrUpdateDialogTrigger,
    ProductConfirmationDeleteDialog,
    productConfirmationDeleteDialogTrigger,
  } from "$lib/entity";
  import { apiMoonIMS, appStore, handleError, Route } from "$lib/util";
  import {
    Button,
    Checkbox,
    CircleLoader,
    Icon,
    Input,
    generateButtonClasses,
  } from "$lib/ui";
  import { melt } from "@melt-ui/svelte";

  let pageState: "idle" | "loading" = "loading";

  $: ({
    currentPage,
    totalPage,
    from,
    to,
    limitInString,
    total,
    orderByKey,
    sortDirection,
  } = $productStore.config);

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

  let inputLimit = "0";
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

  let inputPage = "0";
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

<div class={clsx("flex w-full flex-col items-start px-4", "tablet:px-8")}>
  <ProductAddOrUpdateDialog />

  <header class="flex h-16 w-full items-center justify-between gap-8">
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

    <button
      use:melt={$productAddOrUpdateDialogTrigger}
      on:m-click={async () => {
        productStore.updateDialog({
          id: undefined,
          name: undefined,
          quantity: 1,
          buyPrice: undefined,
          sellPrice: undefined,
        });

        await tick();
      }}
      class={generateButtonClasses({
        text: true,
        icon: true,
        classes: clsx(
          "size-[1.875rem] px-0 py-0",
          "tablet:size-auto tablet:px-4 tablet:py-2",
        ),
      })}
    >
      <div class="flex h-[0.875rem] items-center justify-center">
        <Icon
          props={{
            name: "plus",
            classes: clsx("size-5 shrink-0"),
          }}
        />
      </div>

      <span
        class={clsx("hidden text-sm font-medium leading-none", "tablet:inline")}
        >Tambah Produk</span
      >
    </button>
  </header>

  {#if pageState === "loading"}
    <div class="flex w-full items-start justify-center">
      <CircleLoader />
    </div>
  {:else}
    <section
      class="flex w-full flex-col items-start overflow-auto"
      style={`
        max-height: calc(100vh - (4rem + ${footerHeight}px));
      `}
    >
      {#if total > 0}
        <div class="flex min-h-[2.125rem] w-full bg-accent-50">
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
                      sortDirection === "ASC" ? "arrowDropUp" : "arrowDropDown",
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
          class={clsx(
            "flex min-h-[2.125rem] w-full",
            "hoverable:hover:bg-accent-100",
          )}
        >
          <div
            class="flex min-w-8 items-center justify-center shadow-border-inner-br"
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
            class="flex w-[calc((100%_-_2rem)_/_6_*_2)] min-w-[9.375rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <button
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
              class="flex h-full w-full items-center"
            >
              <span class="text-sm leading-none text-accent-800">{name}</span>
            </button>
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_6_*_0.7)] min-w-[9.875rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800">{quantity}</span>
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_6_*_0.9)] min-w-[12.75rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{buyPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_6_*_0.75)] min-w-[10.25rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalBuyPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_6_*_0.9)] min-w-[12.938rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{sellPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_6_*_0.75)] min-w-[10.438rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalSellPriceInRupiah}</span
            >
          </div>
        </div>
      {:else}
        Tidak ada produk
      {/each}
    </section>

    <ProductConfirmationDeleteDialog />

    {#if total > 0}
      <footer
        bind:clientHeight={footerHeight}
        class={clsx(
          "flex min-h-10 w-full flex-wrap items-center justify-between gap-x-8 gap-y-4 overflow-auto bg-accent-100 px-4 py-2",
        )}
      >
        {#if totalSelectedProductIds > 0}
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              class="text-nowrap text-sm font-medium leading-none text-accent-950"
              >{totalSelectedProductIds} Produk terpilih</span
            >

            <button
              use:melt={$productConfirmationDeleteDialogTrigger}
              type="button"
              class={generateButtonClasses({ text: true, variant: "danger" })}
              >Hapus</button
            >
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
  {/if}
</div>
