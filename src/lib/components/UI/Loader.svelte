<script>
	import { onMount, onDestroy } from 'svelte';

	// Props with defaults
	export let message = 'Loading tape...';

	// Animation states
	let counter = 0;
	let counterInterval;
	let dotsInterval;
	let loadingDots = '';
	let animationStage = 0; // 0: initial, 1: inserting, 2: playing
	let blinker = false;
	let blinkerInterval;

	// Initialize animations
	onMount(() => {
		// Start tape insertion after a short delay
		setTimeout(() => {
			animationStage = 1; // Start inserting

			// After insertion is complete, start playing
			setTimeout(() => {
				animationStage = 2;
			}, 1500); // Time for insertion animation
		}, 2000);

		// Digital counter animation
		counterInterval = setInterval(() => {
			counter = (counter + 1) % 1000;
		}, 200);

		// Animated dots
		dotsInterval = setInterval(() => {
			loadingDots = loadingDots.length >= 3 ? '' : loadingDots + '.';
		}, 350);

		// Blinker animation
		blinkerInterval = setInterval(() => {
			blinker = !blinker;
		}, 800);
	});

	onDestroy(() => {
		clearInterval(counterInterval);
		clearInterval(dotsInterval);
		clearInterval(blinkerInterval);
	});

	// Format counter display
	$: counterDisplay = counter.toString().padStart(3, '0');

	// Dynamic message based on animation stage
	$: displayMessage =
		animationStage === 0
			? 'Preparing tape...'
			: animationStage === 1
				? 'Inserting tape...'
				: message.replace(/\.+$/, '') + loadingDots;
</script>

<div class="loader-container" role="status" aria-live="polite">
	<!-- Cassette player visualization -->
	<div class="cassette-player">
		<div class="player-texture"></div>

		<!-- Cassette slot -->
		<div class="cassette-slot">
			<!-- Slot backdrop -->
			<div class="slot-backdrop"></div>

			<!-- Cassette window -->
			<div class="slot-window">
				<!-- The cassette itself -->
				<div
					class="cassette"
					class:cassette-outside={animationStage === 0}
					class:cassette-inserting={animationStage === 1}
					class:cassette-loaded={animationStage === 2}
				>
					<div class="cassette-label">
						<span class="cassette-text">{displayMessage}</span>
					</div>
					<div class="cassette-detail-line"></div>
				</div>
			</div>

			<!-- Loading mechanism indicators -->
			<div class="mechanism-indicators">
				<div class="loading-indicator left" class:active={animationStage === 2}></div>
				<div class="loading-indicator right" class:active={animationStage === 2}></div>
			</div>
		</div>

		<!-- Player controls -->
		<div class="player-controls">
			<!-- Transport buttons -->
			<div class="transport-buttons">
				<button class="control-button play-button" class:active={animationStage === 2}>
					<div class="play-icon"></div>
				</button>

				<button class="control-button stop-button">
					<div class="stop-icon"></div>
				</button>

				<button class="control-button ff-button">
					<div class="ff-icon"></div>
				</button>
			</div>

			<!-- Indicators and counter -->
			<div class="indicator-panel">
				<div class="counter-display">
					<span class="counter-text">{counterDisplay}</span>
					<div class="display-flicker"></div>
				</div>

				<div class="indicator-lights">
					<div class="indicator-light green" class:glowing={animationStage > 0}></div>
					<div class="indicator-light red" class:blinking={blinker && animationStage === 2}></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Screen reader text -->
	<span class="sr-only">Loading content, please wait</span>
</div>

<style>
	/* Container styles */
	.loader-container {
		display: flex;
		min-height: 180px;
		width: 100%;
		max-width: 300px;
		margin: 0 auto;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		font-family: 'Work Sans', sans-serif;
	}

	/* Cassette player styles */
	.cassette-player {
		position: relative;
		height: 130px;
		width: 100%;
		margin-bottom: 1rem;
		border: 1px solid #a0998a;
		border-radius: 6px;
		background: linear-gradient(145deg, #c17c74, #a46962);
		box-shadow:
			0 4px 12px rgba(51, 49, 46, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		overflow: hidden;
	}

	.player-texture {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23A0998A' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H0V0z'/%3E%3Cpath d='M6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
		/* opacity: 0.8; */
	}

	/* Cassette slot area */
	.cassette-slot {
		position: relative;
		margin: 0.75rem auto 0;
		display: flex;
		height: 70px;
		width: 90%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		background-color: #2a2622; /* Darker shade of Charcoal */
		box-shadow:
			inset 0 2px 6px rgba(0, 0, 0, 0.4),
			inset 0 0 0 1px rgba(0, 0, 0, 0.3);
	}

	/* Slot backdrop - the dark overall slot appearance */
	.slot-backdrop {
		position: absolute;
		inset: 0;
		background-color: #2a2622; /* Darker shade of Charcoal */
		z-index: 1;
	}

	/* Slot window - this is the viewing area */
	.slot-window {
		position: absolute;
		top: 14px;
		left: 50%;
		transform: translateX(-50%);
		width: 78%;
		height: 38px;
		background-color: #252220;
		border-radius: 3px;
		box-shadow:
			inset 0 0 5px rgba(0, 0, 0, 0.5),
			inset 0 0 0 1px rgba(0, 0, 0, 0.4);
		z-index: 2;
		overflow: hidden; /* This is key - hides cassette parts outside the window */
	}

	/* The cassette itself */
	.cassette {
		position: absolute;
		height: 38px;
		width: 100%;
		border-radius: 3px;
		background-color: #e8e5d7; /* Beige from our palette */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		transition: transform 1500ms cubic-bezier(0.16, 1, 0.3, 1);
		z-index: 2;
	}

	.cassette-outside {
		transform: translateY(-100px); /* Initially outside the slot */
	}

	.cassette-inserting {
		transform: translateY(-10px); /* Partially inserted */
	}

	.cassette-loaded {
		transform: translateY(0); /* Fully inserted, centered in window */
	}

	/* Cassette details */
	.cassette-label {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80%;
		height: 60%;
		background-color: #f4f1de; /* Cream Paper */
		border-radius: 2px;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
	}

	.cassette-text {
		font-family: 'Courier New', monospace;
		font-size: 0.7rem;
		color: #33312e; /* Charcoal */
		text-align: center;
		max-width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cassette-detail-line {
		position: absolute;
		left: 50%;
		bottom: 5px;
		transform: translateX(-50%);
		width: 60%;
		height: 3px;
		background-color: rgba(160, 153, 138, 0.4); /* Warm Gray with transparency */
		border-radius: 1px;
	}

	/* Loading mechanism indicators */
	.mechanism-indicators {
		position: absolute;
		bottom: 10px;
		display: flex;
		justify-content: space-between;
		width: 50%;
		z-index: 6;
	}

	.loading-indicator {
		height: 4px;
		width: 4px;
		border-radius: 50%;
		background-color: #a0998a; /* Warm Gray */
		transition: all 0.3s ease;
	}

	.loading-indicator.active {
		background-color: #ddb967; /* Gold */
		box-shadow: 0 0 5px #ddb967; /* Gold glow */
	}

	/* Player controls section */
	.player-controls {
		margin: 1rem 1rem 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* Transport buttons */
	.transport-buttons {
		display: flex;
		gap: 8px;
	}

	.control-button {
		position: relative;
		height: 22px;
		width: 22px;
		cursor: pointer;
		border: none;
		border-radius: 4px;
		background: linear-gradient(to bottom, #3e3b38, #33312e); /* Charcoal gradient */
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		transition: all 0.2s ease;
	}

	.control-button:hover {
		background: linear-gradient(to bottom, #474340, #38352f); /* Slightly lighter */
	}

	.control-button.active {
		background: linear-gradient(to bottom, #2a2825, #33312e); /* Pressed state */
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	/* Button icons */
	.play-icon {
		position: absolute;
		left: 55%;
		top: 50%;
		height: 0;
		width: 0;
		transform: translate(-50%, -50%);
		border-style: solid;
		border-width: 5px 0 5px 8px;
		border-color: transparent transparent transparent #ddb967; /* Gold */
	}

	.stop-icon {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 8px;
		width: 8px;
		transform: translate(-50%, -50%);
		background-color: #c17c74; /* Terracotta */
	}

	.ff-icon {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 8px;
		width: 8px;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
	}

	.ff-icon::before,
	.ff-icon::after {
		content: '';
		position: absolute;
		height: 0;
		width: 0;
		border-style: solid;
		border-width: 4px 0 4px 6px;
		border-color: transparent transparent transparent #7d8c5c; /* Green */
	}

	.ff-icon::before {
		left: -1px;
	}

	.ff-icon::after {
		left: 4px;
	}

	/* Counter and indicator panel */
	.indicator-panel {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
	}

	.counter-display {
		position: relative;
		padding: 0.15rem 0.4rem;
		border-radius: 3px;
		background-color: #252220; /* Darker Charcoal */
		border: 1px solid rgba(0, 0, 0, 0.4);
		overflow: hidden;
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.4),
			inset 0 0 0 1px rgba(0, 0, 0, 0.2);
	}

	.counter-text {
		position: relative;
		z-index: 10;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		font-weight: bold;
		letter-spacing: 0.1em;
		color: #ddb967; /* Gold */
		text-shadow: 0 0 4px rgba(221, 185, 103, 0.5); /* Gold glow */
	}

	.display-flicker {
		position: absolute;
		inset: 0;
		background-color: rgba(255, 255, 255, 0.1);
		opacity: 0;
		animation: flicker 8s infinite;
	}

	/* Indicator lights */
	.indicator-lights {
		display: flex;
		gap: 8px;
	}

	.indicator-light {
		height: 6px;
		width: 6px;
		border-radius: 50%;
		transition: all 0.3s ease;
	}

	.indicator-light.green {
		background-color: #33312e; /* Charcoal */
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.4);
	}

	.indicator-light.green.glowing {
		background-color: #7d8c5c; /* Green */
		box-shadow:
			0 0 5px #7d8c5c,
			/* Green glow */ inset 0 0 2px rgba(255, 255, 255, 0.5);
	}

	.indicator-light.red {
		background-color: #33312e; /* Charcoal */
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.4);
	}

	.indicator-light.red.blinking {
		background-color: #c17c74; /* Terracotta */
		box-shadow:
			0 0 5px #c17c74,
			/* Terracotta glow */ inset 0 0 2px rgba(255, 255, 255, 0.5);
	}

	/* Animations */
	@keyframes flicker {
		0%,
		95%,
		100% {
			opacity: 0;
		}
		96%,
		99% {
			opacity: 0.3;
		}
	}

	/* Accessibility */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
