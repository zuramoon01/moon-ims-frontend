<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import type { CircleLoaderProps } from "$lib/ui";

  export let props: CircleLoaderProps = {};

  $: ({ classes } = props);
</script>

<div
  class={twMerge(
    "size-10 animate-spin rounded-full border-[0.313rem] border-accent-100 border-b-accent-950",
    classes,
  )}
></div>
