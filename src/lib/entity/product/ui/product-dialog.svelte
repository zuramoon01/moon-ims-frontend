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

  export const productDialogTrigger = trigger;
  export const productDialogOpen = open;
  export const productDialogPortalled = portalled;
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import { createDialog, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  import { productStore, productsWithConfigSchema } from "$lib/entity";
  import { Icon, addToast } from "$lib/ui";
  import { Route, handleError, messageSchema } from "$lib/util";

  let input = {
    id: $productStore.dialog.id,
    name: $productStore.dialog.name,
    quantity: $productStore.dialog.quantity,
    buyPrice: $productStore.dialog.buyPrice,
    sellPrice: $productStore.dialog.sellPrice,
  };

  let oldInput = {
    id: $productStore.dialog.id,
    name: $productStore.dialog.name,
    quantity: $productStore.dialog.quantity,
    buyPrice: $productStore.dialog.buyPrice,
    sellPrice: $productStore.dialog.sellPrice,
  };

  const submitProduct = async () => {
    const { id, name, quantity, buyPrice, sellPrice } = input;

    if (!name || !quantity || !buyPrice || !sellPrice) {
      console.log("Gagal Submit");

      return;
    }

    if (!id) {
      try {
        const searchParamsProduct = new URLSearchParams(
          Array.from($page.url.searchParams.entries()),
        ).toString();

        const urlApiProduct = new URL(
          `${Route.Api.Product}?${searchParamsProduct}`,
          PUBLIC_BACKEND_URL,
        );

        const response = await fetch(urlApiProduct, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            quantity,
            buyPrice,
            sellPrice,
          }),
        });

        const data = await response.json();

        if (data.message) {
          const message = messageSchema.parse(data.message);

          if (response.status === 400) {
            addToast({
              data: {
                state: "Error",
                message,
              },
            });
          } else if (response.status === 201 && data.data) {
            const productsWithConfig = productsWithConfigSchema.parse(
              data.data,
            );

            productStore.setProductStore(productsWithConfig);

            addToast({
              data: {
                state: "Sukses",
                message,
              },
            });
          }
        }
      } catch (error) {
        handleError(error, "Fungsi submitProduct add Halaman Produk");
      }
    } else {
      try {
        const searchParamsProduct = new URLSearchParams(
          Array.from($page.url.searchParams.entries()),
        ).toString();

        const urlApiProduct = new URL(
          `${Route.Api.Product}/${id}?${searchParamsProduct}`,
          PUBLIC_BACKEND_URL,
        );

        const response = await fetch(urlApiProduct, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            quantity,
            buyPrice,
            sellPrice,
          }),
        });

        const data = await response.json();

        if (data.message) {
          const message = messageSchema.parse(data.message);

          if (response.status === 400) {
            addToast({
              data: {
                state: "Error",
                message,
              },
            });
          } else if (response.status === 200 && data.data) {
            const productsWithConfig = productsWithConfigSchema.parse(
              data.data,
            );

            productStore.setProductStore(productsWithConfig);

            addToast({
              data: {
                state: "Sukses",
                message,
              },
            });
          }
        }
      } catch (error) {
        handleError(error, "Fungsi submitProduct update Halaman Produk");
      }
    }
  };
</script>

<div
  use:melt={$overlay}
  class="fixed inset-0 z-50 bg-accent-50/50"
/>

<div
  use:melt={$content}
  class="fixed left-[50%] top-[50%] z-50 flex w-full max-w-[640px] translate-x-[-50%] translate-y-[-50%] flex-col items-start rounded-lg bg-accent-100 px-8 pb-4 text-accent-950 shadow-border"
>
  <div
    class="flex h-4 w-full items-center justify-between gap-2 py-8 shadow-border-b"
  >
    <h2
      use:melt={$title}
      class="text font-semibold leading-none"
    >
      Tambah Produk
    </h2>

    <button
      use:melt={$close}
      aria-label="close"
      class={"hover:text-accent-800"}
    >
      <Icon
        props={{
          name: "close",
        }}
      />
    </button>
  </div>

  <div class="flex w-full flex-col items-start gap-4 py-4">
    <fieldset class="flex w-full flex-col items-start gap-2">
      <label
        class="text-sm font-medium leading-none"
        for="name"
      >
        Nama Produk
      </label>

      <input
        type="text"
        id="name"
        bind:value={input.name}
        required={true}
        class="flex w-full items-start justify-center rounded bg-accent-100 px-4 py-2 leading-none shadow-border"
      />
    </fieldset>

    <fieldset class="flex w-full flex-col items-start gap-2">
      <label
        class="text-sm font-medium leading-none"
        for="quantity"
      >
        Kuantitas
      </label>

      <input
        type="number"
        id="quantity"
        min="1"
        bind:value={input.quantity}
        required={true}
        class="flex w-full items-start justify-center rounded bg-accent-100 px-4 py-2 leading-none shadow-border"
      />
    </fieldset>

    <div class="flex w-full items-start gap-4">
      <fieldset class="flex w-full flex-col items-start gap-2">
        <label
          class="text-sm font-medium leading-none"
          for="buy-price"
        >
          Harga Beli
        </label>

        <input
          type="number"
          id="buy-price"
          min="1"
          placeholder="1000"
          bind:value={input.buyPrice}
          required={true}
          class="flex w-full items-start justify-center rounded bg-accent-100 px-4 py-2 leading-none shadow-border"
        />
      </fieldset>

      <fieldset class="flex w-full flex-col items-start gap-2">
        <label
          class="text-sm font-medium leading-none"
          for="sell-price"
        >
          Harga Jual
        </label>

        <input
          type="number"
          id="sell-price"
          min="1"
          placeholder="1000"
          bind:value={input.sellPrice}
          required={true}
          class="flex w-full items-start justify-center rounded bg-accent-100 px-4 py-2 leading-none shadow-border"
        />
      </fieldset>
    </div>

    <div class="flex w-full items-center justify-end gap-4 pt-2">
      <button
        use:melt={$close}
        class={clsx(
          "flex h-8 items-center justify-center rounded bg-red-950 px-4 py-2 text-sm font-semibold leading-none text-red-50",
          "hover:bg-red-800",
          "active:bg-red-900",
          "focus:bg-red-900",
          "disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-red-600",
          "disabled:hover:bg-red-950",
          "disabled:active:bg-red-950",
          "disabled:focus:bg-red-950",
        )}
      >
        Batalkan
      </button>

      <button
        use:melt={$close}
        class={clsx(
          "flex h-8 items-center justify-center rounded bg-accent-950 px-4 py-2 text-sm font-semibold leading-none text-accent-50",
          "hover:bg-accent-800",
          "active:bg-accent-900",
          "focus:bg-accent-900",
          "disabled:cursor-not-allowed disabled:bg-accent-300 disabled:text-accent-600",
          "disabled:hover:bg-accent-950",
          "disabled:active:bg-accent-950",
          "disabled:focus:bg-accent-950",
        )}
        on:m-click={() => {
          submitProduct();
        }}
      >
        {input.id ? "Simpan Perubahan" : "Tambah Produk"}
      </button>
    </div>
  </div>
</div>
