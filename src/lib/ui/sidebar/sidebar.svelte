<script lang="ts">
	import {
		Icon,
		SidebarNavigation,
		type SidebarNavigationProps,
	} from "$lib/ui";

	const navs: Array<SidebarNavigationProps> = [
		{
			text: "Produk",
			link: "#",
			icon: "inventory",
			active: true,
		},
		{
			text: "Tambah Barang",
			link: "#",
			icon: "inventory",
			active: false,
		},
		{
			text: "Pembelian",
			link: "#",
			icon: "receipt",
			active: false,
		},
	];
</script>

<aside
	class="shadow-border-r flex w-sidebar shrink-0 flex-col items-start justify-between gap-8 bg-accent-100 p-4"
>
	<header class="flex w-full flex-col items-start gap-1">
		<div class="shadow-border-b flex h-12 w-full items-center px-4 pb-4">
			<span class="text-lg font-extrabold leading-none text-accent-950"
				>Kasih Murah Store</span
			>
		</div>

		<nav class="flex w-full flex-col items-start gap-1">
			{#each navs as nav, i (i)}
				<SidebarNavigation props={{ ...nav }} />
			{/each}
		</nav>
	</header>

	<footer class="flex w-full items-start">
		<button
			type="button"
			class="flex h-8 w-full items-center gap-2 rounded bg-accent-200 px-4 py-2 text-sm font-semibold leading-none text-accent-950"
			><Icon props={{ name: "logout", classes: "size-4" }} />
			Keluar</button
		>
	</footer>
</aside>
