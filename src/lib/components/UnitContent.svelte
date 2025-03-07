<!-- src/lib/components/UnitContent.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import { fontPreferences } from '$lib/stores/fontPreferences';
	import AudioPlayer from './AudioPlayer.svelte';
	import DialogueDisplay from './DialogueDisplay.svelte';
	import ExerciseDisplay from './ExerciseDisplay.svelte';
	import VocabularyDisplay from './VocabularyDisplay.svelte';

	// Props
	export let unit = {};
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

<div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
	<!-- Tab Navigation -->
	<div class="border-b border-gray-200">
		<nav class="-mb-px flex flex-wrap">
			<button
				class="inline-flex items-center border-b-2 px-6 py-4 text-sm font-medium {activeTab ===
				'review'
					? 'border-[#1A5276] text-[#1A5276]'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
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
				class="inline-flex items-center border-b-2 px-6 py-4 text-sm font-medium {activeTab ===
				'exercises'
					? 'border-[#1A5276] text-[#1A5276]'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
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
				class="inline-flex items-center border-b-2 px-6 py-4 text-sm font-medium {activeTab ===
				'vocabulary'
					? 'border-[#1A5276] text-[#1A5276]'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
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

			<button
				class="inline-flex items-center border-b-2 border-transparent px-6 py-4 text-sm font-medium text-gray-400"
				disabled
			>
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
	<div class="p-6">
		<!-- Review Tab -->
		{#if activeTab === 'review'}
			<div class="space-y-8">
				<!-- Reference Dialogues Section -->
				{#if dialogues && dialogues.length > 0}
					<section class="border-b border-gray-200 pb-8">
						<h3 class="mb-4 text-lg font-semibold text-gray-900">Reference Dialogues</h3>
						<!-- Debug info - you can remove this after confirming dialogues are loaded -->
						<p class="mb-4 text-sm text-gray-500">Found {dialogues.length} dialogues</p>

						<div class="space-y-6">
							{#each dialogues as dialogue}
								<DialogueDisplay {dialogue} expanded={expandedDialogueId === dialogue.id} />
							{/each}
						</div>
					</section>
				{:else}
					<!-- Debug info to check if dialogues array exists -->
					<p class="mb-4 text-sm text-red-500">
						No dialogues found. Debug: {JSON.stringify(dialogues)}
					</p>
				{/if}

				<!-- C-1 Tape Section -->
				{#each reviewTapes.filter((tape) => tape.title.includes('C-1')) as tape}
					<section class="border-b border-gray-200 pb-8">
						<h3 class="mb-4 text-lg font-semibold text-gray-900">
							{tape.title} - Listening Practice
						</h3>

						{#if tape.audio_file}
							<div class="mb-6">
								<AudioPlayer audioSrc={tape.audio_file} title="Listening Practice Tape" />
							</div>
						{:else}
							<div class="mb-6 rounded bg-gray-100 p-4 text-gray-500">Audio file not available</div>
						{/if}

						<!-- Removed the dialogues section from here -->
					</section>
				{/each}

				<!-- P-1 Tape Section (keep as is) -->
				<!-- Rest of your code... -->
			</div>
		{/if}

		<!-- Exercises Tab -->
		{#if activeTab === 'exercises'}
			<div class="space-y-8">
				<!-- Comprehension Exercises Section -->
				{#if comprehensionExercises.length > 0}
					<section class="mb-8 border-b border-gray-200 pb-8">
						<h3 class="mb-6 text-xl font-semibold text-gray-900">Comprehension Exercises</h3>

						<div class="space-y-6">
							{#each comprehensionExercises as exercise}
								{@const tape = getTapeForExercise(exercise.id)}
								<ExerciseDisplay {exercise} {tape} />
							{/each}
						</div>
					</section>
				{/if}

				<!-- Production Exercises Section -->
				{#if productionExercises.length > 0}
					<section>
						<h3 class="mb-6 text-xl font-semibold text-gray-900">Production Exercises</h3>

						<div class="space-y-6">
							{#each productionExercises as exercise}
								{@const tape = getTapeForExercise(exercise.id)}
								<ExerciseDisplay {exercise} {tape} />
							{/each}
						</div>
					</section>
				{/if}

				{#if comprehensionExercises.length === 0 && productionExercises.length === 0}
					<div class="p-8 text-center">
						<p class="text-gray-500">No exercises available for this unit yet.</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Vocabulary Tab -->
		{#if activeTab === 'vocabulary'}
			<div>
				<h3 class="mb-6 text-xl font-semibold text-gray-900">Vocabulary List</h3>
				<VocabularyDisplay {vocabulary} />
			</div>
		{/if}
	</div>
</div>
