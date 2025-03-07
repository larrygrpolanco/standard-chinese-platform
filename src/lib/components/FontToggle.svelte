<!-- src/lib/components/FontToggle.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Optional props for customization
	export let compact = false;
	export let label = 'Character Style:';
</script>

<div class="vintage-switch-container {compact ? 'compact' : ''}">
	<div class="flex items-center gap-2">
		{#if label}
			<span class="text-charcoal text-sm">{label}</span>
		{/if}
		<div
			class="vintage-switch bg-cream-paper border-warm-gray flex rounded-md border p-1 shadow-inner"
		>
			<button
				class={`relative rounded px-3 py-1 text-sm transition-all ${$fontPreferences.displayMode === 'simplified' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
				on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'simplified' }))}
			>
				简体字
			</button>
			<button
				class={`relative rounded px-3 py-1 text-sm transition-all ${$fontPreferences.displayMode === 'traditional' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
				on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'traditional' }))}
			>
				繁體字
			</button>
			<button
				class={`relative rounded px-3 py-1 text-sm transition-all ${$fontPreferences.displayMode === 'pinyin' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
				on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'pinyin' }))}
			>
				Pīnyīn
			</button>
		</div>
	</div>
</div>

<style>
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
