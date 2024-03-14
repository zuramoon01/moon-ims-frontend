<script lang="ts">
  import clsx from "clsx";
  import { Sidebar, Toast } from "$lib/ui";

  import "../app.css";
</script>

<Toast />

<Sidebar />

<main
  class={clsx(
    "flex w-full items-start transition-all duration-500",
    "tablet:pl-sidebar",
  )}
>
  <slot />
</main>
