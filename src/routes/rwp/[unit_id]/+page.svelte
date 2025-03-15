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
			const toast = document.getElementById('toast');
			toast.textContent = 'Your responses have been saved!';
			toast.classList.add('show');

			setTimeout(() => {
				toast.classList.remove('show');
			}, 3000);
		} catch (err) {
			console.error('Error saving responses:', err);
			alert('Failed to save your responses. Please try again.');
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
		} catch (err) {
			console.error('Error generating exercise:', err);
			error = err.message || 'Failed to generate exercise';
		} finally {
			generating = false;
		}
	}

	// Toggle answer visibility
	function toggleAnswers() {
		showAnswers = !showAnswers;
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
				<a href="/modules" class="error-button">Browse All Modules</a>
			</div>
		{:else}
			<!-- Header component -->
			<RwpHeader {unitData} />

			<div class="font-controls">
				<FontToggle />
			</div>

			<div class="grid-layout">
				<!-- Left column: Module questions and generator -->
				<div class="left-column">
					{#if user}
						<div class="panel">
							<h2 class="panel-title">Your Context</h2>
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
					{:else}
						<div class="panel">
							<h2 class="panel-title">Sign In to Personalize</h2>
							<p class="panel-description">
								Create an account to save your preferences and track your progress.
							</p>
							<a href="/login?redirect=/rwp/{unitId}" class="signin-button">
								Sign In or Create Account
							</a>
						</div>
					{/if}

					<!-- Exercise generator component -->
					<ExerciseGenerator
						{generating}
						bind:exerciseType
						bind:specificFocus
						bind:debug
						hasExistingContent={!!rwpContent}
						on:generate={generateExercise}
					/>
				</div>

				<!-- Right column: Exercise content -->
				<div class="right-column">
					{#if rwpContent}
						<div class="exercise-container">
							<div class="exercise-header">
								<h2 class="exercise-title">{rwpContent.title || 'Practice Exercise'}</h2>
								<button on:click={toggleAnswers} class="toggle-answers-button">
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

<!-- Toast notification -->
<div id="toast" class="toast">Your responses have been saved!</div>

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
		max-width: 1240px;
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

	/* Panel for sign-in */
	.panel {
		background-color: white;
		border: 1px solid #e8e5d7;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.panel-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		margin-bottom: 0.5rem;
	}

	.panel-description {
		color: #6b6a65;
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
		background-color: #c17c74;
		color: white;
		border: 1px solid #a06b65;
		width: 100%;
		margin-top: 0.5rem;
	}

	.signin-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(193, 124, 116, 0.3);
		background-color: #b06c65;
	}

	/* Exercise container */
	.exercise-container {
		background-color: white;
		border: 1px solid #e8e5d7;
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
		color: #33312e;
	}

	.exercise-description {
		color: #6b6a65;
		margin-bottom: 1.5rem;
		font-size: 0.925rem;
	}

	.toggle-answers-button {
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		color: #33312e;
		padding: 4px 12px;
		font-size: 0.75rem;
		border-radius: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.toggle-answers-button:hover {
		background-color: #f4f1de;
	}

	/* Questions container */
	.questions-container {
		margin-bottom: 2rem;
	}

	.questions-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		margin-bottom: 0.75rem;
		padding-bottom: 0.375rem;
		border-bottom: 1px solid #e8e5d7;
	}

	/* Empty state */
	.empty-state {
		background-color: white;
		border: 1px solid #e8e5d7;
		border-radius: 0.5rem;
		padding: 3rem 1.5rem;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.empty-state-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		margin-bottom: 0.75rem;
	}

	.empty-state-description {
		color: #6b6a65;
		margin-bottom: 1.5rem;
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
	}

	.generate-button-large {
		background-color: #34667f;
		color: #f4f1de;
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

	/* Toast notification */
	.toast {
		visibility: hidden;
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #333;
		color: white;
		text-align: center;
		border-radius: 8px;
		padding: 16px;
		z-index: 1000;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.toast.show {
		visibility: visible;
		animation:
			fadein 0.5s,
			fadeout 0.5s 2.5s;
	}

	@keyframes fadein {
		from {
			bottom: 0;
			opacity: 0;
		}
		to {
			bottom: 20px;
			opacity: 1;
		}
	}

	@keyframes fadeout {
		from {
			bottom: 20px;
			opacity: 1;
		}
		to {
			bottom: 0;
			opacity: 0;
		}
	}
</style>
