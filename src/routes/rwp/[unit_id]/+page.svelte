<!-- src/routes/rwp/[unit_id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		getUnitBasicInfo,
		getUserPreferences,
		saveUserPreferences,
		getRwpContent
	} from '$lib/supabase/client.js';
	import { generateRwpExercise } from '$lib/rwp/rwpGenerator.js';
	import { exerciseTypes } from '$lib/rwp/exerciseTypes.js';
	import Loader from '$lib/components/UI/Loader.svelte';
	import ModuleQuestions from '$lib/components/ModuleQuestions.svelte';
	import { authStore } from '$lib/stores/authStore';
	import FontToggle from '$lib/components/UI/FontToggle.svelte';
	import Toast from '$lib/components/UI/Toast.svelte';

	// RWP components
	import RwpHeader from '$lib/components/rwp/RwpHeader.svelte';
	import ExerciseGenerator from '$lib/components/rwp/ExerciseGenerator.svelte';
	import ReadingExercise from '$lib/components/rwp/ReadingExercise.svelte';
	import QuestionDisplay from '$lib/components/rwp/QuestionDisplay.svelte';
	import VocabularySection from '$lib/components/rwp/VocabularySection.svelte';

	// State variables
	let loading = true;
	let generating = false;
	let unitData = null;
	let userPreferences = null;
	let rwpContent = null;
	let exerciseType = 'reading_comprehension';
	let specificFocus = '';
	let showAnswers = false;
	let error = null;
	let user;
	let debug = true;

	// Collapsible panel states
	let contextPanelOpen = true;
	let generatorPanelOpen = true;

	// Toast state
	let toastVisible = false;
	let toastMessage = '';

	// Get unit ID from URL parameter
	const unitId = parseInt($page.params.unit_id);

	// Subscribe to auth store
	authStore.subscribe((value) => {
		user = value;
	});

	onMount(async () => {
		loading = true;

		try {
			// Load unit data
			unitData = await getUnitBasicInfo(unitId);

			if (!unitData) {
				error = 'Unit not found';
				return;
			}

			if (user) {
				// Load user preferences
				userPreferences = await getUserPreferences();

				// Initialize empty preferences if needed
				if (!userPreferences) {
					userPreferences = {
						personal_context: {},
						module_responses: {}
					};
				}

				// Load existing RWP content
				const rwpData = await getRwpContent(unitId);
				if (rwpData) {
					rwpContent = rwpData.content;
				}
			}
		} catch (err) {
			console.error('Error loading data:', err);
			error = err.message || 'Failed to load data';
		} finally {
			loading = false;
		}
	});

	// Show toast notification
	function showToast(message) {
		toastMessage = message;
		toastVisible = true;

		// Hide toast after 3 seconds
		setTimeout(() => {
			toastVisible = false;
		}, 3000);
	}

	// Save module responses
	async function saveModuleResponses(event) {
		try {
			const updatedResponses = event.detail;

			// Update preferences in database
			await saveUserPreferences({
				...userPreferences,
				module_responses: updatedResponses
			});

			// Update local state
			userPreferences.module_responses = updatedResponses;

			// Show toast message
			showToast('Your responses have been saved!');
		} catch (err) {
			console.error('Error saving responses:', err);
			showToast('Failed to save your responses');
		}
	}

	// Generate a new exercise
	async function generateExercise() {
		if (!user) {
			window.location.href = `/login?redirect=/rwp/${unitId}`;
			return;
		}

		generating = true;
		showAnswers = false;
		error = null;

		try {
			rwpContent = await generateRwpExercise(unitId, exerciseType, specificFocus, debug);
			showToast('New exercise generated successfully!');
		} catch (err) {
			console.error('Error generating exercise:', err);
			error = err.message || 'Failed to generate exercise';
			showToast('Failed to generate exercise');
		} finally {
			generating = false;
		}
	}

	// Toggle answer visibility
	function toggleAnswers() {
		showAnswers = !showAnswers;
	}

	// Toggle panel visibility
	function togglePanel(panel) {
		if (panel === 'context') {
			contextPanelOpen = !contextPanelOpen;
		} else if (panel === 'generator') {
			generatorPanelOpen = !generatorPanelOpen;
		}
	}

	// Determine which component to use based on exercise type
	$: ExerciseComponent = rwpContent ? exerciseTypes[rwpContent.exercise_type]?.component : null;
</script>

<svelte:head>
	<title>{unitData ? `RWP: ${unitData.title}` : 'Real World Practice'} | Taped Chinese</title>
</svelte:head>

<div class="page-container">
	<div class="content-container">
		{#if loading}
			<Loader />
		{:else if error}
			<div class="error-container">
				<h1 class="error-heading">{error}</h1>
				<p class="error-text">We couldn't load this practice exercise. Please try again later.</p>
				<a href="/units/{unitId}" class="tape-tab">Go back to unit</a>
			</div>
		{:else}
			<!-- Header component -->
			<RwpHeader {unitData} />


			<div class="grid-layout">
				<!-- Left column: Module questions and generator -->
				<div class="left-column">
					{#if user}
						<!-- Context panel - collapsible -->
						<div class="collapsible-panel">
							<button
								class="panel-header"
								on:click={() => togglePanel('context')}
								aria-expanded={contextPanelOpen}
							>
								<h2 class="panel-title">Your Context</h2>
								<svg
									class="panel-icon {contextPanelOpen ? 'rotate-180' : ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</button>

							{#if contextPanelOpen}
								<div class="panel-content">
									<p class="panel-description">
										Tell us about yourself to personalize your practice exercises.
									</p>

									{#if userPreferences}
										<ModuleQuestions
											moduleId={unitData.module.id}
											moduleResponses={userPreferences.module_responses}
											on:save={saveModuleResponses}
										/>
									{/if}
								</div>
							{/if}
						</div>
					{:else}
						<div class="collapsible-panel">
							<div class="panel-header">
								<h2 class="panel-title">Sign In to Personalize</h2>
							</div>
							<div class="panel-content">
								<p class="panel-description">
									Create an account to save your preferences and track your progress.
								</p>
								<a href="/login?redirect=/rwp/{unitId}" class="signin-button">
									Sign In or Create Account
								</a>
							</div>
						</div>
					{/if}

					<!-- Exercise generator component - collapsible -->
					<div class="collapsible-panel">
						<button
							class="panel-header"
							on:click={() => togglePanel('generator')}
							aria-expanded={generatorPanelOpen}
						>
							<h2 class="panel-title">Exercise Generator</h2>
							<svg
								class="panel-icon {generatorPanelOpen ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</button>

						{#if generatorPanelOpen}
							<div class="panel-content">
								<ExerciseGenerator
									{generating}
									bind:exerciseType
									bind:specificFocus
									bind:debug
									hasExistingContent={!!rwpContent}
									on:generate={generateExercise}
								/>
							</div>
						{/if}
					</div>
				</div>

				<!-- Right column: Exercise content -->
				<div class="right-column">
					{#if rwpContent}
						<div class="exercise-container">
							<div class="exercise-header">
								<h2 class="exercise-title">{rwpContent.title || 'Practice Exercise'}</h2>
								<button on:click={toggleAnswers} class="tape-tab {showAnswers ? 'active' : ''}">
									{showAnswers ? 'Hide Answers' : 'Show Answers'}
								</button>
							</div>

							{#if rwpContent.description}
								<p class="exercise-description">{rwpContent.description}</p>
							{/if}

							<!-- Dynamic component based on exercise type -->
							{#if ExerciseComponent}
								<svelte:component
									this={ExerciseComponent}
									content={rwpContent.content}
									questions={rwpContent.questions}
									vocabulary={rwpContent.vocabulary_focus}
									{showAnswers}
								/>
							{:else}
								<div class="error-message">
									Unsupported exercise type: {rwpContent.exercise_type}
								</div>
							{/if}
						</div>
					{:else}
						<div class="empty-state">
							<h2 class="empty-state-title">No Exercise Generated Yet</h2>
							<p class="empty-state-description">
								Use the options on the left to generate a personalized practice exercise based on
								this unit's content and your context.
							</p>
							<button
								on:click={generateExercise}
								disabled={generating}
								class="generate-button-large"
							>
								{generating ? 'Generating...' : 'Generate Your First Exercise'}
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Navigation footer -->
			<div class="navigation-footer">
				<a href={`/units/${unitData.id}`} class="back-link">
					<svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
					Back to Unit {unitData.id}
				</a>
			</div>
		{/if}
	</div>
</div>

<!-- Toast component -->
<Toast message={toastMessage} show={toastVisible} />

<style>
	/* Page layout */
	.page-container {
		display: flex;
		width: 100%;
		justify-content: center;
		background-color: var(--color-cream-paper, #f4f1de);
	}

	.content-container {
		margin-left: auto;
		margin-right: auto;
		max-width: 1200px;
		padding: 1rem;
		width: 100%;
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
		color: var(--color-terracotta, #c17c74);
	}

	.error-text {
		margin-bottom: 1rem;
		color: var(--color-charcoal, #33312e);
	}

	/* Grid layout */
	.grid-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	@media (min-width: 768px) {
		.grid-layout {
			grid-template-columns: 1fr 2fr;
		}
	}

	.left-column,
	.right-column {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Collapsible panel */
	.collapsible-panel {
		background-color: white;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 1rem 1.5rem;
		background-color: var(--color-beige, #e8e5d7);
		border: none;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.panel-header:hover {
		background-color: #dbd8ca;
	}

	.panel-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-charcoal, #33312e);
		margin: 0;
	}

	.panel-icon {
		height: 1.25rem;
		width: 1.25rem;
		transition: transform 0.2s;
	}

	.rotate-180 {
		transform: rotate(180deg);
	}

	.panel-content {
		padding: 1.5rem;
	}

	.panel-description {
		color: var(--color-warm-gray, #6b6a65);
		margin-bottom: 1.25rem;
		font-size: 0.875rem;
	}

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
		text-decoration: none;
		background-color: var(--color-terracotta, #c17c74);
		color: white;
		border: 1px solid var(--color-terracotta-hover, #a06b65);
		width: 100%;
		margin-top: 0.5rem;
	}

	.signin-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(193, 124, 116, 0.3);
		background-color: var(--color-terracotta-hover, #ad6c66);
	}

	/* Exercise container */
	.exercise-container {
		background-color: white;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.exercise-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.exercise-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-charcoal, #33312e);
		font-family: 'Arvo', serif;
	}

	.exercise-description {
		color: var(--color-warm-gray, #6b6a65);
		margin-bottom: 1.5rem;
		font-size: 0.925rem;
	}

	/* Button styling - following style guide */
	.tape-tab {
		display: inline-flex;
		align-items: center;
		padding: 8px 12px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-charcoal, #33312e);
		background-color: var(--color-beige, #e8e5d7);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 16px;
		transition: all 0.2s;
	}

	.tape-tab:hover:not(.active) {
		background-color: rgba(221, 185, 103, 0.2);
	}

	.tape-tab.active {
		background-color: var(--color-gold, #ddb967);
		color: var(--color-charcoal, #33312e);
	}

	/* Empty state */
	.empty-state {
		background-color: white;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 0.5rem;
		padding: 3rem 1.5rem;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.empty-state-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-charcoal, #33312e);
		margin-bottom: 0.75rem;
		font-family: 'Arvo', serif;
	}

	.empty-state-description {
		color: var(--color-warm-gray, #6b6a65);
		margin-bottom: 1.5rem;
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
	}

	.generate-button-large {
		background-color: var(--color-navy, #34667f);
		color: var(--color-cream-paper, #f4f1de);
		border: 1px solid #295267;
		padding: 12px 24px;
		border-radius: 20px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.generate-button-large:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(41, 82, 103, 0.3);
		background-color: #2d586e;
	}

	.generate-button-large:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	/* Navigation footer */
	.navigation-footer {
		margin-top: 2rem;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid var(--color-warm-gray, #a0998a);
		padding-top: 1rem;
	}

	.back-link {
		display: flex;
		align-items: center;
		color: var(--color-navy, #34667f);
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--color-terracotta, #c17c74);
	}

	.back-icon {
		margin-right: 0.5rem;
		height: 1.25rem;
		width: 1.25rem;
	}

	/* Error message */
	.error-message {
		color: var(--color-terracotta, #c17c74);
		padding: 1rem;
		border: 1px solid var(--color-terracotta, #c17c74);
		border-radius: 0.5rem;
		background-color: rgba(193, 124, 116, 0.1);
	}
</style>
