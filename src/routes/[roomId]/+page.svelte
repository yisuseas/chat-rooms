<script lang="ts">
	import { enhance } from '$app/forms';
	import Share from '$lib/components/Share.svelte';
	import { NEW_MEMBER, NEW_MESSAGE, clientPusher } from '$lib/constants';
	import type { NewMemberPayload, NewMessagePayload } from '$lib/server/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const roomData = writable({ members: data.members, messages: data.messages });

	onMount(() => {
		const channel = clientPusher.subscribe(data.roomId);

		channel.bind(NEW_MEMBER, (payload: NewMemberPayload) => {
			roomData.update((prev) => ({
				...prev,
				members: [...prev.members, payload]
			}));
		});

		channel.bind(NEW_MESSAGE, (payload: NewMessagePayload) => {
			roomData.update((prev) => ({
				...prev,
				messages: [...prev.messages, payload]
			}));
		});

		return () => channel.unsubscribe();
	});
</script>

<Share />
<details>
	<summary> Members </summary>
	<ul>
		{#each $roomData.members as { id, name, hue } (id)}
			<li class:owner={id === data.owner.id} style:--hue={hue}>
				{name}
			</li>
		{/each}
	</ul>
</details>
<hr />
<main>
	<div>
		Messages:
		<ul>
			{#each $roomData.messages as { id, content, user: sender } (id)}
				<li style:--hue={sender.hue}>
					{sender.name}: {content}
				</li>
			{/each}
		</ul>
	</div>
	<form action="?/send" method="post" use:enhance>
		<label for="message">
			<span> Message: </span>
			<input
				type="text"
				name="message"
				id="message"
				autocomplete="off"
				required
			/>
		</label>
		<button type="submit"> Send </button>
	</form>
</main>

<style lang="scss">
	.owner::after {
		content: ' (owner)';
	}

	li {
		color: hsl(var(--hue), 100%, 50%);
	}
</style>
