<script lang="ts">
	import { onMount } from "svelte";
	import type { LayoutServerData } from "./$types";
	import { Sidebar } from "$lib/ui";

	import "../app.css";
	import { productsStore } from "$lib/store";

	export let data: LayoutServerData;

	onMount(async () => {
		const products = await data.products;

		productsStore.setProducts(products);
	});
</script>

<Sidebar />

<slot />
