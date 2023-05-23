<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Nuke from '$lib/components/Nuke.svelte';
	import '$lib/styles/global.scss';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Navbar />
<details>
	<summary> Your rooms: </summary>
	<ul>
		{#each data.userRooms as roomId}
			<li>
				<a href="/{roomId}">{roomId}</a>
			</li>
		{/each}
	</ul>
</details>
<slot />
<Nuke />
