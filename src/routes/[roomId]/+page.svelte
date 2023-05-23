<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>
	{data.roomId}
</h1>
<details>
	<summary> Members </summary>
	<ul>
		{#each data.members as { id, name, hue } (id)}
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
			{#each data.messages as { id, content, user: sender } (id)}
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
