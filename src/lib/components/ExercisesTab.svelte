<!-- ExercisesTab.svelte -->
<script context="module">
	function formatInstructions(text) {
		if (!text) return '';

		// Replace sequences of underscores with responsive blank elements
		text = text.replace(/_{3,}/g, '<span class="answer-blank"></span>');

		let formatted = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
		if (!formatted.startsWith('<p>')) {
			formatted = `<p>${formatted}</p>`;
		}
		formatted = formatted.replace(
			/QUESTIONS/g,
			'<strong class="questions-header">QUESTIONS</strong>'
		);
		formatted = formatted.replace(/\(\s*\)\s/g, '<span class="choice-option">( ) </span>');
		return formatted;
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { getExerciseQuestions } from '$lib/supabase/client';
	import { createEventDispatcher } from 'svelte';
	import CassetteTapeSelector from './CassetteTapeSelector.svelte';
	// Other imports...

	const dispatch = createEventDispatcher();
	export let exercises = [];
	export let tapes = [];

	let currentTape = null;
	let currentExerciseIndex = 0;
	let currentQuestions = [];
	let isLoadingQuestions = false;
	let userAnswers = {};
	let imageLoaded = false;

	// Reset the imageLoaded state when the current exercise changes
	$: if (currentExercise) {
		imageLoaded = false;
	}

	// Component logic remains the same...
	onMount(() => {
		const workbookTapes = tapes.filter((tape) => tape.tape_type === 'workbook');
		if (workbookTapes.length > 0) {
			const c2Tape = workbookTapes.find((tape) => tape.title.includes('C-2'));
			currentTape = c2Tape || workbookTapes[0];
		}
	});

	// Other reactive declarations and functions stay unchanged...
	$: workbookTapes = tapes.filter((tape) => tape.tape_type === 'workbook');
	$: filteredExercises = currentTape
		? exercises
				.filter((ex) => ex.tape_id === currentTape.id)
				.sort((a, b) => a.order_num - b.order_num)
		: [];
	$: currentExercise = filteredExercises[currentExerciseIndex] || null;
	$: hasDisplayImage = currentExercise?.display_url && currentExercise.display_url.trim() !== '';

	function handleTapeChange(event) {
		currentTape = event.detail;
		currentExerciseIndex = 0;
	}

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

		<div class="exercise-display-container">
			{#if filteredExercises.length > 0 && currentExercise}
				<div class="exercise-card">
					<!-- Navigation Header -->
					<div class="exercise-navigation">
						<button
							class="nav-button"
							on:click={previousExercise}
							disabled={currentExerciseIndex === 0}
							aria-label="Previous exercise"
						>
							<svg viewBox="0 0 24 24" class="button-icon">
								<path
									d="M15 18l-6-6 6-6"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span>Previous</span>
						</button>

						<div class="exercise-counter">
							<span class="counter-text"
								>{currentExerciseIndex + 1} of {filteredExercises.length}</span
							>
						</div>

						<button
							class="nav-button"
							on:click={nextExercise}
							disabled={currentExerciseIndex === filteredExercises.length - 1}
							aria-label="Next exercise"
						>
							<span>Next</span>
							<svg viewBox="0 0 24 24" class="button-icon">
								<path
									d="M9 6l6 6-6 6"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</div>

					<!-- Exercise Content -->
					<div
						class="exercise-content"
						in:fly={{ x: 300, duration: 400, delay: 100, easing: elasticOut }}
					>
						<h4 class="exercise-title">{currentExercise.title}</h4>

						<div class="exercise-instructions-container">
							<div class="exercise-instructions">
								{@html formatInstructions(currentExercise.instructions)}
							</div>
						</div>

						{#if hasDisplayImage}
							<div class="exercise-display-image">
								{#if !imageLoaded}
									<div class="image-loader">
										<div class="spinner"></div>
										<span>Developing image...</span>
									</div>
								{/if}
								<img
									src={currentExercise.display_url}
									alt="Exercise visual aid"
									class="exercise-image"
									style="opacity: {imageLoaded ? 1 : 0}"
									on:load={() => (imageLoaded = true)}
								/>
							</div>
						{/if}

						<!-- Questions will be displayed here -->
					</div>
				</div>
			{:else}
				<div class="empty-state">
					<div class="empty-state-icon">?</div>
					<p class="empty-state-text">
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
	.section-header {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		color: var(--color-charcoal);
		margin-bottom: 1rem;
		font-weight: 500;
	}

	/* Vintage card styling */
	.exercise-card {
		position: relative;
		background-color: var(--color-cream-paper);
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
		border: 1px solid var(--color-warm-gray);
		border-radius: 8px;
		box-shadow:
			inset 0 1px 3px rgba(51, 49, 46, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.05),
			0 4px 6px rgba(0, 0, 0, 0.03);
		overflow: hidden;
	}

	/* New styles for the answer blanks */
	.answer-blank {
		display: inline-block;
		width: 100%;
		max-width: 240px;
		height: 1px;
		border-bottom: 1px solid var(--color-charcoal);
		margin: 0 2px 3px;
		vertical-align: middle;
	}

	.exercise-instructions {
		/* Your existing styles */
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	/* Make sure code examples stay within boundaries */
	.exercise-instructions pre,
	.exercise-instructions code {
		white-space: pre-wrap;
		word-break: break-word;
		overflow-wrap: break-word;
		max-width: 100%;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.answer-blank {
			max-width: 180px;
		}
	}

	@media (max-width: 480px) {
		.answer-blank {
			max-width: 120px;
		}

		.exercise-instructions {
			font-size: 0.95rem;
			padding: 0.75rem 1rem;
		}
	}

	/* Navigation bar with vintage styling */
	.exercise-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: var(--color-beige);
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
		border-bottom: 1px solid var(--color-warm-gray);
	}

	/* 3D button effect */
	.nav-button {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-charcoal);
		transform: translateY(0);
		transition: all 0.1s ease;
		z-index: 1;
	}

	.nav-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		box-shadow:
			0 3px 0 0 var(--color-button-shadow, #c4b59d),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
		z-index: -1;
		transition: all 0.1s ease;
	}

	.button-icon {
		width: 16px;
		height: 16px;
		position: relative;
		z-index: 2;
	}

	.nav-button:hover:not(:disabled) {
		background-color: rgba(221, 185, 103, 0.2);
		transform: translateY(-1px);
	}

	.nav-button:hover:not(:disabled)::before {
		box-shadow:
			0 4px 0 0 var(--color-button-shadow),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.nav-button:active:not(:disabled) {
		transform: translateY(3px);
	}

	.nav-button:active:not(:disabled)::before {
		box-shadow:
			0 0 0 0 var(--color-button-shadow),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.nav-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Retro counter styling */
	.exercise-counter {
		background-color: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(160, 152, 138, 0.3);
		border-radius: 12px;
		padding: 0.25rem 0.75rem;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.counter-text {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--color-charcoal);
		letter-spacing: 0.05em;
	}

	.exercise-content {
		padding: 1.5rem;
	}

	.exercise-title {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-charcoal);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px dashed var(--color-warm-gray);
	}

	/* Vintage lined paper effect for instructions */
	.exercise-instructions-container {
		margin-bottom: 1.5rem;
	}

	.exercise-instructions {
		position: relative;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-charcoal);
		background-color: #fcf9f0;
		background-image: linear-gradient(rgba(220, 220, 220, 0.25) 1px, transparent 1px);
		background-size: 100% 1.6rem;
		border-radius: 6px;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid var(--color-warm-gray);
		border-left: 3px solid var(--color-terracotta, #c26e5a);
		padding: 1rem 1.5rem;
		margin: 0 0.5rem;
	}

	.exercise-instructions p {
		margin-bottom: 1rem;
	}

	.exercise-instructions p:last-child {
		margin-bottom: 0;
	}

	.exercise-instructions .questions-header {
		display: block;
		margin: 1.25rem 0 0.75rem;
		font-size: 1.1rem;
		color: var(--color-navy);
		font-weight: 600;
		border-bottom: 2px dotted var(--color-gold);
		padding-bottom: 0.375rem;
	}

	.exercise-instructions .choice-option {
		font-family: 'Courier New', monospace;
		margin-right: 0.25rem;
		letter-spacing: 0.03em;
	}

	/* Vintage photo frame for images */
	.exercise-display-image {
		margin: 1.5rem auto;
		text-align: center;
		max-width: 90%;
	}

	.exercise-image {
		border: 1px solid var(--color-warm-gray);
		border-radius: 4px;
		max-width: 100%;
		height: auto;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 0 0 4px rgba(255, 255, 255, 0.8),
			0 0 0 5px rgba(160, 152, 138, 0.2);
	}

	/* Vintage empty state styling */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		background-color: var(--color-cream-paper);
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
		border: 1px solid var(--color-warm-gray);
		border-radius: 8px;
		text-align: center;
	}

	.empty-state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background-color: var(--color-gold);
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.05));
		color: var(--color-charcoal);
		font-size: 2rem;
		font-weight: bold;
		border-radius: 50%;
		margin-bottom: 1rem;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.empty-state-text {
		font-size: 1rem;
		font-style: italic;
		color: var(--color-warm-gray);
	}

	.exercise-display-image {
		position: relative;
		margin: 1.5rem auto;
		text-align: center;
		max-width: 90%;
		min-height: 100px; /* Ensures space for loader */
	}

	.image-loader {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		background-color: var(--color-cream-paper, #f7f3e3);
		border: 1px solid var(--color-warm-gray, #a09a8a);
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		z-index: 1;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid rgba(194, 110, 90, 0.3);
		border-radius: 50%;
		border-top-color: var(--color-terracotta, #c26e5a);
		animation: spin 1s linear infinite;
	}

	.image-loader span {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--color-charcoal, #33312e);
		font-style: italic;
	}

	.exercise-image {
		transition: opacity 0.3s ease;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
