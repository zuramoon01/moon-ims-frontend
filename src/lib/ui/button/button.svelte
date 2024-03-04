<script
	lang="ts"
	context="module"
>
	export interface ButtonProps extends HTMLButtonAttributes {
		text: string;
		variant?: "filled" | "outline";
		icon?: IconProps["name"];
	}
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";
	import clsx from "clsx";
	import { Icon, type IconProps } from "$lib/ui";

	export let props: ButtonProps;

	$: ({ text, variant = "filled", icon, class: className, ...attr } = props);
</script>

<button
	type="button"
	{...attr}
	class={clsx(
		"flex items-center justify-center gap-2 rounded bg-accent-950 px-4 py-2 text-sm font-semibold leading-none text-accent-50",
		"hover:bg-accent-800",
		"active:bg-accent-900",
		"focus:bg-accent-900",
		"disabled:cursor-not-allowed disabled:bg-accent-300 disabled:text-accent-600",
		className,
	)}
	>{#if icon}<Icon
			props={{ name: icon, classes: "size-4" }}
		/>{/if}{text}</button
>
