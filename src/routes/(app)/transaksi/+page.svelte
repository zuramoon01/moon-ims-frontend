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
    TransactionAddDialog,
    TransactionConfirmationDeleteDialog,
    TransactionDetailDialog,
    transactionStore,
    transactionTableTitles,
    transactionsWithConfigSchema,
  } from "$lib/entity";
  import { Button, Checkbox, CircleLoader, Icon, Input } from "$lib/ui";
  import { Route, handleError } from "$lib/util";

  let pageState: "idle" | "loading" = "loading";

  let footerHeight = 0;

  $: ({
    data: transactions,
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
    selectedTransactionIds,
  } = $transactionStore);

  $: totalTransactions = transactions.length;
  $: totalSelectedTransactionIds = selectedTransactionIds.length;

  const getSearchParamsTransactionString = () => {
    return $page.url.searchParams.toString();
  };

  setContext("transactionContext", {
    getSearchParamsTransactionString,
  });

  const updateTransactionPage = async (params: {
    page: string;
    limit: string;
  }) => {
    const searchParamsTransaction = new URLSearchParams(params).toString();
    const urlTransaction = `${Route.Transaction}?${searchParamsTransaction}`;
    await goto(urlTransaction);
  };

  let inputLimit = "0";
  let inputPage = "0";
  const getTransactions = async () => {
    pageState = "loading";

    try {
      const searchParamsTransactionString = getSearchParamsTransactionString();

      const { status, data } = await apiMoonIMS.get(
        `${Route.Api.Transaction}?${searchParamsTransactionString}`,
      );

      if (status !== 200 || !data.data) {
        console.error("getTransactions status not 200 or data not found");
        return;
      }

      const transactionsWithConfig = transactionsWithConfigSchema.parse(
        data.data,
      );

      transactionStore.setTransactionStore(transactionsWithConfig);

      await tick();

      inputLimit = $transactionStore.config.limitInString;
      inputPage = $transactionStore.config.currentPageInString;
    } catch (error) {
      handleError(error, "Fungsi getTransactions Halaman Produk");
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

    await updateTransactionPage(params);

    await getTransactions();
  };

  const handleSubmitLimit = async () => {
    let value = Number(inputLimit);
    value = value !== 0 ? (value < 1 ? 1 : value > 25 ? 25 : value) : 15;

    inputLimit = value.toString();

    const params = {
      page: inputPage,
      limit: inputLimit,
    };

    await updateTransactionPage(params);

    await getTransactions();
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

    await updateTransactionPage(params);

    await getTransactions();
  };

  let getTransactionsInterval: ReturnType<typeof setInterval>;

  onMount(async () => {
    const { search } = $page.url;

    if (search === "") {
      const params = {
        page: "1",
        limit: "15",
      };

      await updateTransactionPage(params);
    }

    await getTransactions();

    getTransactionsInterval = setInterval(
      async () => {
        await getTransactions();
      },
      30 * 60 * 1000,
    );
  });

  onDestroy(() => {
    clearInterval(getTransactionsInterval);
  });
</script>

<svelte:head>
  <title>Admin | Transaksi</title>
</svelte:head>

<div class={clsx("flex w-full flex-col items-start px-4", "tablet:px-8")}>
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

      <h1 class="text-xl font-bold leading-none text-accent-950">Transaksi</h1>
    </div>

    <TransactionAddDialog />
  </header>

  {#if pageState === "loading"}
    <div class="flex w-full items-start justify-center">
      <CircleLoader />
    </div>
  {:else}
    <section class="flex w-full flex-col items-start overflow-auto">
      {#if total > 0}
        <div class="flex min-h-[2.125rem] w-full bg-accent-50">
          <div
            class="flex min-w-8 items-center justify-center shadow-border-inner-br"
          >
            <Checkbox
              props={{
                state:
                  totalSelectedTransactionIds === 0
                    ? false
                    : totalSelectedTransactionIds === totalTransactions
                      ? true
                      : "indeterminate",
              }}
              on:click={transactionStore.toggleAllSelectedTransactionId}
            />
          </div>

          {#each transactionTableTitles as { key, text, classes } (key)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class={clsx(
                "flex cursor-pointer items-center gap-2 px-4",
                "hover:bg-accent-100",
                classes,
              )}
              on:click={async () => {
                transactionStore.sortTransactions(key);

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

      {#each $transactionStore.data as { id, code, totalStock, totalPrice, totalPriceInRupiah, transactionDate, transactionDateFormatted, transactionDetails } (id)}
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
                state: $transactionStore.selectedTransactionIds.includes(id),
              }}
              on:click={() => {
                transactionStore.toggleSelectedTransactionId(id);
              }}
            />
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[9.375rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <TransactionDetailDialog
              props={{
                id,
                code,
                totalStock,
                totalPrice,
                transactionDate,
                transactionDetails,
              }}
            />
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[9.875rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalStock}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[12.75rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc((100%_-_2rem)_/_4_*_1)] min-w-[10.25rem] items-center px-4 py-2 shadow-border-inner-b"
          >
            <span class="text-sm leading-none text-accent-800"
              >{transactionDateFormatted}</span
            >
          </div>
        </div>
      {:else}
        Tidak ada transaksi
      {/each}

      {#if total > 0}
        <footer
          bind:clientHeight={footerHeight}
          class={clsx(
            "flex min-h-10 w-full flex-wrap items-center justify-between gap-x-8 gap-y-4 overflow-auto bg-accent-100 px-4 py-2",
          )}
        >
          {#if totalSelectedTransactionIds > 0}
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span
                class="text-nowrap text-sm font-medium leading-none text-accent-950"
                >{totalSelectedTransactionIds} Transaksi terpilih</span
              >

              <TransactionConfirmationDeleteDialog />
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
                  >Transaksi per halaman</span
                >
              </form>

              <span class="text-sm font-medium leading-none text-accent-950"
                >Menampilkan {from} - {to} transaksi dari {total} transaksi</span
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
