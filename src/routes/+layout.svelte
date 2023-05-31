<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
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

<div class="container" class:not-home={$page.url.pathname !== '/'}>
	<main>
		<slot />
	</main>
	<div class="sidebar">
		<h2>
			{#if data.userRooms.length > 0}
				YOUR CHAT ROOMS
			{:else}
				YOU HAVE NO ROOMS
			{/if}
		</h2>
		{#if data.userRooms.length > 0}
			<ul>
				{#each data.userRooms as room}
					{@const roomPath = '/' + room.id}
					<li class:active={$page.url.pathname === roomPath}>
						<a href={roomPath}>
							{room.title}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		width: 100%;

		grid-template-columns: 1fr;
		grid-template-rows: repeat(3, min-content);
		@include screen-lg {
			grid-template-columns: 17rem 1fr;
			grid-template-rows: 1fr;
		}

		gap: 1rem;
		padding: 1rem;
		&.not-home {
			gap: 0;
			padding: 0;
			@include screen-lg {
				gap: 1rem;
				padding: 1rem;
			}
		}
	}

	main {
		width: 100%;

		display: contents;
		grid-column: 1;
		grid-row: 3;
		@include screen-lg {
			display: flex;
			grid-column: 2;
			grid-row: 1;
			flex-direction: column;
			margin: auto;
			gap: 1rem;
		}

		max-width: 26rem;
		.not-home & {
			height: 100%;
			max-width: 100%;
		}
	}

	.sidebar {
		@extend %card;
		display: flex;
		text-align: center;
		flex-direction: column;

		.not-home & {
			display: none;
			@include screen-lg {
				display: flex;
			}
		}
	}

	h2 {
		font-family: $font-display;
		line-height: $box-height;
	}

	ul {
		z-index: 1;
		display: flex;
		flex-direction: column;
	}

	li {
		box-sizing: content-box;
		height: $box-height;
		border-color: $dark-accent;
		position: relative;
		@include light-theme {
			border-color: $light-accent;
		}

		&:not(:last-child) {
			border-bottom-width: 1px;
		}
	}

	.active {
		color: $dark-background;
		@include light-theme {
			color: $light-text;
		}

		&::before {
			content: '';
			display: block;
			z-index: -1;
			width: calc(100% + 2rem);
			height: calc($box-height + 2px);
			position: absolute;
			top: -1px;
			left: -1rem;
			background-color: $primary;
			border-top-width: 1px;
			border-bottom-width: 1px;

			border-color: $dark-text;
			@include light-theme {
				border-color: $light-text;
			}
		}
	}

	a {
		display: inline-flex;
		place-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
