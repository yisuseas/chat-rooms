<script lang="ts">
	import { page } from '$app/stores';
	import type { Room } from '@prisma/client';

	export let rooms: Room[];
</script>

<div>
	<h2>
		{#if rooms.length > 0}
			YOUR CHAT ROOMS
		{:else}
			YOU HAVE NO ROOMS
		{/if}
	</h2>
	{#if rooms.length > 0}
		<ul>
			{#each rooms as room}
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

<style lang="scss">
	div {
		@extend %card;
		display: flex;
		text-align: center;
		flex-direction: column;
		height: 100%;
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
		pointer-events: none;

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
