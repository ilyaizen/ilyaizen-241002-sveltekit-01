<script>
	import { SliceZone } from '@prismicio/svelte';

	import { components } from '$lib/slices';

	export let data;
</script>

{#if data?.page}
	<SliceZone slices={data.page.data.slices} {components} />
{:else}
	<p>Page not found</p>
{/if}
