<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<p>
	{#if data.user}
		Signed in as {data.user.name}
	{:else}
		Not signed in
	{/if}
</p>
