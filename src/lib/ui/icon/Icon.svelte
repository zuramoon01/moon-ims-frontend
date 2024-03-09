<script
  context="module"
  lang="ts"
>
  export interface IconProps {
    name: IconName;
    classes?: string;
  }
</script>

<script lang="ts">
  import clsx from "clsx";
  import { icons, type IconName } from "$lib/ui";

  export let props: IconProps;

  $: ({ name, classes } = props);
  $: ({ viewBox, paths } = icons[name]);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox={viewBox}
  class={clsx(classes || "size-6", "fill-current")}
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
