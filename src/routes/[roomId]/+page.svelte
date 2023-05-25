<script lang="ts">
	import { enhance } from '$app/forms';
	import Share from '$lib/components/Share.svelte';
	import { NEW_MEMBER, NEW_MESSAGE, clientPusher } from '$lib/constants';
	import type { NewMemberPayload, NewMessagePayload } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const liveData = writable({
		members: data.room.members,
		messages: data.room.messages
	});

	onMount(() => {
		const channel = clientPusher.subscribe(data.room.id);

		channel.bind(NEW_MEMBER, (payload: NewMemberPayload) => {
			liveData.update((prev) => ({
				...prev,
				members: [...prev.members, payload]
			}));
		});

		channel.bind(NEW_MESSAGE, (payload: NewMessagePayload) => {
			liveData.update((prev) => ({
				...prev,
				messages: [...prev.messages, payload]
			}));
		});

		return () => channel.unsubscribe();
	});
</script>

<h1>{data.room.title}</h1>
<Share />
<details>
	<summary> Members </summary>
	<ul>
		{#each $liveData.members as { id, name, hue } (id)}
			<li class:owner={id === data.room.owner.id} style:--hue={hue}>
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
</main>

<style lang="scss">
	.owner::after {
		content: ' (owner)';
	}

	li {
		color: hsl(var(--hue), 100%, 50%);
	}
</style>
