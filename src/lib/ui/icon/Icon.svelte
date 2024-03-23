<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";
  import { icons, type IconProps } from "$lib/ui";

  export let props: IconProps;

  $: ({ name, classes } = props);
  $: ({ viewBox, paths } = icons[name]);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox={viewBox}
  class={twMerge(clsx("size-6 fill-current", classes))}
>
  {#if paths && paths.length > 0}
    {#each paths as { d, fill }, i (i)}
      <path
        d={d}
        fill={fill}
      />
    {/each}
  {/if}
</svg>
