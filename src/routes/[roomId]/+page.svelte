<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>
	{data.roomId}
</h1>
<h2>
	Owner: {data.owner.name}
</h2>
<div>
	Members:
	<ul>
		{#each data.members as { id, name } (id)}
			<li>
				{name}
			</li>
		{/each}
	</ul>
</div>
<hr />
<main>
	<div>
		Messages:
		<ul>
			{#each data.messages as { id, content, user: sender } (id)}
				<li>
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