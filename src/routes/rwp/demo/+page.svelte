<!-- src/routes/rwp/demo/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import {
		getUnitBasicInfo,
		getUnitVocabularyData,
		getCompleteUnit
	} from '$lib/supabase/client.js';
	import Loader from '$lib/components/UI/Loader.svelte';
	import Toast from '$lib/components/UI/Toast.svelte';
	import ComprehensionExercise from '$lib/components/rwp/ComprehensionExercise.svelte';
	import TapeConstruction from '$lib/components/UI/TapeConstruction.svelte';

	// State variables
	let loading = true;
	let generating = false;
	let unitData = null;
	let rwpContent = null;
	let specificFocus = '';
	let showAnswers = false;
	let error = null;
	let unitVocabulary = [];
	let generationPhase = 'init';
	let debug = true;

	// Demo user profile state
	let fullName = 'Dracula';
	let learningLevel = 'beginner';
	let learningGoals = 'buy blood sausage at the night market';

	// Personal context state variables
	let occupation = 'Not a Vampire Lord';
	let location = 'Transylvania';
	let hobbies = 'midnight beach walks, bat watching';
	let reasonLearning = 'planning a trip to Taiwan for their famous night markets';

	// Collapsible panel states
	let profilePanelOpen = true;
	let contextPanelOpen = false;
	let generatorPanelOpen = false;

	// Toast state
	let toastVisible = false;
	let toastMessage = '';

	// Hardcoded unit ID for Module 3, Unit 2
	const unitId = 32;

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

	// Generate a new exercise
	async function generateExercise() {
		generating = true;
		generationPhase = 'init';
		showAnswers = false;
		error = null;

		try {
			// Build the user profile from form inputs with personal context
			const userProfile = {
				full_name: fullName || 'Demo User',
				learning_level: learningLevel,
				learning_goals: learningGoals || 'Learning Chinese',
				personal_context: {
					occupation: occupation || 'not specified',
					location: location || 'not specified',
					hobbies: hobbies || 'not specified',
					reason_learning: reasonLearning || 'not specified'
				},
				// Empty module responses - keeping structure but not using
				module_responses: { 3: {} }
			};

			console.log('User profile being sent:', userProfile);

			// Get complete unit data
			const completeUnitData = await getCompleteUnit(unitId);

			// PHASE 1: Generate the story
			generationPhase = 'story';
			console.log('Generating story...');
			const storyResponse = await fetch('/api/rwp/create-story', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					unitData: completeUnitData,
					userProfile,
					specificFocus,
					debug
				})
			});

			if (!storyResponse.ok) {
				const errorData = await storyResponse.json();
				throw new Error(errorData.error || 'Error generating story');
			}

			const storyData = await storyResponse.json();
			const story = storyData.story;

			// Log the full story text
			console.log('=== GENERATED STORY ===');
			console.log(story);

			// PHASE 2: Generate questions based on the story
			generationPhase = 'questions';
			console.log('Generating questions...');
			const questionsResponse = await fetch('/api/rwp/create-questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					story,
					unitData: completeUnitData,
					userProfile,
					specificFocus,
					debug
				})
			});

			if (!questionsResponse.ok) {
				const errorData = await questionsResponse.json();
				throw new Error(errorData.error || 'Error generating questions');
			}

			const questionsData = await questionsResponse.json();
			const questions = questionsData.questions;

			// Log the full questions text
			console.log('=== GENERATED QUESTIONS ===');
			console.log(questions);

			// PHASE 3: Format everything into JSON structure
			generationPhase = 'formatting';
			console.log('Formatting exercise...');
			const formatResponse = await fetch('/api/rwp/format-exercise', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					story,
					questions,
					unitData: completeUnitData,
					debug
				})
			});

			if (!formatResponse.ok) {
				const errorData = await formatResponse.json();
				throw new Error(errorData.error || 'Error formatting exercise');
			}

			// Get formatted data
			const formatData = await formatResponse.json();
			rwpContent = debug ? formatData.parsed : formatData;

			// Log the formatted output
			console.log('=== FORMATTED OUTPUT ===');
			console.log(formatData);

			showToast('Practice exercise generated successfully!');
		} catch (err) {
			console.error('Error generating exercise:', err);
			error = err.message || 'Failed to generate exercise';
			showToast('Failed to generate exercise');
		} finally {
			generating = false;
		}
	}

	// Toggle panels
	function toggleProfilePanel() {
		profilePanelOpen = !profilePanelOpen;
	}

	function toggleContextPanel() {
		contextPanelOpen = !contextPanelOpen;
	}

	function toggleGeneratorPanel() {
		generatorPanelOpen = !generatorPanelOpen;
	}
</script>

<svelte:head>
	<title>Demo: Personalized Practice | Taped Chinese</title>
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
			<header class="page-header">
				<div class="header-top">
					<a href="/units/{unitId}" class="back-button">
						<svg viewBox="0 0 24 24" class="back-icon">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							></path>
						</svg>
						<span>Back to Unit</span>
					</a>

					<div class="unit-badge">Unit {unitId}</div>
				</div>

				<h1 class="unit-title">{unitData.title} RWP</h1>

				<p class="unit-description">{unitData.description}</p>

				<div class="module-info">
					<span class="module-label">Module {unitData.module.id}:</span>
					<span class="module-title">{unitData.module.title}</span>
				</div>

				<p class="page-description">
					This is a demo of the personalized practice feature. Try it out by filling out the
					learning profile and contexts
				</p>
			</header>

			<!-- Content Layout -->
			<div class="content-area">
				<div class="practice-layout">
					<!-- Sidebar -->
					<div class="sidebar">
						<!-- Profile Panel (Demo-specific) -->
						<div class="vintage-panel">
							<button class="panel-toggle" on:click={toggleProfilePanel}>
								<div class="toggle-header">
									<h3 class="panel-title">Step 1: Your Learning Profile</h3>
									<p class="panel-subtitle">Tell us about yourself to personalize your practice</p>
								</div>
								<div class="fader-icon {profilePanelOpen ? 'open' : ''}"></div>
							</button>

							{#if profilePanelOpen}
								<div class="panel-content" transition:slide={{ duration: 300 }}>
									<div class="question-card">
										<label for="fullName" class="question-label">Name</label>
										<div class="input-wrapper">
											<input
												type="text"
												id="fullName"
												bind:value={fullName}
												class="question-input"
												maxlength="50"
												placeholder="Your name (or preferred name)"
											/>
										</div>
									</div>

									<div class="question-card">
										<label for="learningLevel" class="question-label">Your Chinese Level</label>
										<div class="input-wrapper">
											<select id="learningLevel" bind:value={learningLevel} class="question-input">
												<option value="beginner">Beginner</option>
												<option value="intermediate">Intermediate</option>
												<option value="advanced">Advanced</option>
											</select>
										</div>
									</div>

									<div class="question-card">
										<label for="learningGoals" class="question-label">Learning Goals</label>
										<div class="input-wrapper">
											<textarea
												id="learningGoals"
												bind:value={learningGoals}
												class="question-input"
												maxlength="250"
												placeholder="What do you hope to achieve by learning Chinese? What topics are you most interested in learning?"
												rows="4"
											></textarea>
											<div class="char-count">
												{learningGoals.length}/250
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Context Panel - Now with Personal Context Questions -->
						<div class="vintage-panel">
							<button class="panel-toggle" on:click={toggleContextPanel}>
								<div class="toggle-header">
									<h3 class="panel-title">Step 2: Your Personal Context</h3>
									<p class="panel-subtitle">Help us understand more about you</p>
								</div>
								<div class="fader-icon {contextPanelOpen ? 'open' : ''}"></div>
							</button>

							{#if contextPanelOpen}
								<div class="panel-content" transition:slide={{ duration: 300 }}>
									<!-- Occupation -->
									<div class="question-card">
										<label for="occupation" class="question-label">Occupation</label>
										<div class="input-wrapper">
											<input
												type="text"
												id="occupation"
												bind:value={occupation}
												class="question-input"
												maxlength="100"
												placeholder="What do you do? (job, student, etc.)"
											/>
										</div>
									</div>

									<!-- Location -->
									<div class="question-card">
										<label for="location" class="question-label">Where you live</label>
										<div class="input-wrapper">
											<input
												type="text"
												id="location"
												bind:value={location}
												class="question-input"
												maxlength="100"
												placeholder="City, country or region"
											/>
										</div>
									</div>

									<!-- Hobbies -->
									<div class="question-card">
										<label for="hobbies" class="question-label">Hobbies & Interests</label>
										<div class="input-wrapper">
											<textarea
												id="hobbies"
												bind:value={hobbies}
												class="question-input"
												maxlength="200"
												placeholder="What do you enjoy doing in your free time?"
												rows="3"
											></textarea>
											<div class="char-count">
												{hobbies.length}/200
											</div>
										</div>
									</div>

									<!-- Reason for Learning -->
									<div class="question-card">
										<label for="reasonLearning" class="question-label">
											Why are you learning Chinese?
										</label>
										<div class="input-wrapper">
											<textarea
												id="reasonLearning"
												bind:value={reasonLearning}
												class="question-input"
												maxlength="200"
												placeholder="Travel plans? Business? Interest in the culture?"
												rows="3"
											></textarea>
											<div class="char-count">
												{reasonLearning.length}/200
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Generator Panel -->
						<div class="vintage-panel">
							<button class="panel-toggle" on:click={toggleGeneratorPanel}>
								<div class="toggle-header">
									<h3 class="panel-title">Step 3: Generate Practice</h3>
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
										<p class="input-hint">Specific grammar, vocabulary, situations, etc.</p>
									</div>

									<!-- Generate Button -->
									<button
										class="generate-button {generating ? 'generating' : ''}"
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
									submessage="This should take about a minute"
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
									<svg viewBox="0 0 24 24" class="cassette-large">
										<rect
											x="2"
											y="5"
											width="20"
											height="14"
											rx="2"
											stroke="currentColor"
											fill="none"
											stroke-width="1.5"
										/>
										<circle
											cx="8"
											cy="12"
											r="3"
											stroke="currentColor"
											fill="none"
											stroke-width="1.5"
										/>
										<circle
											cx="16"
											cy="12"
											r="3"
											stroke="currentColor"
											fill="none"
											stroke-width="1.5"
										/>
										<line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" />
										<line x1="5" y1="7" x2="19" y2="7" stroke="currentColor" stroke-width="1.5" />
									</svg>
								</div>
								<h3 class="empty-state-title">Ready to Practice?</h3>
								<p class="empty-state-text">
									This demo lets you generate a personalized exercise based on your responses. Try
									it without creating an account!
								</p>
								<button
									class="generate-button large {generating ? 'generating' : ''}"
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
		background-color: var(--color-cream-paper, #f4f1de);
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

	/* ===== HEADER STYLING ===== */
	.page-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.75rem;
		border-radius: 20px;
		color: var(--color-navy, #34667f);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
	}

	.back-button:hover {
		color: var(--color-terracotta, #c17c74);
		transform: translateX(-2px);
	}

	.back-icon {
		width: 20px;
		height: 20px;
		margin-right: 0.375rem;
	}

	.unit-badge {
		display: inline-block;
		background-color: var(--color-terracotta, #c17c74);
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.unit-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.75rem;
		color: var(--color-charcoal, #33312e);
		margin: 0.5rem 0;
	}

	.unit-description {
		margin-top: 0.5rem;
		font-size: 1.125rem;
		color: #33312e;
	}

	.module-title {
		font-size: 1rem;
		font-weight: 500;
		color: #a0998a;
		font-style: italic;
	}

	.module-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.module-label {
		font-weight: 600;
		color: var(--color-navy, #34667f);
	}

	.module-title {
		color: var(--color-warm-gray, #a0998a);
	}

	.page-description {
		color: var(--color-warm-gray, #a0998a);
		font-size: 1rem;
		margin: 0;
		line-height: 1.5;
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
		/* gap: .5rem; */
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

	.char-count {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		font-size: 0.75rem;
		font-family: 'Courier New', monospace;
		color: var(--color-warm-gray, #a0998a);
		background-color: rgba(255, 255, 255, 0.8);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
	}

	.vintage-button {
		position: relative;
		align-self: flex-end;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-terracotta, #c17c74);
		color: white;
		border: none;
		border-radius: 24px;
		padding: 0.625rem 1.25rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 3px 0 var(--color-terracotta-hover, #ad6c66);
		transform: translateY(0);
	}

	.vintage-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 0 var(--color-terracotta-hover, #ad6c66);
		background-color: #b06b64;
	}

	.vintage-button:active {
		transform: translateY(3px);
		box-shadow: 0 0 0 var(--color-terracotta-hover, #ad6c66);
	}

	.button-text {
		position: relative;
		z-index: 1;
	}

	.question-card {
		background-color: var(--color-cream-paper, #f4f1de);
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.01));
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 6px;
		padding: 0.75rem;
		margin-bottom: 1rem;
	}

	.question-label {
		display: block;
		font-weight: 500;
		color: var(--color-charcoal, #33312e);
		margin-bottom: 0.5rem;
		font-size: 0.9375rem;
	}

	.input-wrapper {
		position: relative;
		background-color: white;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 4px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.input-wrapper:focus-within {
		border-color: var(--color-gold, #ddb967);
		box-shadow: 0 0 0 3px rgba(221, 185, 103, 0.2);
	}

	.question-input {
		width: 100%;
		padding: 0.625rem;
		padding-right: 3.5rem; /* Space for character count */
		background-color: transparent;
		border: none;
		font-family: inherit;
		font-size: 0.875rem;
		color: var(--color-charcoal, #33312e);
		resize: vertical;
	}

	.question-input:focus {
		outline: none;
	}

	.question-input::placeholder {
		color: rgba(160, 152, 138, 0.6);
		font-style: italic;
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
