<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";
  import { Icon, generateButtonClasses, type LinkProps } from "$lib/ui";

  export let props: LinkProps;

  $: ({ variant, text, icon, href, class: classes, ...attr } = props);
</script>

<a
  {...attr}
  href={href}
  class={generateButtonClasses({
    text: !!text,
    icon: !!icon,
    variant,
    classes,
  })}
>
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
</a>
