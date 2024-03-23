<script lang="ts">
  import { apiMoonIMS } from "$lib/api";
  import { productsSearchSchema, type Product } from "$lib/entity";
  import { Icon } from "$lib/ui";
  import { Route, handleError } from "$lib/util";
  import clsx from "clsx";
  import { getContext, onMount } from "svelte";
  import { fly } from "svelte/transition";

  let inputElement: HTMLDivElement;
  let optionsElement: HTMLDivElement;

  const { listSelectedProducts, addProduct } = getContext<{
    listSelectedProducts: Array<
      Pick<Product, "id" | "name" | "quantity"> & {
        quantity: number;
      }
    >;
    addProduct: (product: Pick<Product, "id" | "name" | "quantity">) => void;
  }>("add-dialog");

  let isFocused: boolean = false;

  let products: Array<Pick<Product, "id" | "name" | "quantity">> = [];

  let debounceTimer: ReturnType<typeof setTimeout>;
  const debounce = (callback: () => void | Promise<void>) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, 450);
  };

  let searchInput = "";
  const searchProduct = () => {
    debounce(async () => {
      try {
        const { status, data } = await apiMoonIMS.get(
          `${Route.Api.Product}/search?${new URLSearchParams({
            text: searchInput,
          })}`,
        );

        if (status !== 200 || !data.data) {
          console.error("Get Search Product status not 200 or data not found");

          return;
        }

        products = productsSearchSchema.parse(data.data);
      } catch (error) {
        handleError(error, "Get Search Product");
      }
    });
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      e.target instanceof Node &&
      !inputElement.contains(e.target) &&
      !optionsElement.contains(e.target)
    ) {
      isFocused = false;
    }
  };
</script>

<svelte:document on:click={handleOutsideClick} />

<div class="relative flex w-full flex-col items-start gap-2">
  <div
    bind:this={inputElement}
    class="relative flex w-full items-center"
  >
    <input
      autocomplete="off"
      id="search-product"
      class="flex w-full items-start justify-center rounded bg-accent-50 py-2 pl-4 pr-10 text-sm font-medium leading-none shadow-border"
      placeholder="Cari nama produk"
      bind:value={searchInput}
      on:input={searchProduct}
      on:focus={() => {
        isFocused = true;
      }}
    />

    <Icon
      props={{
        name: "arrowDropDown",
        classes: clsx(
          "absolute right-2 top-1/2 -translate-y-1/2 text-accent-950",
        ),
      }}
    />
  </div>

  <div
    bind:this={optionsElement}
    transition:fly={{ duration: 150, y: -5 }}
    class={clsx(
      "absolute top-[calc(100%_+_8px)] max-h-[15rem] w-full overflow-auto rounded bg-accent-50 p-2 shadow-border",
      !isFocused && "hidden",
    )}
  >
    <div class="flex w-full flex-col items-start">
      {#each products as product (product.id)}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class={clsx(
            "flex w-full cursor-pointer items-center rounded-sm p-4",
            "hover:bg-accent-100",
          )}
          on:click={() => {
            addProduct(product);

            isFocused = false;
          }}
        >
          <span class="text-sm font-medium leading-none">{product.name}</span>
        </div>
      {:else}
        <div class="w-full flex items-center px-4 py-2">
          <span class="text-sm font-medium leading-none">Produk tidak ada.</span
          >
        </div>
      {/each}
    </div>
  </div>
</div>
