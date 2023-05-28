<script lang="ts">
	import { enhance } from '$app/forms';
	import UserButton from '$lib/components/UserButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let name = data.user?.name ?? '';
	let hue = data.user?.hue ?? 180;

	let roomId = data.target ?? '';
	let roomTitle = '';
</script>

<form class="profile" action="?/setProfile" method="post" use:enhance>
	<UserButton />
	<input
		type="text"
		name="name"
		minlength="3"
		maxlength="25"
		autocomplete="off"
		placeholder="Username"
		required
		bind:value={name}
	/>
	<input
		type="range"
		name="hue"
		min="0"
		max="360"
		step="1"
		bind:value={hue}
		style:--temp-hue={hue}
	/>
</form>
<div class="room-actions">
	<form action="?/join" method="post" use:enhance>
		<input type="text" name="name" hidden required bind:value={name} />
		<input type="number" name="hue" hidden required bind:value={hue} />
		<input
			type="text"
			name="room-id"
			autocomplete="off"
			placeholder="Room Id"
			required
			bind:value={roomId}
		/>
		<button class="btn-long" type="submit"> Join </button>
	</form>
	<div class="divider">OR</div>
	<form action="?/create" method="post" use:enhance>
		<input type="text" name="name" hidden required bind:value={name} />
		<input type="number" name="hue" hidden required bind:value={hue} />
		<input
			type="text"
			name="room-title"
			autocomplete="off"
			placeholder="Room Title"
			required
			bind:value={roomTitle}
		/>
		<button class="btn-long" type="submit"> Create </button>
	</form>
</div>

<style lang="scss">
	.profile {
		@extend %card;
		display: grid;

		grid-template-columns: 1fr;
		grid-template-rows: repeat(3, auto);
		@include screen-lg {
			grid-template-columns: auto 1fr;
			grid-template-rows: repeat(2, auto);
		}

		input {
			text-align: center;

			@include screen-lg {
				&[name='name'] {
					align-self: end;
				}
				&[name='hue'] {
					align-self: start;
				}
			}
		}
	}

	.room-actions {
		@extend %card;
		display: flex;
		flex-direction: column;

		form {
			display: flex;

			flex-direction: column;
			gap: 0.25rem;
			@include screen-lg {
				flex-direction: row;
				gap: 1rem;

				button {
					width: 7.5rem;
				}
			}
		}
		input {
			flex-grow: 1;
		}
	}

	.divider {
		display: flex;
		flex-direction: row;
		align-items: center;
		align-self: stretch;
		gap: 1rem;

		&::before,
		&::after {
			content: '';
			flex-grow: 1;
			height: 0.25rem;
			border-radius: $border-radius;
			background-color: currentColor;
			width: 100%;
		}
	}
</style>
