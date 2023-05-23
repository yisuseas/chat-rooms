<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	let roomId = '';
</script>

<form action="?/join" method="post" use:enhance>
	<!-- User Info -->
	<label for="name">
		<span>Name: </span>
		<input
			type="text"
			name="name"
			id="name"
			value={data.user?.name ?? ''}
			minlength="3"
			maxlength="25"
			autocomplete="off"
			required
		/>
	</label>
	<label for="hue">
		<span>Hue: </span>
		<input
			type="range"
			name="hue"
			id="hue"
			value={data.user?.hue ?? 0}
			min="0"
			max="255"
			step="1"
		/>
	</label>
	<!-- Actions -->
	<label for="room-id">
		<span> Room Id: </span>
		<input
			type="text"
			name="room-id"
			id="room-id"
			autocomplete="off"
			bind:value={roomId}
		/>
	</label>
	<button type="submit" disabled={!roomId}> Join </button>
	<div>Or</div>
	<button formaction="?/create"> Create Room </button>
</form>
