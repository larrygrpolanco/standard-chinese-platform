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
		<p class="text-[#A0998A]">Loading module content...</p>
	</div>
{:else if module}
	<Breadcrumb moduleName={`Module ${module.id}: ${module.title}`} />

	<div class="container mx-auto max-w-4xl px-4">
		<header class="mb-10">
			<div class="mb-4 flex items-center">
				<div
					class="mr-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#A0998A] bg-[#C17C74] text-white"
				>
					<span class="font-['Arvo',serif] text-lg font-bold">{module.id}</span>
				</div>
				<h1 class="font-['Arvo',serif] text-[2.5rem] font-bold text-[#33312E]">{module.title}</h1>
			</div>

			<p class="text-lg leading-relaxed text-[#33312E]">{module.description}</p>
		</header>

		<!-- Learning objectives styled as vintage paper document -->
		<section class="mb-10 rounded-[8px] border border-[#A0998A] bg-[#E8E5D7] p-6">
			<h2 class="mb-4 font-['Arvo',serif] text-xl font-semibold text-[#33312E]">
				What You'll Learn
			</h2>
			<ul class="space-y-2">
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-[#7D8C5C]"
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
					<span class="text-[#33312E]"
						>Key vocabulary and phrases for {module.title.toLowerCase()}</span
					>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-[#7D8C5C]"
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
					<span class="text-[#33312E]">Essential grammar patterns and structures</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-[#7D8C5C]"
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
					<span class="text-[#33312E]">Authentic dialogues with native speakers</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-[#7D8C5C]"
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
					<span class="text-[#33312E]">Practical exercises to reinforce your learning</span>
				</li>
			</ul>
		</section>

		<!-- Units listing -->
		<section class="mb-12">
			<h2 class="mb-6 font-['Arvo',serif] text-2xl font-semibold text-[#33312E]">Module Units</h2>

			{#if units.length > 0}
				<div class="space-y-4">
					{#each units as unit, index}
						<UnitCard {unit} {index} />
					{/each}
				</div>
			{:else}
				<div class="rounded-[8px] border border-[#A0998A] bg-[#E8E5D7] p-8 text-center">
					<p class="text-[#33312E]">No units found in this module.</p>
					<a
						href="/modules"
						class="mt-2 inline-block font-medium text-[#34667F] hover:text-[#C17C74] hover:underline"
					>
						Return to all modules
					</a>
				</div>
			{/if}
		</section>
	</div>
{:else}
	<div class="py-20 text-center">
		<h1 class="mb-4 font-['Arvo',serif] text-xl text-[#C17C74]">Module Not Found</h1>
		<p class="mb-4 text-[#33312E]">
			The module you're looking for doesn't exist or has been removed.
		</p>
		<a
			href="/modules"
			class="inline-block rounded-[8px] bg-[#C17C74] px-4 py-2 font-medium text-white transition-transform hover:bg-[#aa6b64] active:translate-y-1"
		>
			Browse All Modules
		</a>
	</div>
{/if}