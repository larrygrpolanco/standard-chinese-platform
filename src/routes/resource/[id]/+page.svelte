<!-- src/routes/resource/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase, getUnitBasicInfo, getUnitExercisesData } from '$lib/supabase/client';
	import Loader from '$lib/components/UI/Loader.svelte';
	import CassetteTapeSelector from '$lib/components/CassetteTapeSelector.svelte';

	let resourceId = $page.params.id;
	let resourceData = null;
	let loading = true;
	let error = null;
	let workbookTapes = [];
	let exercises = [];
	let currentTape = null;
	let currentExerciseIndex = 0;
	let currentImageIndex = 0; // Track the current image index
	let imageLoaded = false;
	let coreModuleAssociations = {
		'pronunciation-romanization': {
			name: 'Pronunciation & Romanization',
			modules: ['Core Module 1'],
			description: 'Basic Chinese sounds and pinyin system'
		},
		'numbers': {
			name: 'Numbers',
			modules: ['Core Module 1', 'Core Module 3'],
			description: 'Cardinal and ordinal numbers, quantities and counting'
		},
		'time-dates': {
			name: 'Time and Dates',
			modules: ['Core Module 2', 'Core Module 3'],
			description: 'Expressing time and calendar dates'
		},
		'classroom-expressions': {
			name: 'Classroom Expressions',
			modules: ['Core Module 1', 'Core Module 2'],
			description: 'Common phrases used in learning environments'
		}
	};

	// Hardcoded tape connections to core modules
	const tapeConnections = {
		'pronunciation-romanization': [
			{ tapeNumbers: '1-6', coreModule: 'Core Module 1' }
		],
		'numbers': [
			{ tapeNumbers: '1-4', coreModule: 'Core Module 1' },
			{ tapeNumbers: '5-6', coreModule: 'Core Module 3' }
		],
		'time-dates': [
			{ tapeNumbers: '1-2', coreModule: 'Core Module 2' },
			{ tapeNumbers: '3-4', coreModule: 'Core Module 3' }
		],
		'classroom-expressions': [
			{ tapeNumbers: '1', coreModule: 'Core Module 1' },
			{ tapeNumbers: '2', coreModule: 'Core Module 2' }
		]
	};

	$: resourceInfo = coreModuleAssociations[resourceId] || {
		name: 'Resource Module',
		modules: [],
		description: 'Supplementary learning materials'
	};

	$: connections = tapeConnections[resourceId] || [];
	
	$: filteredExercises = currentTape
		? exercises
				.filter((ex) => ex.tape_id === currentTape.id)
				.sort((a, b) => a.order_num - b.order_num)
		: [];
	
	$: currentExercise = filteredExercises[currentExerciseIndex] || null;
	$: hasDisplayImage = currentExercise?.display_url && currentExercise.display_url.trim() !== '';
	$: displayUrls = hasDisplayImage ? currentExercise.display_url.split(',').map(url => url.trim()) : [];
	$: currentImageUrl = displayUrls[currentImageIndex] || '';

	// Reset image index when exercise or tape changes
	$: if (currentExercise) {
		imageLoaded = false;
		currentImageIndex = 0;
	}

	async function loadResourceData() {
		loading = true;
		error = null;

		try {
			// Fetch unit data based on resource type
			// For simplicity, we're assuming you'll create units with IDs 1-4 in Module 0
			let unitId;
			switch (resourceId) {
				case 'pronunciation-romanization':
					unitId = 1; // Unit 01 in Module 0
					break;
				case 'numbers':
					unitId = 2; // Unit 02 in Module 0
					break;
				case 'time-dates':
					unitId = 3; // Unit 03 in Module 0
					break;
				case 'classroom-expressions':
					unitId = 4; // Unit 04 in Module 0
					break;
				default:
					throw new Error('Invalid resource type');
			}

			// Fetch basic unit info and exercises data
			const [unitInfo, exercisesData] = await Promise.all([
				getUnitBasicInfo(unitId),
				getUnitExercisesData(unitId)
			]);

			if (!unitInfo) {
				throw new Error('Resource not found');
			}

			resourceData = unitInfo;
			workbookTapes = exercisesData.workbookTapes || [];
			exercises = exercisesData.exercises || [];

			// Select first tape by default
			if (workbookTapes.length > 0) {
				currentTape = workbookTapes[0];
				currentExerciseIndex = 0;
				currentImageIndex = 0;
			}
		} catch (err) {
			console.error('Error loading resource data:', err);
			error = err.message || 'Failed to load resource';
		} finally {
			loading = false;
		}
	}

	function handleTapeChange(event) {
		currentTape = event.detail;
		currentExerciseIndex = 0;
		currentImageIndex = 0;
		imageLoaded = false;
	}

	// Navigate to previous image
	function previousImage() {
		if (currentImageIndex > 0) {
			// Go to previous image in current exercise
			currentImageIndex--;
			imageLoaded = false;
		} else if (currentExerciseIndex > 0) {
			// Go to previous exercise and its last image
			currentExerciseIndex--;
			const prevExercise = filteredExercises[currentExerciseIndex];
			if (prevExercise?.display_url) {
				const prevUrls = prevExercise.display_url.split(',').map(url => url.trim());
				currentImageIndex = prevUrls.length - 1;
			} else {
				currentImageIndex = 0;
			}
			imageLoaded = false;
		}
	}

	// Navigate to next image
	function nextImage() {
		if (currentImageIndex < displayUrls.length - 1) {
			// Go to next image in current exercise
			currentImageIndex++;
			imageLoaded = false;
		} else if (currentExerciseIndex < filteredExercises.length - 1) {
			// Go to next exercise and its first image
			currentExerciseIndex++;
			currentImageIndex = 0;
			imageLoaded = false;
		}
	}

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

	onMount(() => {
		loadResourceData();
	});
</script>

<svelte:head>
	<title>{resourceInfo.name} | Resource Module | Taped Chinese</title>
	<meta name="description" content={resourceInfo.description} />
</svelte:head>

<div class="page-container">
	<div class="content-container">
		{#if loading}
			<Loader />
		{:else if error}
			<div class="error-container">
				<h1 class="error-heading">{error}</h1>
				<p class="error-text">The resource you're looking for doesn't exist or has been removed.</p>
				<a href="/resource" class="error-button"> Browse All Resources </a>
			</div>
		{:else}
			<header class="resource-header">
				<div class="resource-nav">
					<!-- Resource badge that links back to resource page -->
					<a href="/resource" class="resource-badge" title="Back to Resource Guide">
						<span class="resource-badge-text">R</span>
					</a>
					<div class="resource-title-container">
						<h1 class="resource-title">{resourceInfo.name}</h1>
					</div>
				</div>

				<p class="resource-description">{resourceInfo.description}</p>

				<!-- Core module associations -->
				<div class="module-associations">
					<p class="association-label">Connected with:</p>
					<div class="association-tags">
						{#each resourceInfo.modules as module}
							<a href="/modules/{module.split(' ').pop()}" class="module-tag">
								{module}
							</a>
						{/each}
					</div>
				</div>

				<!-- Tape connection notes -->
				{#if connections.length > 0}
					<div class="tape-connections">
						<p class="connection-label">Tape connections:</p>
						<ul class="connections-list">
							{#each connections as connection}
								<li class="connection-item">
									<span class="tape-range">Tapes {connection.tapeNumbers}</span>
									<span class="tape-module">→ {connection.coreModule}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="resource-warning">
					<p>
						<strong>Note:</strong> These resource modules are supplementary materials and may be extra boring
						for absolute beginners. They are best used alongside the core modules.
					</p>
				</div>
			</header>

			<div class="exercise-container">
				<!-- Cassette Tape Selector Component -->
				<CassetteTapeSelector
					tapes={workbookTapes}
					tapeType="workbook"
					on:tapeChange={handleTapeChange}
				/>

				<!-- Exercise Display Section -->
				<section class="section-container mt-6">
					<div class="mb-4">
						<h3 class="section-header">Practice Materials</h3>
					</div>

					<div class="exercise-display-container">
						{#if filteredExercises.length > 0 && currentExercise}
							<div class="exercise-card">
								<!-- Navigation Header -->
								<div class="exercise-navigation">
									<button
										class="nav-button"
										on:click={previousImage}
										disabled={currentImageIndex === 0 && currentExerciseIndex === 0}
										aria-label="Previous page"
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
											>Page {currentImageIndex + 1} of {displayUrls.length}</span
										>
									</div>

									<button
										class="nav-button"
										on:click={nextImage}
										disabled={currentImageIndex === displayUrls.length - 1 && currentExerciseIndex === filteredExercises.length - 1}
										aria-label="Next page"
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
								<div class="exercise-content">
									{#if currentExercise.instructions}
										<div class="exercise-instructions-container">
											<div class="exercise-instructions">
												{@html formatInstructions(currentExercise.instructions)}
											</div>
										</div>
									{/if}

									{#if hasDisplayImage}
										<div class="exercise-display-image">
											{#if !imageLoaded}
												<div class="image-loader">
													<div class="spinner"></div>
													<span>Loading image...</span>
												</div>
											{/if}
											<img
												src={currentImageUrl}
												alt={`Exercise page ${currentImageIndex + 1}`}
												class="exercise-image"
												style="opacity: {imageLoaded ? 1 : 0}"
												on:load={() => (imageLoaded = true)}
											/>
										</div>
									{:else}
										<div class="no-image-notice">
											<p>Follow along with your workbook while listening to the tape recording.</p>
										</div>
									{/if}
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

			<!-- Navigation footer -->
			<div class="navigation-footer">
				<a href="/resource" class="back-link">
					<svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
					Back to Resource Guide
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

	/* Resource header */
	.resource-header {
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #a0998a;
		padding-bottom: 1rem;
	}

	.resource-nav {
		margin-bottom: 0.75rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.resource-badge {
		display: flex;
		height: 3rem;
		width: 3rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: #7d8c5c; /* Avocado color for resources */
		color: white;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		transition: transform 0.2s;
	}

	.resource-badge:hover {
		transform: scale(1.05);
	}

	.resource-badge-text {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.resource-title-container {
		flex-grow: 1;
	}

	.resource-title {
		font-family: 'Arvo', serif;
		font-size: 1.75rem;
		color: #33312e;
		margin: 0;
	}

	.resource-description {
		font-size: 1.125rem;
		color: #5c5c5c;
		margin-bottom: 1rem;
	}

	/* Module associations */
	.module-associations {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.association-label {
		font-weight: 500;
		color: #5c5c5c;
		margin: 0;
	}

	.association-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.module-tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background-color: rgba(193, 124, 116, 0.1);
		border: 1px solid rgba(193, 124, 116, 0.3);
		color: #c17c74;
		border-radius: 16px;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.module-tag:hover {
		background-color: rgba(193, 124, 116, 0.2);
		transform: translateY(-1px);
	}

	/* Tape connections */
	.tape-connections {
		margin-bottom: 1rem;
	}

	.connection-label {
		font-weight: 500;
		color: #5c5c5c;
		margin-bottom: 0.5rem;
	}

	.connections-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.connection-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
	}

	.tape-range {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background-color: rgba(125, 140, 92, 0.1);
		border: 1px solid rgba(125, 140, 92, 0.3);
		color: #7d8c5c;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
	}

	.tape-module {
		color: #5c5c5c;
	}

	/* Resource warning */
	.resource-warning {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		background-color: rgba(221, 185, 103, 0.1);
		border-left: 3px solid #ddb967;
		border-radius: 4px;
		font-size: 0.9rem;
		color: #5c5c5c;
	}

	.resource-warning p {
		margin: 0;
	}

	.resource-warning strong {
		color: #33312e;
	}

	/* Exercise container styles */
	.exercise-container {
		margin-top: 2rem;
	}

	.section-header {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		color: #33312e;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.mt-6 {
		margin-top: 1.5rem;
	}

	.mb-4 {
		margin-bottom: 1rem;
	}

	/* Vintage card styling */
	.exercise-card {
		position: relative;
		background-color: #f7f3e3;
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
		border: 1px solid #a0998a;
		border-radius: 8px;
		box-shadow:
			inset 0 1px 3px rgba(51, 49, 46, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.05),
			0 4px 6px rgba(0, 0, 0, 0.03);
		overflow: hidden;
	}

	/* Navigation bar with vintage styling */
	.exercise-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: #e8e5d7;
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
		border-bottom: 1px solid #a0998a;
	}

	/* 3D button effect */
	.nav-button {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: #f7f3e3;
		border: 1px solid #a0998a;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
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
			0 3px 0 0 #c4b59d,
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
			0 4px 0 0 #c4b59d,
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.nav-button:active:not(:disabled) {
		transform: translateY(3px);
	}

	.nav-button:active:not(:disabled)::before {
		box-shadow:
			0 0 0 0 #c4b59d,
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
		color: #33312e;
		letter-spacing: 0.05em;
	}

	.exercise-content {
		padding: 1rem 3rem;
	}

	/* Vintage lined paper effect for instructions */
	.exercise-instructions-container {
		margin-bottom: 1.5rem;
	}

	.exercise-instructions {
		position: relative;
		font-size: 1rem;
		line-height: 1.6;
		color: #33312e;
		background-color: #fcf9f0;
		background-image: linear-gradient(rgba(220, 220, 220, 0.25) 1px, transparent 1px);
		background-size: 100% 1.6rem;
		border-radius: 6px;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid #a0998a;
		border-left: 3px solid #7d8c5c; /* Avocado color for resources */
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
		color: #34667f;
		font-weight: 600;
		border-bottom: 2px dotted #ddb967;
		padding-bottom: 0.375rem;
	}

	.exercise-instructions .choice-option {
		font-family: 'Courier New', monospace;
		margin-right: 0.25rem;
		letter-spacing: 0.03em;
	}

	/* Vintage photo frame for images */
	.exercise-display-image {
		position: relative;
		margin: 0 auto;
		text-align: center;
		max-width: 100%;
		min-height: 100px; /* Ensures space for loader */
	}

	.exercise-image {
		border: 1px solid hsl(41, 10%, 58%);
		border-radius: 4px;
		max-width: 100%;
		height: auto;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 0 0 4px rgba(255, 255, 255, 0.8),
			0 0 0 5px rgba(160, 152, 138, 0.2);
		transition: opacity 0.3s ease;
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
		background-color: #f7f3e3;
		border: 1px solid #a0998a;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		z-index: 1;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid rgba(125, 140, 92, 0.3);
		border-radius: 50%;
		border-top-color: #7d8c5c;
		animation: spin 1s linear infinite;
	}

	.image-loader span {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: #33312e;
		font-style: italic;
	}

	.no-image-notice {
		padding: 1.5rem;
		text-align: center;
		background-color: rgba(221, 185, 103, 0.1);
		border: 1px dashed #ddb967;
		border-radius: 8px;
	}

	.no-image-notice p {
		font-style: italic;
		color: #5c5c5c;
		margin: 0;
	}

	/* Vintage empty state styling */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		background-color: #f7f3e3;
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
		border: 1px solid #a0998a;
		border-radius: 8px;
		text-align: center;
	}

	.empty-state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background-color: #ddb967;
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.05));
		color: #33312e;
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
		color: #a0998a;
	}

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
		color: #7d8c5c;
	}

	.back-icon {
		margin-right: 0.5rem;
		height: 1.25rem;
		width: 1.25rem;
	}

	/* Animation */
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.resource-nav {
			flex-direction: column;
			align-items: flex-start;
		}

		.module-associations,
		.tape-connections {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (max-width: 480px) {
		.exercise-navigation {
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.exercise-counter {
			order: 1;
			width: 100%;
			text-align: center;
			margin-top: 0.5rem;
		}
	}
</style>