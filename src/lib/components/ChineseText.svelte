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
		$fontPreferences.script === 'traditional' && traditional
			? traditional.replace(/ /g, '\u00A0')
			: simplified.replace(/ /g, '\u00A0');

	$: displayPinyin = pinyin.replace(/ /g, '\u00A0');
</script>

<div class="chinese-content">
	<!-- Pinyin above characters when enabled -->
	{#if $fontPreferences.showPinyin && pinyin}
		<p class="pinyin whitespace-pre-line">{displayPinyin}</p>
	{/if}

	<!-- Chinese characters - larger size -->
	<p class="chinese-text whitespace-pre-line" lang="zh">
		{displayText}
	</p>

	<!-- English translation below if provided -->
	{#if english}
		<p class="english-text mt-2 whitespace-pre-line">{english}</p>
	{/if}
</div>

<style>
	.chinese-content {
		margin-bottom: 1rem;
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		font-size: 1.25em;
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

	.english-text {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-charcoal);
		line-height: 1.5;
	}
</style>
