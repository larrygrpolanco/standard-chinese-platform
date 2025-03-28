<!-- src/lib/components/UI/FontToggle.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Optional props for customization
	export let compact = false;
	export let label = null;
</script>

<div class={compact ? 'toggle-wrapper compact' : 'toggle-wrapper'}>
	<div class="toggle-container">
		{#if label}
			<span class="toggle-label">{label}</span>
		{/if}
		<div class="vintage-switch">
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
	.toggle-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.toggle-label {
		font-size: 0.875rem;
		color: var(--color-charcoal, #333);
	}

	.vintage-switch {
		display: flex;
		background-color: var(--color-cream-paper, #f8f6f1);
		border: 1px solid var(--color-warm-gray, #8a8a8a);
		border-radius: 0.375rem;
		padding: 0.25rem;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.button-base {
		position: relative;
		border-radius: 0.25rem;
		padding: 0.375rem 0.875rem; /* Increased from 0.25rem 0.75rem */
		font-size: 0.9375rem; /* Increased from 0.875rem */
		transition: all 0.2s ease;
	}

	.button-active {
		background-color: var(--color-gold, gold);
		color: var(--color-charcoal, #333);
		box-shadow:
			inset 0 2px 5px rgba(0, 0, 0, 0.2),
			inset 0 -1px 2px rgba(255, 255, 255, 0.2);
		transform: translateY(1px);
	}

	.button-inactive {
		background-color: transparent;
		color: var(--color-warm-gray, #8a8a8a);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	/* Compact mode styling  */
	.compact .button-base {
		padding: 0.25rem 0.625rem; /* Increased from 2px 6px */
		font-size: 0.85rem; /* Increased from 0.75rem */
	}

	@media (max-width: 640px) {
		.vintage-switch button {
			padding: 0.25rem 0.5rem;
			font-size: 0.875rem;
		}
	}
</style>
