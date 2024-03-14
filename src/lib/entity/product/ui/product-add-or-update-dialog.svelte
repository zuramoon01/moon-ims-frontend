<script
  lang="ts"
  context="module"
>
  const {
    elements: { close, content, overlay, portalled, title, trigger },
    states: { open },
  } = createDialog();

  export const productAddOrUpdateDialogTrigger = trigger;
</script>

<script lang="ts">
  import { getContext, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { createDialog, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import {
    productStore,
    productDialogSchema,
    productsWithConfigSchema,
  } from "$lib/entity";
  import { Route, apiMoonIMS, handleError, messageSchema } from "$lib/util";
  import {
    Button,
    Icon,
    Input,
    addToast,
    generateButtonClasses,
  } from "$lib/ui";

  $: input = $productStore.dialog;
  $: oldInput = input;

  const { generateSearchParamsProduct } = getContext<{
    generateSearchParamsProduct: () => string;
  }>("productContext");

  const resetDialog = async () => {
    productStore.updateDialog({
      id: undefined,
      name: undefined,
      quantity: 1,
      buyPrice: undefined,
      sellPrice: undefined,
    });

    await tick();
  };

  let processState: "idle" | "loading" = "idle";
  const submitProduct = async () => {
    if (processState === "idle") {
      try {
        const { id, name, quantity, buyPrice, sellPrice } =
          productDialogSchema.parse(input);

        if (!name || !quantity || !buyPrice || !sellPrice) {
          addToast({
            data: {
              state: "Peringatan",
              description:
                "Pastikan untuk mengisi nama produk, jumlah produk, harga beli, dan harga jual.",
            },
          });

          return;
        }

        processState = "loading";
        let productDialogState = true;

        const searchParamsProduct = generateSearchParamsProduct();

        if (!id) {
          try {
            const { status, data } = await apiMoonIMS.post(
              `${Route.Api.Product}?${searchParamsProduct}`,
              {
                name,
                quantity,
                buyPrice,
                sellPrice,
              },
            );

            if (data.message) {
              const message = messageSchema.parse(data.message);

              if (status === 201 && data.data) {
                const productsWithConfig = productsWithConfigSchema.parse(
                  data.data,
                );

                productStore.setProductStore(productsWithConfig);

                await tick();

                addToast({
                  data: {
                    state: "Sukses",
                    description: message,
                  },
                });

                productDialogState = false;
              }
            }
          } catch (error) {
            handleError(error, "Fungsi submitProduct add Halaman Produk");
          }
        } else {
          try {
            if (
              name === oldInput.name &&
              quantity === oldInput.quantity &&
              buyPrice === oldInput.buyPrice &&
              sellPrice === oldInput.sellPrice
            ) {
              addToast({
                data: {
                  state: "Error",
                  description:
                    "Tidak ada data pada produk yang dapat diperbaharui.",
                },
              });
            } else {
              const { status, data } = await apiMoonIMS.put(
                `${Route.Api.Product}/${id}?${searchParamsProduct}`,
                {
                  name,
                  quantity,
                  buyPrice,
                  sellPrice,
                },
              );

              if (data.message) {
                const message = messageSchema.parse(data.message);

                if (status === 200 && data.data) {
                  const productsWithConfig = productsWithConfigSchema.parse(
                    data.data,
                  );

                  productStore.setProductStore(productsWithConfig);

                  await tick();

                  addToast({
                    data: {
                      state: "Sukses",
                      description: message,
                    },
                  });

                  productDialogState = false;
                }
              }
            }
          } catch (error) {
            handleError(error, "Fungsi submitProduct update Halaman Produk");
          }
        }

        open.set(productDialogState);

        processState = "idle";
      } catch (error) {
        handleError(error, "Fungsi submitProduct UI ProductDialog");
      }
    }
  };
</script>

<div use:melt={$portalled}>
  {#if $open}
    <div
      use:melt={$overlay}
      transition:fade={{
        duration: 300,
        easing: cubicInOut,
      }}
      class="fixed inset-0 z-40 flex items-center justify-center bg-accent-50/50 p-4"
    >
      <div
        use:melt={$content}
        class="flex w-full max-w-[40rem] flex-col items-start gap-4 overflow-hidden rounded-md bg-accent-50 p-4 shadow-border"
      >
        <div class="flex w-full flex-col items-start gap-2">
          <div class="flex w-full items-center justify-between gap-4">
            <h3
              use:melt={$title}
              class="text-base font-semibold leading-none text-accent-950"
            >
              {input.id ? "Perbaharui Produk" : "Tambah Produk"}
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

        <form
          on:submit|preventDefault={submitProduct}
          class="flex w-full flex-col items-start gap-4"
        >
          <Input
            props={{
              label: "Nama Produk",
              type: "text",
              id: "name",
              required: true,
            }}
            bind:value={input.name}
          />

          <div
            class={clsx(
              "flex w-full flex-col items-start gap-4",
              "tablet:flex-row",
            )}
          >
            <Input
              props={{
                containerClasses: clsx(
                  "w-full",
                  "tablet:w-[calc((100%_-_1rem)_/_2_*_0.35)]",
                ),
                label: "Jumlah Produk",
                type: "number",
                id: "quantity",
                min: "1",
                required: true,
              }}
              bind:value={input.quantity}
            />

            <div
              class={clsx(
                "flex w-full flex-col items-start gap-4",
                "mobile-l:flex-row",
                "tablet:w-[calc((100%_-_1rem)_/_2_*_1.65)]",
              )}
            >
              <Input
                props={{
                  label: "Harga Beli",
                  type: "number",
                  id: "buy-price",
                  min: "1",
                  placeholder: "1000",
                  required: true,
                }}
                bind:value={input.buyPrice}
              />

              <Input
                props={{
                  label: "Harga Jual",
                  type: "number",
                  id: "sell-price",
                  min: "1",
                  placeholder: "1000",
                  required: true,
                }}
                bind:value={input.sellPrice}
              />
            </div>
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
                text: "Batalkan",
                class: clsx("w-full", "mobile-l:w-auto"),
              }}
              on:click={() => {
                open.set(false);
              }}
            />

            <Button
              props={{
                type: "submit",
                text: input.id ? "Simpan Perubahan" : "Tambah Produk",
                class: clsx("w-full", "mobile-l:w-auto"),
                loading: processState === "loading",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
