<!-- src/lib/components/AudioPlayer.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	// Props
	export let audioSrc = '';
	export let title = '';

	// Audio element and state
	let audio;
	let duration = 0;
	let currentTime = 0;
	let playing = false;
	let playbackRate = 1;
	let loaded = false;
	let scrubbing = false;
	let playAfterScrub = false;

	// Visual tape state
	$: tapeProgress = duration > 0 ? currentTime / duration : 0;
	$: leftSpoolPercent = 100 - tapeProgress * 80; // Start at 100%, end at 20%
	$: rightSpoolPercent = 20 + tapeProgress * 80; // Start at 20%, end at 100%

	// Animation control variables
	let leftRotationSpeed = '3s';
	let rightRotationSpeed = '3s';
	let tapeAnimationDuration = 2; // in seconds
	let isMovingForward = true; // Flag to determine tape movement direction

	/**
	 * Format seconds to MM:SS display format
	 * @param {number} seconds - Time in seconds
	 * @returns {string} Formatted time as MM:SS
	 */
	function formatTime(seconds) {
		if (!seconds || isNaN(seconds)) return '00:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	/**
	 * Toggle audio playback state
	 */
	function togglePlay() {
		if (playing) {
			audio.pause();
		} else {
			audio.play();
			isMovingForward = true; // During normal playback, tape always moves forward
		}
		playing = !playing;
	}

	/**
	 * Update audio playback speed
	 * @param {number} rate - Playback rate (0.75, 1, 1.25, etc.)
	 */
	function setPlaybackRate(rate) {
		playbackRate = rate;
		if (audio) audio.playbackRate = rate;
	}

	/**
	 * Handle seeking when user moves the progress slider
	 * @param {Event} e - Input event
	 */
	function handleSeek(e) {
		if (audio) {
			const newTime = parseFloat(e.target.value);
			const prevTime = currentTime;

			// Determine direction and speed for animation
			if (newTime !== prevTime) {
				// Update movement direction flag based on scrub direction
				isMovingForward = newTime > prevTime;

				// Set animation speed based on scrubbing intensity
				const difference = Math.abs(newTime - prevTime);
				tapeAnimationDuration = difference > 3 ? 0.5 : difference > 0.5 ? 1 : 2;

				// Set rotation speed based on scrubbing direction
				leftRotationSpeed = isMovingForward ? '0.5s' : '0.3s';
				rightRotationSpeed = isMovingForward ? '0.3s' : '0.5s';
			}

			audio.currentTime = newTime;
			currentTime = newTime;
		}
	}

	/**
	 * Initialize scrubbing state
	 */
	function startScrubbing() {
		if (playing) {
			playAfterScrub = true;
			audio.pause();
		}
		scrubbing = true;
		// Direction will be determined when the user actually drags
	}

	/**
	 * End scrubbing and restore previous playback state if needed
	 */
	function endScrubbing() {
		if (playAfterScrub) {
			audio.play();
			playing = true;
			isMovingForward = true; // Reset to forward for normal playback
		}
		scrubbing = false;
		playAfterScrub = false;

		// Reset animation properties for normal playback
		tapeAnimationDuration = 2;

		// Reset rotation speeds
		leftRotationSpeed = '3s';
		rightRotationSpeed = '3s';
	}

	// Setup event listeners when component mounts
	onMount(() => {
		if (audio) {
			audio.addEventListener('timeupdate', () => {
				currentTime = audio.currentTime;
			});

			audio.addEventListener('loadedmetadata', () => {
				duration = audio.duration;
				loaded = true;
			});

			audio.addEventListener('ended', () => {
				playing = false;
			});
		}
	});

	// Cleanup resources when component is destroyed
	onDestroy(() => {
		if (audio) {
			audio.pause();
		}
	});
</script>

<div class="audio-cassette-player">
	<!-- Hidden audio element -->
	<audio bind:this={audio} src={audioSrc} preload="metadata"></audio>

	<div class="cassette-body">
		<!-- Title bar / cassette label -->
		{#if title}
			<div class="cassette-label">
				<div class="label-text">{title}</div>
			</div>
		{/if}

		<!-- Cassette visualization -->
		<div class="cassette-tape">
			<div class="cassette-window">
				<div class="spool-container">
					<!-- Left tape spool -->
					<div
						class="tape-spool left-spool"
						class:spinning={playing && !scrubbing}
						class:fast-spinning={scrubbing}
						style="--rotation-duration: {leftRotationSpeed}; --tape-fill: {leftSpoolPercent}%;"
					>
						<div class="spool-center"></div>
						<div class="spool-hole"></div>
						<div class="spool-tape"></div>
					</div>

					<!-- Tape path visualization -->
					<div class="tape-path">
						<div class="tape-top"></div>
						<div class="tape-roller tape-roller-left"></div>
						{#key isMovingForward + tapeAnimationDuration}
							<div
								class="tape-middle"
								class:move-left={(playing || scrubbing) && isMovingForward}
								class:move-right={(playing || scrubbing) && !isMovingForward}
								style="--tape-duration: {tapeAnimationDuration}s;"
							></div>
						{/key}
						<div class="tape-roller tape-roller-right"></div>
						<div class="tape-bottom"></div>
					</div>

					<!-- Right tape spool -->
					<div
						class="tape-spool right-spool"
						class:spinning={playing && !scrubbing}
						class:fast-spinning={scrubbing}
						style="--rotation-duration: {rightRotationSpeed}; --tape-fill: {rightSpoolPercent}%;"
					>
						<div class="spool-center"></div>
						<div class="spool-hole"></div>
						<div class="spool-tape"></div>
					</div>
				</div>
			</div>

			<!-- Counter display -->
			<div class="counter-display">
				<div class="counter-window">
					<span>{formatTime(currentTime)}</span>
					<span class="counter-divider">/</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="player-controls">
			<!-- Play button with mechanical styling -->
			<button
				on:click={togglePlay}
				class="play-button"
				class:pressed={playing}
				aria-label={playing ? 'Pause' : 'Play'}
				disabled={!loaded}
			>
				<div class="button-face">
					{#if playing}
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<rect x="7" y="6" width="3" height="12" rx="0.5"></rect>
							<rect x="14" y="6" width="3" height="12" rx="0.5"></rect>
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<polygon points="7,6 7,18 17,12" fill="currentColor"></polygon>
						</svg>
					{/if}
				</div>
			</button>

			<!-- Progress bar -->
			<div class="progress-bar">
				<input
					type="range"
					min="0"
					max={duration || 100}
					bind:value={currentTime}
					on:input={handleSeek}
					on:mousedown={startScrubbing}
					on:mouseup={endScrubbing}
					on:touchstart={startScrubbing}
					on:touchend={endScrubbing}
					disabled={!loaded}
					aria-label="Seek audio position"
				/>
				<div class="progress-track">
					<div
						class="progress-indicator"
						style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
					></div>
				</div>
			</div>

			<!-- Playback speed control -->
			<div class="speed-control">
				<select
					bind:value={playbackRate}
					on:change={() => setPlaybackRate(playbackRate)}
					aria-label="Playback speed"
				>
					<option value={0.75}>0.75×</option>
					<option value={1}>1×</option>
					<option value={1.25}>1.25×</option>
					<option value={1.5}>1.5×</option>
					<option value={2}>2×</option>
				</select>
			</div>
		</div>
	</div>
</div>

<style>
	/* Color variables from style guide */
	:root {
		--color-terracotta: #c17c74;
		--color-terracotta-hover: #ad6c66;
		--color-green: #7d8c5c;
		--color-gold: #ddb967;
		--color-navy: #34667f;
		--color-cream-paper: #f4f1de;
		--color-charcoal: #33312e;
		--color-beige: #e8e5d7;
		--color-warm-gray: #a0998a;
		--color-button-shadow: #826d5b;
	}

	/* Main container */
	.audio-cassette-player {
		font-family: 'Work Sans', sans-serif;
		background-color: var(--color-beige);
		border: 1px solid var(--color-warm-gray);
		border-radius: 8px;
		padding: 8px;
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
		box-shadow: 0 2px 8px rgba(51, 49, 46, 0.08);
	}

	.cassette-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		/* background-color: var(--color-cream-paper); */
        background-color: #c5b59051;
		border-radius: 6px;
		padding: 12px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	/* Cassette label */
	.cassette-label {
		position: relative;
		background-color: var(--color-gold);
		border-radius: 4px;
		padding: 2px;
		box-shadow: 0 1px 2px rgba(51, 49, 46, 0.15);
	}

	.label-text {
		background-color: white;
		font-size: 0.875rem;
		font-weight: 600;
		text-align: center;
		color: var(--color-charcoal);
		padding: 4px 8px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 3px;
		box-shadow: inset 0 1px 2px rgba(51, 49, 46, 0.05);
	}

	/* Cassette visualization */
	.cassette-tape {
		background-color: var(--color-beige);
		border: 1px solid var(--color-warm-gray);
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px;
		box-shadow: inset 0 1px 4px rgba(51, 49, 46, 0.1);
	}

	.cassette-window {
		background-color: var(--color-cream-paper);
		border-radius: 4px;
		border: 1px solid var(--color-warm-gray);
		padding: 12px 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.15);
	}

	.spool-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
		position: relative;
	}

	/* Tape spools */
	.tape-spool {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background-color: var(--color-charcoal);
		position: relative;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.spool-center {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 12px;
		height: 12px;
		background-color: var(--color-beige);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.spool-hole {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 4px;
		height: 4px;
		background-color: #000;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.spool-tape {
		position: absolute;
		top: 50%;
		left: 50%;
		width: var(--tape-fill, 50%);
		height: var(--tape-fill, 50%);
		background-color: var(--color-warm-gray);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		transition:
			width 0.2s ease,
			height 0.2s ease;
	}

	/* Tape path visualization */
	.tape-path {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: none;
	}

	.tape-top,
	.tape-bottom {
		height: 1px;
		background-color: var(--color-charcoal);
		margin: 7px 60px;
	}

	.tape-middle {
		height: 2px;
		background-color: var(--color-charcoal);
		margin: 0 62px;
		position: relative;
		top: 1px;
		transform: translateY(-50%);
		/* Base pattern for both directions */
		background: repeating-linear-gradient(
			90deg,
			var(--color-charcoal),
			var(--color-charcoal) 8px,
			transparent 8px,
			transparent 12px
		);
		background-size: 20px 100%;
	}

	/* Left-moving animation (forward playback) */
	.tape-middle.move-left {
		animation: tape-move-left var(--tape-duration, 2s) infinite linear;
	}

	/* Right-moving animation (backward playback/scrubbing) */
	.tape-middle.move-right {
		animation: tape-move-right var(--tape-duration, 2s) infinite linear;
	}

	@keyframes tape-move-left {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -20px 0;
		} /* Move left */
	}

	@keyframes tape-move-right {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 20px 0;
		} /* Move right */
	}

	.tape-roller {
		position: absolute;
		width: 6px;
		height: 12px;
		background-color: var(--color-warm-gray);
		border-radius: 2px;
		top: 50%;
		transform: translateY(-50%);
	}

	.tape-roller-left {
		left: 56px;
	}

	.tape-roller-right {
		right: 56px;
	}

	/* Spinning animations */
	.spinning {
		animation: spin var(--rotation-duration, 3s) linear infinite;
	}

	.fast-spinning {
		animation: spin var(--rotation-duration, 0.5s) linear infinite;
	}

	.left-spool.spinning,
	.left-spool.fast-spinning {
		animation-direction: reverse; /* Left spool spins counterclockwise */
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Counter display */
	.counter-display {
		width: 100%;
		padding: 0;
	}

	.counter-window {
		width: 100%;
		max-width: 250px;
		margin: 0 auto;
		font-family: 'Courier New', monospace;
		background-color: var(--color-charcoal);
		color: var(--color-gold);
		padding: 6px 8px;
		border-radius: 4px;
		font-size: 0.9rem;
		letter-spacing: 1px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 6px;
		box-shadow:
			inset 0 1px 4px rgba(0, 0, 0, 0.4),
			0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.counter-divider {
		opacity: 0.6;
	}

	/* Player controls */
	.player-controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	/* Play button with mechanical styling */
	.play-button {
		position: relative;
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		background: none;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		outline: none;
	}

	.play-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--color-beige);
		border-radius: 6px;
		box-shadow:
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 5px 0 0 var(--color-button-shadow),
			0 6px 4px rgba(0, 0, 0, 0.15);
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
		z-index: 0;
	}

	.play-button.pressed .button-face {
		transform: translateY(5px);
	}

	.play-button:active .button-face {
		transform: translateY(5px);
	}

	.button-face {
		position: relative;
		width: 38px;
		height: 38px;
		background-color: var(--color-terracotta);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			inset 0 1px 2px rgba(255, 255, 255, 0.3),
			inset 0 -1px 2px rgba(0, 0, 0, 0.2);
		z-index: 1;
		transition: transform 0.1s ease;
		color: white;
	}

	.play-button.pressed::before {
		transform: translateY(5px);
		box-shadow:
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 0 0 0 var(--color-button-shadow),
			0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.play-button:active::before {
		transform: translateY(5px);
		box-shadow:
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 0 0 0 var(--color-button-shadow),
			0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.play-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.play-button svg {
		width: 24px;
		height: 24px;
		fill: currentColor;
	}

	/* Progress bar */
	.progress-bar {
		position: relative;
		flex-grow: 1;
		height: 20px;
	}

	.progress-track {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 12px;
		background-color: var(--color-beige);
		border: 1px solid var(--color-warm-gray);
		border-radius: 2px;
		transform: translateY(-50%);
		overflow: hidden;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.progress-bar input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
		z-index: 2;
	}

	.progress-bar input:disabled {
		cursor: not-allowed;
	}

	.progress-indicator {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background-color: var(--color-gold);
		background-image: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.2) 0%,
			rgba(255, 255, 255, 0) 100%
		);
		transition: width 0.1s linear;
	}

	/* Speed control */
	.speed-control select {
		-webkit-appearance: none;
		appearance: none;
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 4px;
		padding: 6px 28px 6px 10px;
		font-size: 0.875rem;
		color: var(--color-charcoal);
		cursor: pointer;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2333312E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 8px center;
		background-size: 10px;
		box-shadow:
			inset 0 1px 2px rgba(0, 0, 0, 0.05),
			0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.speed-control select:hover {
		border-color: var(--color-charcoal);
	}

	/* Responsive adjustments */
	@media (max-width: 400px) {
		.audio-cassette-player {
			padding: 10px;
		}

		.cassette-body {
			padding: 8px;
			gap: 12px;
		}

		.cassette-tape {
			padding: 8px;
		}

		.cassette-window {
			padding: 8px 6px;
		}

		.tape-spool {
			width: 36px;
			height: 36px;
		}

		.spool-center {
			width: 10px;
			height: 10px;
		}

		.tape-top,
		.tape-bottom {
			margin: 6px 50px;
		}

		.tape-middle {
			margin: 0 50px;
		}

		.tape-roller-left {
			left: 46px;
		}

		.tape-roller-right {
			right: 46px;
		}

		.play-button {
			width: 42px;
			height: 42px;
		}

		.button-face {
			width: 34px;
			height: 34px;
		}

		.play-button svg {
			width: 20px;
			height: 20px;
		}

		.counter-window {
			font-size: 0.85rem;
			letter-spacing: 0.5px;
			padding: 5px 6px;
		}

		.speed-control select {
			padding: 4px 22px 4px 8px;
			font-size: 0.75rem;
		}
	}
</style>
