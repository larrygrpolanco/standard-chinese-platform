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

<section class="py-10">
	<h1 class="text-3xl mb-8 text-center">Modules</h1>

	{#if loading}
		<p class="text-center">Loading modules...</p>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each modules as module}
				<a href="/modules/{module.id}" class="block p-5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
					<h2 class="text-xl font-semibold mb-2">{module.title}</h2>
					<p class="text-gray-700">{module.description}</p>
				</a>
			{/each}
		</div>
	{/if}
</section>