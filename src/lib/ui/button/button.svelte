<script
  lang="ts"
  context="module"
>
  export interface ButtonProps extends BaseButtonProps, HTMLButtonAttributes {
    loading?: boolean;
  }
</script>

<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";
  import {
    CircleLoader,
    Icon,
    generateButtonClasses,
    type BaseButtonProps,
  } from "$lib/ui";

  export let props: ButtonProps;

  $: ({ variant, text, icon, loading, class: classes, ...attr } = props);
</script>

<button
  {...attr}
  class={generateButtonClasses({ text, icon, variant, classes, loading })}
  on:click
>
  {#if loading}
    <CircleLoader props={{ classes: clsx("size-4 border-4") }} />

    {#if text}
      <span class="text-nowrap text-sm font-semibold leading-none">Loading</span
      >
    {/if}
  {:else}
    {#if icon}
      <div class="flex h-[14px] items-center justify-center">
        <Icon
          props={{
            ...icon,
            classes: twMerge(clsx("size-5 shrink-0", icon.classes)),
          }}
        />
      </div>
    {/if}

    <span class="text-nowrap text-sm font-semibold leading-none"
      >{text || ""}</span
    >
  {/if}
</button>
