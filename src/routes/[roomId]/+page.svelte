<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import Whale from '$lib/components/Whale.svelte';
	import { NEW_MEMBER, NEW_MESSAGE, clientPusher } from '$lib/constants';
	import type { NewMemberPayload, NewMessagePayload } from '$lib/types';
	import type { Channel } from 'pusher-js';
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

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
</script>

<div class="window">
	<div class="edge top">
		<a class="btn-circle" href="/">
			<Icon name="home" />
		</a>
		<button class="title" on:click={copyRoomId}>
			{data.room.title}
		</button>
		<button class="btn-circle">
			<Icon name="more" />
		</button>
	</div>
	<div class="feed" bind:this={feed}>
		<ul>
			{#each $liveData.messages as msg (msg.id)}
				<Whale {msg} own={msg.user.id === data.user.id} />
			{/each}
		</ul>
	</div>
	<form class="edge bottom" action="?/send" method="post" use:enhance>
		<input
			type="text"
			name="message"
			id="message"
			autocomplete="off"
			placeholder="Write something..."
			required
		/>
		<button class="btn-circle" type="submit">
			<Icon name="send" />
		</button>
	</form>
</div>

<style lang="scss">
	.window {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;

		min-height: 100vh;
		max-height: 100vh;
		border-radius: 0;
		@include screen-lg {
			min-height: 0;
			max-height: calc(100vh - 2rem);
			border-radius: $border-radius;
		}

		background-color: $dark-background;
		@include light-theme {
			background-color: $light-background;
		}
	}

	.edge {
		display: flex;
		flex-direction: row;
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
		flex-grow: 1;
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

	input {
		flex-grow: 1;
	}
</style>
