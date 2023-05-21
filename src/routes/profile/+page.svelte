<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form action="?/setInfo" method="post" use:enhance>
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
	<button type="submit">
		{#if data.user}
			Update
		{:else}
			Create
		{/if}
	</button>
	<button formaction="?/delete"> Delete </button>
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
	}
</style>
