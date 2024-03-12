<script
  lang="ts"
  context="module"
>
  export interface CheckboxProps {
    value: boolean | "indeterminate";
  }
</script>

<script lang="ts">
  import { createCheckbox, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { Icon } from "$lib/ui";

  export let props: CheckboxProps;

  const {
    elements: { input, root },
    helpers: { isChecked, isIndeterminate },
    states: { checked },
  } = createCheckbox();

  $: checked.set(props.value);
</script>

<button
  use:melt={$root}
  class={clsx(
    "flex size-4 items-center justify-center rounded border",
    $isIndeterminate || $isChecked
      ? "border-accent-950 text-accent-950"
      : "border-accent-950/20 text-accent-950/20",
  )}
  on:click
>
  {#if $isIndeterminate}
    <Icon props={{ name: "remove" }} />
  {:else if $isChecked}
    <Icon props={{ name: "check" }} />
  {/if}

  <input use:melt={$input} />
</button>
