<!-- ExercisesTab.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { elasticOut, backOut } from 'svelte/easing';
	import { getExerciseQuestions } from '$lib/supabase/client';
	import { createEventDispatcher } from 'svelte';

	import CassetteTapeSelector from './CassetteTapeSelector.svelte';
	import TabSelector from './TabSelector.svelte';
	import MultipleChoiceQuestion from './Exercises/MultipleChoiceQuestion.svelte';
	import ShortAnswerQuestion from './Exercises/ShortAnswerQuestion.svelte';
	import DisplayOnlyQuestion from './Exercises/DisplayOnlyQuestion.svelte';
	import TableRowQuestion from './Exercises/TableRowQuestion.svelte';

	const dispatch = createEventDispatcher();

	// Props
	export let exercises = [];
	export let tapes = []; // All tapes associated with this unit

	// State variables
	let currentTape = null;
	let currentExerciseIndex = 0;
	let currentQuestions = [];
	let isLoadingQuestions = false;
	let userAnswers = {}; // Initialize this

	// Auto-select first workbook tape when component mounts
	onMount(() => {
		// Filter for workbook tapes directly here
		const workbookTapes = tapes.filter((tape) => tape.tape_type === 'workbook');

		if (workbookTapes.length > 0) {
			// Find tape with C-2 prefix if it exists
			const c2Tape = workbookTapes.find((tape) => tape.title.includes('C-2'));
			currentTape = c2Tape || workbookTapes[0];
		}

		console.log('Selected initial tape:', currentTape);
	});

	// Fetch questions when current exercise changes
	$: if (currentExercise && currentExercise.id) {
		isLoadingQuestions = true;
		getExerciseQuestions(currentExercise.id)
			.then((questions) => {
				currentQuestions = questions;
				isLoadingQuestions = false;
				console.log('Loaded questions:', questions.length);
			})
			.catch((error) => {
				console.error('Error fetching questions:', error);
				isLoadingQuestions = false;
			});
	} else {
		currentQuestions = [];
	}

	// Filter for workbook tapes only
	$: workbookTapes = tapes.filter((tape) => tape.tape_type === 'workbook');

	// Filter exercises to only show those for the current tape
	$: filteredExercises = currentTape
		? exercises
				.filter((ex) => ex.tape_id === currentTape.id)
				.sort((a, b) => a.order_num - b.order_num)
		: [];

	// Current exercise based on index
	$: currentExercise = filteredExercises[currentExerciseIndex] || null;

	// Emit event when current exercise changes
	$: {
		if (currentExercise) {
			dispatch('exerciseChange', { exerciseId: currentExercise.id });
		}
	}

	// Handle tape change from CassetteTapeSelector
	function handleTapeChange(event) {
		currentTape = event.detail;
		currentExerciseIndex = 0; // Reset to first exercise when tape changes
		console.log('Tape changed to:', currentTape);
	}

	// Navigation functions
	function previousExercise() {
		if (currentExerciseIndex > 0) {
			currentExerciseIndex--;
		}
	}

	function nextExercise() {
		if (currentExerciseIndex < filteredExercises.length - 1) {
			currentExerciseIndex++;
		}
	}

	// Function to update answer (to be implemented with API calls later)
	function updateAnswer(questionId, answer) {
		// For now, just store in local state
		userAnswers = {
			...userAnswers,
			[questionId]: answer
		};

		// TODO: Add API call to save answer to database
		console.log('Answer updated:', questionId, answer);
	}

	// Check if current exercise has a display image
	$: hasDisplayImage = currentExercise?.display_url && currentExercise.display_url.trim() !== '';
</script>

<div class="exercise-container">
	<!-- Cassette Tape Selector Component -->
	<CassetteTapeSelector
		{tapes}
		tapeType="workbook"
		initialTapePrefix="C-2"
		on:tapeChange={handleTapeChange}
	/>

	<!-- Exercise Display Section -->
	<section class="section-container mt-6">
		<div class="mb-4">
			<h3 class="section-header">Workbook Exercises</h3>
		</div>

		<!-- Exercise Navigation and Display -->
		<div class="exercise-display-container">
			{#if filteredExercises.length > 0 && currentExercise}
				<div class="exercise-card">
					<!-- Exercise Navigation -->
					<div class="exercise-navigation">
						<button
							class="nav-button"
							on:click={previousExercise}
							disabled={currentExerciseIndex === 0}
						>
							<svg viewBox="0 0 24 24" class="h-5 w-5">
								<path fill="none" stroke="currentColor" stroke-width="2" d="M15 18l-6-6 6-6" />
							</svg>
							Previous
						</button>

						<div class="exercise-counter">
							{currentExerciseIndex + 1} of {filteredExercises.length}
						</div>

						<button
							class="nav-button"
							on:click={nextExercise}
							disabled={currentExerciseIndex === filteredExercises.length - 1}
						>
							Next
							<svg viewBox="0 0 24 24" class="h-5 w-5">
								<path fill="none" stroke="currentColor" stroke-width="2" d="M9 6l6 6-6 6" />
							</svg>
						</button>
					</div>

					<!-- Exercise Content -->
					<div class="exercise-content">
						<!-- Exercise Title -->
						<h4 class="exercise-title">{currentExercise.title}</h4>

						<!-- Exercise Instructions -->
						<div class="exercise-instructions">
							<p class="whitespace-pre-line">{currentExercise.instructions}</p>
						</div>

						<!-- Display Image (if available) -->
						{#if hasDisplayImage}
							<div class="exercise-display-image">
								<img
									src={currentExercise.display_url}
									alt="Exercise visual aid"
									class="border-warm-gray h-auto max-w-full rounded-lg border"
								/>
							</div>
						{/if}

						<!-- Questions Section -->
						<div class="questions-container mt-4">
							{#if isLoadingQuestions}
								<div class="loading-questions py-4 text-center">
									<p class="text-warm-gray italic">Loading questions...</p>
								</div>
							{:else if currentQuestions && currentQuestions.length > 0}
								{#each currentQuestions.sort((a, b) => a.order_num - b.order_num) as question (question.id)}
									<!-- Your existing question rendering code -->
								{/each}
							{:else}
								<div class="empty-questions py-4 text-center">
									<p class="text-warm-gray italic">No questions available for this exercise.</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<div class="empty-state py-8 text-center">
					<p class="text-warm-gray italic">
						{currentTape
							? 'No exercises available for this tape.'
							: 'Please select a tape to view exercises.'}
					</p>
				</div>
			{/if}
		</div>
	</section>
</div>

<style>
	.exercise-card {
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.exercise-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: var(--color-beige);
		border-bottom: 1px solid var(--color-warm-gray);
	}

	.nav-button {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-charcoal);
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 0.25rem;
		transition: all 0.15s ease;
	}

	.nav-button:hover:not(:disabled) {
		background-color: rgba(221, 185, 103, 0.2);
	}

	.nav-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.exercise-counter {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-charcoal);
	}

	.exercise-content {
		padding: 1.5rem;
	}

	.exercise-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-charcoal);
		margin-bottom: 0.75rem;
	}

	.exercise-instructions {
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-charcoal);
		background-color: rgba(245, 242, 235, 0.7);
		padding: 0.75rem;
		border-radius: 0.25rem;
		border-left: 3px solid var(--color-gold);
		margin-bottom: 1rem;
	}

	/* Add this to your global CSS or component styles */
	.exercise-instructions p {
		white-space: pre-line;
		line-height: 1.6;
	}

	.exercise-display-image {
		margin: 1rem 0;
		text-align: center;
	}

	.questions-container {
		border-top: 1px solid rgba(160, 153, 138, 0.3);
		padding-top: 1rem;
	}

	.empty-state {
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 0.5rem;
		padding: 2rem;
	}
</style>
