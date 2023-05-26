<button type="submit">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="1 1 22 22"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path
			d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"
		/>
	</svg>
</button>

<style lang="scss">
	$diameter: 136px;
	button {
		width: $diameter;
		height: $diameter;
		overflow: hidden;
		border-width: $border-width;
		border-radius: $diameter;

		background-color: $dark-secondary;
		border-color: $primary;
		@include light-theme {
			background-color: $primary;
			border-color: $light-text;
		}
	}

	svg {
		fill: $primary;
		@include light-theme {
			fill: $light-text;
		}
	}
</style>
