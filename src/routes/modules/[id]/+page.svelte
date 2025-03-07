<!-- src/routes/modules/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getModuleById, getUnitsByModuleId } from '$lib/supabase/client';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import UnitCard from '$lib/components/UnitCard.svelte';

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
	<div class="py-20 text-center">
		<p>Loading module content...</p>
	</div>
{:else if module}
	<Breadcrumb moduleName={`Module ${module.id}: ${module.title}`} />

	<div class="mx-auto max-w-4xl">
		<header class="mb-10">
			<div class="mb-4 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A5276] text-white"
				>
					<span class="text-lg font-bold">{module.id}</span>
				</div>
				<h1 class="text-3xl font-bold text-gray-900">{module.title}</h1>
			</div>

			<p class="text-lg leading-relaxed text-gray-600">{module.description}</p>
		</header>

		<!-- Learning objectives (example - could be populated from database in future) -->
		<section class="mb-10 rounded-lg border border-blue-100 bg-blue-50 p-6">
			<h2 class="mb-4 text-xl font-semibold text-[#1A5276]">What You'll Learn</h2>
			<ul class="space-y-2">
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<span>Key vocabulary and phrases for {module.title.toLowerCase()}</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<span>Essential grammar patterns and structures</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<span>Authentic dialogues with native speakers</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<span>Practical exercises to reinforce your learning</span>
				</li>
			</ul>
		</section>

		<!-- Units listing -->
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-semibold text-gray-900">Module Units</h2>

			{#if units.length > 0}
				<div class="space-y-4">
					{#each units as unit, index}
						<UnitCard {unit} {index} />
					{/each}
				</div>
			{:else}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
					<p class="text-gray-500">No units found in this module.</p>
					<a href="/modules" class="mt-2 inline-block font-medium text-[#1A5276] hover:underline">
						Return to all modules
					</a>
				</div>
			{/if}
		</section>
	</div>
{:else}
	<div class="py-20 text-center">
		<h1 class="mb-4 text-xl text-red-600">Module Not Found</h1>
		<p class="mb-4 text-gray-600">
			The module you're looking for doesn't exist or has been removed.
		</p>
		<a
			href="/modules"
			class="inline-block rounded bg-[#1A5276] px-4 py-2 font-medium text-white transition-colors hover:bg-[#154360]"
		>
			Browse All Modules
		</a>
	</div>
{/if}
