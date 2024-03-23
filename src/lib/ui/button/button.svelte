<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";
  import {
    CircleLoader,
    generateButtonClasses,
    Icon,
    type ButtonProps,
  } from "$lib/ui";

  export let props: ButtonProps;

  $: ({ variant, text, icon, loading, class: classes, ...attr } = props);
</script>

<button
  {...attr}
  class={generateButtonClasses({
    text: !!text,
    icon: !!icon,
    variant,
    classes,
    loading,
  })}
  on:click
>
  {#if loading}
    <CircleLoader props={{ classes: clsx("size-4 border-4") }} />

    {#if text}
      <span class="text-nowrap text-sm font-medium leading-none">Loading</span>
    {/if}
  {:else}
    {#if icon}
      <div class="flex h-[0.875rem] items-center justify-center">
        <Icon
          props={{
            ...icon,
            classes: twMerge(clsx("size-5 shrink-0", icon.classes)),
          }}
        />
      </div>
    {/if}

    <span class="text-sm font-medium leading-none">{text || ""}</span>
  {/if}
</button>
