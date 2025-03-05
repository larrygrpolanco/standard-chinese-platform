<!-- src/lib/components/ChineseText.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';

	export let chineseSimplified = '';
	export let chineseTraditional = '';
	export let pinyin = '';
	export let english = '';
	export let showEnglish = true;

	// Use traditional if available, otherwise use font change on simplified
	$: displayedChinese =
		$fontPreferences.script === 'traditional' && chineseTraditional
			? chineseTraditional
			: chineseSimplified;
</script>

<div class="chinese-text-container">
	<div
		class="chinese-text"
		style="font-family: {$fontPreferences.script === 'traditional'
			? 'Noto Sans TC'
			: 'Noto Sans SC'}"
	>
		{displayedChinese}
	</div>

	{#if $fontPreferences.showPinyin && pinyin}
		<div class="pinyin text-sm text-gray-500">{pinyin}</div>
	{/if}

	{#if showEnglish && english}
		<div class="english text-gray-700 italic">{english}</div>
	{/if}
</div>

<style>
	/* Same styles as before */
</style>
