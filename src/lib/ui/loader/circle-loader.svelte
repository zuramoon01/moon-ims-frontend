<script
  lang="ts"
  context="module"
>
  export interface CircleLoaderProps {
    classes?: string | null;
  }
</script>

<script lang="ts">
  import { twMerge } from "tailwind-merge";

  export let props: CircleLoaderProps;

  $: ({ classes } = props);
</script>

<div
  class={twMerge(
    "size-10 animate-spin rounded-full border-[5px] border-accent-100 border-b-accent-950",
    classes,
  )}
></div>
