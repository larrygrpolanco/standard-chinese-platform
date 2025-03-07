<!-- src/lib/components/UnitContent.svelte -->
<script>
	import { slide, fade } from 'svelte/transition';
	import { fontPreferences } from '$lib/stores/fontPreferences';
	import AudioPlayer from './AudioPlayer.svelte';
	import ReviewTab from './ReviewTab.svelte';
	import ExerciseDisplay from './ExerciseDisplay.svelte';
	import VocabularyDisplay from './VocabularyDisplay.svelte';
	import { onMount } from 'svelte';

	// Props
	export let vocabulary = [];
	export let reviewTapes = [];
	export let workbookTapes = [];
	export let dialogues = [];
	export let exercises = [];

	// Tab state
	let activeTab = 'review'; // Default tab
	let showMobileMenu = false;

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

	// Tab data for easier management
	const tabs = [
		{
			id: 'review',
			label: 'Review',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>`
		},
		{
			id: 'exercises',
			label: 'Exercises',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
		},
		{
			id: 'vocabulary',
			label: 'Vocabulary',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
		},
		{
			id: 'ai-practice',
			label: 'AI Practice',
			disabled: true,
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`
		}
	];

	// Function to change tabs and hide mobile menu
	function selectTab(tabId) {
		activeTab = tabId;
		showMobileMenu = false;
	}

	// Get current tab info
	$: currentTab = tabs.find((tab) => tab.id === activeTab);
</script>

<div class="unit-content overflow-hidden rounded-lg border border-[#A0998A] bg-[#E8E5D7]">
	<!-- Tab Navigation - Desktop Version -->
	<div class="tab-container hidden md:block">
		<nav class="vintage-toggle-switch" role="tablist">
			{#each tabs as tab}
				<button
					role="tab"
					id="tab-{tab.id}"
					class="vintage-tab-button {activeTab === tab.id ? 'active' : ''} {tab.disabled
						? 'disabled'
						: ''}"
					aria-selected={activeTab === tab.id}
					aria-controls="panel-{tab.id}"
					on:click={() => !tab.disabled && selectTab(tab.id)}
					disabled={tab.disabled}
				>
					{@html tab.icon}
					<span class="tab-label">{tab.label}</span>
					{#if tab.disabled}<span class="coming-soon">(Coming Soon)</span>{/if}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Tab Navigation - Mobile Version -->
	<div class="mobile-tab-selector block md:hidden">
		<button
			class="vintage-selector-button"
			on:click={() => (showMobileMenu = !showMobileMenu)}
			aria-expanded={showMobileMenu}
			aria-controls="mobileTabs"
		>
			<!-- Current Tab Display -->
			<span class="flex items-center">
				{@html currentTab.icon}
				<span class="ml-2">{currentTab.label}</span>
			</span>

			<!-- Vintage Dropdown Arrow -->
			<svg class="vintage-selector-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1" fill="none" />
				<path
					d="M8 11L12 15L16 11"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		<!-- Mobile Dropdown Menu -->
		{#if showMobileMenu}
			<div id="mobileTabs" class="vintage-selector-menu" transition:slide={{ duration: 300 }}>
				{#each tabs as tab}
					<button
						class="vintage-selector-option {activeTab === tab.id ? 'active' : ''} {tab.disabled
							? 'disabled'
							: ''}"
						on:click={() => !tab.disabled && selectTab(tab.id)}
						disabled={tab.disabled}
					>
						{@html tab.icon}
						<span class="ml-2">{tab.label}</span>
						{#if tab.disabled}<span class="ml-1 text-xs">(Coming Soon)</span>{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Tab Content Panels -->
	<div class="content-area">
		{#each tabs as tab}
			{#if activeTab === tab.id}
				<div
					id="panel-{tab.id}"
					role="tabpanel"
					aria-labelledby="tab-{tab.id}"
					class="content-section"
					transition:fade={{ duration: 200 }}
				>
					{#if tab.id === 'review'}
						<h3 class="section-header">Listening & Speaking Tapes</h3>
						<ReviewTab {dialogues} tapes={reviewTapes} />
					{:else if tab.id === 'exercises'}
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
					{:else if tab.id === 'vocabulary'}
						<h3 class="section-header">Vocabulary List</h3>
						<VocabularyDisplay {vocabulary} />
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.unit-content {
		position: relative;
		background-color: var(--color-beige, #e8e5d7);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		overflow: hidden;
		background-image: url('/textures/subtle-paper.png');
		background-repeat: repeat;
	}

	/* Desktop Tab Toggle Switch Styles */
	.tab-container {
		padding: 8px;
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
		background-color: var(--color-cream-paper, #f4f1de);
	}

	.vintage-toggle-switch {
		display: inline-flex;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 6px;
		padding: 3px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.vintage-tab-button {
		display: flex;
		align-items: center;
		padding: 6px 12px;
		font-family: 'Work Sans', sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-charcoal, #33312e);
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
		z-index: 1;
		white-space: nowrap;
	}

	.vintage-tab-button :global(svg) {
		width: 18px;
		height: 18px;
		margin-right: 6px;
	}

	.vintage-tab-button.active {
		background-color: var(--color-gold, #ddb967);
		color: var(--color-charcoal, #33312e);
		font-weight: 600;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.vintage-tab-button:hover:not(.active):not(.disabled) {
		background-color: rgba(221, 185, 103, 0.2);
	}

	.vintage-tab-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.coming-soon {
		font-size: 0.7rem;
		opacity: 0.7;
		margin-left: 4px;
	}

	/* Mobile Selector Styles */
	.mobile-tab-selector {
		position: relative;
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
	}

	.vintage-selector-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 12px 16px;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		background-color: var(--color-cream-paper, #f4f1de);
		background-image: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(0, 0, 0, 0.05) 100%
		);
		border: none;
		text-align: left;
		color: var(--color-charcoal, #33312e);
		box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
	}

	.vintage-selector-button:focus {
		outline: none;
		box-shadow:
			inset 0 -1px 0 rgba(0, 0, 0, 0.1),
			0 0 0 2px rgba(221, 185, 103, 0.3);
	}

	.vintage-selector-icon {
		width: 24px;
		height: 24px;
		transition: transform 0.3s ease;
		transform: rotate(0deg);
		color: var(--color-warm-gray, #a0998a);
	}

	.vintage-selector-menu {
		position: absolute;
		z-index: 50;
		width: 100%;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-top: none;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.vintage-selector-option {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 12px 16px;
		text-align: left;
		background: transparent;
		border: none;
		border-bottom: 1px solid rgba(160, 153, 138, 0.2);
		color: var(--color-charcoal, #33312e);
		font-family: 'Work Sans', sans-serif;
	}

	.vintage-selector-option:last-child {
		border-bottom: none;
	}

	.vintage-selector-option.active {
		background-color: rgba(221, 185, 103, 0.15);
		font-weight: 600;
	}

	.vintage-selector-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.vintage-selector-option:hover:not(.active):not(.disabled) {
		background-color: rgba(221, 185, 103, 0.05);
	}

	.vintage-selector-option :global(svg) {
		width: 18px;
		height: 18px;
	}

	/* Content Area Styles */
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

	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--color-warm-gray, #a0998a);
		font-style: italic;
	}

	@media (max-width: 768px) {
		.content-area {
			padding: 16px;
		}

		.section-header {
			font-size: 1.25rem;
		}
	}
</style>
