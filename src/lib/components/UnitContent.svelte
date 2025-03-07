<!-- src/lib/components/UnitContent.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import { fontPreferences } from '$lib/stores/fontPreferences';
	import AudioPlayer from './AudioPlayer.svelte';
	import ReviewTab from './ReviewTab.svelte';
	import ExerciseDisplay from './ExerciseDisplay.svelte';
	import VocabularyDisplay from './VocabularyDisplay.svelte';

	// Props
	export let vocabulary = [];
	export let reviewTapes = [];
	export let workbookTapes = [];
	export let dialogues = [];
	export let exercises = [];

	// Tab state
	let activeTab = 'review'; // Default tab

	// Track which dialogue's notes are expanded
	let expandedDialogueId = null;

	// Group exercises by type for easier display
	$: comprehensionExercises = exercises.filter((ex) => ex.exercise_type === 'comprehension');
	$: productionExercises = exercises.filter((ex) => ex.exercise_type === 'production');

	// Get the tape associated with an exercise
	function getTapeForExercise(exerciseId) {
		const tape = workbookTapes.find(
			(tape) => exercises.find((ex) => ex.id === exerciseId)?.tape_id === tape.id
		);
		return tape || null;
	}
</script>

<div class="unit-content overflow-hidden rounded-lg border border-[#A0998A] bg-[#E8E5D7]">
	<!-- Tab Navigation -->
	<div class="tab-container">
		<nav class="tabs">
			<button
				class="tab-button {activeTab === 'review' ? 'active' : ''}"
				aria-current={activeTab === 'review' ? 'page' : undefined}
				on:click={() => (activeTab = 'review')}
			>
				<svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
					/>
				</svg>
				Review
			</button>

			<button
				class="tab-button {activeTab === 'exercises' ? 'active' : ''}"
				aria-current={activeTab === 'exercises' ? 'page' : undefined}
				on:click={() => (activeTab = 'exercises')}
			>
				<svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
				Exercises
			</button>

			<button
				class="tab-button {activeTab === 'vocabulary' ? 'active' : ''}"
				aria-current={activeTab === 'vocabulary' ? 'page' : undefined}
				on:click={() => (activeTab = 'vocabulary')}
			>
				<svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
				Vocabulary
			</button>

			<button class="tab-button disabled" disabled>
				<svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					/>
				</svg>
				AI Practice <span class="ml-1 text-xs">(Coming Soon)</span>
			</button>
		</nav>
	</div>

	<!-- Tab Content -->
	<div class="content-area">
		<!-- Review Tab -->
		{#if activeTab === 'review'}
			<div class="content-section">
				<h3 class="section-header">Listening & Speaking Tapes</h3>
				<ReviewTab {dialogues} tapes={reviewTapes} />
			</div>
		{/if}

		<!-- Exercises Tab -->
		{#if activeTab === 'exercises'}
			<div class="content-section">
				<!-- Comprehension Exercises Section -->
				{#if comprehensionExercises.length > 0}
					<section class="section-container">
						<h3 class="section-header">Comprehension Exercises</h3>

						<div class="exercise-container">
							{#each comprehensionExercises as exercise}
								{@const tape = getTapeForExercise(exercise.id)}
								<ExerciseDisplay {exercise} {tape} />
							{/each}
						</div>
					</section>
				{/if}

				<!-- Production Exercises Section -->
				{#if productionExercises.length > 0}
					<section class="section-container">
						<h3 class="section-header">Production Exercises</h3>

						<div class="exercise-container">
							{#each productionExercises as exercise}
								{@const tape = getTapeForExercise(exercise.id)}
								<ExerciseDisplay {exercise} {tape} />
							{/each}
						</div>
					</section>
				{/if}

				{#if comprehensionExercises.length === 0 && productionExercises.length === 0}
					<div class="empty-state">
						<p>No exercises available for this unit yet.</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Vocabulary Tab -->
		{#if activeTab === 'vocabulary'}
			<div class="content-section">
				<h3 class="section-header">Vocabulary List</h3>
				<VocabularyDisplay {vocabulary} />
			</div>
		{/if}
	</div>
</div>

<style>
	.unit-content {
		background-color: var(--color-beige, #e8e5d7);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		overflow: hidden;
		background-image: url('/textures/subtle-paper.png');
		background-repeat: repeat;
	}

	.tab-container {
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
		background-color: var(--color-cream-paper, #f4f1de);
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		margin-bottom: -1px;
	}

	.tab-button {
		display: inline-flex;
		align-items: center;
		padding: 16px 24px;
		font-family: 'Work Sans', sans-serif;
		font-size: 0.95rem;
		font-weight: 600;
		border: 1px solid transparent;
		border-bottom: none;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		margin-right: 4px;
		margin-bottom: -1px;
		position: relative;
		background-color: transparent;
		color: var(--color-charcoal, #33312e);
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.tab-button:hover:not(.active):not(.disabled) {
		background-color: rgba(160, 153, 138, 0.1);
		border-color: var(--color-warm-gray, #a0998a);
		color: var(--color-navy, #34667f);
	}

	.tab-button.active {
		background-color: var(--color-beige, #e8e5d7);
		border-color: var(--color-warm-gray, #a0998a);
		border-bottom-color: var(--color-beige, #e8e5d7);
		color: var(--color-terracotta, #c17c74);
		z-index: 1;
	}

	.tab-button.disabled {
		opacity: 0.6;
		cursor: not-allowed;
		color: var(--color-warm-gray, #a0998a);
	}

	.content-area {
		padding: 24px;
	}

	.content-section {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.section-container {
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
		padding-bottom: 32px;
		margin-bottom: 16px;
	}

	.section-container:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.section-header {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-charcoal, #33312e);
		margin-bottom: 24px;
		position: relative;
		padding-bottom: 8px;
	}

	.section-header::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 60px;
		height: 3px;
		background-color: var(--color-gold, #ddb967);
	}

	.dialogue-container,
	.exercise-container {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.audio-container {
		margin-bottom: 24px;
	}

	.audio-placeholder {
		padding: 16px;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px dashed var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		color: var(--color-warm-gray, #a0998a);
		text-align: center;
		font-style: italic;
	}

	.practice-note {
		padding: 16px;
		background-color: rgba(221, 185, 103, 0.15);
		border: 1px solid rgba(221, 185, 103, 0.3);
		border-radius: 8px;
	}

	.practice-note p {
		color: var(--color-charcoal, #33312e);
		margin: 0;
		font-family: 'Work Sans', sans-serif;
	}

	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--color-warm-gray, #a0998a);
		font-style: italic;
	}

	@media (max-width: 768px) {
		.tab-button {
			padding: 12px 16px;
			font-size: 0.875rem;
		}

		.content-area {
			padding: 16px;
		}
	}
</style>
