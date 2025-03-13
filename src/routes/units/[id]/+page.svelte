<!-- +page.svelte file -->
<script>
	import { page } from '$app/stores';
	import { onMount, afterUpdate } from 'svelte';
	import {
		getUnitBasicInfo,
		getUnitReviewData,
		getUnitExercisesData,
		getUnitVocabularyData
	} from '$lib/supabase/client';
	import UnitContent from '$lib/components/UnitContent.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import UnitDropdown from '$lib/components/UnitDropdown.svelte';

	let unitData = null;
	let loading = true;
	let error = null;
	let activeTab = 'review'; // Default tab
	let currentUnitId = '';

	// Tab data holders
	let tabData = {
		review: null,
		exercises: null,
		vocabulary: null
	};

	// Load data for a specific tab
	async function loadTabData(tab) {
		if (!unitData?.id) return; // Only skip if we don't have unit ID

		try {
			switch (tab) {
				case 'review':
					tabData.review = await getUnitReviewData(unitData.id);
					break;
				case 'exercises':
					tabData.exercises = await getUnitExercisesData(unitData.id);
					break;
				case 'vocabulary':
					tabData.vocabulary = await getUnitVocabularyData(unitData.id);
					break;
			}
		} catch (err) {
			console.error(`Error loading ${tab} data:`, err);
		}
	}

	// Handle tab change event from UnitContent
	function handleTabChange(event) {
		activeTab = event.detail.tabId;
		loadTabData(activeTab);
	}

	// Load all unit data
	async function loadUnitData(unitId) {
		loading = true;
		error = null;

		try {
			unitData = await getUnitBasicInfo(unitId);

			if (!unitData) {
				error = 'Unit not found';
			} else {
				// Load initial tab data
				await loadTabData(activeTab);
			}
		} catch (err) {
			console.error('Error loading unit:', err);
			error = 'Failed to load unit data';
		} finally {
			loading = false;
		}
	}

	// Watch for URL changes and reload data when unit ID changes
	$: if ($page.params.id && $page.params.id !== currentUnitId) {
		currentUnitId = $page.params.id;
		loadUnitData(currentUnitId);
	}

	onMount(async () => {
		const unitId = $page.params.id;
		currentUnitId = unitId;
		await loadUnitData(unitId);
	});

	function getAllTapes() {
		// Safe access to ensure we don't try to use properties of undefined
		const reviewTapes = tabData.review?.reviewTapes || [];
		const workbookTapes = tabData.exercises?.workbookTapes || [];
		return [...reviewTapes, ...workbookTapes];
	}
</script>

<svelte:head>
	<title>{unitData ? `${unitData.title} | ${unitData.module.title}` : 'Unit'} | Taped Chinese</title
	>
</svelte:head>

<!-- New outer flex container to center everything -->
<div class="flex w-full justify-center">
	<div class="container mx-auto max-w-4xl px-4 py-4">
		{#if loading}
			<Loader />
		{:else if error}
			<div class="py-16 text-center">
				<h1 class="mb-4 font-['Arvo',serif] text-xl text-[#C17C74]">{error}</h1>
				<p class="mb-4 text-[#33312E]">
					The unit you're looking for doesn't exist or has been removed.
				</p>
				<a
					href="/modules"
					class="inline-block rounded-lg bg-[#C17C74] px-4 py-2 font-medium text-white transition-all hover:bg-[#aa6b64]"
				>
					Browse All Modules
				</a>
			</div>
		{:else}
			<header class="mb-4 border-b border-[#A0998A] pb-2">
				<div class="mb-2 flex items-center gap-3">
					<!-- Module badge that links back to module page -->
					<a
						href={`/modules/${unitData.module.id}`}
						class="flex h-12 w-12 items-center justify-center rounded-full bg-[#C17C74] text-white shadow-sm transition-transform hover:scale-105"
						title="Go to Module {unitData.module.id}"
					>
						<span class="font-['Arvo',serif] text-xl font-bold">{unitData.module.id}</span>
					</a>
					<div class="relative z-[20]">
						<UnitDropdown {currentUnitId} currentUnit={unitData} />
					</div>
				</div>

				<!-- Module title at bottom of header -->
				<p class=" text-base font-medium text-[#A0998A] italic">
					Module:
					<span class="text-[#C17C74]">{unitData.module.title}</span>
				</p>

				{#if unitData.description}
					<p class="mt-2 text-lg text-[#33312E]">{unitData.description}</p>
				{/if}
			</header>

			<UnitContent
				unit={unitData}
				vocabulary={tabData.vocabulary?.vocabulary || []}
				tapes={getAllTapes()}
				dialogues={tabData.review?.dialogues || []}
				exercises={tabData.exercises?.exercises || []}
				{activeTab}
				on:tabChange={handleTabChange}
			/>

			<!-- Navigation footer -->
			<div class="mt-8 flex justify-between border-t border-[#A0998A] pt-4">
				<a
					href={`/modules/${unitData.module.id}`}
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
					Back to Module {unitData.module.id}
				</a>
			</div>
		{/if}
	</div>
</div>
