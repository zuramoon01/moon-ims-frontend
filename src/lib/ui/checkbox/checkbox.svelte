<script lang="ts">
  import { createCheckbox, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { Icon, type CheckboxProps } from "$lib/ui";

  export let props: CheckboxProps;

  $: ({ state, name, value, required, disabled } = props);

  const {
    elements: { input, root },
    helpers: { isChecked, isIndeterminate },
    states: { checked },
  } = createCheckbox({
    required,
    disabled,
    name,
    value,
  });

  $: checked.set(state);
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
