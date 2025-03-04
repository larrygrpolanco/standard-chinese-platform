<!-- src/routes/units/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getUnitById } from '$lib/supabase/client';
	import UnitContent from '$lib/components/UnitContent.svelte';

	let unit = {};
	let loading = true;

	onMount(async () => {
		const unitId = $page.params.id;
		unit = await getUnitById(unitId);
		loading = false;
	});
</script>

<svelte:head>
	<title>{unit?.title || 'Unit'} | FSI Chinese</title>
</svelte:head>

{#if loading}
	<div class="p-8 text-center">
		<p>Loading unit content...</p>
	</div>
{:else if unit}
	<UnitContent {unit} />
{:else}
	<div class="p-8">
		<h1 class="text-xl text-red-600">Unit Not Found</h1>
		<a href="/modules" class="mt-4 inline-block text-blue-600 hover:underline">Back to Modules</a>
	</div>
{/if}
