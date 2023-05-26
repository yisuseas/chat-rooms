<script lang="ts">
	export let name: 'home' | 'more' | 'send';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{#if name === 'home'}
		<path
			d="M12.71 2.29a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42A1 1 0 0 0 3 13h1v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7h1a1 1 0 0 0 1-1 1 1 0 0 0-.29-.71zM6 20v-9.59l6-6 6 6V20z"
		/>
	{:else if name === 'more'}
		<path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
	{:else if name === 'send'}
		<path
			d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z"
		/>
	{/if}
</svg>

<style lang="scss">
	svg {
		$side: calc($box-height - 20px);
		width: $side;
		height: $side;
		fill: currentColor;
	}
</style>
