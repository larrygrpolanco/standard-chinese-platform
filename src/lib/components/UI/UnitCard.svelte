<!-- src/lib/components/UnitCard.svelte -->
<script>
	export let unit;
	export let index;
	export let isCompleted = false;

	// Generate colors based on unit number to keep consistency
	function getUnitColors(unitNumber) {
		const colors = [
			{ border: '#C17C74', bg: '#F8EBE8', accent: '#C17C74' }, // Terracotta
			{ border: '#7D8C5C', bg: '#EBEEE7', accent: '#7D8C5C' }, // Avocado
			{ border: '#DDB967', bg: '#F9F4E8', accent: '#DDB967' }, // Gold
			{ border: '#34667F', bg: '#EAF0F3', accent: '#34667F' } // Navy
		];
		return colors[(unitNumber - 1) % colors.length];
	}

	const colors = getUnitColors(unit.id);

	// Colors for completion status
	const notCompletedColor = '#A0998A'; // Grey terracotta
	const completedColor = '#7D8C5C'; // Muted avocado
</script>

<a
	href="/units/{unit.id}"
	class="unit-card"
	style="box-shadow: inset 0 1px 10px rgba(255, 255, 255, 0.3), 1px 1px 0 #826D5B;"
	aria-label="Unit {unit.id}: {unit.title} - {isCompleted ? 'Complete' : 'Ready'}"
>
	<!-- Left color bar with unit number (styled as cassette spine) -->
	<div class="unit-number-container" style="background-color: {colors.bg};">
		<!-- Cassette tape texture pattern -->
		<div class="tape-texture"></div>

		<!-- Scan line animation (matches retro theme) -->
		<div class="scan-line"></div>

		<span class="unit-number">{unit.id}</span>
	</div>

	<div class="content-container">
		<!-- Title and description section -->
		<div class="title-description-container">
			<div class="title-description-inner">
				<h3 class="unit-title">
					{unit.title}
				</h3>

				<!-- Unit description -->
				{#if unit.description}
					<p class="unit-description">
						{unit.description}
					</p>
				{/if}
			</div>
		</div>

		<!-- Enhanced cassette tape reel visual as completion indicator -->
		<div class="completion-indicator">
			<div class="reels-container">
				<!-- Left reel -->
				<div
					class="reel"
					style="background-color: {isCompleted ? completedColor : notCompletedColor}30;"
				>
					<!-- Inner reel detail -->
					<div class="reel-inner"></div>
					<!-- Rotation indicator line -->
					<div class="reel-rotation">
						<div
							class="reel-line"
							style="background-color: {isCompleted ? completedColor : notCompletedColor};"
						></div>
					</div>
				</div>

				<!-- Right reel -->
				<div
					class="reel"
					style="background-color: {isCompleted ? completedColor : notCompletedColor}30;"
				>
					<!-- Inner reel detail -->
					<div class="reel-inner"></div>
					<!-- Rotation indicator line (counter-rotation) -->
					<div class="reel-rotation reverse">
						<div
							class="reel-line"
							style="background-color: {isCompleted ? completedColor : notCompletedColor};"
						></div>
					</div>
				</div>
			</div>

			<!-- Status text -->
			<span class="status-text" style="color: {isCompleted ? completedColor : notCompletedColor};">
				{isCompleted ? 'Complete' : 'Ready'}
			</span>
		</div>
	</div>

	<!-- Side tape indicator (subtle design element) -->
	<div
		class="tape-indicator"
		style="background: repeating-linear-gradient(90deg, transparent, transparent 2px, {colors.accent}20 2px, {colors.accent}20 4px);"
	></div>
</a>

<style>
	/* Main card styling */
	.unit-card {
		position: relative;
		display: flex;
		height: 4rem;
		align-items: center;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 2px solid #33312e;
		background-color: #f4f1de;
		transition: all 0.2s;
	}

	.unit-card:hover {
		transform: translateY(-0.25rem);
		box-shadow: 3px 3px 0 #826d5b !important;
	}

	.unit-card:focus {
		outline: none;
		box-shadow:
			0 0 0 2px #ddb967,
			0 0 0 4px white;
	}

	/* Unit number container */
	.unit-number-container {
		position: relative;
		display: flex;
		height: 100%;
		width: 4rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-right: 2px solid #33312e;
	}

	.tape-texture {
		position: absolute;
		inset: 0;
		opacity: 0.1;
		background-image:
			linear-gradient(45deg, #33312e 25%, transparent 25%, transparent 75%, #33312e 75%, #33312e),
			linear-gradient(45deg, #33312e 25%, transparent 25%, transparent 75%, #33312e 75%, #33312e);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
	}

	.scan-line {
		position: absolute;
		top: 0;
		left: 0;
		height: 0.25rem;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		animation: scanDown 3s ease-in-out infinite;
	}

	.unit-number {
		position: relative;
		z-index: 10;
		font-family: 'Arvo', serif;
		font-size: 1rem;
		font-weight: bold;
		color: #33312e;
	}

	/* Content container */
	.content-container {
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: space-between;
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}

	.title-description-container {
		flex-grow: 1;
		padding-right: 0.5rem;
	}

	.title-description-inner {
		display: flex;
		flex-direction: column;
	}

	.unit-title {
		max-width: 200px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: 'Arvo', serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
		margin: 0;
	}

	.unit-card:hover .unit-title {
		color: #c17c74;
	}

	.unit-description {
		font-size: 0.75rem;
		color: rgba(51, 49, 46, 0.8);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 200px;
		margin: 0;
	}

	/* Completion indicator */
	.completion-indicator {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.reels-container {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.reel {
		position: relative;
		height: 1.5rem;
		width: 1.5rem;
		overflow: hidden;
		border-radius: 9999px;
		border: 2px solid #33312e;
	}

	.reel-inner {
		position: absolute;
		inset: 0.25rem;
		border-radius: 9999px;
		border: 1px solid rgba(51, 49, 46, 0.3);
	}

	.reel-rotation {
		position: absolute;
		inset: 0;
		transform-origin: center;
		animation: spin 15s linear infinite;
		opacity: 0.9;
	}

	.reel-rotation.reverse {
		animation: spin-reverse 15s linear infinite;
	}

	.reel-line {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 2px;
		width: 100%;
		transform: translate(-50%, -50%);
	}

	.status-text {
		margin-left: 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		display: none;
	}

	/* Tape indicator at bottom */
	.tape-indicator {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 50%;
		height: 2px;
		background-color: rgba(51, 49, 46, 0.1);
	}

	/* Animations */
	@keyframes scanDown {
		0%,
		100% {
			transform: translateY(-100%);
		}
		50% {
			transform: translateY(100%);
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes spin-reverse {
		from {
			transform: rotate(360deg);
		}
		to {
			transform: rotate(0deg);
		}
	}

	/* Media queries */
	@media (min-width: 640px) {
		.unit-title,
		.unit-description {
			max-width: calc(100vw - 20rem);
		}

		.status-text {
			display: inline;
		}
	}
</style>
