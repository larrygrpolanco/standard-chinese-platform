<script>
	import { onMount, onDestroy } from 'svelte';

	// Props
	export let message = 'Under Construction';
	export let submessage = "We're recording more content";
	export let currentPhase = 'init'; // 'init', 'story', 'questions', 'formatting'
	export let isGenerating = false;

	// Interactive states
	let clickCounter = 0;
	let dragActive = false;
	let speedBoost = 0;
	let tapeCounter = 0;
	let isPulsing = false;

	// Reel rotation tracking - prevents skipping
	let leftReelRotation = 0;
	let rightReelRotation = 0;
	let lastTimestamp = 0;

	// Define generation phases
	const phases = [
		{ id: 'init', label: 'Init', percentage: 5 },
		{ id: 'story', label: 'Story', percentage: 30 },
		{ id: 'questions', label: 'Questions', percentage: 60 },
		{ id: 'formatting', label: 'Format', percentage: 100 }
	];

	// Reactive calculations
	$: currentPhaseInfo = phases.find((p) => p.id === currentPhase) || phases[0];
	$: tapeProgress = currentPhaseInfo.percentage;
	$: effectiveReelSpeed = 1 + speedBoost;
	$: tapeCounter = Math.floor(tapeProgress * 5);

	// Handle reel interactions
	function handleReelClick() {
		clickCounter++;
		speedBoost = Math.min(speedBoost + 0.5, 2);

		// Add visual feedback
		isPulsing = true;
		setTimeout(() => {
			isPulsing = false;
			speedBoost = Math.max(speedBoost - 0.3, 0);
		}, 800);
	}

	// Drag functionality
	function handleDragStart() {
		dragActive = true;
	}

	function handleDragEnd() {
		dragActive = false;
	}

	function handleDragMove(e) {
		if (dragActive) {
			// For touch events, use a constant boost
			if (e.touches) {
				speedBoost = Math.min(speedBoost + 0.1, 2);
			} else {
				// For mouse events, use movement
				speedBoost = Math.min(speedBoost + Math.abs(e.movementX) / 20, 2);
			}
		}
	}

	// Animate reels smoothly with requestAnimationFrame
	function animateReels(timestamp) {
		if (!lastTimestamp) lastTimestamp = timestamp;
		const deltaTime = timestamp - lastTimestamp;

		// Calculate rotation increment based on speed and time
		const rotationIncrement = (deltaTime / 1000) * 90 * effectiveReelSpeed;

		// Update rotations
		leftReelRotation = (leftReelRotation + rotationIncrement) % 360;
		rightReelRotation = (rightReelRotation - rotationIncrement) % 360;

		lastTimestamp = timestamp;
		requestAnimationFrame(animateReels);
	}

	// Chinese tips rotation
	let tipIndex = 0;
	const chineseTips = [
		'Chinese has over 50,000 characters, but you only need about 2,500 for daily use.',
		"Mandarin Chinese is the world's most spoken first language.",
		"Chinese characters are called 'Hanzi' (汉字) in Mandarin.",
		'Chinese is a tonal language with 4 tones in Mandarin.',
		'Many Chinese characters are pictographs derived from ancient drawings.'
	];

	// Interactive feedback messages
	$: clickMessage =
		clickCounter > 10
			? 'Winding faster! Keep going!'
			: clickCounter > 5
				? 'The tape is moving faster now!'
				: clickCounter > 0
					? 'That helps!'
					: 'Click or drag the reels to speed up recording';

	// Tip rotation interval
	let tipInterval;

	onMount(() => {
		// Start reel animation
		requestAnimationFrame(animateReels);

		if (isGenerating) {
			tipInterval = setInterval(() => {
				tipIndex = (tipIndex + 1) % chineseTips.length;
			}, 8000);
		}
	});

	onDestroy(() => {
		if (tipInterval) clearInterval(tipInterval);
	});
</script>

<svelte:window
	on:mousemove={handleDragMove}
	on:mouseup={handleDragEnd}
	on:touchmove={handleDragMove}
	on:touchend={handleDragEnd}
/>

<div class="construction-container">
	<div class="cassette-wrapper">
		<div class="cassette" class:pulse={isPulsing || speedBoost > 1.5}>
			<div class="cassette-body">
				<div class="label">
					<span class="tape-title">{message}</span>
					{#if isGenerating}
						<div class="tape-counter">
							<span class="counter-display">{tapeCounter.toString().padStart(4, '0')}</span>
						</div>
					{/if}
				</div>

				<div class="tape-window">
					<div
						class="reel left-reel"
						style="transform: rotate({leftReelRotation}deg);"
						on:click={handleReelClick}
						on:mousedown={handleDragStart}
						on:touchstart|preventDefault={handleDragStart}
						aria-label="Left reel - click or drag to speed up"
						tabindex="0"
						role="button"
					>
						<div class="reel-center"></div>
					</div>
					<div class="tape-line" style="width: {40 + tapeProgress / 5}%;"></div>
					<div
						class="reel right-reel"
						style="transform: rotate({rightReelRotation}deg);"
						on:click={handleReelClick}
						on:mousedown={handleDragStart}
						on:touchstart|preventDefault={handleDragStart}
						aria-label="Right reel - click or drag to speed up"
						tabindex="0"
						role="button"
					>
						<div class="reel-center"></div>
					</div>
				</div>

				<div class="tape-details">
					<div class="tape-text">{submessage}</div>
					<div class="tape-notches">
						<div class="notch"></div>
						<div class="notch"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if isGenerating}
		<div class="progress-section">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {tapeProgress}%">
					<div class="progress-pulse"></div>
				</div>
				<span class="progress-percentage">{Math.round(tapeProgress)}%</span>
			</div>

			<div class="phase-indicator">
				{#each phases as phase}
					<div
						class="phase-step {phase.id === currentPhase ? 'active' : ''} 
						       {currentPhaseInfo.percentage >= phase.percentage ? 'completed' : ''}"
					>
						<div class="step-dot"></div>
						<span class="step-label">{phase.label}</span>
					</div>
				{/each}
			</div>

			<div class="click-helper">
				<p class="helper-text">{clickMessage}</p>
			</div>

			<div class="chinese-tip">
				<p class="tip-text">💡 {chineseTips[tipIndex]}</p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Variables */
	.construction-container {
		--tape-primary: #c17c74; /* Terracotta */
		--tape-secondary: #e8e5d7; /* Beige */
		--tape-accent: #ddb967; /* Gold */
		--tape-dark: #33312e; /* Charcoal */
		--tape-light: #f4f1de; /* Cream Paper */
		--tape-muted: #a0998a; /* Warm Gray */
	}

	.construction-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		margin: 2rem auto;
		max-width: 500px;
	}

	.cassette-wrapper {
		animation: slight-wobble 5s ease-in-out infinite;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
	}

	.cassette {
		position: relative;
		width: 280px;
		height: 180px;
		margin: 0 auto;
		transition: transform 0.2s;
	}

	.cassette.pulse {
		animation: pulse 0.5s ease-in-out;
	}

	.cassette-body {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: var(--tape-primary);
		border-radius: 10px;
		box-shadow:
			inset 0 2px 0 rgba(255, 255, 255, 0.2),
			inset 0 -2px 0 rgba(0, 0, 0, 0.2);
		overflow: hidden;
		padding: 12px;
	}

	.label {
		background-color: var(--tape-light);
		height: 60px;
		width: 100%;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
		border: 1px solid var(--tape-muted);
		position: relative;
	}

	.tape-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		color: var(--tape-dark);
		font-size: 1.25rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Tape counter */
	.tape-counter {
		position: absolute;
		bottom: 6px;
		right: 10px;
		background-color: var(--tape-dark);
		border-radius: 3px;
		padding: 1px 4px;
		font-family: 'Courier New', monospace;
		font-size: 0.7rem;
	}

	.counter-display {
		color: var(--tape-accent);
		font-weight: bold;
	}

	.tape-window {
		margin-top: 12px;
		background-color: var(--tape-dark);
		border-radius: 4px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30px;
		position: relative;
	}

	.reel {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--tape-secondary);
		position: relative;
		border: 6px solid var(--tape-muted);
		overflow: hidden;
		cursor: grab;
		transition: transform 0.2s;
	}

	.reel:active {
		cursor: grabbing;
	}

	.reel-center {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 10px;
		height: 10px;
		background-color: var(--tape-dark);
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	/* Hover effects */
	.reel:hover {
		transform: scale(1.1) !important; /* Override inline transform */
	}

	.reel:active {
		transform: scale(0.95) !important; /* Override inline transform */
	}

	.reel::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 20px;
		height: 2px;
		background-color: var(--tape-dark);
		transform-origin: center;
	}

	.left-reel::before {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.right-reel::before {
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	.tape-line {
		position: absolute;
		height: 3px;
		width: 60%;
		background-color: var(--tape-accent);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		border-radius: 2px;
		opacity: 0.8;
		transition: width 0.5s ease-out;
	}

	.tape-details {
		margin-top: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tape-text {
		font-family: 'Work Sans', sans-serif;
		color: var(--tape-light);
		font-size: 0.875rem;
		font-style: italic;
	}

	.tape-notches {
		display: flex;
		gap: 8px;
	}

	.notch {
		width: 12px;
		height: 12px;
		background-color: var(--tape-dark);
		border-radius: 50%;
	}

	/* Progress indicator */
	.progress-section {
		margin-top: 2rem;
		width: 100%;
		max-width: 280px;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background-color: var(--tape-secondary);
		border-radius: 4px;
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		position: relative;
		margin-bottom: 1rem;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--tape-accent);
		border-radius: 4px;
		transition: width 0.5s ease;
		position: relative;
		overflow: hidden;
	}

	.progress-pulse {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 30px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		animation: progress-pulse 1.5s ease-in-out infinite;
	}

	.progress-percentage {
		position: absolute;
		right: 0;
		top: -18px;
		font-size: 0.75rem;
		color: var(--tape-dark);
		font-weight: bold;
	}

	.phase-indicator {
		display: flex;
		justify-content: space-between;
		gap: 4px;
		margin-bottom: 1rem;
	}

	.phase-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		position: relative;
		opacity: 0.5;
		transition: all 0.3s ease;
	}

	.phase-step.active {
		opacity: 1;
		transform: translateY(-2px);
	}

	.phase-step.completed {
		opacity: 0.8;
	}

	.step-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(--tape-muted);
		margin-bottom: 0.5rem;
		transition: all 0.3s ease;
	}

	.phase-step.completed .step-dot {
		background-color: var(--tape-primary);
	}

	.phase-step.active .step-dot {
		background-color: var(--tape-accent);
		box-shadow: 0 0 0 3px rgba(221, 185, 103, 0.3);
	}

	.step-label {
		font-size: 0.65rem;
		text-align: center;
		white-space: nowrap;
		font-weight: 600;
		color: var(--tape-dark);
	}

	.click-helper {
		margin-top: 1rem;
		text-align: center;
	}

	.helper-text {
		font-size: 0.875rem;
		color: var(--tape-muted);
		font-style: italic;
		margin: 0;
	}

	/* Chinese tip */
	.chinese-tip {
		margin-top: 1.5rem;
		animation: fade-in 0.5s ease;
		background-color: var(--tape-light);
		padding: 12px;
		border-radius: 8px;
		border-left: 4px solid var(--tape-accent);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.tip-text {
		font-size: 0.9rem;
		color: var(--tape-dark);
		margin: 0;
		line-height: 1.4;
	}

	/* Animations */
	@keyframes slight-wobble {
		0%,
		100% {
			transform: rotate(-1deg);
		}
		50% {
			transform: rotate(1deg);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.03);
		}
	}

	@keyframes progress-pulse {
		0%,
		100% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(100%);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.construction-container {
			padding: 1rem;
		}

		.cassette {
			width: 240px;
			height: 160px;
		}

		.tape-title {
			font-size: 1rem;
		}

		.tape-text {
			font-size: 0.75rem;
		}

		.progress-section {
			max-width: 240px;
		}

		.phase-indicator {
			gap: 8px;
		}

		.step-label {
			font-size: 0.55rem;
		}

		.chinese-tip {
			padding: 10px;
		}

		.tip-text {
			font-size: 0.8rem;
		}
	}
</style>
