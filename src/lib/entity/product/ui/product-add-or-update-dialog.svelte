<script
  lang="ts"
  context="module"
>
  const {
    elements: { close, content, overlay, portalled, title, trigger },
    states: { open },
  } = createDialog({
    forceVisible: true,
    preventScroll: true,
  });

  export const productAddOrUpdateDialogTrigger = trigger;
  export const productAddOrUpdateDialogOpen = open;
  export const productAddOrUpdateDialogPortalled = portalled;
</script>

<script lang="ts">
  import { getContext, onDestroy, tick } from "svelte";
  import { createDialog, melt } from "@melt-ui/svelte";
  import {
    productStore,
    productDialogSchema,
    productsWithConfigSchema,
    type DialogProduct,
  } from "$lib/entity";
  import { Route, apiMoonIMS, handleError, messageSchema } from "$lib/util";
  import { Button, Input, addToast } from "$lib/ui";
  import clsx from "clsx";

  const { generateSearchParamsProduct } = getContext<{
    generateSearchParamsProduct: () => string;
  }>("productContext");

  let input: DialogProduct = $productStore.dialog;
  let oldInput: DialogProduct = $productStore.dialog;

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
              message:
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
                    message,
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
                  message:
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
                      message,
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

  onDestroy(async () => {
    productStore.updateDialog({
      id: undefined,
      name: undefined,
      quantity: 1,
      buyPrice: undefined,
      sellPrice: undefined,
    });

    await tick();
  });
</script>

<div
  use:melt={$overlay}
  class="fixed inset-0 z-40 flex items-center justify-center bg-accent-50/50 px-4"
>
  <div
    use:melt={$content}
    class={clsx(
      "flex w-full max-w-[640px] shrink-0 flex-col items-start overflow-hidden rounded-lg bg-accent-100 px-8 pb-4 shadow-border-inner",
      "max-[360px]:px-4",
    )}
  >
    <div
      class="flex h-4 w-full items-center justify-between gap-2 py-8 shadow-border-inner-b"
    >
      <h3
        use:melt={$title}
        class="text font-semibold leading-none text-accent-950"
      >
        Tambah Produk
      </h3>

      <div
        use:melt={$close}
        aria-label="close"
      >
        <Button props={{ variant: "shadow", icon: { name: "close" } }} />
      </div>
    </div>

    <div class="flex w-full flex-col items-start gap-4 py-4">
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
        class={clsx("flex w-full items-start gap-4", "max-[510px]:flex-col")}
      >
        <Input
          props={{
            containerClasses: clsx(
              "w-[calc((100%_-_16px)_/_3_*_0.75)]",
              "max-[510px]:w-full",
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
            "flex w-[calc((100%_-_16px)_/_3_*_2.25)] items-start gap-4",
            "max-[510px]:w-full max-[510px]:flex-col",
          )}
        >
          <Input
            props={{
              containerClasses: clsx(
                "w-[calc((100%_-_16px)_/_2)]",
                "max-[510px]:w-full",
              ),
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
              containerClasses: clsx(
                "w-[calc((100%_-_16px)_/_2)]",
                "max-[510px]:w-full",
              ),
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
          "flex w-full items-center justify-end gap-x-4 gap-y-2 pt-2",
          "max-[360px]:flex-col",
        )}
      >
        <Button
          props={{
            text: "Batalkan",
            variant: "outline",
            class: "max-[360px]:w-full",
          }}
          on:click={() => {
            open.set(false);
          }}
        />

        <Button
          props={{
            text: input.id ? "Simpan Perubahan" : "Tambah Produk",
            class: "max-[360px]:w-full",
            loading: processState === "loading",
          }}
          on:click={() => {
            submitProduct();
          }}
        />
      </div>
    </div>
  </div>
</div>
