<script
  lang="ts"
  context="module"
>
  export interface LinkProps extends BaseButtonProps, HTMLAnchorAttributes {}
</script>

<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";
  import { Icon, generateButtonClasses, type BaseButtonProps } from "$lib/ui";

  export let props: LinkProps;

  $: ({ variant, text, icon, href, class: classes, ...attr } = props);
</script>

<a
  {...attr}
  href={href}
  class={generateButtonClasses({ text, icon, variant, classes })}
>
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

  <span class="text-sm font-semibold leading-none">{text || ""}</span>
</a>
