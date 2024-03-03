<script lang="ts">
	import { Checkbox } from "$lib/ui";
	import { Icon } from "$lib/ui";
	import { formatToRupiah } from "$lib/utils";

	const tableTitles = [
		"Nama Produk",
		"Kuantitas",
		"Harga Beli Per Satuan",
		"Harga Jual Per Satuan",
		"Total Harga Beli",
		"Total Harga Jual",
	];

	const products = [
		{
			name: "Paku 4 Inch",
			quantity: 20,
			buyPrice: 10000,
			sellPrice: 12000,
		},
		{
			name: "Paku 8 Inch",
			quantity: 20,
			buyPrice: 10000,
			sellPrice: 12000,
		},
		{
			name: "Paku 10 Inch",
			quantity: 20,
			buyPrice: 10000,
			sellPrice: 12000,
		},
		{
			name: "Paku 12 Inch",
			quantity: 20,
			buyPrice: 10000,
			sellPrice: 12000,
		},
	];
</script>

<main class="flex h-full w-full flex-col items-start">
	<section
		class="flex h-full w-full flex-col items-start rounded-md border border-havelock-blue-50 bg-white px-8 py-8"
	>
		<div class="flex w-full items-center pb-4">
			<h1 class="text-[1.25rem] font-bold leading-none">Produk</h1>
		</div>

		<div class="flex h-full w-full flex-col items-start overflow-auto">
			<div
				class="grid w-full grid-cols-[32px_minmax(200px,_1fr)_200px_240px_240px_200px_200px_120px] border-b-2 border-havelock-blue-100"
			>
				<div class="flex w-full items-center justify-center">
					<Checkbox />
				</div>

				{#each tableTitles as title, i (i)}
					<div class="flex w-full items-center justify-between px-4 py-2">
						<span class="w-full text-base font-semibold leading-none"
							>{title}</span
						>

						<Icon props={{ name: "arrowDropDown" }} />
					</div>
				{/each}

				<div class="flex w-full items-center justify-between px-4 py-2">
					<span class="w-full text-center text-base font-semibold leading-none"
						>Aksi</span
					>
				</div>
			</div>

			{#each products as { name, quantity, buyPrice, sellPrice }, i (i)}
				<div
					class="grid w-full grid-cols-[32px_minmax(200px,_1fr)_200px_240px_240px_200px_200px_120px] border-b border-havelock-blue-100"
				>
					<div class="flex w-full items-center justify-center">
						<Checkbox />
					</div>

					<div class="flex w-full items-center justify-between px-4 py-2">
						<span class="w-full text-base leading-none">{name}</span>
					</div>

					<div class="flex w-full items-center justify-between px-4 py-2">
						<span class="w-full text-base leading-none">{quantity}</span>
					</div>

					<div class="flex w-full items-center justify-between px-4 py-2">
						<span class="w-full text-base leading-none"
							>{formatToRupiah(buyPrice)}</span
						>
					</div>

					<div class="flex w-full items-center justify-between px-4 py-2">
						<span class="w-full text-base leading-none"
							>{formatToRupiah(sellPrice)}</span
						>
					</div>

					<div class="flex w-full items-center justify-between px-4 py-2">
						<span class="w-full text-base leading-none"
							>{formatToRupiah(quantity * buyPrice)}</span
						>
					</div>

					<div class="flex w-full items-center justify-between px-4 py-2">
						<span class="w-full text-base leading-none"
							>{formatToRupiah(quantity * sellPrice)}</span
						>
					</div>

					<div class="flex w-full items-center justify-center gap-2 px-4 py-2">
						<div class="rounded-md bg-yellow-500 p-1">
							<Icon props={{ name: "edit", width: "20px", height: "20px" }} />
						</div>

						<div class="rounded-md bg-red-500 p-1">
							<Icon props={{ name: "delete", width: "20px", height: "20px" }} />
						</div>
					</div>
				</div>
			{/each}

			<div
				class="flex w-full items-center justify-between bg-havelock-blue-50 px-4 py-2 text-sm leading-none"
			>
				<div class="flex items-center gap-8">
					<div class="flex items-center gap-2">
						<span
							class="rounded-md border border-havelock-blue-100 bg-white p-2 font-medium"
							>15</span
						>

						<span class="text-black/50">Produk per halaman</span>
					</div>

					<span class="font-medium">1 - 15 dari 200 produk</span>
				</div>

				<div class="flex items-center gap-2">
					<span
						class="rounded-md border border-havelock-blue-100 bg-white p-2 font-medium"
						>1</span
					>

					<span class="font-medium">dari 14 halaman</span>

					<div class="flex items-center gap-1">
						<div class="rounded-md bg-white p-1">
							<Icon props={{ name: "chevronLeft", fill: "#000000" }} />
						</div>

						<div class="rounded-md bg-white p-1">
							<Icon props={{ name: "chevronRight", fill: "#000000" }} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
