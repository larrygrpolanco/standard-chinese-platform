<!-- src/lib/components/UI/TapeConstruction.svelte (enhanced) -->
<script>
	// Props
	export let message = 'Under Construction';
	export let submessage = "We're recording more content";
	export let currentPhase = 'init'; // 'init', 'story', 'questions', 'formatting'
	export let isGenerating = false;

	// Interactive states
	let clickCounter = 0;
	let leftReelSpeed = 1;
	let rightReelSpeed = 1;
	let tapeProgress = 0;

	// Define generation phases
	const phases = [
		{ id: 'init', label: 'Initializing', percentage: 5 },
		{ id: 'story', label: 'Creating Story', percentage: 30 },
		{ id: 'questions', label: 'Generating Questions', percentage: 60 },
		{ id: 'formatting', label: 'Formatting Exercise', percentage: 100 }
	];

	// Get current phase info
	$: currentPhaseInfo = phases.find((p) => p.id === currentPhase) || phases[0];
	$: tapeProgress = currentPhaseInfo.percentage;

	// Handle reel interactions
	function handleLeftReelClick() {
		clickCounter++;
		leftReelSpeed = Math.min(leftReelSpeed + 0.5, 3);
		setTimeout(() => {
			leftReelSpeed = Math.max(leftReelSpeed - 0.5, 1);
		}, 2000);
	}

	function handleRightReelClick() {
		clickCounter++;
		rightReelSpeed = Math.min(rightReelSpeed + 0.5, 3);
		setTimeout(() => {
			rightReelSpeed = Math.max(rightReelSpeed - 0.5, 1);
		}, 2000);
	}

	// Interactive feedback messages
	$: clickMessage =
		clickCounter > 10
			? 'Winding faster! Keep going!'
			: clickCounter > 5
				? 'The tape is moving faster now!'
				: clickCounter > 0
					? 'That helps!'
					: 'Click the reels to speed up recording';
</script>

<div class="construction-container">
	<div class="cassette-wrapper">
		<div class="cassette">
			<div class="cassette-body">
				<div class="label">
					<span class="tape-title">{message}</span>
				</div>
				<div class="tape-window">
					<div
						class="reel left-reel"
						style="animation-duration: {4 / leftReelSpeed}s"
						on:click={handleLeftReelClick}
						aria-label="Left reel"
					></div>
					<div class="tape-line" style="width: {40 + tapeProgress / 5}%;"></div>
					<div
						class="reel right-reel"
						style="animation-duration: {4 / rightReelSpeed}s"
						on:click={handleRightReelClick}
						aria-label="Right reel"
					></div>
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
			<div class="phase-indicator">
				{#each phases as phase}
					<div class="phase-step {phase.id === currentPhase ? 'active' : ''}">
						<div class="step-dot"></div>
						<span class="step-label">{phase.label}</span>
					</div>
				{/each}
			</div>

			<div class="progress-bar">
				<div class="progress-fill" style="width: {tapeProgress}%"></div>
			</div>

			<div class="click-helper">
				<p class="helper-text">{clickMessage}</p>
			</div>
		</div>
	{/if}
</div>

<style>
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
	}

	.cassette-body {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #c17c74; /* Terracotta */
		border-radius: 10px;
		box-shadow:
			inset 0 2px 0 rgba(255, 255, 255, 0.2),
			inset 0 -2px 0 rgba(0, 0, 0, 0.2);
		overflow: hidden;
		padding: 12px;
	}

	.label {
		background-color: #f4f1de; /* Cream Paper */
		height: 60px;
		width: 100%;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
		border: 1px solid #a0998a; /* Warm Gray */
	}

	.tape-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		color: #33312e; /* Charcoal */
		font-size: 1.25rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tape-window {
		margin-top: 12px;
		background-color: #33312e;
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
		background-color: #e8e5d7; /* Beige */
		position: relative;
		border: 6px solid #a0998a; /* Warm Gray */
		overflow: hidden;
		cursor: pointer; /* Show it's clickable */
		transition: transform 0.2s;
	}

	/* Add hover effect to indicate clickability */
	.reel:hover {
		transform: scale(1.1);
	}

	/* Add active state for feedback */
	.reel:active {
		transform: scale(0.95);
	}

	.reel::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 20px;
		height: 2px;
		background-color: #33312e;
		transform-origin: center;
	}

	.left-reel {
		animation: spin 4s linear infinite;
	}

	.left-reel::before {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.right-reel {
		animation: spin 4s linear infinite reverse;
	}

	.right-reel::before {
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	.tape-line {
		position: absolute;
		height: 3px;
		width: 60%;
		background-color: #ddb967; /* Gold */
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
		color: #f4f1de; /* Cream Paper */
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
		background-color: #33312e;
		border-radius: 50%;
	}

	/* Progress indicator styles */
	.progress-section {
		margin-top: 2rem;
		width: 100%;
		max-width: 280px; /* Match cassette width */
	}

	.phase-indicator {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.phase-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
		position: relative;
		opacity: 0.5;
		transition: opacity 0.3s;
	}

	.phase-step.active {
		opacity: 1;
	}

	.step-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: #a0998a; /* Warm Gray */
		margin-bottom: 0.5rem;
	}

	.phase-step.active .step-dot {
		background-color: #ddb967; /* Gold */
		box-shadow: 0 0 0 3px rgba(221, 185, 103, 0.3);
	}

	.step-label {
		font-size: 0.7rem;
		text-align: center;
		white-space: nowrap;
		font-weight: 600;
		color: #33312e;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background-color: #e8e5d7; /* Beige */
		border-radius: 4px;
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.progress-fill {
		height: 100%;
		background-color: #ddb967; /* Gold */
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	.click-helper {
		margin-top: 1rem;
		text-align: center;
	}

	.helper-text {
		font-size: 0.875rem;
		color: #a0998a; /* Warm Gray */
		font-style: italic;
		margin: 0;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes slight-wobble {
		0%,
		100% {
			transform: rotate(-1deg);
		}
		50% {
			transform: rotate(1deg);
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

		.step-label {
			font-size: 0.6rem;
		}
	}
</style>
