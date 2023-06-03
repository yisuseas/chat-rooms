<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Whale from '$lib/components/Whale.svelte';
	import { NEW_MEMBER, NEW_MESSAGE, clientPusher } from '$lib/constants';
	import { room } from '$lib/transition';
	import type { NewMemberPayload, NewMessagePayload } from '$lib/types';
	import type { Channel } from 'pusher-js';
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import type { ActionData, PageData, SubmitFunction } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let feed: HTMLDivElement;

	$: liveData = writable({
		members: data.room.members,
		messages: data.room.messages
	});

	let channel: Channel | null = null;

	afterNavigate(() => {
		channel = clientPusher
			.subscribe(data.room.id)
			.bind(NEW_MEMBER, (payload: NewMemberPayload) => {
				liveData.update((prev) => ({
					...prev,
					members: [...prev.members, payload]
				}));
			})
			.bind(NEW_MESSAGE, (payload: NewMessagePayload) => {
				if (payload.user.id === data.user.id) {
					sending = null;
				}
				liveData.update((prev) => ({
					...prev,
					messages: [...prev.messages, payload]
				}));
			});

		feed.scrollTo({ behavior: 'auto', top: feed.scrollHeight });
	});

	onDestroy(() => {
		channel?.unsubscribe();
	});

	function copyRoomId() {
		navigator.clipboard.writeText(data.room.id).then(() => {
			console.log('copied: ', data.room.id);
		});
	}

	let message = '';

	let sending: NewMessagePayload | null = null;

	const handleSubmit = (() => {
		sending = {
			id: -1,
			createdAt: new Date(),
			roomId: data.room.id,
			content: message,
			userId: data.user.id,
			user: data.user
		};
		message = '';
	}) satisfies SubmitFunction;

	let ctrl = false;
	let submitBtn: HTMLButtonElement;

	function handleKeyDown({ key }: KeyboardEvent) {
		if (key === 'Control') {
			ctrl = true;
		} else if (ctrl && key === 'Enter') {
			submitBtn.click();
		}
	}

	function handleKeyUp({ key }: KeyboardEvent) {
		if (key === 'Control') {
			ctrl = false;
		}
	}

	let showModal = false;
	function openModal() {
		showModal = true;
	}
	function hideModal() {
		showModal = false;
	}
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<div class="window" transition:room>
	<div class="edge top">
		<a class="btn-circle" href="/">
			<Icon name="home" />
		</a>
		<button class="title" on:click={copyRoomId}>
			{data.room.title}
		</button>
		<button class="btn-circle" on:click={openModal}>
			<Icon name="more" />
		</button>
	</div>
	<div class="feed" bind:this={feed}>
		<ul>
			{#each $liveData.messages as msg (msg.id)}
				<Whale {msg} own={msg.user.id === data.user.id} />
			{/each}
			{#if sending}
				<Whale msg={sending} own={true} sending={true} />
			{/if}
		</ul>
	</div>
	<form
		class="edge bottom"
		action="?/send"
		method="post"
		use:enhance={handleSubmit}
	>
		<input
			type="text"
			name="message"
			id="message"
			hidden
			bind:value={message}
		/>
		<div
			class="faux-input"
			class:empty={!message}
			class:missing={form?.missing === 'message'}
			role="textbox"
			spellcheck="true"
			title="Write something..."
			contenteditable="true"
			bind:textContent={message}
		/>
		<button
			class="btn-circle"
			class:loading={sending !== null}
			type="submit"
			disabled={!message}
			bind:this={submitBtn}
		>
			<Icon name="send" />
		</button>
	</form>

	<Modal
		open={showModal}
		members={data.room.members}
		owner={data.room.owner}
		on:click={hideModal}
	/>
</div>

<style lang="scss">
	.window {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		position: relative;
		grid-column: 1;
		grid-row: 1;

		min-height: 100vh;
		max-height: 100vh;
		border-radius: 0;
		@include screen-lg {
			min-height: 0;
			max-height: calc(100vh - 2rem);
			margin: 1rem {
				left: 0rem;
			}
			border-radius: $border-radius;
		}

		background-color: $dark-background;
		@include light-theme {
			background-color: $light-background;
		}
	}

	.edge {
		display: grid;
		grid-template-columns: $box-height 1fr $box-height;
		align-items: end;
		padding: 1rem;
		gap: 1rem;

		background-color: $dark-secondary;
		@include light-theme {
			background-color: $light-secondary;
		}

		$rad: 0.5rem;
		&.top {
			border-radius: 0 0 $rad $rad;
		}
		&.bottom {
			border-radius: $rad $rad 0 0;
		}
	}

	.title {
		font-family: $font-display;
		text-transform: uppercase;
		height: $box-height;
	}

	.feed {
		overflow-y: auto;
		flex-grow: 1;
	}

	ul {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		gap: 1rem;
	}

	// Make the content be 20px(1rem) tall
	$pd: calc(($box-height - 6px - 20px) / 2);

	.faux-input {
		grid-column-end: span 2;
		position: relative;
		user-select: text;
		white-space: pre-wrap;
		word-break: break-word;
		height: fit-content;
		min-height: $box-height;
		padding-top: $pd;
		padding-bottom: $pd;
	}

	.empty::before {
		content: 'Write something...';
		cursor: text;
		font-family: inherit;
		user-select: none;
		opacity: 0.5;
		position: absolute;
		height: 1rem;
		top: $pd;
		left: 1rem;
	}
</style>
