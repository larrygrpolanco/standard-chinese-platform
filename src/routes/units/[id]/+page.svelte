<!-- src/routes/units/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getCompleteUnit } from '$lib/supabase/client'; // Changed import
	import UnitContent from '$lib/components/UnitContent.svelte';

	let unit = null; // Initialize unit to null
	let loading = true;

	onMount(async () => {
		const unitId = $page.params.id;
		unit = await getCompleteUnit(unitId); // Use getCompleteUnit
		loading = false;
	});
</script>

<svelte:head>
	<title>{unit?.title || 'Unit'} | FSI Chinese</title>
</svelte:head>

{#if loading}
	<div class="p-10 text-center">
		<p>Loading unit content...</p>
	</div>
{:else if unit}
	<UnitContent {unit} />
{:else}
	<div class="p-10 text-center">
		<h1 class="text-xl text-red-600 mb-2">Unit Not Found</h1>
		<a href="/modules" class="text-blue-600 hover:underline">Back to Modules</a>
	</div>
{/if}