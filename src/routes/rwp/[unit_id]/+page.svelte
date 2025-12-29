<!-- src/routes/rwp/[unit_id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import {
		getUnitBasicInfo,
		getUserPreferences,
		saveUserPreferences,
		getRwpContent,
		getUnitVocabularyData
	} from '$lib/supabase/client.js';
	import { generateRwpExercise } from '$lib/rwp/rwpGenerator.js';

	import { STRIPE_CONFIG } from '$lib/stripe/config';

	import Loader from '$lib/components/UI/Loader.svelte';
	import Toast from '$lib/components/UI/Toast.svelte';
	import ModuleQuestions from '$lib/components/ModuleQuestions.svelte';
	import ComprehensionExercise from '$lib/components/rwp/ComprehensionExercise.svelte';
	import TapeConstruction from '$lib/components/UI/TapeConstruction.svelte';

	import UnitDropdown from '$lib/components/UI/UnitDropdown.svelte';

	// State variables
	let loading = true;
	let generating = false;
	let unitData = null;
	let userPreferences = {
		personal_context: {},
		module_responses: {}
	};
	let rwpContent = null;
	let specificFocus = '';
	let showAnswers = false;
	let error = null;
	let unitVocabulary = [];
	let generationPhase = 'init';
	let debug = false;

	// Collapsible panel state - only for context panel
	let contextPanelOpen = true; // Open by default for first-time users
	let generatorPanelOpen = true; // Open by default

	// Toast state
	let toastVisible = false;
	let toastMessage = '';

	// Get unit ID from URL parameter
	const unitId = parseInt($page.params.unit_id);

	function handleRwpUnitChange(event) {
		// You can implement custom behavior when a user changes units from the dropdown
		const newUnitId = event.detail.unitId;
		if (newUnitId && newUnitId !== unitId) {
			window.location.href = `/rwp/${newUnitId}`;
		}
	}

	function goToProfile() {
		window.location.href = '/profile#subscription';
	}

	onMount(async () => {
		loading = true;

		try {
			// Load unit data
			unitData = await getUnitBasicInfo(unitId);

			if (!unitData) {
				error = 'Unit not found';
				return;
			}

			const vocabData = await getUnitVocabularyData(unitId);
			unitVocabulary = vocabData.vocabulary || [];
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
		setTimeout(() => {
			toastVisible = false;
		}, 3000);
	}

	// Save module responses
	function saveModuleResponses(event) {
		const updatedResponses = event.detail;
		// Update local state
		userPreferences.module_responses = updatedResponses;
		showToast('Your responses have been saved locally!');
	}

	// Generate a new exercise
	async function generateExercise() {
		generating = true;
		generationPhase = 'init'; // Reset to initial phase
		showAnswers = false;
		error = null;

		try {
			// Pass the progress callback to track generation phases
            // Pass userPreferences to the generator
			rwpContent = await generateRwpExercise(unitId, specificFocus, userPreferences, debug, (phase) => {
				generationPhase = phase;
			});
			showToast('Practice exercise generated successfully!');
		} catch (err) {
			console.error('Error generating exercise:', err);
			error = err.message || 'Failed to generate exercise';
			showToast('Failed to generate exercise');
		} finally {
			generating = false;
		}
	}

	// Toggle context panel
	function toggleContextPanel() {
		contextPanelOpen = !contextPanelOpen;
	}

	function toggleGeneratorPanel() {
		generatorPanelOpen = !generatorPanelOpen;
	}
</script>

<svelte:head>
	<title>{unitData ? `RWP: ${unitData.title}` : 'Practice'} | Taped Chinese</title>
</svelte:head>

<div class="page-wrapper">
	{#if loading}
		<div class="centered-loader">
			<Loader />
		</div>
	{:else if error}
		<div class="vintage-error">
			<div class="error-icon">!</div>
			<h1 class="error-title">{error}</h1>
			<p class="error-message">We couldn't load this practice exercise. Please try again later.</p>
			<a href="/units/{unitId}" class="vintage-button">
				<span class="button-text">Return to Unit {unitId}</span>
			</a>
		</div>
	{:else}
		<div class="page-container">
			<!-- Page Header -->
			<header class="unit-header">
				<div class="module-nav">
					<!-- Modified badge that links back to RWP page -->
					<a href="/rwp" class="module-badge" title="Go to RWP page">
						<span class="module-badge-text">RWP</span>
					</a>
					<div class="dropdown-wrapper">
						{#if unitData && unitData.module && unitData.module.id}
							<UnitDropdown currentUnitId={unitId.toString()} currentUnit={unitData} />
						{/if}
					</div>
				</div>

				<!-- Module title at bottom of header -->
				<p class="module-title">
					Module {unitData.module.id}:
					<span class="module-title-highlight">{unitData.module.title}</span>
				</p>

				{#if unitData.description}
					<p class="unit-description">{unitData.description}</p>
				{/if}

				<!-- Action buttons area -->
				<div class="action-buttons">
					<a href={`/units/${unitId}`} class="back-to-unit-button">
						<svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							></path>
						</svg>
						Back to Unit {unitId}
					</a>
				</div>
			</header>

			<!-- Content Layout -->
			<div class="content-area">
				<div class="practice-layout">
					<!-- Sidebar -->
					<div class="sidebar">
							<!-- Context Panel -->
							<div class="vintage-panel">
								<button class="panel-toggle" on:click={toggleContextPanel}>
									<div class="toggle-header">
										<h3 class="panel-title">Step 1: Your Learning Context</h3>
										<p class="panel-subtitle">
											Tell us about yourself to personalize your practice
										</p>
									</div>
									<div class="fader-icon {contextPanelOpen ? 'open' : ''}"></div>
								</button>

								{#if contextPanelOpen}
									<div class="panel-content" transition:slide={{ duration: 300 }}>
										<ModuleQuestions
											moduleId={unitData.module.id}
											moduleResponses={userPreferences.module_responses}
											on:save={saveModuleResponses}
										/>
									</div>
								{/if}
							</div>

							<!-- Generator Panel -->
							<div class="vintage-panel">
								<button class="panel-toggle" on:click={toggleGeneratorPanel}>
									<div class="toggle-header">
										<h3 class="panel-title">Step 2: Generate Practice</h3>
										<p class="panel-subtitle">Create a personalized exercise for this unit</p>
									</div>
									<div class="fader-icon {generatorPanelOpen ? 'open' : ''}"></div>
								</button>

								{#if generatorPanelOpen}
									<div class="panel-content" transition:slide={{ duration: 300 }}>
										<!-- Specific Focus Input -->
										<div class="form-group">
											<label for="specific-focus" class="form-label">
												And... <span class="optional-text">(optional)</span>
											</label>
											<input
												id="specific-focus"
												type="text"
												bind:value={specificFocus}
												placeholder="Add anything you want to practice or include"
												class="vintage-input"
											/>
											<!-- <p class="input-hint">Specific grammar, vocabulary, situations, etc.</p> -->
										</div>

										<button
											class={`generate-button ${generating ? 'generating' : ''}`}
											on:click={generateExercise}
											disabled={generating}
										>
											<div class="button-content">
												{#if generating}
													<div class="tape-spinner"></div>
													<span>Creating your practice...</span>
												{:else if rwpContent}
													<svg class="button-icon" viewBox="0 0 24 24">
														<path
															d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
															stroke="currentColor"
															stroke-width="2"
														/>
													</svg>
													<span>Regenerate Practice</span>
												{:else}
													<svg class="button-icon" viewBox="0 0 24 24">
														<path d="M19 12H5M12 19V5" stroke="currentColor" stroke-width="2" />
													</svg>
													<span>Create Practice</span>
												{/if}
											</div>
										</button>

									</div>
								{/if}
							</div>
					</div>

					<!-- Main Content Area -->
					<div class="main-content">
						{#if generating}
							<!-- Show the interactive tape loader during generation -->
							<div class="loading-container">
								<TapeConstruction
									message="Creating Your Practice"
									submessage="This will take 2-3 minutes"
									currentPhase={generationPhase}
									isGenerating={true}
									vocabulary={unitVocabulary}
								/>
							</div>
						{:else if rwpContent}
							<!-- Exercise Display -->
							<div class="exercise-wrapper">
								<div class="exercise-controls">
									<h3 class="exercise-title">{'Story Practice'}</h3>
								</div>

								<!-- Exercise Component -->
								<div class="exercise-container">
									<ComprehensionExercise content={rwpContent} vocabulary={unitVocabulary} />
								</div>
							</div>
						{:else}
							<!-- Empty State -->
							<div class="empty-state">
								<div class="empty-state-icon">
									<svg
										class="cassette-icon"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="3"
											y="6"
											width="18"
											height="12"
											rx="1"
											stroke="currentColor"
											stroke-width="2"
										/>
										<circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="2" />
										<circle cx="16" cy="12" r="2" stroke="currentColor" stroke-width="2" />
										<line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2" />
									</svg>
								</div>
								<h3 class="empty-state-title">Ready to Practice?</h3>
								<p class="empty-state-text">
									Generate a personalized exercise based on what you've learned in this unit. It
									will be tailored to your interests and learning goals.
								</p>
								<button
									class="generate-button large {generating
										? 'generating'
										: ''}"
									on:click={generateExercise}
									disabled={generating}
								>
									<div class="button-content">
										{#if generating}
											<div class="tape-spinner"></div>
											<span>Creating your practice...</span>
										{:else}
											<svg class="button-icon" viewBox="0 0 24 24">
												<path d="M19 12H5M12 19V5" stroke="currentColor" stroke-width="2" />
											</svg>
											<span>Create Practice Exercise</span>
										{/if}
									</div>
								</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Toast component -->
<Toast message={toastMessage} visible={toastVisible} />

<style>
	/* ===== BASE LAYOUT ===== */
	.page-wrapper {
		width: 100%;
		min-height: 100vh;
		background-color: #f4f1de;
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
	}

	.loading-container {
		background-color: var(--color-beige);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
		overflow: hidden;
		padding: 0rem 1rem;
		overflow: hidden;
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.page-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.centered-loader {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 50vh;
	}

	/* Unit header styling */
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
		min-width: 3rem;
		padding: 0 0.75rem;
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
		white-space: nowrap;
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
			margin-top: 1rem;
		}
	}

	.back-to-unit-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border-radius: 16px;
		background-color: #34667f;
		color: #f4f1de;
		border: 1px solid #295267;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 140px;
		text-decoration: none;
	}

	.back-to-unit-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(41, 82, 103, 0.3);
		background-color: #295267;
	}

	.back-to-unit-button:active {
		transform: translateY(1px);
		box-shadow: none;
	}

	.button-icon {
		height: 1rem;
		width: 1rem;
		margin-right: 0.375rem;
	}

	.rwp-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border-radius: 16px;
		background-color: #7d8c5c;
		color: #f4f1de;
		border: 1px solid #6a7a4b;
		font-weight: 600;
		font-size: 0.875rem;
	}

	/* ===== CONTENT AREA ===== */
	.content-area {
		margin-top: 1rem;
	}

	/* Main grid layout */
	.practice-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 1024px) {
		.practice-layout {
			grid-template-columns: 320px 1fr;
		}
	}

	/* ===== SIDEBAR STYLES ===== */
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* Vintage panel styling */
	.vintage-panel {
		background-color: var(--color-beige, #e8e5d7);
		background-image: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.4) 0%,
			rgba(255, 255, 255, 0) 100%
		);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.panel-toggle {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.875rem 1.25rem;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s;
	}

	.panel-toggle:hover {
		background-color: rgba(160, 152, 138, 0.1);
	}

	.toggle-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.panel-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-charcoal, #33312e);
		margin: 0;
	}

	.panel-subtitle {
		font-size: 0.875rem;
		color: var(--color-warm-gray, #a0998a);
		margin: 0;
	}

	.fader-icon {
		position: relative;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	/* Vertical track - vintage slider groove */
	.fader-icon::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		width: 2px;
		height: 100%;
		background-color: #837b6d; /* Darker than handle for contrast */
		transform: translateX(-50%);
		border-radius: 1px;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.15); /* Subtle inset shadow */
	}

	/* Horizontal handle - vintage slider knob */
	.fader-icon::after {
		content: '';
		position: absolute;
		width: 8px; /* Slightly wider for better visibility */
		height: 3px;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-warm-gray, #a0998a);
		transition: top 0.25s ease;
		border-radius: 1.5px;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2); /* Subtle drop shadow */
		background-image: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.1) 0%,
			transparent 60%
		); /* Hint of highlight */
	}

	/* Position when closed (up) */
	.fader-icon::after {
		top: 20%;
	}

	/* Position when open (down) */
	.fader-icon.open::after {
		top: 80%;
	}

	.panel-content {
		padding: 1rem 1.25rem 1rem;
	}

	/* Form elements styling */
	.form-group {
		margin-bottom: 1rem;
	}

	.form-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--color-charcoal, #33312e);
	}

	.optional-text {
		font-weight: normal;
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.8rem;
	}

	.vintage-input {
		width: 100%;
		padding: 0.625rem 0.875rem;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 4px;
		background-color: var(--color-cream-paper, #f4f1de);
		font-size: 0.9rem;
	}

	.vintage-input:focus {
		outline: none;
		border-color: var(--color-navy, #34667f);
		box-shadow: 0 0 0 2px rgba(52, 102, 127, 0.2);
	}

	.input-hint {
		margin-top: 0.375rem;
		justify-self: center;
		font-size: 0.8rem;
		color: var(--color-warm-gray, #a0998a);
	}

	/* Generate button styling */
	.generate-button {
		position: relative;
		display: inline-flex;
		justify-content: center;
		padding: 0.75rem 1.25rem;
		background-color: var(--color-navy, #34667f);
		color: white;
		border: none;
		border-radius: 24px;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid #295267;
		width: 100%;
		overflow: hidden;
	}

	.generate-button.large {
		padding: 1rem 1.5rem;
		font-size: 1rem;
	}

	.generate-button:not(:disabled):hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		background-color: #2d5870;
	}

	.generate-button:not(:disabled):active {
		transform: translateY(1px);
		box-shadow: none;
	}

	.generate-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.button-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.button-icon {
		width: 18px;
		height: 18px;
	}

	.generate-button.disabled {
		opacity: 0.6;
	}

	/* If the button is .large and .disabled, add slightly different styling */
	.generate-button.large.disabled {
		background-color: #f3f3f3;
		border: 1px solid #d97706;
		color: #d97706;
	}

	.limit-message {
		margin-top: 12px;
		padding: 8px 12px;
		background: #fff8e6;
		border: 1px solid #ffd78a;
		border-radius: 4px;
		font-size: 14px;
		line-height: 1.5;
		color: #78350f;
	}

	/* Tape spinner animation */
	.tape-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: white;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Sign-up prompt styling */
	.signup-prompt {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
	}

	.tape-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 60px;
		background-color: var(--color-gold, #ddb967);
		border-radius: 50%;
		margin-bottom: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.cassette-icon {
		width: 32px;
		height: 32px;
		color: var(--color-charcoal, #33312e);
		stroke-width: 1.5;
	}

	.prompt-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.125rem;
		color: var(--color-charcoal, #33312e);
		margin-top: 0;
		margin-bottom: 0.75rem;
	}

	.prompt-text {
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.875rem;
		margin-bottom: 1.25rem;
		line-height: 1.5;
	}

	/* ===== MAIN CONTENT STYLES ===== */
	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Exercise wrapper */
	.exercise-wrapper {
		background-color: white;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
		overflow: hidden;
	}

	.exercise-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background-color: var(--color-beige, #e8e5d7);
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
	}

	.exercise-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.25rem;
		color: var(--color-charcoal, #33312e);
		margin: 0;
	}

	.exercise-container {
		padding: 0;
		background-color: var(--color-cream-paper, #f4f1de);
	}

	/* Empty state styling */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		background-color: white;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		padding: 3rem 2rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
	}

	.empty-state-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80px;
		height: 80px;
		background-color: var(--color-beige, #e8e5d7);
		border-radius: 50%;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.cassette-large {
		width: 48px;
		height: 48px;
		color: var(--color-warm-gray, #a0998a);
	}

	.empty-state-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.5rem;
		color: var(--color-charcoal, #33312e);
		margin-top: 0;
		margin-bottom: 0.75rem;
	}

	.empty-state-text {
		color: var(--color-warm-gray, #a0998a);
		font-size: 1rem;
		line-height: 1.6;
		max-width: 500px;
		margin-bottom: 1.5rem;
	}

	/* ===== ERROR STYLING ===== */
	.vintage-error {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 4rem 2rem;
		background-color: white;
		border: 1px solid var(--color-terracotta, #c17c74);
		border-radius: 8px;
		max-width: 600px;
		margin: 4rem auto;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
	}

	.error-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 60px;
		background-color: var(--color-terracotta, #c17c74);
		color: white;
		font-size: 2rem;
		font-weight: bold;
		border-radius: 50%;
		margin-bottom: 1.5rem;
	}

	.error-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.5rem;
		color: var(--color-terracotta, #c17c74);
		margin-top: 0;
		margin-bottom: 0.75rem;
	}

	.error-message {
		color: var(--color-charcoal, #33312e);
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	/* ===== UTILITY STYLES ===== */
	.vintage-button {
		position: relative;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-cream-paper, #f4f1de);
		color: var(--color-charcoal, #33312e);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 24px;
		padding: 0.75rem 1.25rem;
		font-weight: 600;
		font-size: 0.875rem;
		text-decoration: none;
		transition: all 0.2s;
		transform: translateY(0);
	}

	.vintage-button.large {
		padding: 1rem 1.5rem;
		font-size: 1rem;
	}

	.vintage-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 24px;
		box-shadow: 0 3px 0 0 var(--color-button-shadow, #826d5b);
		z-index: -1;
		transition: all 0.1s ease;
	}

	.vintage-button:hover {
		transform: translateY(-1px);
	}

	.vintage-button:hover::before {
		box-shadow: 0 4px 0 0 var(--color-button-shadow, #826d5b);
	}

	.vintage-button:active {
		transform: translateY(3px);
	}

	.vintage-button:active::before {
		box-shadow: 0 0 0 0 var(--color-button-shadow, #826d5b);
	}

	.full-width {
		width: 100%;
	}

	.cassette-icon {
		color: var(--color-warm-gray, #a0998a);
		width: 61.8%; /* Golden ratio: 1/φ ≈ 61.8% */
		height: 61.8%;
	}

	/* ===== RESPONSIVE ADJUSTMENTS ===== */
	@media (max-width: 768px) {
		.page-container {
			padding: 1rem;
		}

		.exercise-controls {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}

	@media (max-width: 640px) {
		.unit-title {
			font-size: 1.5rem;
		}

		.exercise-title {
			font-size: 1.125rem;
		}
	}
</style>
