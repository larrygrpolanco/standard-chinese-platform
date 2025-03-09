<!-- ChineseText.svelte -->
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
			<!-- Pinyin above characters when enabled -->
			{#if $fontPreferences.showPinyin && pinyin}
				<p class="pinyin whitespace-pre-line">{displayPinyin}</p>
			{/if}

			<!-- Chinese characters -->
			<p class="chinese-text whitespace-pre-line" lang="zh">
				{displayText}
			</p>
		</div>

		<!-- English translation -->
		{#if english}
			<div class="english-section">
				<p class="english-text whitespace-pre-line">{english}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.chinese-content {
		margin-bottom: 1rem;
	}

	.content-layout {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (min-width: 640px) {
		.content-layout {
			flex-direction: row;
			align-items: flex-start;
		}

		.chinese-section {
			flex: 1;
			min-width: 0; /* Allow text wrapping */
			padding-right: 1rem;
		}

		.english-section {
			flex: 1;
			min-width: 0; /* Allow text wrapping */
		}
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		font-size: 1.1em;
		color: var(--color-charcoal);
		line-height: 1.5;
	}

	.pinyin {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-warm-gray);
		font-size: 0.85em;
		margin-bottom: 0.25rem;
		line-height: 1.4;
	}

	.pinyin-large {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-charcoal);
		font-size: 1em;
		line-height: 1.8;
	}

	.english-text {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-charcoal);
		line-height: 1.5;
	}
</style>
