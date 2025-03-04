<!-- src/routes/modules/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getModules } from '$lib/supabase/client';

	let modules = [];
	let loading = true;

	onMount(async () => {
		modules = await getModules();
		loading = false;
	});
</script>

<svelte:head>
	<title>Modules | FSI Chinese</title>
</svelte:head>

<section>
	<h1 class="mb-6 text-3xl font-bold">Chinese Language Modules</h1>

	{#if loading}
		<p>Loading modules...</p>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each modules as module}
				<a href="/modules/{module.id}" class="block rounded border p-4 hover:bg-blue-50">
					<h3 class="text-lg font-medium">{module.title}</h3>
					<p class="mt-2 text-gray-600">{module.description}</p>
				</a>
			{/each}
		</div>
	{/if}
</section>
