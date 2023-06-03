<script lang="ts">
	import { browser } from '$app/environment';
	import RoomList from '$lib/components/RoomList.svelte';
	import '$lib/styles/global.scss';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	function updatePrimary(newHue: number | undefined) {
		if (newHue && browser) {
			document.body.style.setProperty('--user-hue', newHue.toString());
		}
	}
	$: updatePrimary(data.user?.hue);
</script>

<svelte:head>
	<title>Chat Rooms</title>
	<meta name="description" content="Chat with your friends" />
</svelte:head>

<div class="container">
	<div class="sidebar">
		<RoomList rooms={data.userRooms} />
	</div>
	<main>
		<slot />
	</main>
</div>

<style lang="scss">
	.container {
		display: grid;
		width: 100%;
		gap: 1rem;

		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		@include screen-lg {
			grid-template-columns: 17rem 1fr;
			grid-template-rows: 1fr;
		}
	}

	.sidebar {
		display: none;
		@include screen-lg {
			display: block;
			padding: 1rem {
				right: 0rem;
			}
		}
	}

	main {
		display: grid;
		overflow: hidden;
	}
</style>
