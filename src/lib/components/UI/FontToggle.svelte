<!-- src/lib/components/UI/FontToggle.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Optional props for customization
	export let compact = false;
	export let label = 'Character Style:';
</script>

<div class={compact ? 'compact' : ''}>
	<div class="flex items-center gap-2">
		{#if label}
			<span class="text-charcoal text-sm">{label}</span>
		{/if}
		<div
			class="vintage-switch bg-cream-paper border-warm-gray flex rounded-md border p-1 shadow-inner"
		>
			<button
				class="button-base {$fontPreferences.displayMode === 'simplified'
					? 'button-active'
					: 'button-inactive'}"
				on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'simplified' }))}
			>
				简体字
			</button>
			<button
				class="button-base {$fontPreferences.displayMode === 'traditional'
					? 'button-active'
					: 'button-inactive'}"
				on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'traditional' }))}
			>
				繁體字
			</button>
			<button
				class="button-base {$fontPreferences.showPinyin ? 'button-active' : 'button-inactive'}"
				on:click={() => fontPreferences.update((p) => ({ ...p, showPinyin: !p.showPinyin }))}
			>
				Pīnyīn
			</button>
		</div>
	</div>
</div>

<style>
	/* Moved button classes from script to style block */
	.button-base {
		position: relative;
		border-radius: 0.25rem;
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		transition: all;
	}

	.button-active {
		/* background-color: var(--color-gold, gold); */
		color: var(--color-charcoal, #333);
		box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
	}

	.button-inactive {
		color: var(--color-warm-gray, #8a8a8a);
	}

	.vintage-switch {
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.compact .vintage-switch button {
		padding: 2px 6px;
		font-size: 0.75rem;
	}

	@media (max-width: 640px) {
		.vintage-switch button {
			padding: 2px 6px;
			font-size: 0.75rem;
		}
	}
</style>
