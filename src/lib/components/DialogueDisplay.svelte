<script>
	import { slide, fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { fontPreferences } from '$lib/stores/fontPreferences';
	import ChunkByPinyin from './UI/ChunkByPinyin.svelte'; // Import the component

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

<div class="dialogue-card">
	<div class="p-4">
		<!-- Dialogue header with vintage styling -->
		<div class="dialogue-header mb- flex flex-wrap items-center justify-between gap-y-2">
			<!-- Left side with dialogue number and title -->
			<div class="flex items-center">
				<div class="dialogue-number-badge">
					<span class="dialogue-number">{dialogue.number}</span>
				</div>
				<h4 class="text-md font-arvo text-charcoal ml-2 font-medium">Dialogue</h4>
			</div>

			<!-- Right side with navigation controls - simplified structure -->
			<div class="flex items-center">
				<button
					class="nav-button"
					aria-label="previous button"
					class:disabled={isFirst}
					on:click={onPrevious}
					disabled={isFirst}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none">
						<path
							d="M13 7L7 12L13 17M19 7L13 12L19 17"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>

				<div class="dialogue-counter mx-2">
					<span class="counter-text">{dialogue.number}/{totalCount}</span>
				</div>

				<button
					class="nav-button"
					aria-label="next button"
					class:disabled={isLast}
					on:click={onNext}
					disabled={isLast}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none">
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

		<!-- Content with retro paper effect -->
		<div class="content-container">
			<div
				class="content-layout mb-4"
				in:fly={{ x: 300, duration: 400, delay: 100, easing: elasticOut }}
			>
				<div class="chinese-section">
					{#if displayPinyinOnly}
						<p class="pinyin-large whitespace-pre-line">{dialogue.pinyin}</p>
					{:else}
						{#if $fontPreferences.showPinyin}
							<p class="pinyin whitespace-pre-line">{dialogue.pinyin}</p>
						{/if}
						<p class="chinese-text whitespace-pre-line">{chineseText}</p>
					{/if}
				</div>

				<div class="english-section">
					<p class="text-charcoal whitespace-pre-line">{dialogue.english}</p>
				</div>
			</div>
		</div>

		<!-- Notes section with retro toggle -->
		{#if dialogue.notes}
			<div class="notes-section">
				<button class="notes-toggle" class:expanded on:click={toggleExpanded}>
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
		border-radius: 8px;
		border: 1px solid var(--color-warm-gray, #a09a8a);
		background-color: var(--color-cream-paper, #f5f2e8);
		/* Vintage paper texture */
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));

		box-shadow:
			inset 0 1px 3px rgba(51, 49, 46, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.05),
			0 4px 6px rgba(0, 0, 0, 0.03);
	}

	.dialogue-header {
		border-bottom: 1px solid rgba(160, 152, 138, 0.3);
		padding-bottom: 0.5rem;
	}

	.dialogue-number-badge {
    text-align: center;
    line-height: 28px; /* Match the height of the badge */
    background-color: var(--color-gold, #ddb967);
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.05));
    color: var(--color-charcoal, #33312e);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.dialogue-number {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    font-size: 0.9rem;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    vertical-align: middle;
}

	/* Retro dialogue counter */
	.dialogue-counter {
		font-family: 'Courier New', monospace;
		background-color: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(160, 152, 138, 0.3);
		border-radius: 12px;
		padding: 0.125rem 0.5rem;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.counter-text {
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		color: var(--color-charcoal, #33312e);
		letter-spacing: 0.05em;
	}

	/* Navigation buttons styling
	.navigation-buttons {
		display: flex;
		gap: 4px;
	} */

	/* Button shadow and 3D effect */

	/* Y2K-style 3D buttons */
	.nav-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 55px;
		height: 34px;
		background-color: var(--color-cream-paper, #f7f4e9);
		border: 1px solid var(--color-warm-gray, #a09a8a);
		border-radius: 4px;
		color: var(--color-charcoal, #33312e);
		transform: translateY(0);
		transition: all 0.1s ease;
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

	/* .button-icon {
		width: 45.305px;
		height: 28px;
		position: relative;
		z-index: 2;
	} */

	/* Make sure SVG is visible */
	.nav-button svg {
		position: absolute;
		z-index: 2;
		width: 100%;
		height: 100%;
	}

	.nav-button:hover:not(.disabled) {
		background-color: rgba(221, 185, 103, 0.2);
		transform: translateY(-1px);
	}

	.nav-button:hover:not(.disabled)::before {
		box-shadow:
			0 4px 0 0 var(--color-button-shadow, #c4b59d),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.nav-button:active:not(.disabled) {
		transform: translateY(3px);
	}

	.nav-button:active:not(.disabled)::before {
		box-shadow:
			0 0 0 0 var(--color-button-shadow, #c4b59d),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.nav-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Content sections */
	.content-container {
		position: relative;
		overflow: hidden;
		min-height: 100px;
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
			padding-right: 1.5rem;
			position: relative;
		}

		.chinese-section::after {
			content: '';
			position: absolute;
			right: 0;
			top: 0;
			height: 100%;
			/* Retro dashed line separator */
			background: repeating-linear-gradient(
				to bottom,
				var(--color-warm-gray, #a09a8a) 0,
				var(--color-warm-gray, #a09a8a) 4px,
				transparent 4px,
				transparent 8px
			);
			width: 1px;
			opacity: 0.6;
		}

		.english-section {
			flex: 1;
			padding-left: 1.5rem;
		}
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		font-size: 1.25em;
		color: var(--color-charcoal, #33312e);
		line-height: 1.7;
	}

	.pinyin {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-warm-gray, #a09a8a);
		font-size: 0.85em;
		margin-bottom: 0.35rem;
		letter-spacing: 0.01em;
	}

	.pinyin-large {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-charcoal, #33312e);
		font-size: 1.1em;
		line-height: 1.8;
		letter-spacing: 0.01em;
	}

	/* Notes section with retro styling */
	.notes-section {
		margin-top: 0.75rem;
		border-top: 1px dashed var(--color-warm-gray, #a09a8a);
		padding-top: 0.75rem;
	}

	.notes-toggle {
		display: flex;
		align-items: center;
		background: none;
		border: none;
		color: var(--color-navy, #28536b);
		font-size: 0.875rem;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.notes-toggle:hover {
		color: var(--color-terracotta, #c26e5a);
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
		background-color: var(--color-cream-paper, #f7f4e9);
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
		border-radius: 6px;
		padding: 0.75rem;
		margin-top: 0.75rem;
		font-size: 0.95em;
		box-shadow:
			inset 0 1px 2px rgba(0, 0, 0, 0.05),
			0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(160, 152, 138, 0.2);
	}
</style>
