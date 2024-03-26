<script lang="ts">
  import clsx from "clsx";
  import { Sidebar } from "$lib/ui";
</script>

<Sidebar />

<main
  class={clsx(
    "flex w-full items-start transition-all duration-500",
    "tablet:pl-sidebar",
  )}
>
  <slot />
</main>
