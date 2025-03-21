<!-- src/lib/components/UI/ChineseText.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';
	import ChunkByPinyin from './ChunkByPinyin.svelte';

	// Props
	export let simplified = '';
	export let traditional = '';
	export let pinyin = '';
	export let english = '';
	export let containerClass = ''; // Class for the main container
	export let chineseClass = ''; // Class specifically for Chinese text
	export let englishClass = ''; // Class specifically for English text

	// Use appropriate text based on user preference
	$: displayText =
		$fontPreferences.displayMode === 'traditional' && traditional ? traditional : simplified;
</script>

<div class="chinese-content {containerClass}">
	<div class="content-layout">
		<div class="chinese-section">
			{#if $fontPreferences.showPinyin && pinyin}
				<ChunkByPinyin text={displayText} {pinyin} customClass={chineseClass} />
			{:else}
				<p class="chinese-text {chineseClass}" lang="zh">{displayText}</p>
			{/if}
		</div>

		{#if english && $fontPreferences.showEnglish}
			<div class="english-section">
				<p class="english-text whitespace-pre-line {englishClass}">{english}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Keep your existing styles */
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
