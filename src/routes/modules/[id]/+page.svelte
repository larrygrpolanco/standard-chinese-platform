<!-- src/routes/modules/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getModuleById, getUnitsByModuleId } from '$lib/supabase/client';
	import UnitCard from '$lib/components/UnitCard.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let module = null;
	let units = [];
	let loading = true;

	// Learning objectives by module ID - customize these later
	const moduleObjectives = {
		'1': [
			'Greet people and introduce yourself in Chinese',
			'Master essential pronunciation patterns',
			'Navigate basic conversations with confidence',
			'Count from 1-10 and ask simple questions'
		],
		'2': [
			'Talk about your nationality and occupation',
			'Ask and answer questions about personal details',
			'Describe your work environment',
			'Use directional vocabulary for locations'
		],
		'3': [
			'Discuss your daily schedule and routines',
			'Tell time and talk about calendar events',
			'Make appointments and arrangements',
			'Express preferences and make simple plans'
		],
		// Add more modules as needed
		default: [
			'Master key vocabulary and phrases for this topic',
			'Practice essential grammar patterns and structures',
			'Engage with authentic dialogues featuring native speakers',
			'Complete practical exercises to reinforce your learning'
		]
	};

	onMount(async () => {
		const moduleId = $page.params.id;
		module = await getModuleById(moduleId);
		if (module) {
			units = await getUnitsByModuleId(moduleId);
		}
		loading = false;
	});

	$: objectives = module ? moduleObjectives[module.id] || moduleObjectives.default : [];
</script>

<svelte:head>
	<title>{module?.title || 'Module'} | Taped Chinese</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-4">
	{#if loading}
		<Loader />
	{:else if module}
		<div in:fade={{ duration: 300 }}>

			<div class="mb-6 flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-[#C17C74] text-white shadow-sm"
				>
					<span class="font-['Arvo',serif] text-xl font-bold">{module.id}</span>
				</div>
				<h1 class="font-['Arvo',serif] text-2xl font-bold text-[#33312E] md:text-3xl">
					{module.title}
				</h1>
			</div>

            <!-- Units section -->
			<section>
				<h2 class="mb-4 font-['Arvo',serif] text-xl font-semibold text-[#33312E]">Choose a Unit</h2>

				{#if units.length > 0}
					<div class="grid grid-cols-1 gap-3">
						{#each units as unit, index}
							<UnitCard {unit} {index} />
						{/each}
					</div>
				{:else}
					<div class="rounded-lg border border-[#A0998A] bg-[#E8E5D7] p-6 text-center">
						<p class="mb-2 text-[#33312E]">No units found in this module.</p>
						<a
							href="/modules"
							class="inline-block font-medium text-[#34667F] hover:text-[#C17C74] hover:underline"
						>
							Return to all modules
						</a>
					</div>
				{/if}
			</section>

			<!-- Compact info section with description and objectives -->
			<div class="mb-8 rounded-lg border border-[#A0998A] bg-[#E8E5D7] p-4 shadow-sm">
				<div class="flex flex-col md:flex-row md:gap-6">
					<!-- Module description -->
					<div class="mb-4 md:mb-0 md:w-1/2">
						<h2 class="mb-2 font-['Arvo',serif] text-lg font-semibold text-[#33312E]">
							About This Module
						</h2>
						<p class="text-sm leading-relaxed text-[#33312E]">{module.description}</p>
					</div>

					<!-- Divider for mobile -->
					<div class="mb-4 h-px w-full bg-[#A0998A] opacity-30 md:hidden"></div>

					<!-- Learning objectives -->
					<div class="md:w-1/2">
						<h2 class="mb-2 font-['Arvo',serif] text-lg font-semibold text-[#33312E]">
							Learning Objectives
						</h2>
						<ul class="space-y-2">
							{#each objectives as objective}
								<li class="flex items-start">
									<svg
										class="mt-1 mr-2 h-4 w-4 flex-shrink-0 text-[#7D8C5C]"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-sm text-[#33312E]">{objective}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

			
		</div>
	{:else}
		<div class="py-16 text-center">
			<h1 class="mb-4 font-['Arvo',serif] text-xl text-[#C17C74]">Module Not Found</h1>
			<p class="mb-4 text-[#33312E]">
				The module you're looking for doesn't exist or has been removed.
			</p>
			<a
				href="/modules"
				class="inline-block rounded-lg bg-[#C17C74] px-4 py-2 font-medium text-white transition-all hover:bg-[#aa6b64]"
			>
				Browse All Modules
			</a>
		</div>
	{/if}
</div>
