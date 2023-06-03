<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import RoomList from '$lib/components/RoomList.svelte';
	import UserButton from '$lib/components/UserButton.svelte';
	import type { ActionData, PageData, SubmitFunction } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let name = data.user?.name ?? '';
	let hue = data.user?.hue ?? 180;

	let roomId = data.target ?? '';
	let roomTitle = '';

	let loading = false;

	const handleSubmit = (() => {
		loading = true;

		return async ({ result }) => {
			await applyAction(result);
			loading = false;
		};
	}) satisfies SubmitFunction;
</script>

<div class="column">
	<form
		class="profile"
		action="?/setProfile"
		method="post"
		use:enhance={handleSubmit}
	>
		<UserButton {loading} disabled={name.length < 3 || name.length > 25} />
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
		<form action="?/join" method="post" use:enhance={handleSubmit}>
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
		<form action="?/create" method="post" use:enhance={handleSubmit}>
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
			<button
				class="btn-long"
				class:loading
				type="submit"
				disabled={!roomTitle}
			>
				Create
			</button>
		</form>
	</div>
	<div class="rooms">
		<RoomList rooms={data.userRooms} />
	</div>
</div>

<style lang="scss">
	.column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		height: 100%;
		margin-left: auto;
		margin-right: auto;

		max-width: 100%;
		@include screen-lg {
			max-width: 35rem;
		}
	}

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

	.rooms {
		flex-grow: 1;

		display: block;
		@include screen-lg {
			display: none;
		}
	}
</style>
