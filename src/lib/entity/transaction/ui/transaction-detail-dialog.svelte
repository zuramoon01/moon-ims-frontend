<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import type { Transaction } from "$lib/entity";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { Button, Icon, generateButtonClasses } from "$lib/ui";
  import clsx from "clsx";
  import { formatToRupiah } from "$lib/util";

  const {
    elements: { close, content, overlay, portalled, title, trigger },
    states: { open },
  } = createDialog();

  export let props: Transaction;

  const transactionType = props.code.slice(0, 2) === "PO" ? "purchase" : "sale";
</script>

<div class="flex h-full w-full items-center">
  <button
    use:melt={$trigger}
    class="flex h-full w-full items-center"
  >
    <span class="text-sm leading-none text-accent-800">{props.code}</span>
  </button>

  <div use:melt={$portalled}>
    {#if $open}
      <div
        use:melt={$overlay}
        transition:fade={{
          duration: 300,
          easing: cubicInOut,
        }}
        class="fixed inset-0 z-40 flex items-start justify-center overflow-auto bg-accent-50/50 p-4"
      >
        <div
          use:melt={$content}
          class="my-auto flex w-full max-w-[40rem] flex-col items-start gap-4 overflow-hidden rounded-md bg-accent-50 p-4 shadow-border"
        >
          <div class="flex w-full flex-col items-start gap-2">
            <div class="flex w-full items-center justify-between gap-4">
              <h3
                use:melt={$title}
                class="text-base font-semibold leading-none text-accent-950"
              >
                Transaksi #{props.code}
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
          </div>

          <div class="flex w-full flex-col items-start gap-4">
            <div
              class="flex max-h-[22.5rem] w-full flex-col items-start gap-2 overflow-auto"
            >
              {#each props.transactionDetails as { id, product, price: { buyPrice, sellPrice }, stock } (id)}
                <div
                  class="flex w-full items-center justify-between gap-4 rounded p-4 shadow-border-inner"
                >
                  <div class="flex flex-col items-start gap-2">
                    <h3 class="text-base font-medium leading-none">
                      {product.name}
                    </h3>
                    {#if transactionType === "purchase"}
                      <span class="text-sm font-medium leading-none"
                        >Harga Beli: {formatToRupiah(buyPrice)}</span
                      >
                    {:else}
                      <span class="text-sm font-medium leading-none"
                        >Harga Jual: {formatToRupiah(sellPrice)}</span
                      >
                    {/if}
                    <span class="text-sm font-medium leading-none"
                      >{transactionType === "purchase"
                        ? "Total Pembelian:"
                        : "Total Penjualan:"}
                      {stock}</span
                    >
                    <span class="text-sm font-medium leading-none"
                      >Total Harga:
                      {formatToRupiah(
                        transactionType === "purchase"
                          ? buyPrice * stock
                          : sellPrice * stock,
                      )}</span
                    >
                  </div>
                </div>
              {/each}
            </div>

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
                  text: "Kembali",
                  class: clsx("w-full", "mobile-l:w-auto"),
                }}
                on:click={() => {
                  open.set(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
