<script lang="ts">
  import { apiMoonIMS } from "$lib/api";
  import {
    TransactionCombobox,
    type Product,
    transactionStore,
    transactionsWithConfigSchema,
  } from "$lib/entity";
  import {
    Button,
    Icon,
    Input,
    addToast,
    generateButtonClasses,
  } from "$lib/ui";
  import { Route, handleError, messageSchema } from "$lib/util";
  import { createDialog, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { setContext, tick } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const {
    elements: { close, content, overlay, portalled, title, trigger },
    states: { open },
  } = createDialog();

  let listSelectedProducts: Array<
    Pick<Product, "id" | "name" | "quantity"> & {
      stock: number;
    }
  > = [];

  const addProduct = (
    newProduct: Pick<Product, "id" | "name" | "quantity">,
  ) => {
    let isFound = false;

    listSelectedProducts.forEach((product, index) => {
      if (product.id === newProduct.id) {
        listSelectedProducts[index].stock += 1;

        isFound = true;

        return;
      }
    });

    if (!isFound) {
      listSelectedProducts = [
        ...listSelectedProducts,
        {
          ...newProduct,
          stock: 1,
        },
      ];
    }
  };

  setContext("add-dialog", { listSelectedProducts, addProduct });

  const decreaseStock = (index: number) => {
    let stock = listSelectedProducts[index].stock;
    stock--;

    if (stock === 0) {
      listSelectedProducts = listSelectedProducts.filter(
        (product) => product.id !== listSelectedProducts[index].id,
      );

      return;
    }

    listSelectedProducts[index].stock = stock;
  };

  const increaseStock = (index: number) => {
    let stock = listSelectedProducts[index].stock;
    stock++;

    listSelectedProducts[index].stock = stock;
  };

  let processState: { purchase: "idle" | "loading"; sale: "idle" | "loading" } =
    { purchase: "idle", sale: "idle" };
  const submitTransaction = async (type: "purchase" | "sale") => {
    if (processState[type] === "idle") {
      try {
        if (listSelectedProducts.length === 0) {
          addToast({
            data: {
              state: "Peringatan",
              description: "Tidak ada produk yang ditambahkan.",
            },
          });

          return;
        }

        const dataProducts = listSelectedProducts
          .filter(({ stock }) => stock > 0)
          .map(({ id, stock }) => {
            return { id, quantity: stock };
          });

        if (dataProducts.length === 0) {
          addToast({
            data: {
              state: "Peringatan",
              description:
                "Terdapat produk yang bernilai kurang dari atau sama dengan 0 (nol).",
            },
          });

          return;
        }

        processState[type] = "loading";

        const { status, data } = await apiMoonIMS.post(
          `${Route.Api.Transaction}/${type}`,
          {
            data: dataProducts,
          },
        );

        if (!data.message) {
          console.error("Fungsi submitTransaction no message");

          processState[type] = "idle";

          return;
        }

        const message = messageSchema.parse(data.message);

        if (status !== 201 || !data.data) {
          console.error(
            "Fungsi submitTransaction status not 201 or data not found",
          );

          processState[type] = "idle";

          return;
        }

        const transactionsWithConfig = transactionsWithConfigSchema.parse(
          data.data,
        );

        transactionStore.setTransactionStore(transactionsWithConfig);

        await tick();

        addToast({
          data: {
            state: "Sukses",
            description: message,
          },
        });

        listSelectedProducts = [];

        processState[type] = "idle";

        open.set(false);
      } catch (error) {
        processState[type] = "idle";
        handleError(error, "Fungsi submitTransaction");
      }
    }
  };
</script>

<div class="flex items-center">
  <button
    use:melt={$trigger}
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
      >Tambah Transaksi</span
    >
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
          class="my-auto flex w-full max-w-[40rem] flex-col items-start gap-4 rounded-md bg-accent-50 p-4 shadow-border"
        >
          <div class="flex w-full flex-col items-start gap-2">
            <div class="flex w-full items-center justify-between gap-4">
              <h3
                use:melt={$title}
                class="text-base font-semibold leading-none text-accent-950"
              >
                Buat Transaksi
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

          <form class="flex w-full flex-col items-start gap-4">
            <TransactionCombobox />

            <div
              class="flex max-h-[22.5rem] w-full flex-col items-start gap-2 overflow-auto"
            >
              {#each listSelectedProducts as { id, name, quantity, stock }, index (id)}
                <div
                  class={clsx(
                    "flex w-full flex-col items-start gap-4 overflow-scroll rounded p-4 shadow-border-inner",
                    "tablet:flex-row tablet:items-center tablet:justify-between",
                  )}
                >
                  <div class="flex flex-col items-start gap-2">
                    <h3 class="text-base font-medium leading-none">{name}</h3>
                    <span class="text-sm font-medium leading-none"
                      >Jumlah Produk Saat Ini: {quantity}</span
                    >
                  </div>

                  <div class="flex items-center gap-4">
                    <Button
                      props={{
                        type: "button",
                        variant: "outline",
                        icon: {
                          name: "remove",
                        },
                      }}
                      on:click={() => {
                        decreaseStock(index);
                      }}
                    />

                    <Input
                      props={{
                        type: "number",
                        min: "1",
                        class: clsx(
                          "items-center px-2 h-[1.875rem] text-center",
                        ),
                        containerClasses: clsx("w-16 shrink-0"),
                      }}
                      bind:value={stock}
                    />

                    <Button
                      props={{
                        type: "button",
                        variant: "outline",
                        icon: {
                          name: "plus",
                        },
                      }}
                      on:click={() => {
                        increaseStock(index);
                      }}
                    />
                  </div>
                </div>
              {/each}
            </div>

            <div
              class={clsx(
                "flex w-full flex-col items-center justify-end gap-x-4 gap-y-2 pt-4",
                "table:flex-row",
              )}
            >
              <Button
                props={{
                  type: "button",
                  variant: "outline",
                  text: "Batalkan",
                  class: clsx("w-full", "table:w-auto"),
                }}
                on:click={() => {
                  open.set(false);
                }}
              />

              <Button
                props={{
                  type: "button",
                  text: "Buat Transaksi Pembelian",
                  class: clsx("w-full", "table:w-auto"),
                  disabled: processState["sale"] === "loading",
                  loading: processState["purchase"] === "loading",
                }}
                on:click={() => {
                  submitTransaction("purchase");
                }}
              />

              <Button
                props={{
                  type: "button",
                  text: "Buat Transaksi Penjualan",
                  class: clsx("w-full", "table:w-auto"),
                  disabled: processState["purchase"] === "loading",
                  loading: processState["sale"] === "loading",
                }}
                on:click={() => {
                  submitTransaction("sale");
                }}
              />
            </div>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>
