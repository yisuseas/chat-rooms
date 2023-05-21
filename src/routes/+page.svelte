<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let roomId = '';
	function handleJoin() {
		goto('/' + roomId);
	}
</script>

<p>
	{#if data.user}
		Signed in as {data.user.name}
	{:else}
		Not signed in
	{/if}
</p>

<form method="post" use:enhance>
	<button formaction="?/create"> Create </button>
</form>
<hr />
<form on:submit|preventDefault={handleJoin}>
	<label for="room-id">
		<span> Room Id: </span>
		<input type="text" name="room-id" id="room-id" bind:value={roomId} />
	</label>
	<button type="submit"> Join </button>
</form>
