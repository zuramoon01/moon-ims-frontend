<script
	context="module"
	lang="ts"
>
	export interface IconProps {
		name: IconName;
		width?: string;
		height?: string;
		fill?: string;
	}
</script>

<script lang="ts">
	import type { IconName } from "$lib/ui";
	import { icons } from "$lib/ui";

	export let props: IconProps;
	$: ({ name, width = "24px", height = "24px", fill = "#ffffff" } = props);
	$: ({ viewBox, paths } = icons[name]);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height={height}
	viewBox={viewBox}
	width={width}
	fill={fill}
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
