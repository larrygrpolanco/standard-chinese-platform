<!-- src/lib/components/UI/ChineseText.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Props
	export let simplified = '';
	export let traditional = '';
	export let pinyin = '';
	export let english = '';

	// Use appropriate text based on user preference
	$: displayText =
		$fontPreferences.displayMode === 'traditional' && traditional
			? traditional.replace(/ /g, '\u00A0')
			: simplified.replace(/ /g, '\u00A0');

	$: displayPinyin = pinyin.replace(/ /g, '\u00A0');
</script>

<div class="chinese-content">
	<div class="content-layout">
		<div class="chinese-section">
			<!-- Improved Chinese text and pinyin container -->
			<div class="chinese-display">
				{#if $fontPreferences.showPinyin && pinyin}
					<p class="pinyin-text">{displayPinyin}</p>
				{/if}
				<p class="chinese-text" lang="zh">{displayText}</p>
			</div>
		</div>

		<!-- English translation - only show if it exists and fits design -->
		{#if english && $fontPreferences.showEnglish}
			<div class="english-section">
				<p class="english-text whitespace-pre-line">{english}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.chinese-content {
		margin-bottom: 0.75rem;
		width: 100%;
	}

	.content-layout {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.chinese-section {
		width: 100%;
		flex: 1;
		min-width: 0; /* Allows flex item to shrink below content size */
	}

	.chinese-display {
		width: 100%;
	}

	.pinyin-text {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.8rem;
		line-height: 1.5;
		margin-bottom: 0.125rem;
		overflow-wrap: break-word;
		word-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--color-charcoal, #33312e);
		overflow-wrap: break-word;
		word-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}

	.english-section {
		width: 100%;
		flex: 1;
		min-width: 0; /* Allows flex item to shrink below content size */
	}

	.english-text {
		font-family: 'Work Sans', sans-serif;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--color-charcoal, #33312e);
		overflow-wrap: break-word;
		word-wrap: break-word;
	}

	/* More aggressive space saving on mobile */
	@media (max-width: 640px) {
		.chinese-content {
			margin-bottom: 0.5rem;
		}

		.pinyin-text {
			font-size: 0.75rem;
			line-height: 1.4;
			margin-bottom: 0.0625rem;
		}

		.chinese-text {
			font-size: 1rem;
			line-height: 1.5;
		}

		.english-text {
			font-size: 0.85rem;
			line-height: 1.4;
		}
	}

	@media (min-width: 768px) {
		.content-layout {
			flex-direction: row;
			align-items: flex-start;
		}

		.chinese-section {
			padding-right: 1.5rem;
		}
	}
</style>
