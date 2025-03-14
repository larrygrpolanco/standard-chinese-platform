<!-- TabSelector.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';

	// Props
	export let tabs = []; // Array of tab objects with id, label, icon properties
	export let activeTab = ''; // Currently active tab id

	// Event dispatcher
	const dispatch = createEventDispatcher();

	// Function to change tabs
	function selectTab(tabId) {
		activeTab = tabId;
		dispatch('tabChange', { tabId });
	}

	// Get current tab info
	$: currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0] || {};
</script>

<div class="tab-selector">
	<div class="tab-container">
		<nav class="vintage-toggle-switch" role="tablist">
			{#each tabs as tab}
				<button
					role="tab"
					id="tab-{tab.id}"
					class="vintage-tab-button {activeTab === tab.id ? 'active' : ''}"
					aria-selected={activeTab === tab.id}
					aria-controls="panel-{tab.id}"
					on:click={() => selectTab(tab.id)}
				>
					<span class="tab-icon">{@html tab.icon}</span>
					<span class="tab-label">{tab.label}</span>
				</button>
			{/each}
		</nav>
	</div>
</div>

<style>
	/* Tab container */
	.tab-container {
		padding: 8px;
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
		background-color: var(--color-cream-paper, #f4f1de);
	}

	/* Vintage toggle switch */
	.vintage-toggle-switch {
		display: flex;
		width: 100%;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 6px;
		padding: 3px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	/* Tab buttons */
	.vintage-tab-button {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8px 4px;
		font-family: 'Work Sans', sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-charcoal, #33312e);
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
	}

	.tab-icon :global(svg) {
		width: 18px;
		height: 18px;
		margin-bottom: 4px;
	}

	.tab-label {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		font-size: 0.85rem;
	}

	.vintage-tab-button.active {
		background-color: var(--color-gold, #ddb967);
		color: var(--color-charcoal, #33312e);
		font-weight: 600;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.vintage-tab-button:hover:not(.active) {
		background-color: rgba(221, 185, 103, 0.2);
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.vintage-tab-button {
			flex-direction: row;
			padding: 8px 16px;
			justify-content: center;
		}

		.tab-icon :global(svg) {
			margin-right: 8px;
			margin-bottom: 0;
		}

		.tab-label {
			font-size: 0.9rem;
		}
	}
</style>
