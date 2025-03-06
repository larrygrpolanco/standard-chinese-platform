<!-- src/routes/modules/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getModuleById, getUnitsByModuleId } from '$lib/supabase/client';

	let module = null;
	let units = [];
	let loading = true;

	onMount(async () => {
		const moduleId = $page.params.id;
		module = await getModuleById(moduleId);
		if (module) {
			units = await getUnitsByModuleId(moduleId);
		}
		loading = false;
	});
</script>

<svelte:head>
	<title>{module?.title || 'Module'} | FSI Chinese</title>
</svelte:head>

{#if loading}
	<div class="p-10 text-center">
		<p>Loading module content...</p>
	</div>
{:else if module}
	<div class="py-10 px-6 max-w-3xl mx-auto">
		<header class="mb-10">
			<h1 class="text-4xl font-semibold mb-4">{module.title}</h1>
			<p class="text-gray-600 text-lg">{module.description}</p>
		</header>

		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-6">Units</h2>
			{#if units.length > 0}
				<div class="grid gap-6 md:grid-cols-2">
					{#each units as unit}
						<a href="/units/{unit.id}" class="block p-4 bg-white hover:bg-gray-50 rounded-md shadow-sm transition-colors">
							<h3 class="text-lg font-semibold mb-1">{unit.title}</h3>
							<p class="text-gray-500 text-sm">{unit.description || 'No description'}</p>
						</a>
					{/each}
				</div>
			{:else}
				<p class="text-gray-500">No units found in this module.</p>
			{/if}
		</section>
		<p class="text-center text-gray-500 text-sm">End of Module Content</p>
	</div>
{:else}
	<div class="p-10 text-center">
		<h1 class="text-xl text-red-600 mb-2">Module Not Found</h1>
		<a href="/modules" class="text-blue-600 hover:underline">Back to Modules</a>
	</div>
{/if}