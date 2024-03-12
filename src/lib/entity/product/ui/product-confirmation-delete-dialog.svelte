<script
  lang="ts"
  context="module"
>
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
  } = createDialog({
    forceVisible: true,
    preventScroll: true,
  });

  export const productConfirmationDeleteDialogTrigger = trigger;
  export const productConfirmationDeleteDialogOpen = open;
  export const productConfirmationDeleteDialogPortalled = portalled;
</script>

<script lang="ts">
  import { getContext, tick } from "svelte";
  import { createDialog, melt } from "@melt-ui/svelte";
  import { productStore, productsWithConfigSchema } from "$lib/entity";
  import { Button, addToast } from "$lib/ui";
  import { Route, apiMoonIMS, handleError, messageSchema } from "$lib/util";
  import clsx from "clsx";

  const { generateSearchParamsProduct } = getContext<{
    generateSearchParamsProduct: () => string;
  }>("productContext");

  let processState: "idle" | "loading" = "idle";
  const deleteProducts = async () => {
    if (processState === "idle") {
      processState = "loading";

      try {
        const searchParamsProduct = generateSearchParamsProduct();

        const { status, data } = await apiMoonIMS.delete(
          `${Route.Api.Product}?${searchParamsProduct}`,
          {
            data: { ids: $productStore.selectedProductIds },
          },
        );

        if (data.message) {
          const message = messageSchema.parse(data.message);

          if (status === 200 && data.data) {
            const productsWithConfig = productsWithConfigSchema.parse(
              data.data,
            );

            productStore.setProductStore(productsWithConfig);
            productStore.removeAllSelectedProductId();

            await tick();

            addToast({
              data: {
                state: "Sukses",
                message,
              },
            });
          }
        }
      } catch (error) {
        handleError(error, "Fungsi deleteProducts Halaman Produk");
      }

      open.set(false);

      processState = "idle";
    }
  };
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
        Hapus Produk
      </h3>

      <div
        use:melt={$close}
        aria-label="close"
      >
        <Button props={{ variant: "shadow", icon: { name: "close" } }} />
      </div>
    </div>

    <div class="flex w-full flex-col items-start gap-4 py-4">
      <p
        use:melt={$description}
        class="flex w-full flex-col text-base leading-normal text-accent-950"
      >
        <span>Yakin ingin menghapus produk yang terpilih?</span>
        <span class="text-sm text-accent-500"
          >* Produk yang dihapus tidak dapat dikembalikan lagi!</span
        >
      </p>

      <div
        class={clsx(
          "flex w-full items-center justify-end gap-x-4 gap-y-2 pt-2",
          "max-[360px]:flex-col",
        )}
      >
        <div
          use:melt={$close}
          class="max-[360px]:w-full"
        >
          <Button
            props={{
              text: "Batalkan",
              variant: "outline",
              class: "max-[360px]:w-full",
            }}
          />
        </div>

        <Button
          props={{
            text: "Hapus Produk",
            variant: "danger",
            class: "max-[360px]:w-full",
            loading: processState === "loading",
          }}
          on:click={deleteProducts}
        />
      </div>
    </div>
  </div>
</div>
