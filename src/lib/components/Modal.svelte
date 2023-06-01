<script lang="ts">
	import type { User } from '@prisma/client';
	import { fade, fly } from 'svelte/transition';

	export let open = false;

	export let members: User[];
	export let owner: User;
</script>

{#if open}
	<button class="back" transition:fade={{ duration: 150 }} on:click />
	<div class="dialog" transition:fly={{ duration: 150, y: 25 }}>
		<h2>MEMBERS</h2>
		<ul>
			{#each members as member}
				<li class:owner={member.id === owner.id} style:--user-hue={member.hue}>
					{member.name}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style lang="scss">
	.back {
		cursor: default;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		backdrop-filter: blur(3px);

		background-color: #101010;
		@include light-theme {
			background-color: #767676;
		}
	}

	.dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		@extend %card;
		display: flex;
		flex-direction: column;
		text-align: center;

		background-color: $dark-background;
		@include light-theme {
			background-color: $light-text;
		}
	}

	h2 {
		font-family: $font-display;
		line-height: $box-height;
		height: $box-height;

		color: $dark-text;
		@include light-theme {
			color: $light-background;
		}
	}

	ul {
		display: flex;
		flex-direction: column;
	}

	li {
		color: $primary;
		line-height: $box-height;
		height: $box-height;
	}

	.owner::after {
		content: ' (owner)';
	}
</style>
