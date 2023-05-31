<script lang="ts">
	import type { Message, User } from '@prisma/client';

	export let msg: Message & { user: User };
	export let own: boolean;
	export let sending = false;
</script>

<li class:own class:sending style:--user-hue={msg.user.hue}>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
		<path d="M 0 1 L {own ? '0' : '1'} 0 L 1 1 H 0" />
	</svg>
	<div>{msg.content}</div>
</li>

<style lang="scss">
	li {
		display: flex;
		align-items: end;

		--whale-color: #{$primary};
		flex-direction: row;
		&.own {
			--whale-color: #{$dark-text};
			flex-direction: row-reverse;
			@include light-theme {
				--whale-color: #{$light-secondary};
			}
		}

		&.sending {
			animation: $anim-pulse;
		}
	}

	svg {
		fill: var(--whale-color);
		$side: 0.75rem;
		width: $side;
		height: $side;
	}

	div {
		min-height: $box-height;
		max-width: 90%;
		display: flex;
		align-items: center;
		background-color: var(--whale-color);

		$offset: 0.125rem;
		padding: {
			top: calc($border-radius + $offset);
			bottom: calc($border-radius - $offset);
			left: $border-radius;
			right: $border-radius;
		}

		$rad: $border-radius;
		border-radius: $rad $rad $rad 0;
		.own & {
			border-radius: $rad $rad 0 $rad;
		}

		color: $dark-background;
		@include light-theme {
			color: $light-text;
		}
	}
</style>
