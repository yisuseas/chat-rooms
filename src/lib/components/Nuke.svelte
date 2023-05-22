<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form action="/?/nuke" method="post" use:enhance>
	<button type="submit"> Nuke </button>
</form>

<style lang="scss">
	form {
		display: block;
		position: fixed;
		left: 1rem;
		bottom: 1rem;
		z-index: 99999;
	}

	form,
	button {
		margin: 0;
	}
</style>
