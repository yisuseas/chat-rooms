<script lang="ts">
	import { page } from '$app/stores';

	$: fullUrl = $page.url.toString();
	$: roomId = $page.url.pathname.slice(1);

	function copyText(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			console.log('copied: ', text);
		});
	}
</script>

<div class="grid">
	<button on:click={() => copyText(fullUrl)}> Copy link </button>
	<button on:click={() => copyText(roomId)}> Copy room id </button>
</div>
