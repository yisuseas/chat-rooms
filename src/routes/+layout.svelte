<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Nuke from '$lib/components/Nuke.svelte';
	import '$lib/styles/global.scss';
</script>

<Navbar />
<slot />
<Nuke />
