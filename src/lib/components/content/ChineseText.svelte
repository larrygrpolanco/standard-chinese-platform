<!-- src/lib/components/content/ChineseText.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';

	export let chinese = '';
	export let pinyin = '';
	export let english = '';
	export let showEnglish = true;
</script>

<div class="chinese-text-container">
	<div
		class="chinese-text"
		style="font-family: {$fontPreferences.script === 'traditional'
			? 'Noto Sans TC'
			: 'Noto Sans SC'}"
	>
		{chinese}
	</div>

	{#if $fontPreferences.showPinyin && pinyin}
		<div class="pinyin text-sm text-gray-500">{pinyin}</div>
	{/if}

	{#if showEnglish && english}
		<div class="english text-gray-700 italic">{english}</div>
	{/if}
</div>

<style>
	.chinese-text-container {
		margin-bottom: 1rem;
	}

	.chinese-text {
		font-size: 1.25rem;
		line-height: 1.8;
	}

	.pinyin {
		margin-top: 0.25rem;
	}

	.english {
		margin-top: 0.25rem;
	}
</style>
