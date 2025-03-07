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
		<!-- Dialogue number -->
		<div class="mb-3">
			<h4 class="text-md text-charcoal font-arvo font-medium">Dialogue {dialogue.number}</h4>
		</div>

		<!-- Content display with side-by-side layout -->
		<div class="content-layout mb-3">
			<div class="chinese-section">
				{#if $fontPreferences.displayMode === 'pinyin'}
					<!-- Pinyin-only mode -->
					<p class="pinyin-large whitespace-pre-line">{dialogue.pinyin}</p>
				{:else}
					<!-- Character modes with optional pinyin -->
					{#if $fontPreferences.showPinyin}
						<p class="pinyin whitespace-pre-line">{dialogue.pinyin}</p>
					{/if}

					<p class="chinese-text leading-relaxed whitespace-pre-line">
						{$fontPreferences.displayMode === 'simplified'
							? dialogue.chinese_simplified
							: dialogue.chinese_traditional}
					</p>
				{/if}
			</div>

			<!-- English translation -->
			<div class="english-section">
				<p class="text-charcoal whitespace-pre-line">{dialogue.english}</p>
			</div>
		</div>

		<!-- Notes (expandable) -->
		{#if dialogue.notes && expanded}
			<div transition:slide class="bg-cream-paper border-warm-gray mt-4 rounded-md border p-4">
				<h5 class="text-charcoal font-arvo mb-2 font-medium">Notes</h5>
				<p class="text-charcoal whitespace-pre-line">{dialogue.notes}</p>
			</div>
		{/if}

		<!-- Notes toggle button moved to bottom -->
		{#if dialogue.notes}
			<div class="mt-3 text-right">
				<button
					class="vintage-link text-navy hover:text-terracotta text-sm"
					on:click={toggleExpanded}
				>
					{expanded ? 'Hide Notes' : 'View Notes'}
				</button>
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
	}

	.pinyin {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-warm-gray);
		font-size: 0.85em;
		margin-bottom: 0.25rem;
	}

	.pinyin-large {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-charcoal);
		font-size: 1em;
		line-height: 1.8;
	}
</style>
