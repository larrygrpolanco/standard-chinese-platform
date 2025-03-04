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

		// Fetch module data
		module = await getModuleById(moduleId);

		// Fetch units in this module
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
	<div class="p-8 text-center">
		<p>Loading module content...</p>
	</div>
{:else if module}
	<div class="module-content">
		<header class="mb-8">
			<h1 class="mb-2 text-3xl font-bold">{module.title}</h1>
			<p class="text-lg text-gray-700">{module.description}</p>
		</header>

		<section>
			<h2 class="mb-4 text-xl font-semibold">Units in this Module</h2>

			{#if units.length > 0}
				<div class="grid gap-4 md:grid-cols-2">
					{#each units as unit}
						<a
							href="/units/{unit.id}"
							class="block rounded border bg-white p-4 transition-colors hover:bg-blue-50"
						>
							<h3 class="text-lg font-medium">{unit.title}</h3>
							<p class="mt-1 text-gray-600">{unit.description || 'No description available'}</p>
						</a>
					{/each}
				</div>
			{:else}
				<p class="text-gray-600">No units found in this module.</p>
			{/if}
		</section>
	</div>
{:else}
	<div class="p-8">
		<h1 class="text-xl text-red-600">Module Not Found</h1>
		<a href="/modules" class="mt-4 inline-block text-blue-600 hover:underline">Back to Modules</a>
	</div>
{/if}
