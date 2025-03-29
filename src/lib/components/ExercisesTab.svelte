<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import CassetteTapeSelector from './CassetteTapeSelector.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let exercises = [];
	export let tapes = [];

	let currentTape = null;
	let currentExerciseIndex = 0;
	let imagesLoaded = {}; // Track loading status for multiple images
	let imageWidths = {}; // Store user's preferred widths
	let isDragging = false;
	let startX = 0;
	let startWidth = 0;
	let currentImageId = null;
	let defaultImageWidth = '85%'; // Initial readable size

	// Parse display URLs into arrays for multi-page exercises
	$: workbookTapes = tapes.filter((tape) => tape.tape_type === 'workbook');

	$: filteredExercises = currentTape
		? exercises
				.filter((ex) => ex.tape_id === currentTape.id)
				.sort((a, b) => a.order_num - b.order_num)
				.map((exercise) => ({
					...exercise,
					displayUrls: exercise.display_url
						? exercise.display_url.split(',').map((url) => url.trim())
						: []
				}))
		: [];

	$: currentExercise = filteredExercises[currentExerciseIndex] || null;

	onMount(() => {
		if (workbookTapes.length > 0) {
			const c2Tape = workbookTapes.find((tape) => tape.title.includes('C-2'));
			currentTape = c2Tape || workbookTapes[0];
		}
		const handleKeyDown = (e) => {
			if (e.key === 'Escape' && fullscreenActive) {
				closeFullscreen();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	// Image resize functions
	function startResize(e, imageId) {
		isDragging = true;
		startX = e.clientX || e.touches?.[0].clientX;
		currentImageId = imageId;

		// Get current width - either from stored value or default
		const currentWidth = imageWidths[imageId];
		startWidth = currentWidth ? parseInt(currentWidth) : 85;

		// Add event listeners
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', stopResize);
		window.addEventListener('touchmove', handleMouseMove);
		window.addEventListener('touchend', stopResize);
		e.preventDefault();
	}

	function handleMouseMove(e) {
		if (!isDragging) return;
		const clientX = e.clientX || e.touches?.[0].clientX;
		const delta = clientX - startX;

		// Calculate new width with constraints (50% to 100%)
		const newWidth = Math.max(50, Math.min(100, startWidth + delta * 0.5));
		imageWidths[currentImageId] = `${newWidth}%`;
		imageWidths = { ...imageWidths }; // Trigger reactivity
	}

	function stopResize() {
		isDragging = false;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', stopResize);
		window.removeEventListener('touchmove', handleMouseMove);
		window.removeEventListener('touchend', stopResize);
	}

	function handleTapeChange(event) {
		currentTape = event.detail;
		currentExerciseIndex = 0;
		imagesLoaded = {}; // Reset loading states
	}

	function previousExercise() {
		if (currentExerciseIndex > 0) {
			currentExerciseIndex--;
			imagesLoaded = {}; // Reset loading states
		}
	}

	function nextExercise() {
		if (currentExerciseIndex < filteredExercises.length - 1) {
			currentExerciseIndex++;
			imagesLoaded = {}; // Reset loading states
		}
	}

	function handleImageLoad(imageId) {
		imagesLoaded[imageId] = true;
		imagesLoaded = { ...imagesLoaded }; // Trigger reactivity
	}

	// Add to your script section
	import { fade } from 'svelte/transition';
	import { spring } from 'svelte/motion';

	// Fullscreen state management
	let fullscreenActive = false;
	let currentFullscreenImage = null;
	let fullscreenContainer;
	let isPanning = false;
	let lastX = 0;
	let lastY = 0;

	// Spring animations for smooth zooming and panning
	let zoomSpring = spring(1, { stiffness: 0.1, damping: 0.8 });
	let panXSpring = spring(0, { stiffness: 0.1, damping: 0.8 });
	let panYSpring = spring(0, { stiffness: 0.1, damping: 0.8 });

	// Actual values (non-animated)
	let zoomLevel = 1;
	let panX = 0;
	let panY = 0;

	function openFullscreen(imageId) {
		const [exerciseId, index] = imageId.split('-');

		if (currentExercise && currentExercise.displayUrls) {
			const idx = parseInt(index);

			if (currentExercise.displayUrls[idx]) {
				currentFullscreenImage = {
					url: currentExercise.displayUrls[idx],
					alt: `Exercise ${currentExercise.title} - Page ${idx + 1}`
				};

				// Reset zoom and pan
				zoomLevel = 1;
				panX = 0;
				panY = 0;
				zoomSpring.set(1);
				panXSpring.set(0);
				panYSpring.set(0);

				fullscreenActive = true;

				// Prevent scrolling when fullscreen is active
				document.body.style.overflow = 'hidden';
			}
		}
	}

	function closeFullscreen() {
		fullscreenActive = false;
		currentFullscreenImage = null;
		document.body.style.overflow = '';
	}

	// Zoom functions
	function zoomIn() {
		zoomLevel = Math.min(zoomLevel + 0.25, 3);
		zoomSpring.set(zoomLevel);
	}

	function zoomOut() {
		zoomLevel = Math.max(zoomLevel - 0.25, 1);
		zoomSpring.set(zoomLevel);

		// Reset pan if zooming out to 1
		if (zoomLevel <= 1) {
			panX = 0;
			panY = 0;
			panXSpring.set(0);
			panYSpring.set(0);
		}
	}

	function resetView() {
		zoomLevel = 1;
		panX = 0;
		panY = 0;
		zoomSpring.set(1);
		panXSpring.set(0);
		panYSpring.set(0);
	}

	// Handle mouse wheel for zooming
	function handleWheel(e) {
		if (!fullscreenActive) return;

		e.preventDefault();

		if (e.deltaY < 0) {
			zoomIn();
		} else {
			zoomOut();
		}
	}

	// Pan functionality
	function startPan(e) {
		if (!fullscreenActive || zoomLevel <= 1) return;

		isPanning = true;
		lastX = e.clientX || e.touches?.[0].clientX;
		lastY = e.clientY || e.touches?.[0].clientY;

		// Add event listeners for move and end events
		if (e.type === 'mousedown') {
			window.addEventListener('mousemove', handlePan);
			window.addEventListener('mouseup', endPan);
		} else {
			window.addEventListener('touchmove', handlePan, { passive: false });
			window.addEventListener('touchend', endPan);
		}

		e.preventDefault();
	}

	function handlePan(e) {
		if (!isPanning) return;

		const clientX = e.clientX || e.touches?.[0].clientX;
		const clientY = e.clientY || e.touches?.[0].clientY;

		const deltaX = clientX - lastX;
		const deltaY = clientY - lastY;

		panX += deltaX / zoomLevel;
		panY += deltaY / zoomLevel;

		panXSpring.set(panX);
		panYSpring.set(panY);

		lastX = clientX;
		lastY = clientY;

		e.preventDefault();
	}

	function endPan() {
		isPanning = false;
		window.removeEventListener('mousemove', handlePan);
		window.removeEventListener('mouseup', endPan);
		window.removeEventListener('touchmove', handlePan);
		window.removeEventListener('touchend', endPan);
	}

	// Double-tap/double-click to zoom
	function handleDoubleTap(e) {
		if (!fullscreenActive) return;

		e.preventDefault();

		if (zoomLevel > 1) {
			resetView();
		} else {
			zoomLevel = 2;
			zoomSpring.set(2);
		}
	}

	// Pinch zoom functionality for mobile
	let initialDistance = 0;
	let initialZoom = 1;

	function handleTouchStart(e) {
		if (e.touches.length === 2) {
			// Prevent default behavior for two-finger touch
			e.preventDefault();

			const touch1 = e.touches[0];
			const touch2 = e.touches[1];

			// Calculate initial distance between touches
			initialDistance = Math.hypot(
				touch2.clientX - touch1.clientX,
				touch2.clientY - touch1.clientY
			);

			initialZoom = zoomLevel;

			// Add listener for pinch gesture
			window.addEventListener('touchmove', handlePinch, { passive: false });
			window.addEventListener('touchend', endPinch);
		}
	}

	function handlePinch(e) {
		if (e.touches.length === 2) {
			e.preventDefault();

			const touch1 = e.touches[0];
			const touch2 = e.touches[1];

			// Calculate new distance
			const currentDistance = Math.hypot(
				touch2.clientX - touch1.clientX,
				touch2.clientY - touch1.clientY
			);

			// Calculate zoom scale based on pinch
			const scale = currentDistance / initialDistance;
			zoomLevel = Math.min(Math.max(initialZoom * scale, 1), 3);
			zoomSpring.set(zoomLevel);
		}
	}

	function endPinch() {
		window.removeEventListener('touchmove', handlePinch);
		window.removeEventListener('touchend', endPinch);
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
			<!-- <h3 class="section-header">Exercises</h3> -->
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
							<span class="counter-text">
								{currentExerciseIndex + 1}/{filteredExercises.length}</span
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
						<!-- <h4 class="exercise-title">{currentExercise.title}</h4> -->

						<!-- Display all pages vertically -->
						{#if currentExercise.displayUrls.length > 0}
							<div class="exercise-pages">
								{#each currentExercise.displayUrls as url, index}
									<div
										class="exercise-page-container"
										style="width: {imageWidths[`${currentExercise.id}-${index}`] ||
											defaultImageWidth}"
									>
										<div class="exercise-page">
											{#if !imagesLoaded[`${currentExercise.id}-${index}`]}
												<div class="image-loader">
													<div class="spinner"></div>
													<span>Developing image...</span>
												</div>
											{/if}

											{#if imagesLoaded[`${currentExercise.id}-${index}`]}
												<button
													class="fullscreen-btn"
													on:click={() => openFullscreen(`${currentExercise.id}-${index}`)}
													aria-label="View full screen"
												>
													<span class="icon-symbol">⛶</span>
												</button>
											{/if}

											<img
												src={url}
												alt={`Exercise ${currentExercise.title} - Page ${index + 1}`}
												class="exercise-image"
												style="opacity: {imagesLoaded[`${currentExercise.id}-${index}`] ? 1 : 0}"
												on:load={() => handleImageLoad(`${currentExercise.id}-${index}`)}
											/>

											<!-- Resize handle -->
											<div
												class="resize-handle"
												on:mousedown={(e) => startResize(e, `${currentExercise.id}-${index}`)}
												on:touchstart={(e) => startResize(e, `${currentExercise.id}-${index}`)}
											>
												<div class="handle-bar"></div>
											</div>
										</div>

										{#if currentExercise.displayUrls.length > 1}
											<div class="page-indicator">
												Page {index + 1}
												<!-- of {currentExercise.displayUrls.length} -->
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{:else}
							<div class="empty-state">
								<div class="empty-state-icon">?</div>
								<p class="empty-state-text">No exercise pages available.</p>
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

	<!-- Add at the bottom of your component, right before the closing </div> of the main container -->
	{#if fullscreenActive}
		<div class="fullscreen-modal" transition:fade={{ duration: 200 }}>
			<div class="fullscreen-toolbar">
				<button class="fullscreen-close" on:click={closeFullscreen}>
					<span class="icon-symbol">✕</span>
				</button>
			</div>

			<div
				class="fullscreen-content"
				class:grabbing={isPanning}
				bind:this={fullscreenContainer}
				on:wheel={handleWheel}
				on:mousedown={startPan}
				on:touchstart={(e) => {
					if (e.touches.length === 1) startPan(e);
					else handleTouchStart(e);
				}}
				on:dblclick={handleDoubleTap}
				style="transform: scale({$zoomSpring}) translate({$panXSpring}px, {$panYSpring}px);"
			>
				{#if currentFullscreenImage}
					<img
						src={currentFullscreenImage.url}
						alt={currentFullscreenImage.alt}
						class="fullscreen-image"
						draggable="false"
					/>
				{/if}
			</div>

			<div class="fullscreen-controls">
				<button class="control-btn" on:click={zoomOut} disabled={$zoomSpring <= 1}>
					<span class="icon-symbol">−</span>
				</button>
				<span class="zoom-level">{Math.round($zoomSpring * 100)}%</span>
				<button class="control-btn" on:click={zoomIn} disabled={$zoomSpring >= 3}>
					<span class="icon-symbol">+</span>
				</button>
				<button class="control-btn" on:click={resetView}>
					<span class="icon-symbol">↺</span>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* .section-header {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		color: var(--color-charcoal);
		margin-bottom: 1rem;
		font-weight: 500;
	} */

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

	/* Navigation bar with vintage styling */
	.exercise-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.75rem;
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
		padding: 0.25rem 0.5rem;
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
		text-align: center;
		background-color: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(160, 152, 138, 0.3);
		border-radius: 12px;
		padding: 0.25rem 0.5rem;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.counter-text {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--color-charcoal);
		letter-spacing: 0.025em;
	}

	.exercise-content {
		padding: 1rem 1.5em;
	}

	/* .exercise-title {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-charcoal);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px dashed var(--color-warm-gray);
	} */

	/* New styles for multiple page display */
	.exercise-pages {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
		margin: 1.5rem 0;
	}

	.exercise-page-container {
		position: relative;
		width: 85%; /* Default width - will be overridden by dynamic styles */
		margin: 0 auto;
		transition: width 0.3s ease;
	}

	.exercise-page {
		position: relative;
		display: flex;
		justify-content: center;
		border: 1px solid var(--color-warm-gray);
		border-radius: 4px;
		background-color: #fff;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 0 0 4px rgba(255, 255, 255, 0.8),
			0 0 0 5px rgba(160, 152, 138, 0.2);
		overflow: hidden;
	}

	.exercise-image {
		width: 100%;
		height: auto;
		display: block;
		transition: opacity 0.3s ease;
	}

	/* Resize handle styling */
	.resize-handle {
		position: absolute;
		top: 0;
		right: -12px;
		width: 24px; /* Wide touch area */
		height: 100%;
		cursor: ew-resize;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.handle-bar {
		height: 90%; /* Taller to be more visible */
		width: 16px;
		/* background-color: var(--color-terracotta, #c26e5a); */
		background-color: var(--color-cream-paper);
		border-radius: 6px;
		opacity: 0.4;
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease;
		background-image: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 5px,
			rgba(0, 0, 0, 0.1) 6px,
			rgba(0, 0, 0, 0.1) 10px
		);
	}

	.resize-handle:hover .handle-bar {
		background-color: var(--color-terracotta, #c26e5a);
		width: 20px;
		box-shadow:
			0 0 6px rgba(194, 110, 90, 0.4),
			inset 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.resize-handle:active .handle-bar {
		background-color: #ad6c66;
	}

	/* Add a tooltip hint on hover */
	.resize-handle::after {
		content: 'Drag to resize';
		position: absolute;
		top: 10px;
		right: 20px;
		background: var(--color-charcoal, #33312e);
		color: var(--color-cream-paper, #f7f3e3);
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 11px;
		white-space: nowrap;
		opacity: 0;
		transform: translateX(-10px);
		transition: all 0.3s ease;
		pointer-events: none;
	}

	.resize-handle:hover::after {
		opacity: 0.9;
		transform: translateX(0);
	}

	.page-indicator {
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-charcoal);
		opacity: 0.7;
		margin-top: 0.5rem;
		font-family: 'Courier New', monospace;
	}

	/* Image loader styling */
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

	/* Empty state styling */
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

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.exercise-page-container {
			width: 95%; /* Wider on mobile by default */
		}

		.resize-handle {
			right: -8px;
			width: 16px; /* Smaller but still touchable */
		}

		.resize-handle::after {
			display: none; /* Hide tooltip on mobile */
		}

		.handle-bar {
			width: 32px;
		}
	}

	/* Fullscreen button */
	.fullscreen-btn {
		position: absolute;
		bottom: 16px;
		left: 16px;
		width: 32px;
		height: 32px;
		background-color: rgba(51, 49, 46, 0.473);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease;
		z-index: 5;
		opacity: 0.85;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(2px);
	}

	.fullscreen-btn:hover {
		background-color: var(--color-terracotta, #c26e5a);
		transform: scale(1.05);
		opacity: 1;
	}

	.icon-symbol {
		font-size: 24px;
		line-height: 1;
	}

	/* Fullscreen modal */
	.fullscreen-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(33, 31, 29, 0.95);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.fullscreen-toolbar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		padding: 16px;
		z-index: 1001;
	}

	.fullscreen-close {
		background-color: rgba(51, 49, 46, 0.8);
		border: none;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.fullscreen-close:hover {
		background-color: var(--color-terracotta, #c26e5a);
	}

	.fullscreen-content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		will-change: transform;
		cursor: grab;
	}

	.fullscreen-content.grabbing {
		cursor: grabbing;
	}

	.fullscreen-image {
		max-width: 90%;
		max-height: 80vh;
		object-fit: contain;
		user-select: none;
		-webkit-user-drag: none;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
	}

	.fullscreen-controls {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 16px;
		align-items: center;
		background-color: rgba(51, 49, 46, 0.8);
		padding: 8px 16px;
		border-radius: 50px;
		z-index: 1001;
		backdrop-filter: blur(4px);
	}

	.control-btn {
		background: none;
		border: none;
		color: white;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.control-btn:hover:not(:disabled) {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.control-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.zoom-level {
		color: white;
		font-family: 'Courier New', monospace;
		font-size: 16px;
		width: 60px;
		text-align: center;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.fullscreen-controls {
			bottom: 16px;
			padding: 8px 12px;
		}

		.control-btn {
			width: 40px;
			height: 40px;
		}

		.fullscreen-btn {
			position: absolute;
			bottom: 8px;
			left: 8px;
			width: 24px;
			height: 24px;
		}

		.icon-symbol {
			font-size: 16px;
			line-height: 1;
		}
	}
</style>
