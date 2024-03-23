<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
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
    transactionStore,
    transactionTableTitles,
    transactionsWithConfigSchema,
  } from "$lib/entity";
  import { Button, CircleLoader } from "$lib/ui";
  import { Route, handleError } from "$lib/util";

  let pageState: "idle" | "loading" = "loading";

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
  } = $transactionStore);

  const getSearchParamsTransactionString = () => {
    return $page.url.searchParams.toString();
  };

  const updateTransactionPage = async (params: {
    page: string;
    limit: string;
  }) => {
    const searchParamsTransaction = new URLSearchParams(params).toString();
    const urlTransaction = `${Route.Transaction}?${searchParamsTransaction}`;
    await goto(urlTransaction);
  };

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
    } catch (error) {
      handleError(error, "Fungsi getTransactions Halaman Produk");
    }

    pageState = "idle";
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
          {#each transactionTableTitles as { key, text, classes } (key)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class={clsx(
                "flex cursor-pointer items-center gap-2 px-4 shadow-border-inner-br",
                "hover:bg-accent-100",
                classes,
              )}
              on:click={async () => {
                await tick();
              }}
            >
              <span class="text-sm leading-none text-accent-950">{text}</span>

              <!-- {#if orderByKey === key}
              <Icon
                props={{
                  name:
                    sortDirection === "ASC" ? "arrowDropUp" : "arrowDropDown",
                  classes: clsx("size-5"),
                }}
              />
            {/if} -->
            </div>
          {/each}
        </div>
      {/if}

      {#each $transactionStore.data as { id, code, totalStock, totalPriceInRupiah, transactionDateFormatted } (id)}
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
            class="flex w-[calc(100%_/_4_*_1)] min-w-[9.375rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800">{code}</span>
          </div>

          <div
            class="flex w-[calc(100%_/_4_*_1)] min-w-[9.875rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalStock}</span
            >
          </div>

          <div
            class="flex w-[calc(100%_/_4_*_1)] min-w-[12.75rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{totalPriceInRupiah}</span
            >
          </div>

          <div
            class="flex w-[calc(100%_/_4_*_1)] min-w-[10.25rem] items-center px-4 py-2 shadow-border-inner-br"
          >
            <span class="text-sm leading-none text-accent-800"
              >{transactionDateFormatted}</span
            >
          </div>
        </div>
      {:else}
        Tidak ada transaksi
      {/each}
    </section>
  {/if}
</div>
