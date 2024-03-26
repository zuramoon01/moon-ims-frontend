<script lang="ts">
  import { getContext, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { createDialog, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { apiMoonIMS } from "$lib/api";
  import {
    productsWithConfigSchema,
    productStore,
    type NewProduct,
  } from "$lib/entity";
  import {
    Button,
    Icon,
    Input,
    addToast,
    generateButtonClasses,
  } from "$lib/ui";
  import { Route, handleError, messageSchema } from "$lib/util";

  const {
    elements: { close, content, overlay, portalled, title, trigger },
    states: { open },
  } = createDialog();

  let input: Record<keyof NewProduct, string> = {
    name: "",
    quantity: "1",
    buyPrice: "",
    sellPrice: "",
  };

  const { getSearchParamsProductString } = getContext<{
    getSearchParamsProductString: () => string;
  }>("productContext");

  let processState: "idle" | "loading" = "idle";
  const submitProduct = async () => {
    try {
      if (processState === "idle") {
        const { name, quantity, buyPrice, sellPrice } = input;

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

        const searchParamsProductString = getSearchParamsProductString();

        const { status, data } = await apiMoonIMS.post(
          `${Route.Api.Product}?${searchParamsProductString}`,
          {
            name,
            quantity: Number(quantity),
            buyPrice: Number(buyPrice),
            sellPrice: Number(sellPrice),
          },
        );

        if (!data.message) {
          console.error("Fungsi submitProduct UI ProductAddDialog no message");

          processState = "idle";

          return;
        }

        const message = messageSchema.parse(data.message);

        if (status !== 201 || !data.data) {
          console.error(
            "Fungsi submitProduct UI ProductAddDialog status not 201 or data not found",
          );

          processState = "idle";

          return;
        }

        const productsWithConfig = productsWithConfigSchema.parse(data.data);

        productStore.setProductStore(productsWithConfig);

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
      handleError(error, "Fungsi submitProduct UI ProductAddDialog");
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
      >Tambah Produk</span
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
                Tambah Produk
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
            class="flex w-full flex-col items-start gap-4"
            on:submit|preventDefault={submitProduct}
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
                  min: "0",
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
                  text: "Tambah Produk",
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
</div>
