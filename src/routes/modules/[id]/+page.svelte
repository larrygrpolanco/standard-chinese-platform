<!-- src/routes/modules/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getModuleById, getUnitsByModuleId } from '$lib/supabase/client';
	import UnitCard from '$lib/components/UnitCard.svelte';
	import Loader from '$lib/components/Loader.svelte';

	let module = null;
	let units = [];
	let loading = true;

	// Learning objectives by module ID - customize these later
	const moduleObjectives = {
		'1': [
			'Understand Chinese personal name structure and titles (Mr., Mrs., Miss, Comrade).',
			"Ask and answer questions about someone's origin and location.",
			'Translate between English and Chinese expressions from the target list.',
			'Participate in short conversations about identity and origin.'
		],
		'2': [
			'Use polite Chinese to ask about identity, health, age, and other basic information.',
			'Respond to questions using Chinese equivalents for "yes" and "no".',
			'Discuss family, including members, ages, and locations in Chinese.',
			'Ask and answer questions about travel in China and work or study details.'
		],
		'3': [
			'Learn Chinese names for 15 shopping items.',
			'Conduct basic shopping conversations (availability, price, purchase).',
			'Describe items bought (quantity, size, color, price).',
			'Manage currency exchange and ask for specific change.'
		],
		'4': [
			'Translate direction-related sentences between English and Chinese.',
			'Ask for and understand directions in various locations (city, building, address).',
			'Recognize differences between Beijing and Taipei direction expressions.',
			'Give directions using single sentences based on floor plans.'
		],
		'5': [
			'Navigate bus and train systems for transportation.',
			'Utilize taxis effectively for local travel.',
			'Arrange for air travel including booking and airport logistics.',
			'Describe detailed travel experiences and plans.'
		],
		'6': [
			'Understand and translate basic Chinese sentences.',
			'Respond to and initiate introductions in Chinese.',
			'Arrange and manage meetings and social events.',
			'Handle phone calls and invitations politely.'
		],
		'7': [
			'Discuss Chinese family size and members',
			'Apply social visit etiquette in China',
			'Analyze traditional family roles and relationships',
			'Explain the significance of extended families'
		],
		'8': [
			'Plan travel arrangements in Chinese',
			'Discuss transportation options within China',
			'Learn vocabulary for travel-related situations',
			'Practice dialogues for booking and travel activities'
		],
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

<div class="container mx-auto max-w-4xl px-4 py-2">
	{#if loading}
		<Loader />
	{:else if module}
		<div in:fade={{ duration: 300 }}>
			<div class="mb-6 flex items-center gap-3">
				<a
					href="/modules"
					class="flex h-12 w-12 items-center justify-center rounded-full bg-[#C17C74] text-white shadow-sm transition-transform hover:scale-105"
					title="Back to All Modules"
				>
					<span class="font-['Arvo',serif] text-xl font-bold">{module.id}</span>
				</a>
				<h1 class="font-['Arvo',serif] text-2xl font-bold text-[#33312E] md:text-3xl">
					{module.title}
				</h1>
			</div>

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

		<!-- Units section -->
		<section>
			<h2 class="mb-4 font-['Arvo',serif] text-xl font-semibold text-[#33312E]">Choose a Unit</h2>

			{#if units.length > 0}
				<div class="grid grid-cols-1 gap-2 mb-4">
					{#each units as unit, index}
						<UnitCard {unit} {index} />
					{/each}
				</div>
                <!-- Navigation footer -->
			<div class="mt-8 flex justify-between border-t border-[#A0998A] pt-4">
				<a
					href={`/modules`}
					class="flex items-center text-[#34667F] hover:text-[#C17C74]"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
					Back to Modules
				</a>
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
