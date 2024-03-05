<script
  lang="ts"
  context="module"
>
  export interface LinkProps extends HTMLAnchorAttributes {
    variant?: "filled" | "outline";
    text?: string;
    icon?: IconProps;
  }
</script>

<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import clsx from "clsx";
  import { Icon, type IconProps } from "$lib/ui";

  export let props: LinkProps;

  $: ({
    variant = "filled",
    text,
    icon,
    href,
    class: className,
    ...attr
  } = props);
</script>

<a
  {...attr}
  href={href}
  class={clsx(
    variant === "filled"
      ? [
          text && icon && "gap-2",
          text && !icon && "px-4 py-2",
          "flex items-center justify-center rounded bg-accent-950 text-sm font-semibold leading-none text-accent-50",
          "hover:bg-accent-800",
          "active:bg-accent-900",
          "focus:bg-accent-900",
          "disabled:cursor-not-allowed disabled:bg-accent-300 disabled:text-accent-600",
          "disabled:hover:bg-accent-950",
          "disabled:active:bg-accent-950",
          "disabled:focus:bg-accent-950",
        ]
      : [
          text && icon && "gap-2",
          text && !icon && "px-4 py-2",
          "flex items-center justify-center rounded bg-accent-50 text-sm font-semibold leading-none text-accent-950 shadow-border",
          "hover:bg-accent-200",
          "active:bg-accent-100",
          "focus:bg-accent-100",
          "disabled:cursor-not-allowed disabled:text-accent-400 disabled:shadow-[rgba(179,_179,_179,_0.1)_0px_0px_0px_1px_inset]",
          "disabled:hover:bg-accent-50",
          "disabled:active:bg-accent-50",
          "disabled:focus:bg-accent-50",
        ],
    className,
  )}
  >{#if icon}<Icon
      props={{ ...icon, classes: icon.classes || "size-4 shrink-0" }}
    />{/if}{text || ""}</a
>
