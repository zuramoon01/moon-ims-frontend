<script lang="ts">
  import { tick } from "svelte";
  import { page } from "$app/stores";
  import clsx from "clsx";
  import { Route, appStore } from "$lib/util";
  import { Button, Link, type LinkProps } from "$lib/ui";

  $: ({ showSidebar } = $appStore);

  const navs: Array<LinkProps> = [
    {
      text: "Produk",
      href: Route.Product,
      icon: { name: "inventory" },
    },
    {
      text: "Transaksi",
      href: Route.Transaction,
      icon: { name: "receipt" },
    },
  ];
</script>

<aside
  class={clsx(
    "fixed left-0 top-0 z-10 flex h-full shrink-0 flex-col items-start justify-between gap-8 bg-accent-100 py-4 shadow-border-inner-r transition-all duration-1000",
    showSidebar
      ? ["w-sidebar px-4", "max-[360px]:w-full max-[360px]:shadow-none"]
      : "w-[46px] px-2",
  )}
>
  <button
    type="button"
    class={clsx(
      "absolute right-[-15px] top-[16px] z-50 flex size-[30px] items-center justify-center rounded-md bg-accent-950 transition-all",
      showSidebar
        ? ["right-[-15px]", "max-[360px]:right-[16px]"]
        : "right-[8px]",
    )}
    on:click={async () => {
      appStore.toggleSidebar(!showSidebar);

      await tick();
    }}
  >
    <div
      class={clsx(
        "flex size-5 items-center border-4 border-accent-50 bg-accent-50",
      )}
    >
      <div
        class={clsx(
          "h-full w-1/2 bg-accent-950 transition-all",
          showSidebar ? "ml-0" : "ml-[6px]",
        )}
      ></div>
    </div>
  </button>

  <header class="flex w-full flex-col items-start gap-1 overflow-hidden">
    <div class="flex h-12 w-full items-center px-4 pb-4 shadow-border-inner-b">
      <h2
        class={clsx(
          "z-40 text-nowrap text-lg font-extrabold leading-none text-accent-950 transition-all delay-1000",
          showSidebar ? "opacity-100" : "opacity-0",
        )}
      >
        Kasih Murah Store
      </h2>
    </div>

    <nav class="flex w-full flex-col items-start gap-1">
      {#each navs as { text, href, icon }, i (i)}
        <Link
          props={{
            href,
            variant: $page.url.pathname === href ? "filled" : "shadow",
            text,
            icon,
            class: clsx(
              "transition-all flex justify-start w-full",
              showSidebar ? "px-4" : "px-[5px]",
            ),
          }}
        />
        <!-- <Link
          props={{
            href,
            variant: $page.url.pathname === href ? "filled" : "shadow",
            icon,
            class: clsx(
              "transition-all",
              showSidebar ? "hidden opacity-0" : "flex opacity-100",
            ),
          }}
        /> -->
      {/each}
    </nav>
  </header>

  <footer class="flex w-full flex-col items-start gap-1">
    <Button
      props={{
        variant: "outline",
        text: "Keluar",
        icon: {
          name: "logout",
        },
        class: clsx(
          "transition-all flex justify-start w-full",
          showSidebar ? "px-4" : "px-[5px]",
        ),
      }}
    />
  </footer>
</aside>
