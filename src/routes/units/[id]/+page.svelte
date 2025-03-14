<script>
	import { page } from '$app/stores';
	import { onMount, afterUpdate } from 'svelte';
	import {
		getUnitBasicInfo,
		getUnitReviewData,
		getUnitExercisesData,
		getUnitVocabularyData,
		getUserProgress
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
<div class="page-container">
	<div class="content-container">
		{#if loading}
			<Loader />
		{:else if error}
			<div class="error-container">
				<h1 class="error-heading">{error}</h1>
				<p class="error-text">The unit you're looking for doesn't exist or has been removed.</p>
				<a href="/modules" class="error-button"> Browse All Modules </a>
			</div>
		{:else}
			<header class="unit-header">
				<div class="module-nav">
					<!-- Module badge that links back to module page -->
					<a
						href={`/modules/${unitData.module.id}`}
						class="module-badge"
						title="Go to Module {unitData.module.id}"
					>
						<span class="module-badge-text">{unitData.module.id}</span>
					</a>
					<div class="dropdown-wrapper">
						<UnitDropdown {currentUnitId} currentUnit={unitData} />
					</div>
				</div>

				<!-- Module title at bottom of header -->
				<p class="module-title">
					Module:
					<span class="module-title-highlight">{unitData.module.title}</span>
				</p>

				{#if unitData.description}
					<p class="unit-description">{unitData.description}</p>
				{/if}

				<!-- Progress tracking and RWP practice area -->
				<div class="action-buttons">
					{#if user}
						<UnitProgressButton
							unitId={unitData.id}
							initialStatus={userProgress?.status || 'in_progress'}
						/>

						<a href="/rwp/{unitData.id}" class="rwp-button"> Real World Practice </a>
					{:else}
						<a href="/login?redirect=/units/{unitData.id}" class="signin-button">
							Sign-in to Unlock Progress Tracking & RWPs
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
			<div class="navigation-footer">
				<a href={`/modules/${unitData.module.id}`} class="back-link">
					<svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

<style>
	/* Page layout */
	.page-container {
		display: flex;
		width: 100%;
		justify-content: center;
	}

	.content-container {
		margin-left: auto;
		margin-right: auto;
		max-width: 1240px; /* You can adjust this value as needed */
		padding: 1rem;
		width: 100%; /* Ensures it takes full available width up to max-width */
	}

	/* Error display */
	.error-container {
		padding: 4rem 0;
		text-align: center;
	}

	.error-heading {
		margin-bottom: 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		color: #c17c74;
	}

	.error-text {
		margin-bottom: 1rem;
		color: #33312e;
	}

	.error-button {
		display: inline-block;
		border-radius: 0.5rem;
		background-color: #c17c74;
		padding: 0.5rem 1rem;
		font-weight: 500;
		color: white;
		transition: all 0.2s;
	}

	.error-button:hover {
		background-color: #aa6b64;
	}

	/* Unit header */
	.unit-header {
		margin-bottom: 1rem;
		border-bottom: 1px solid #a0998a;
		padding-bottom: 0.5rem;
	}

	.module-nav {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.module-badge {
		display: flex;
		height: 3rem;
		width: 3rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: #c17c74;
		color: white;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		transition: transform 0.2s;
	}

	.module-badge:hover {
		transform: scale(1.05);
	}

	.module-badge-text {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.dropdown-wrapper {
		position: relative;
		z-index: 20;
	}

	.module-title {
		font-size: 1rem;
		font-weight: 500;
		color: #a0998a;
		font-style: italic;
	}

	.module-title-highlight {
		color: #c17c74;
	}

	.unit-description {
		margin-top: 0.5rem;
		font-size: 1.125rem;
		color: #33312e;
	}

	.action-buttons {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.action-buttons {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			gap: 1rem;
			/* space-y: 0; */
			margin-top: 0;
		}
	}

	/* Navigation footer */
	.navigation-footer {
		margin-top: 2rem;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid #a0998a;
		padding-top: 1rem;
	}

	.back-link {
		display: flex;
		align-items: center;
		color: #34667f;
	}

	.back-link:hover {
		color: #c17c74;
	}

	.back-icon {
		margin-right: 0.5rem;
		height: 1.25rem;
		width: 1.25rem;
	}

	/* Button styles */
	.rwp-button,
	.signin-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border-radius: 16px;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 140px;
		text-decoration: none;
	}

	.rwp-button {
		background-color: #34667f;
		color: #f4f1de;
		border: 1px solid #295267;
	}

	.rwp-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(41, 82, 103, 0.3);
		background-color: #7d8c5c;
	}

	.signin-button {
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
	}

	.signin-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(160, 153, 138, 0.2);
		background-color: #f4f1de;
		color: #c17c74;
	}

	.rwp-button:active,
	.signin-button:active {
		transform: translateY(1px);
		box-shadow: none;
	}
</style>
