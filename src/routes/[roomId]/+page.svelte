<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { NEW_MEMBER, NEW_MESSAGE, clientPusher } from '$lib/constants';
	import type { NewMemberPayload, NewMessagePayload } from '$lib/types';
	import type { Channel } from 'pusher-js';
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

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
	});

	onDestroy(() => {
		channel?.unsubscribe();
	});
</script>

<h1>{data.room.title}</h1>
<div>
	<span> Members </span>
	<ul>
		{#each $liveData.members as { id, name, hue } (id)}
			<li class:owner={id === data.room.owner.id} style:--hue={hue}>
				{name}
			</li>
		{/each}
	</ul>
</div>
<hr />
<div>
	<div>
		Messages:
		<ul>
			{#each $liveData.messages as { id, content, user: sender } (id)}
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
</div>
