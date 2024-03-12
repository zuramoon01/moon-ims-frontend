<script lang="ts">
  import clsx from "clsx";
  import { appStore } from "$lib/util";
  import { Sidebar, Toast } from "$lib/ui";

  import "../app.css";
</script>

<Toast />

<Sidebar />

<main
  class={clsx(
    "flex w-full items-start transition-all duration-[1000ms]",
    $appStore.showSidebar ? "pl-sidebar" : "pl-[46px]",
  )}
>
  <slot />
</main>
