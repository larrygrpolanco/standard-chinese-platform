<!-- TabSelector.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	// Props
	export let tabs = []; // Array of tab objects with id, label, icon, disabled properties
	export let activeTab = ''; // Currently active tab id

	// Local state
	let showMobileMenu = false;

	// Event dispatcher
	const dispatch = createEventDispatcher();

	// Function to change tabs and hide mobile menu
	function selectTab(tabId) {
		activeTab = tabId;
		showMobileMenu = false;
		dispatch('tabChange', { tabId });
	}

	// Get current tab info
	$: currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0] || {};
</script>

<div class="tab-selector">
	<!-- Tab Navigation - Desktop Version -->
	<div class="tab-container hidden rounded-b-none md:block">
		<nav class="vintage-toggle-switch" role="tablist">
			{#each tabs as tab}
				<button
					role="tab"
					id="tab-{tab.id}"
					class="vintage-tab-button {activeTab === tab.id ? 'active' : ''} {tab.disabled
						? 'disabled'
						: ''}"
					aria-selected={activeTab === tab.id}
					aria-controls="panel-{tab.id}"
					on:click={() => !tab.disabled && selectTab(tab.id)}
					disabled={tab.disabled}
				>
					{@html tab.icon}
					<span class="tab-label">{tab.label}</span>
					{#if tab.disabled}<span class="coming-soon">(Coming Soon)</span>{/if}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Tab Navigation - Mobile Version -->
	<div class="mobile-tab-selector block md:hidden">
		<button
			class="vintage-selector-button"
			on:click={() => (showMobileMenu = !showMobileMenu)}
			aria-expanded={showMobileMenu}
			aria-controls="mobileTabs"
		>
			<!-- Current Tab Display -->
			<span class="flex items-center">
				{@html currentTab.icon}
				<span class="ml-2">{currentTab.label}</span>
			</span>

			<!-- Vintage Dropdown Arrow -->
			<svg class="vintage-selector-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1" fill="none" />
				<path
					d="M8 11L12 15L16 11"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		<!-- Mobile Dropdown Menu -->
		{#if showMobileMenu}
			<div id="mobileTabs" class="vintage-selector-menu" transition:slide={{ duration: 300 }}>
				{#each tabs as tab}
					<button
						class="vintage-selector-option {activeTab === tab.id ? 'active' : ''} {tab.disabled
							? 'disabled'
							: ''}"
						on:click={() => !tab.disabled && selectTab(tab.id)}
						disabled={tab.disabled}
					>
						{@html tab.icon}
						<span class="ml-2">{tab.label}</span>
						{#if tab.disabled}<span class="ml-1 text-xs">(Coming Soon)</span>{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Tab Styles */
	.tab-container {
		padding: 8px;
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
		background-color: var(--color-cream-paper, #f4f1de);
	}

	.vintage-toggle-switch {
		display: inline-flex;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 6px;
		padding: 3px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.vintage-tab-button {
		display: flex;
		align-items: center;
		padding: 6px 12px;
		font-family: 'Work Sans', sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-charcoal, #33312e);
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
		z-index: 1;
		white-space: nowrap;
	}

	.vintage-tab-button :global(svg) {
		width: 18px;
		height: 18px;
		margin-right: 6px;
	}

	.vintage-tab-button.active {
		background-color: var(--color-gold, #ddb967);
		color: var(--color-charcoal, #33312e);
		font-weight: 600;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.vintage-tab-button:hover:not(.active):not(.disabled) {
		background-color: rgba(221, 185, 103, 0.2);
	}

	.vintage-tab-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.coming-soon {
		font-size: 0.7rem;
		opacity: 0.7;
		margin-left: 4px;
	}

	/* Mobile Selector Styles */
	.mobile-tab-selector {
		position: relative;
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
	}

	.vintage-selector-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 12px 16px;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		background-color: var(--color-cream-paper, #f4f1de);
		border: none;
		text-align: left;
		color: var(--color-charcoal, #33312e);
	}

	.vintage-selector-icon {
		width: 24px;
		height: 24px;
		transition: transform 0.3s ease;
		color: var(--color-warm-gray, #a0998a);
	}

	.vintage-selector-menu {
		position: absolute;
		z-index: 50;
		width: 100%;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.vintage-selector-option {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 12px 16px;
		text-align: left;
		background: transparent;
		border: none;
		border-bottom: 1px solid rgba(160, 153, 138, 0.2);
		color: var(--color-charcoal, #33312e);
		font-family: 'Work Sans', sans-serif;
	}

	.vintage-selector-option:last-child {
		border-bottom: none;
	}

	.vintage-selector-option.active {
		background-color: rgba(221, 185, 103, 0.15);
		font-weight: 600;
	}

	.vintage-selector-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.vintage-selector-option:hover:not(.active):not(.disabled) {
		background-color: rgba(221, 185, 103, 0.05);
	}

	.vintage-selector-option :global(svg) {
		width: 18px;
		height: 18px;
	}
</style>
