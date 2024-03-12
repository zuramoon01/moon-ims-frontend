<script
  lang="ts"
  context="module"
>
  export interface InputProps extends Omit<HTMLInputAttributes, "value"> {
    containerClasses?: string | null;
    label: string;
  }
</script>

<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";

  export let props: InputProps;
  export let value: any;

  $: ({ containerClasses, label, id, class: classes, ...attr } = props);
</script>

<fieldset
  class={twMerge(
    clsx("flex w-full flex-col items-start gap-2", containerClasses),
  )}
>
  <label
    class="text-sm font-medium leading-none"
    for={id}
  >
    {label}
  </label>

  <input
    {...attr}
    id={id}
    bind:value={value}
    class={twMerge(
      clsx(
        "flex w-full items-start justify-center rounded bg-accent-100 px-4 py-2 leading-none shadow-border-inner",
        classes,
      ),
    )}
  />
</fieldset>
