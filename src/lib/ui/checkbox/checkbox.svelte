<script lang="ts">
  import clsx from "clsx";
  import { createCheckbox, melt } from "@melt-ui/svelte";
  import { Icon } from "$lib/ui";

  const {
    elements: { root, input },
    helpers: { isChecked, isIndeterminate },
  } = createCheckbox({});
</script>

<button
  use:melt={$root}
  class={clsx(
    "flex size-4 items-center justify-center rounded border",
    $isIndeterminate || $isChecked
      ? "border-accent-950 text-accent-950"
      : "border-accent-950/20 text-accent-950/20",
  )}
>
  {#if $isIndeterminate}
    <Icon props={{ name: "remove" }} />
  {:else if $isChecked}
    <Icon props={{ name: "check" }} />
  {/if}

  <input use:melt={$input} />
</button>
