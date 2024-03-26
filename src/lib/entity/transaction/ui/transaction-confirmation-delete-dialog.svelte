<script lang="ts">
  import { getContext, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { createDialog, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { apiMoonIMS } from "$lib/api";
  import { transactionStore, transactionsWithConfigSchema } from "$lib/entity";
  import { Button, Icon, addToast, generateButtonClasses } from "$lib/ui";
  import { Route, handleError, messageSchema } from "$lib/util";

  const {
    elements: {
      close,
      content,
      description,
      overlay,
      portalled,
      title,
      trigger,
    },
    states: { open },
  } = createDialog();

  const { getSearchParamsTransactionString } = getContext<{
    getSearchParamsTransactionString: () => string;
  }>("transactionContext");

  let processState: "idle" | "loading" = "idle";
  const deleteTransactions = async () => {
    try {
      if (processState === "idle") {
        processState = "loading";

        const searchParamsProductString = getSearchParamsTransactionString();

        const { status, data } = await apiMoonIMS.delete(
          `${Route.Api.Transaction}?${searchParamsProductString}`,
          {
            data: { ids: $transactionStore.selectedTransactionIds },
          },
        );

        if (!data.message) {
          console.error(
            "Fungsi deleteTransactions UI TransactionConfirmationDeleteDialog no message",
          );

          processState = "idle";

          return;
        }

        const message = messageSchema.parse(data.message);

        if (status !== 200 || !data.data) {
          console.error(
            "Fungsi deleteTransactions UI TransactionConfirmationDeleteDialog status not 200 or data not found",
          );

          processState = "idle";

          return;
        }

        const transactionsWithConfig = transactionsWithConfigSchema.parse(
          data.data,
        );

        transactionStore.setTransactionStore(transactionsWithConfig);
        transactionStore.removeAllSelectedTransactionId();

        await tick();

        addToast({
          data: {
            state: "Sukses",
            description: message,
          },
        });

        processState = "idle";

        open.set(false);
      }
    } catch (error) {
      handleError(error, "Fungsi deleteProducts Halaman Produk");
    }
  };
</script>

<button
  use:melt={$trigger}
  class={generateButtonClasses({ text: true, variant: "danger" })}>Hapus</button
>

<div use:melt={$portalled}>
  {#if $open}
    <div
      use:melt={$overlay}
      transition:fade={{
        duration: 300,
        easing: cubicInOut,
      }}
      class="fixed inset-0 z-40 flex items-center justify-center bg-accent-50/50 px-4"
    >
      <div
        use:melt={$content}
        class="flex w-full max-w-[25rem] flex-col items-start gap-4 overflow-hidden rounded-md bg-accent-50 p-4 shadow-border"
      >
        <div class="flex w-full flex-col items-start gap-2">
          <div class="flex w-full items-center justify-between gap-4">
            <h3
              use:melt={$title}
              class="text-base font-semibold leading-none text-accent-950"
            >
              Hapus Transaksi
            </h3>

            <button
              use:melt={$close}
              class={generateButtonClasses({ icon: true, variant: "shadow" })}
            >
              <div class="flex h-[0.875rem] items-center justify-center">
                <Icon
                  props={{
                    name: "close",
                    classes: clsx("size-5 shrink-0"),
                  }}
                />
              </div>
            </button>
          </div>

          <p
            use:melt={$description}
            class="flex w-full flex-col text-sm leading-tight text-accent-950"
          >
            <span>Yakin ingin menghapus transaksi yang terpilih?</span>
            <span class="text-accent-500"
              >* Transaksi yang dihapus tidak dapat dikembalikan lagi!</span
            >
          </p>
        </div>

        <div class="flex w-full flex-col items-start gap-4">
          <div
            class={clsx(
              "flex w-full flex-col items-center justify-end gap-x-4 gap-y-2 pt-4",
              "mobile-l:flex-row",
            )}
          >
            <Button
              props={{
                type: "button",
                variant: "outline",
                text: "Batalkan",
                class: clsx("w-full", "mobile-l:w-auto"),
              }}
              on:click={() => {
                open.set(false);
              }}
            />

            <Button
              props={{
                type: "button",
                variant: "danger",
                text: "Hapus Transaksi",
                class: clsx("w-full", "mobile-l:w-auto"),
                loading: processState === "loading",
              }}
              on:click={deleteTransactions}
            />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
