<script lang="ts">
	import { Icon } from "$lib/ui";
	import { createCheckbox, melt } from "@melt-ui/svelte";

	const {
		elements: { root, input },
		helpers: { isChecked, isIndeterminate },
	} = createCheckbox({});
</script>

<button
	use:melt={$root}
	class="flex size-4 items-center justify-center rounded-sm border border-havelock-blue-500"
>
	{#if $isIndeterminate}
		<Icon props={{ name: "remove", fill: "#4893db" }} />
	{:else if $isChecked}
		<Icon props={{ name: "check", fill: "#4893db" }} />
	{/if}

	<input use:melt={$input} />
</button>
