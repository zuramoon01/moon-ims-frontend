<script lang="ts">
	import { Icon, type IconName } from "$lib/ui";
	import { clsx } from "clsx";
	import "../app.css";

	const navs: Array<{
		name: string;
		link: string;
		icon: IconName;
		active: boolean;
	}> = [
		{
			name: "Produk",
			link: "#",
			icon: "inventory",
			active: true,
		},
		{
			name: "Tambah Barang",
			link: "#",
			icon: "inventory",
			active: false,
		},
		{
			name: "Pembelian",
			link: "#",
			icon: "receipt",
			active: false,
		},
	];
</script>

<div
	class="grid h-full min-h-[100vh] w-full grid-cols-[theme(spacing.sidebar)_minmax(0px,_1fr)] grid-rows-1 items-start"
>
	<aside
		class="z-10 flex h-full w-full flex-col items-start justify-between border-r border-havelock-blue-100 pb-8"
	>
		<header class="flex w-full flex-col items-start gap-4">
			<div
				class="flex w-full items-center border-b border-havelock-blue-100 px-8 py-4"
			>
				<span class="text-lg font-extrabold leading-none"
					>Kasih Murah Store</span
				>
			</div>

			<nav class="flex w-full flex-col items-start gap-1 px-4">
				{#each navs as { name, link, icon, active }, i (i)}
					<a
						href={link}
						class={clsx(
							"flex w-full items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-semibold leading-none",
							active ? "bg-havelock-blue-500 text-white" : "text-black",
						)}
						><Icon
							props={{
								name: icon,
								width: "20px",
								height: "20px",
								fill: active ? "#ffffff" : "#000000",
							}}
						/>
						{name}</a
					>
				{/each}
			</nav>
		</header>

		<footer class="flex w-full flex-col items-start gap-4 px-4">
			<nav class="flex w-full flex-col items-start gap-4">
				<button
					type="button"
					class="flex w-full items-center justify-start gap-2 rounded-md bg-havelock-blue-500 px-4 py-2 text-sm font-bold leading-none text-white"
					><Icon props={{ name: "logout", width: "20px", height: "20px" }} /> Keluar</button
				>
			</nav>
		</footer>
	</aside>

	<slot />
</div>
