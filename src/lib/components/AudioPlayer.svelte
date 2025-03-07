<!-- src/lib/components/AudioPlayer.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	// Props
	export let audioSrc = '';
	export let title = '';
	export let sync = null; // Reference to another audio player to sync with

	// Audio element and state
	let audio;
	let duration = 0;
	let currentTime = 0;
	let playing = false;
	let playbackRate = 1;
	let loaded = false;

	// Format seconds to MM:SS
	function formatTime(seconds) {
		if (!seconds || isNaN(seconds)) return '00:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	// Toggle play/pause
	function togglePlay() {
		if (playing) {
			audio.pause();
		} else {
			audio.play();
		}
		playing = !playing;
	}

	// Change playback speed
	function setPlaybackRate(rate) {
		playbackRate = rate;
		if (audio) audio.playbackRate = rate;
	}

	// Handle seeking
	function handleSeek(e) {
		if (audio) {
			audio.currentTime = e.target.value;
			currentTime = e.target.value;
		}
	}

	// Setup event listeners
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

	// Cleanup
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
			<div class="cassette-label">{title}</div>
		{/if}

		<!-- Cassette visualization -->
		<div class="cassette-tape">
			<div class="spool-container">
				<div class="tape-spool left-spool" class:spinning={playing}>
					<div class="spool-center"></div>
					<div class="spool-line"></div>
				</div>
				<div class="tape-line" class:moving={playing}></div>
				<div class="tape-spool right-spool" class:spinning={playing}>
					<div class="spool-center"></div>
					<div class="spool-line"></div>
				</div>
			</div>

			<!-- Counter display -->
			<div class="counter-display">
				<span>{formatTime(currentTime)}</span>
				<span class="counter-divider">/</span>
				<span>{formatTime(duration)}</span>
			</div>
		</div>

		<!-- Controls -->
		<div class="player-controls">
			<!-- Play button -->
			<button
				on:click={togglePlay}
				class="play-button"
				aria-label={playing ? 'Pause' : 'Play'}
				disabled={!loaded}
			>
				{#if playing}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<rect x="6" y="4" width="4" height="16" rx="1"></rect>
						<rect x="14" y="4" width="4" height="16" rx="1"></rect>
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M8 5.14v14l11-7-11-7z"></path>
					</svg>
				{/if}
			</button>

			<!-- Progress bar -->
			<div class="progress-bar">
				<input
					type="range"
					min="0"
					max={duration || 100}
					bind:value={currentTime}
					on:input={handleSeek}
					disabled={!loaded}
					aria-label="Seek audio position"
				/>
				<div
					class="progress-indicator"
					style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
				></div>
			</div>

			<!-- Playback speed -->
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
	.audio-cassette-player {
		font-family: 'Work Sans', sans-serif;
		background-color: var(--color-beige, #e8e5d7);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		padding: 12px;
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
	}

	.cassette-body {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* Cassette label */
	.cassette-label {
		font-size: 0.875rem;
		font-weight: 600;
		text-align: center;
		color: var(--color-charcoal, #33312e);
		background-color: #f9f7f0;
		border: 1px dashed var(--color-warm-gray, #a0998a);
		padding: 4px 8px;
		margin-bottom: 4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Cassette visualization */
	.cassette-tape {
		background-color: rgba(0, 0, 0, 0.03);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 6px;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.spool-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		position: relative;
	}

	.tape-spool {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 2px solid var(--color-charcoal, #33312e);
		position: relative;
	}

	.spool-center {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		background-color: var(--color-charcoal, #33312e);
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.spool-line {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: var(--color-charcoal, #33312e);
		transform: translateY(-50%);
	}

	.tape-line {
		position: absolute;
		top: 50%;
		left: 50px;
		right: 50px;
		height: 2px;
		background-color: var(--color-charcoal, #33312e);
		transform: translateY(-50%);
	}

	.tape-line.moving {
		background: repeating-linear-gradient(
			90deg,
			var(--color-charcoal, #33312e),
			var(--color-charcoal, #33312e) 8px,
			transparent 8px,
			transparent 12px
		);
		background-size: 20px 100%;
		animation: tape-move 2s infinite linear;
	}

	.spinning {
		animation: spin 3s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes tape-move {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 20px 0;
		}
	}

	/* Counter display */
	.counter-display {
		font-family: 'Courier New', monospace;
		text-align: center;
		background-color: var(--color-charcoal, #33312e);
		color: var(--color-gold, #ddb967);
		padding: 6px 10px;
		border-radius: 4px;
		font-size: 0.9rem;
		letter-spacing: 1px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 6px;
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

	/* Play button */
	.play-button {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background-color: var(--color-terracotta, #c17c74);
		color: white;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 0.1s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.play-button:hover {
		background-color: #b06c66;
	}

	.play-button:active {
		transform: scale(0.95);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
		height: 16px;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		overflow: hidden;
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
		background-color: var(--color-gold, #ddb967);
		z-index: 1;
		transition: width 0.1s linear;
	}

	/* Speed control */
	.speed-control select {
		-webkit-appearance: none;
		appearance: none;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 4px;
		padding: 4px 24px 4px 8px;
		font-size: 0.875rem;
		color: var(--color-charcoal, #33312e);
		cursor: pointer;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2333312E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 8px center;
		background-size: 10px;
	}

	/* Responsive adjustments */
	@media (max-width: 400px) {
		.audio-cassette-player {
			padding: 8px;
		}

		.tape-spool {
			width: 32px;
			height: 32px;
		}

		.tape-line {
			left: 40px;
			right: 40px;
		}

		.play-button {
			width: 36px;
			height: 36px;
		}

		.play-button svg {
			width: 20px;
			height: 20px;
		}

		.speed-control select {
			padding: 3px 20px 3px 6px;
			font-size: 0.75rem;
		}
	}
</style>
