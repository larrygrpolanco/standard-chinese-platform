<!-- DialogueDisplay.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import { fontPreferences } from '$lib/stores/fontPreferences';

	export let dialogue = {};
	export let expanded = false;

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="border-warm-gray bg-beige overflow-hidden rounded-lg border">
	<div class="p-4">
		<!-- Dialogue number and toggle button -->
		<div class="mb-2 flex items-center justify-between">
			<h4 class="font-arvo text-md text-charcoal font-medium">Dialogue {dialogue.number}</h4>
			{#if dialogue.notes}
				<button
					class="vintage-link text-navy hover:text-terracotta text-sm"
					on:click={toggleExpanded}
				>
					{expanded ? 'Hide Notes' : 'View Notes'}
				</button>
			{/if}
		</div>

		<!-- Chinese text with pinyin above, larger characters -->
		<div class="mb-3">
			<!-- Pinyin above characters -->
			{#if $fontPreferences.showPinyin}
				<p class="pinyin whitespace-pre-line">{dialogue.pinyin}</p>
			{/if}

			<!-- Chinese characters -->
			<p class="chinese-text leading-relaxed whitespace-pre-line">
				{#if $fontPreferences.showSimplified}
					{dialogue.chinese_simplified}
				{:else}
					{dialogue.chinese_traditional}
				{/if}
			</p>

			<!-- English translation -->
			<p class="text-charcoal mt-2 whitespace-pre-line">{dialogue.english}</p>
		</div>

		<!-- Notes (expandable) -->
		{#if dialogue.notes && expanded}
			<div transition:slide class="border-warm-gray bg-cream-paper mt-4 rounded-md border p-4">
				<h5 class="font-arvo text-charcoal mb-2 font-medium">Notes</h5>
				<p class="text-charcoal whitespace-pre-line">{dialogue.notes}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.vintage-link {
		text-decoration: none;
		border-bottom: 1px dashed;
		padding-bottom: 1px;
		transition: all 0.2s;
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		font-size: 1.25em;
		color: var(--color-charcoal);
	}

	.pinyin {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-warm-gray);
		font-size: 0.85em;
		margin-bottom: 0.25rem;
	}
</style>
