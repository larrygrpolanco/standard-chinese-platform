<!-- ModuleCard.svelte -->
<script>
	import { fade } from 'svelte/transition';

	// Props
	export let authStore;
	export let latestUnit = null;
	export let completedCount = 0; // Just pass the count of completed units

	// Navigation functions
	function navigateToModules() {
		window.location.href = '/modules';
	}

	function navigateToLatestUnit() {
		if ($authStore && latestUnit) {
			window.location.href = `/units/${latestUnit.unit_id}`;
		} else {
			navigateToModules();
		}
	}

	// Keyboard navigation handler
	function handleKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateToModules();
		}
	}

	// Get progress level based on completed count
	function getProgressWidth() {
		if (!$authStore || completedCount === 0) return 0;
		if (completedCount < 10) return 15;
		if (completedCount < 20) return 30;
		if (completedCount < 30) return 45;
		if (completedCount < 40) return 60;
		if (completedCount < 50) return 75;
		if (completedCount < 63) return 90;
		return 100;
	}

	// Get a descriptive progress status text
	function getProgressStatusText() {
		if (!$authStore || completedCount === 0) return 'SIDE A - NOT STARTED';
		if (completedCount < 15) return 'SIDE A - JUST STARTED';
		if (completedCount < 30) return 'SIDE A - MAKING PROGRESS';
		if (completedCount < 45) return 'SIDE B - OVER HALFWAY';
		if (completedCount < 63) return 'SIDE B - ALMOST DONE';
		return 'SIDE B - COMPLETE';
	}
</script>

<!-- Core Module -->
<div class="module-container" in:fade={{ duration: 400, delay: 400 }}>
	<!-- Module card styled as vintage cassette case -->
	<div
		class="module-card"
		style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 2px 2px 0 #826D5B;"
		role="button"
		tabindex="0"
		aria-label="Browse modules"
		on:click={() => navigateToModules()}
		on:keydown={handleKeydown}
	>
		<!-- Top colored binding - using a green color -->
		<div class="binding-top"></div>

		<!-- Card content -->
		<div class="card-content">
			<!-- Header section with title -->
			<div class="header-section">
				<div class="title-container">
					<!-- Title -->
					<h2 class="card-title">Core Modules</h2>

					<!-- Small tape icon - positioned relative to the top-right -->
					<div class="tape-icon" aria-hidden="true">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect x="2" y="4" width="20" height="16" rx="2" stroke="#33312E" stroke-width="2" />
							<circle cx="7" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
							<circle cx="17" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
							<line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#33312E" stroke-width="1.5" />
						</svg>
					</div>
				</div>

				<!-- Progress meter styled as tape counter -->
				<div class="progress-container">
					<div class="progress-meter">
						<div class="progress-label">PROGRESS:</div>
						<div
							class="progress-bar-container"
							style="box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);"
						>
							<!-- Progress bar -->
							<div
								class="progress-bar"
								style="width: {getProgressWidth()}%; background-color: #C17C74; opacity: 0.8;"
								role="progressbar"
								aria-valuenow={getProgressWidth()}
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
							<!-- Tick marks -->
							<div class="tick-marks" aria-hidden="true">
								<span class="tick"></span>
								<span class="tick"></span>
								<span class="tick"></span>
								<span class="tick"></span>
							</div>
						</div>
					</div>
					<p class="progress-status">
						{#if $authStore}
							{getProgressStatusText()} - {completedCount}/63 UNITS
						{:else}
							SIDE A - NOT STARTED
						{/if}
					</p>
				</div>
			</div>

			<!-- Divider with perforated line -->
			<div class="divider" aria-hidden="true">
				<div class="divider-line"></div>
			</div>

			<!-- Module description -->
			<div class="description-section">
				<p class="description-text">
					FSI Standard Chinese: A Modular Approach is divided into 9 core modules each with a
					different focus. These modules were designed by linguist to break down Mandarin
					systematically and provide practical language skills.
				</p>
			</div>

			<!-- Call to action styled as a mechanical button -->
			<div
				class="cta-section"
				style="background: repeating-linear-gradient(45deg, #7D8C5C10, #7D8C5C10 10px, transparent 10px, transparent 20px);"
			>
				{#if $authStore && latestUnit}
					<button
						type="button"
						class="cta-button continue-button"
						style="box-shadow: 1px 1px 0 #826D5B;"
						on:click|stopPropagation={() => navigateToLatestUnit()}
					>
						Continue Unit {latestUnit.unit_id}
						<svg
							class="button-icon"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</button>
				{:else}
					<button
						type="button"
						class="cta-button browse-button"
						style="box-shadow: 1px 1px 0 #826D5B;"
						on:click|stopPropagation={() => navigateToModules()}
					>
						Browse modules
						<svg
							class="button-icon"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* Container */
	.module-container {
		position: relative;
		margin-left: auto;
		margin-right: auto;
		/* margin-bottom: 2rem; */
		width: 100%;
		max-width: 36rem;
	}

	/* Module card */
	.module-card {
		position: relative;
		display: flex;
		height: 100%;
		cursor: pointer;
		flex-direction: column;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 2px solid #33312e;
		background-color: #e8e5d7;
		transition: all 0.3s;
	}

	.module-card:hover {
		transform: translateY(-0.25rem);
		box-shadow: 4px 4px 0 #826d5b !important;
	}

	/* Top colored binding */
	.binding-top {
		height: 0.75rem;
		width: 100%;
		border-bottom: 2px solid #33312e;
		background-color: #ddb967;
	}

	/* Card content */
	.card-content {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}

	/* Header section */
	.header-section {
		padding: 1.5rem;
	}

	.title-container {
		position: relative;
		margin-bottom: 0.75rem;
		display: flex;
		gap: 1rem;
	}

	/* Title */
	.card-title {
		flex: 1;
		align-self: center;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		transition: color 0.3s;
	}

	.module-card:hover .card-title {
		color: #c17c74;
	}

	/* Tape icon */
	.tape-icon {
		position: absolute;
		top: 0;
		right: 0;
		opacity: 0.7;
	}

	/* Progress section */
	.progress-container {
		margin-top: 1rem;
	}

	.progress-meter {
		display: flex;
		align-items: center;
	}

	.progress-label {
		margin-right: 0.5rem;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		letter-spacing: -0.025em;
		opacity: 0.8;
	}

	.progress-bar-container {
		position: relative;
		height: 1rem;
		flex-grow: 1;
		overflow: hidden;
		border-radius: 0.125rem;
		border: 1px solid #33312e;
		background-color: #f4f1de;
	}

	.progress-bar {
		height: 100%;
		transition: width 0.3s ease-out;
	}

	.tick-marks {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		height: 100%;
		width: 80%;
		justify-content: space-between;
		padding-left: 0.25rem;
		padding-right: 0.25rem;
	}

	.tick {
		margin-top: 0.25rem;
		height: 0.25rem;
		width: 1px;
		background-color: #33312e;
		opacity: 0.4;
	}

	.progress-status {
		margin-top: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		color: #33312e;
		opacity: 0.7;
	}

	/* Divider */
	.divider {
		display: flex;
		align-items: center;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.divider-line {
		flex-grow: 1;
		border-top: 1px dashed #a0998a;
	}

	/* Description section */
	.description-section {
		flex-grow: 1;
		background-color: #f4f1de;
		opacity: 0.5;
		padding: 1rem;
	}

	.description-text {
		font-family: 'Work Sans', sans-serif;
		font-size: 0.875rem;
		line-height: 1.625;
		color: #33312e;
	}

	/* Call to action section */
	.cta-section {
		border-top: 2px solid #33312e;
		padding: 0.75rem;
		text-align: right;
	}

	/* Button */
	.cta-button {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		border: 1px solid #33312e;
		background-color: #f4f1de;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.375rem;
		padding-bottom: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.15s ease-out;
	}

	.continue-button {
		color: #34667f;
	}

	.browse-button {
		color: #33312e;
	}

	.module-card:hover .cta-button {
		transform: translateY(-0.125rem);
		box-shadow: 2px 2px 0 #826d5b !important;
	}

	.cta-button:active {
		transform: translateY(0.125rem);
		box-shadow: none !important;
	}

	/* Button icon */
	.button-icon {
		margin-left: 0.375rem;
		height: 1rem;
		width: 1rem;
		transition: transform 0.3s;
	}

	.module-card:hover .button-icon {
		transform: translateX(0.25rem);
	}
</style>
