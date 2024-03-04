<script lang="ts">
	import clsx from "clsx";
	import { Button, Checkbox, Icon } from "$lib/ui";
	import { formatToRupiah } from "$lib/utils";
	import { productsStore } from "$lib/store";

	const tableTitles = [
		{
			text: "Nama Produk",
			classes:
				" min-w-[200px] w-[calc(100%_-_(32px_+_160px_+_240px_+_240px_+_200px_+_200px_+_80px))]",
		},
		{
			text: "Kuantitas",
			classes: "w-[160px] shrink-0",
		},
		{
			text: "Harga Beli Per Satuan",
			classes: "w-[240px] shrink-0",
		},
		{
			text: "Total Harga Beli",
			classes: "w-[200px] shrink-0",
		},
		{
			text: "Harga Jual Per Satuan",
			classes: "w-[240px] shrink-0",
		},
		{
			text: "Total Harga Jual",
			classes: "w-[200px] shrink-0",
		},
	];
</script>

<main class="flex w-[calc(100%_-_theme(spacing.sidebar))] flex-col items-start">
	<section class="flex w-full flex-col items-start px-8">
		<header
			class="flex h-[64px] w-full items-center justify-between px-4 text-accent-950"
		>
			<h1 class="text-xl font-bold leading-none">Produk</h1>

			<Button
				props={{
					text: "Tambah Produk",
					icon: "plus",
				}}
			/>
		</header>

		<div
			class="flex w-full flex-col items-start overflow-auto text-sm leading-none"
		>
			<div
				class="flex h-8 w-full px-4 font-semibold text-accent-950 shadow-horizontal"
			>
				<div
					class="flex w-8 shrink-0 items-center justify-center shadow-vertical"
				>
					<Checkbox />
				</div>

				{#each tableTitles as { text, classes }, i (i)}
					<div
						class={clsx(
							"flex items-center justify-between px-4 shadow-vertical",
							classes,
						)}
					>
						<span>{text}</span>

						<Icon props={{ name: "arrowDropDown", classes: "size-5" }} />
					</div>
				{/each}

				<div class="flex w-20 shrink-0 items-center justify-center px-4">
					<span class="text-center">Aksi</span>
				</div>
			</div>

			{#each $productsStore as { id, name, quantity, buyPriceInRupiah, totalBuyPriceInRupiah, sellPriceInRupiah, totalSellPriceInRupiah }, i (i)}
				<div class="flex min-h-8 w-full px-4 shadow-horizontal">
					<div
						class="flex w-8 shrink-0 items-center justify-center shadow-vertical"
					>
						<Checkbox />
					</div>

					<div
						class="flex w-[calc(100%_-_(32px_+_160px_+_240px_+_240px_+_200px_+_200px_+_80px))] min-w-[200px] items-center px-4 py-1 shadow-vertical"
					>
						<span class="text-sm">{name}</span>
					</div>

					<div
						class="flex w-[160px] shrink-0 items-center px-4 py-1 shadow-vertical"
					>
						<span>{quantity}</span>
					</div>

					<div
						class="flex w-[240px] shrink-0 items-center px-4 py-1 shadow-vertical"
					>
						<span>{buyPriceInRupiah}</span>
					</div>

					<div
						class="flex w-[200px] shrink-0 items-center px-4 py-1 shadow-vertical"
					>
						<span>{totalBuyPriceInRupiah}</span>
					</div>

					<div
						class="flex w-[240px] shrink-0 items-center px-4 py-1 shadow-vertical"
					>
						<span>{sellPriceInRupiah}</span>
					</div>

					<div
						class="flex w-[200px] shrink-0 items-center px-4 py-1 shadow-vertical"
					>
						<span>{totalSellPriceInRupiah}</span>
					</div>

					<div
						class="flex w-[80px] shrink-0 items-center justify-center gap-1 px-4"
					>
						<div class="rounded bg-accent-200 p-1">
							<Icon
								props={{
									name: "edit",
									classes: clsx("size-4 text-yellow-500"),
								}}
							/>
						</div>

						<div class="rounded bg-accent-200 p-1">
							<Icon
								props={{ name: "delete", classes: clsx("size-4 text-red-500") }}
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<footer
			class="flex w-full items-center justify-between bg-accent-100 px-4 py-2 text-sm leading-none"
		>
			<div class="flex items-center gap-2">
				<div
					class="flex items-center justify-center rounded border border-accent-950/10 px-2 py-1"
				>
					<span class="font-medium">15</span>
				</div>

				<span>Produk per halaman</span>

				<span class="font-medium text-accent-950">1 - 15 dari 200 produk</span>
			</div>

			<div class="flex items-center gap-2">
				<div
					class="flex items-center justify-center rounded border border-accent-950/10 px-2 py-1"
				>
					<span class="font-medium">1</span>
				</div>

				<span class="font-medium">dari 14 halaman</span>

				<div
					class="flex size-6 items-center justify-center rounded border border-accent-950/10"
				>
					<Icon props={{ name: "chevronLeft", classes: "size-5" }} />
				</div>

				<div
					class="flex size-6 items-center justify-center rounded border border-accent-950/10"
				>
					<Icon props={{ name: "chevronRight", classes: "size-5" }} />
				</div>
			</div>
		</footer>
	</section>
</main>
