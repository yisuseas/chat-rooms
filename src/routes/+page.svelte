<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Chat Rooms</h1>
{#if data.user}
	<p>Signed in as {data.user.name}</p>
{/if}
