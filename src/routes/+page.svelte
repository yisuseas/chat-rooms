<script lang="ts">
	import { enhance } from '$app/forms';
	import UserButton from '$lib/components/UserButton.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let name = data.user?.name ?? '';
	let hue = data.user?.hue ?? 180;

	let roomId = data.target ?? '';
	let roomTitle = '';

	let loading = false;
</script>

<form class="profile" action="?/setProfile" method="post" use:enhance>
	<UserButton {loading} />
	<input
		class:missing={form?.missing === 'name'}
		class:invalid={form?.invalid === 'name'}
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
		<input type="text" name="name" hidden bind:value={name} />
		<input type="number" name="hue" hidden required bind:value={hue} />
		<input
			class:missing={form?.missing === 'room-id'}
			class:invalid={form?.invalid === 'room-id'}
			type="text"
			name="room-id"
			autocomplete="off"
			placeholder="Room Id"
			required
			bind:value={roomId}
		/>
		<button
			class="btn-long"
			class:loading
			type="submit"
			disabled={roomId.length !== 36}
		>
			Join
		</button>
	</form>
	<div class="divider">OR</div>
	<form action="?/create" method="post" use:enhance>
		<input type="text" name="name" hidden bind:value={name} />
		<input type="number" name="hue" hidden required bind:value={hue} />
		<input
			class:missing={form?.missing === 'room-title'}
			class:invalid={form?.invalid === 'room-title'}
			type="text"
			name="room-title"
			autocomplete="off"
			placeholder="Room Title"
			required
			bind:value={roomTitle}
		/>
		<button class="btn-long" class:loading type="submit" disabled={!roomTitle}>
			Create
		</button>
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
