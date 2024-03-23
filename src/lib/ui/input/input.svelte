<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";
  import type { InputProps } from "$lib/ui";

  export let props: InputProps;
  export let value: any;

  $: ({ containerClasses, label, id, class: classes, ...attr } = props);
</script>

<fieldset
  class={twMerge(
    clsx("flex w-full flex-col items-start gap-2", containerClasses),
  )}
>
  {#if label}
    <label
      class="text-sm font-medium leading-none"
      for={id}
    >
      {label}
    </label>
  {/if}

  <input
    {...attr}
    id={id}
    bind:value={value}
    class={twMerge(
      clsx(
        "flex w-full items-start justify-center rounded bg-accent-50 px-4 py-2 text-sm font-medium leading-none shadow-border",
        classes,
      ),
    )}
  />
</fieldset>
