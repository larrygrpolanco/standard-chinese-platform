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
		if (!loaded) return;

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
	 */
	function setPlaybackRate(rate) {
		playbackRate = rate;
		if (audio) audio.playbackRate = rate;
	}

	/**
	 * Handle seeking when user moves the progress slider
	 */
	function handleSeek(e) {
		if (audio) {
			const newTime = parseFloat(e.target.value);
			const prevTime = currentTime;

			// Determine direction and speed for animation
			if (newTime !== prevTime) {
				isMovingForward = newTime > prevTime;
				const difference = Math.abs(newTime - prevTime);
				tapeAnimationDuration = difference > 3 ? 0.5 : difference > 0.5 ? 1 : 2;
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
		leftRotationSpeed = '3s';
		rightRotationSpeed = '3s';
	}

	/**
	 * Prevent event propagation for controls within the cassette
	 */
	function handleControlClick(e) {
		e.stopPropagation();
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

		<!-- Cassette visualization - now clickable with mechanical styling -->
		<div
			class="cassette-tape"
			class:pressed={playing}
			class:disabled={!loaded}
			on:click={togglePlay}
			role="button"
			tabindex="0"
			aria-label={playing ? 'Pause audio' : 'Play audio'}
			on:keydown={(e) => e.key === ' ' && togglePlay()}
		>
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

					<!-- Tape path visualization with integrated play button -->
					<div class="tape-path">
						<div class="tape-top"></div>
						<div class="tape-roller tape-roller-left"></div>

						<!-- Integrated play button face -->
						<div class="play-button-face">
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

		<!-- Controls (without play button now) -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="player-controls" on:click|stopPropagation>
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
					<!-- Add tick marks like on old hardware -->
					<div class="tick-marks">
						{#each Array(20) as _, i}
							<div class="tick-mark" style="left: {i * 5}%"></div>
						{/each}
					</div>
					<div
						class="progress-indicator"
						style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
					></div>
					<!-- Add visible slider head -->
					<div
						class="slider-knob"
						style="left: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
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
					<option value={0.7}>70%</option>
					<option value={0.8}>80%</option>
					<option value={0.9}>90%</option>
					<option value={1}>100%</option>
					<option value={1.2}>120%</option>
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
		box-shadow:
			2px 2px 0 rgba(0, 0, 0, 0.2),
			0 4px 6px rgba(51, 49, 46, 0.15),
			inset 1px 1px 0 rgba(255, 255, 255, 0.2);
	}

	.cassette-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background-color: var(--color-beige);
		border-radius: 6px;
		padding: 12px;
		box-shadow: inset 1px 1px 3px 0 rgba(51, 49, 46, 0.1);
	}

	/* Cassette label */
	.cassette-label {
		position: relative;
		background-color: var(--color-gold);
		border-radius: 4px;
		padding: 2px;
		box-shadow: 0 1px 2px rgba(51, 49, 46, 0.15);
		margin-bottom: 4px;
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

	/* Cassette visualization - with mechanical styling */
	.cassette-tape {
		position: relative;
		/* background-color: var(--color-beige); */
		/* background-color: #e6cc91; */
		background-image: radial-gradient(circle, #ffeeca, #f9e5bc, #f3ddad, #ecd49f, #e6cc91);
		border: 1px solid var(--color-warm-gray);
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px;
		cursor: pointer;
		/* Apply mechanical styling */
		box-shadow:
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 5px 0 0 var(--color-button-shadow),
			0 6px 4px rgba(0, 0, 0, 0.15);
		transform: translateY(0);
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.cassette-tape:hover {
		/* background-image: radial-gradient(circle, #e8e5d7, #e6dfc5, #e6d9b4, #e5d3a2, #e6cc91); */
	}

	.cassette-tape:active,
	.cassette-tape.pressed {
		transform: translateY(5px);
		/* background-color: #ddb967; */
		background-image: radial-gradient(circle, #e8e5d7, #e6dfc5, #e6d9b4, #e5d3a2, #e6cc91);
		box-shadow:
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 0 0 0 var(--color-button-shadow),
			0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.cassette-tape.disabled {
		opacity: 0.6;
		cursor: not-allowed;
		pointer-events: none;
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

	/* Integrated play button face */
	.play-button-face {
		position: absolute;
		width: 51.777px;
		height: 32px;
		background-color: var(--color-terracotta);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			inset 0 1px 2px rgba(255, 255, 255, 0.3),
			inset 0 -1px 2px rgba(0, 0, 0, 0.2);
		z-index: 1;
		color: white;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition:
			transform 0.1s ease,
			background-color 0.1s ease;
	}

	.cassette-tape:active .play-button-face,
	.cassette-tape.pressed .play-button-face {
		transform: translate(-50%, -45%);
		background-color: var(--color-terracotta-hover);
	}

	.play-button-face svg {
		width: 24px;
		height: 24px;
		fill: currentColor;
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
		margin-top: 8px;
	}

	/* Progress bar */
	/* Progress bar - taller and more mechanical */
	.progress-bar {
		position: relative;
		flex-grow: 1;
		height: 36px; /* Taller for easier interaction */
	}

	.progress-track {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 22px; /* Significantly taller */
		background-color: #e0ddd0;
		/* Add subtle "grooved" texture */
		background-image: repeating-linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.02),
			rgba(0, 0, 0, 0.02) 1px,
			transparent 1px,
			transparent 5px
		);
		border: 1px solid var(--color-warm-gray);
		border-radius: 3px;
		transform: translateY(-50%);
		overflow: visible; /* Allow knob to extend outside */
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.2),
			inset 0 -1px 0 rgba(255, 255, 255, 0.5);
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

	/* Make the progress indicator look more vintage */
	.progress-indicator {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background-color: var(--color-gold);
		background-image: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.3) 0%,
			rgba(255, 255, 255, 0) 50%,
			rgba(0, 0, 0, 0.1) 100%
		);
		transition: width 0.1s linear;
		border-radius: 0 2px 2px 0;
	}

	/* Tick marks for that analog feeling */
	.tick-marks {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	.tick-mark {
		position: absolute;
		top: 0;
		height: 100%;
		width: 1px;
		background-color: rgba(51, 49, 46, 0.1);
	}
	/* Add a physical slider knob like on real equipment */
	.slider-knob {
		position: absolute;
		top: 50%;
		width: 10px;
		height: 30px; /* Taller than the track */
		background-color: #a8a196; /* Metallic look */
		background-image: linear-gradient(
			to right,
			rgba(255, 255, 255, 0.4) 0%,
			rgba(255, 255, 255, 0.2) 40%,
			rgba(0, 0, 0, 0.2) 60%,
			rgba(0, 0, 0, 0.4) 100%
		);
		border: 1px solid #706a61;
		border-radius: 2px;
		transform: translate(-50%, -50%);
		z-index: 3;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.2),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		transition: all 0.05s ease;
	}

	/* Give visual feedback when dragging */
	input:active ~ .progress-track .slider-knob {
		background-color: #bfb7a7;
		transform: translate(-50%, -48%); /* Slight pushed down effect */
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1);
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

	.speed-control select {
		padding: 4px 22px 4px 8px;
		font-size: 0.75rem;
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

		.tape-roller-left {
			left: 46px;
		}

		.tape-roller-right {
			right: 46px;
		}

		.play-button-face {
			width: 28px;
			height: 28px;
		}

		.play-button-face svg {
			width: 20px;
			height: 20px;
		}

		.counter-window {
			font-size: 0.85rem;
			letter-spacing: 0.5px;
			padding: 5px 6px;
		}
	}
</style>
