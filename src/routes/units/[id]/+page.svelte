<!-- +page.svelte file -->
<script>
	import { page } from '$app/stores';
	import { onMount, afterUpdate } from 'svelte';
	import {
		getUnitBasicInfo,
		getUnitReviewData,
		getUnitExercisesData,
		getUnitVocabularyData,
		getUserProgress,
	} from '$lib/supabase/client';
	import UnitContent from '$lib/components/UnitContent.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import UnitDropdown from '$lib/components/UnitDropdown.svelte';
	import UnitProgressButton from '$lib/components/UnitProgressButton.svelte';
	import { authStore } from '$lib/stores/authStore'; // Import auth store

	let unitData = null;
	let loading = true;
	let error = null;
	let activeTab = 'review'; // Default tab
	let currentUnitId = '';
	let userProgress = null; // Add this to track user progress
	let user; // Add this to track authenticated user

	// Subscribe to auth changes
	authStore.subscribe((value) => {
		user = value;
	});

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

				// Load user progress if logged in
				if (user) {
					userProgress = await getUserProgress(unitId);
				}
			}
		} catch (err) {
			console.error('Error loading unit:', err);
			error = 'Failed to load unit data';
		} finally {
			loading = false;
		}
	}

	// Reload progress when authentication state changes
	$: if (user && unitData?.id) {
		getUserProgress(unitData.id)
			.then((progress) => {
				userProgress = progress;
			})
			.catch((err) => {
				console.error('Error loading user progress:', err);
			});
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
				<!-- After unit description -->
				{#if unitData.description}
					<p class="mt-2 text-lg text-[#33312E]">{unitData.description}</p>
				{/if}

				<!-- Progress tracking and RWP practice area -->
				<div class="mt-6 space-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-4 sm:space-y-0">
					{#if user}
						<UnitProgressButton
							unitId={unitData.id}
							initialStatus={userProgress?.status || 'in_progress'}
						/>

						<a
							href="/rwp/{unitData.id}"
							class="inline-flex items-center justify-center rounded-2xl border border-[#295267] bg-[#34667F] px-4 py-2 text-sm font-semibold text-[#F4F1DE] transition-all hover:bg-[#295267] hover:shadow-md"
						>
							<svg
								class="mr-2 h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.25 19.75 8 19.25L3 20L4.5 15.5C3.5 14.5 3 13.25 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Practice with RWP
						</a>
					{:else}
						<a
							href="/login?redirect=/units/{unitData.id}"
							class="inline-flex items-center rounded-2xl border border-[#A0998A] bg-[#E8E5D7] px-4 py-2 text-sm font-medium text-[#33312E] transition-all hover:bg-[#F4F1DE] hover:text-[#C17C74]"
						>
							<svg
								class="mr-2 h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Sign in to track progress
						</a>
					{/if}
				</div>
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
