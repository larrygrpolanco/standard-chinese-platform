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
		<!-- Dialogue number and toggles -->
		<div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
			<h4 class="text-md text-charcoal font-arvo font-medium">Dialogue {dialogue.number}</h4>

			<div class="flex flex-wrap items-center gap-2">
				<!-- Display Mode Toggle - styled as vintage tabs -->
				<div
					class="vintage-switch bg-cream-paper border-warm-gray flex rounded-md border p-1 shadow-inner"
				>
					<button
						class={`relative rounded px-2 py-1 text-xs transition-all ${$fontPreferences.displayMode === 'simplified' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
						on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'simplified' }))}
					>
						简体字
					</button>
					<button
						class={`relative rounded px-2 py-1 text-xs transition-all ${$fontPreferences.displayMode === 'traditional' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
						on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'traditional' }))}
					>
						繁體字
					</button>
					<button
						class={`relative rounded px-2 py-1 text-xs transition-all ${$fontPreferences.displayMode === 'pinyin' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
						on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'pinyin' }))}
					>
						Pīnyīn
					</button>
				</div>

				{#if dialogue.notes}
					<button
						class="vintage-link text-navy hover:text-terracotta text-sm"
						on:click={toggleExpanded}
					>
						{expanded ? 'Hide Notes' : 'View Notes'}
					</button>
				{/if}
			</div>
		</div>

		<!-- Content display based on mode -->
		<div class="mb-3">
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

			<!-- English translation always shown -->
			<p class="text-charcoal mt-2 whitespace-pre-line">{dialogue.english}</p>
		</div>

		<!-- Notes (expandable) -->
		{#if dialogue.notes && expanded}
			<div transition:slide class="bg-cream-paper border-warm-gray mt-4 rounded-md border p-4">
				<h5 class="text-charcoal font-arvo mb-2 font-medium">Notes</h5>
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

	.pinyin-large {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-navy);
		font-size: 1.1em;
		line-height: 1.8;
	}

	.vintage-switch {
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}
</style>
