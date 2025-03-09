<script>
	import { slide, fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { fontPreferences } from '$lib/stores/fontPreferences';

	export let dialogue = {};
	export let expanded = false;
	export let onPrevious = () => {};
	export let onNext = () => {};
	export let isFirst = false;
	export let isLast = false;
	export let totalCount = 1;

	// Derived values to simplify template logic
	$: displayPinyinOnly = $fontPreferences.displayMode === 'pinyin';
	$: chineseText =
		$fontPreferences.displayMode === 'simplified'
			? dialogue.chinese_simplified
			: dialogue.chinese_traditional;

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="dialogue-card bg-beige border-warm-gray rounded-lg border">
	<div class="p-4">
		<!-- Dialogue header with vintage styling and navigation buttons -->
		<div class="dialogue-header mb-3 flex items-center justify-between">
			<div class="flex items-center">
				<div class="dialogue-number-badge">
					<span class="dialogue-number">{dialogue.number}</span>
				</div>
				<h4 class="text-md font-arvo text-charcoal ml-2 font-medium">Dialogue</h4>
			</div>

			<!-- Navigation controls with counter above buttons -->
			<div class="navigation-controls flex flex-col items-center">
				<!-- Dialogue counter centered above buttons -->
				<div class="dialogue-counter mb-2">
					<span class="counter-text">{dialogue.number}/{totalCount}</span>
				</div>

				<!-- Navigation buttons with fixed SVGs -->
				<div class="navigation-buttons flex justify-center space-x-4">
					<button
						class="nav-button"
						class:disabled={isFirst}
						on:click={onPrevious}
						disabled={isFirst}
						aria-label="Previous dialogue"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="nav-button svg h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M13 7L7 12L13 17M19 7L13 12L19 17"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>

					<button
						class="nav-button"
						class:disabled={isLast}
						on:click={onNext}
						disabled={isLast}
						aria-label="Next dialogue"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="nav-button svg h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M5 7L11 12L5 17M11 7L17 12L11 17"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Content display with animation -->
		<div class="content-container">
			<div
				class="content-layout mb-4"
				in:fly={{ x: 300, duration: 400, delay: 100, easing: elasticOut }}
			>
				<div class="chinese-section">
					{#if displayPinyinOnly}
						<!-- Pinyin-only mode -->
						<p class="pinyin-large whitespace-pre-line">{dialogue.pinyin}</p>
					{:else}
						<!-- Character modes with optional pinyin -->
						{#if $fontPreferences.showPinyin}
							<p class="pinyin whitespace-pre-line">{dialogue.pinyin}</p>
						{/if}
						<p class="chinese-text whitespace-pre-line">{chineseText}</p>
					{/if}
				</div>

				<!-- English translation with improved styling -->
				<div class="english-section">
					<p class="text-charcoal whitespace-pre-line">{dialogue.english}</p>
				</div>
			</div>
		</div>

		<!-- Notes section with improved styling -->
		{#if dialogue.notes}
			<div class="notes-section">
				<button
					class="notes-toggle"
					class:expanded
					on:click={toggleExpanded}
					aria-expanded={expanded}
				>
					<span class="notes-toggle-icon">{expanded ? '−' : '+'}</span>
					<span class="notes-toggle-text">{expanded ? 'Hide Notes' : 'View Notes'}</span>
				</button>

				{#if expanded}
					<div transition:slide={{ duration: 300 }} class="notes-content">
						<p class="text-charcoal whitespace-pre-line">{dialogue.notes}</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.dialogue-card {
		position: relative;
		overflow: hidden;
		box-shadow:
			inset 0 1px 3px rgba(51, 49, 46, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.05);
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
	}

	.dialogue-header {
		border-bottom: 1px solid rgba(160, 152, 138, 0.3);
		padding-bottom: 0.5rem;
	}

	.dialogue-number-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-gold);
		color: var(--color-charcoal);
		width: 28px;
		height: 28px;
		border-radius: 50%;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.dialogue-number {
		font-family: 'Courier New', monospace;
		font-weight: 600;
		font-size: 0.9rem;
		line-height: 1;
	}

	.content-container {
		position: relative;
		overflow: hidden;
		min-height: 100px; /* Prevent layout shift */
	}

	.content-layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.content-layout {
			flex-direction: row;
			align-items: flex-start;
		}

		.chinese-section {
			flex: 1;
			min-width: 0; /* Allow text wrapping */
			padding-right: 1.5rem;
			position: relative;
		}

		.chinese-section::after {
			content: '';
			position: absolute;
			right: 0;
			top: 0;
			height: 100%;
			border-right: 1px dashed var(--color-warm-gray);
		}

		.english-section {
			flex: 1;
			min-width: 0; /* Allow text wrapping */
			padding-left: 1.5rem;
		}
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		font-size: 1.25em;
		color: var(--color-charcoal);
		line-height: 1.7;
	}

	.pinyin {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-warm-gray);
		font-size: 0.85em;
		margin-bottom: 0.35rem;
		letter-spacing: 0.01em;
	}

	.pinyin-large {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-charcoal);
		font-size: 1.1em;
		line-height: 1.8;
		letter-spacing: 0.01em;
	}

	.notes-section {
		margin-top: 0.75rem;
		border-top: 1px solid var(--color-warm-gray);
		padding-top: 0.75rem;
	}

	.notes-toggle {
		display: flex;
		align-items: center;
		background: none;
		border: none;
		color: var(--color-navy);
		font-size: 0.875rem;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.notes-toggle:hover {
		color: var(--color-terracotta);
	}

	.notes-toggle-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border: 1px solid currentColor;
		border-radius: 50%;
		margin-right: 6px;
		font-size: 14px;
		line-height: 1;
	}

	.notes-content {
		background-color: var(--color-cream-paper);
		border-radius: 6px;
		padding: 0.75rem;
		margin-top: 0.75rem;
		font-size: 0.95em;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	/* Navigation controls styling */
	.navigation-controls {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.dialogue-counter {
		font-family: 'Courier New', monospace;
		padding: 0.125rem 0.5rem;
		border-radius: 0.5rem;
		font-size: 0.8rem;
	}

	.counter-text {
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		color: var(--color-charcoal);
		letter-spacing: 0.05em;
	}

	/* Navigation buttons styling */
	.navigation-buttons {
		display: flex;
		gap: 4px;
	}

	.nav-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 24px;
		color: var(--color-charcoal);
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 4px;
		transition: all 0.1s ease;
		transform: translateZ(0);
	}

	/* Navigation buttons styling */
	.navigation-buttons {
		display: flex;
		gap: 4px;
	}

	.nav-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 24px;
		color: var(--color-charcoal);
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 4px;
		transition: all 0.1s ease;
		transform: translateZ(0);
		z-index: 1; /* Ensure button has proper stacking context */
		overflow: visible; /* Prevent clipping of content */
	}

	/* Button shadow and 3D effect */
	.nav-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		border-radius: 4px;
		box-shadow:
			0 3px 0 0 var(--color-button-shadow),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 4px 3px rgba(0, 0, 0, 0.15);
		transition: all 0.1s ease;
		z-index: -1; /* Keep this behind the button content */
	}

	/* Make sure SVG is visible */
	.nav-button svg {
		position: absolute;
		z-index: 2; 
		width: 100%;
		height: 100%;
        
	}

	/* Hover and active states */
	.nav-button:hover:not(.disabled) {
		background-color: rgba(221, 185, 103, 0.2);
		transform: translateY(-1px);
	}

	.nav-button:hover:not(.disabled)::before {
		box-shadow:
			0 4px 0 0 var(--color-button-shadow),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 5px 3px rgba(0, 0, 0, 0.15);
	}

	.nav-button:active:not(.disabled) {
		transform: translateY(3px);
	}

	.nav-button:active:not(.disabled)::before {
		box-shadow:
			0 0 0 0 var(--color-button-shadow),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.nav-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
