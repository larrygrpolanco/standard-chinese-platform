<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		getUnitBasicInfo,
		getUnitReviewData,
		getUnitExercisesData,
		getUnitVocabularyData
	} from '$lib/supabase/client';
	import UnitContent from '$lib/components/UnitContent.svelte';
	import Loader from '$lib/components/Loader.svelte';

	let unitData = null;
	let loading = true;
	let error = null;
	let activeTab = 'review'; // Default tab

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

	onMount(async () => {
		try {
			const unitId = $page.params.id;
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
	});

	function getAllTapes() {
		// Safe access to ensure we don't try to use properties of undefined
		const reviewTapes = tabData.review?.reviewTapes || [];
		const workbookTapes = tabData.exercises?.workbookTapes || [];
		console.log('getAllTapes called with:', {
			reviewLoaded: !!tabData.review,
			exercisesLoaded: !!tabData.exercises,
			reviewTapesCount: reviewTapes.length,
			workbookTapesCount: workbookTapes.length
		});
		return [...reviewTapes, ...workbookTapes];
	}
</script>

<svelte:head>
	<title>{unitData ? `${unitData.title} | ${unitData.module.title}` : 'Unit'} | FSI Chinese</title>
</svelte:head>

<!-- New outer flex container to center everything -->
<div class="flex w-full justify-center">
	<div class="w-full max-w-6xl px-4 py-8 font-sans sm:px-6 lg:px-8">
		{#if loading}
			<Loader />
		{:else if error}
			<div class="py-20 text-center">
				<h1 class="text-terracotta mb-4 font-serif text-xl">{error}</h1>
				<p class="text-charcoal mb-4">
					The unit you're looking for doesn't exist or has been removed.
				</p>
				<a
					href="/modules"
					class="bg-terracotta text-cream-paper border-terracotta/50 inline-block rounded-lg border px-4 py-2 font-medium transition-all hover:-translate-y-1 active:translate-y-0"
				>
					Browse All Modules
				</a>
			</div>
		{:else}

			<header class="border-warm-gray mb-6 border-b pb-4">
				<div class="mb-2 flex flex-wrap items-center gap-3">
					<h1 class="text-2.5rem text-charcoal font-serif font-bold">{unitData.title}</h1>
					<span
						class="bg-beige border-warm-gray text-charcoal rounded-lg border px-3 py-1 text-sm"
						style="transform: rotate(-1deg);"
					>
						Module {unitData.module.id}
					</span>
				</div>

				{#if unitData.description}
					<p class="text-charcoal mt-2 text-lg">{unitData.description}</p>
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
		{/if}
	</div>
</div>
