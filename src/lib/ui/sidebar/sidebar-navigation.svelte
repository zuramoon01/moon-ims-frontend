<script
	context="module"
	lang="ts"
>
	export interface SidebarNavigationProps {
		text: string;
		link: string;
		icon: IconProps["name"];
		active: boolean;
	}
</script>

<script lang="ts">
	import clsx from "clsx";
	import { Icon, type IconProps } from "$lib/ui";

	export let props: SidebarNavigationProps;

	$: ({ text, link, icon, active } = props);
</script>

<a
	href={link}
	class={clsx(
		"flex h-8 w-full items-center gap-2 rounded px-4 py-2 text-sm font-semibold leading-none",
		active ? "bg-accent-200 text-accent-950" : "hover:bg-accent-200",
	)}
	><Icon props={{ name: icon, classes: "size-4" }} />
	{text}</a
>
