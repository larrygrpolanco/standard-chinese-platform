<!-- src/lib/components/CassetteTapeSelector.svelte -->
<script>
	import { slide } from 'svelte/transition';

	// Props
	export let tabs = []; // Array of tab objects {id, label, icon, disabled}
	export let activeTab; // Currently active tab ID
	export let onTabChange = () => {}; // Function to call when tab changes

	// Local state for mobile dropdown
	let isDropdownOpen = false;

	// Toggle dropdown for mobile view
	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	// Change the active tab
	function selectTab(tabId) {
		if (activeTab !== tabId) {
			activeTab = tabId;
			onTabChange(tabId);
			isDropdownOpen = false; // Close dropdown after selection
		}
	}

	// Get the currently active tab
	$: currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
</script>

<div class="cassette-player">
	<!-- Desktop view: Show all tapes side by side with one inserted -->
	<div class="cassette-rack desktop-only">
		{#each tabs as tab}
			<button
				class="cassette-tape {tab.id === activeTab ? 'active' : ''} {tab.disabled
					? 'disabled'
					: ''}"
				on:click={() => !tab.disabled && selectTab(tab.id)}
				disabled={tab.disabled}
				aria-current={tab.id === activeTab ? 'page' : undefined}
				title={tab.disabled ? `${tab.label} (Coming Soon)` : tab.label}
			>
				<div class="cassette-shell">
					<div class="cassette-label">
						{#if tab.icon}
							<span class="cassette-icon">
								{@html tab.icon}
							</span>
						{/if}
						<span class="cassette-text">{tab.label}</span>
						{#if tab.disabled}
							<span class="coming-soon-badge">Coming Soon</span>
						{/if}
					</div>
					<div class="cassette-reels">
						<div class="reel left-reel"></div>
						<div class="reel right-reel"></div>
					</div>
					<div class="cassette-windows">
						<div class="window"></div>
						<div class="window"></div>
					</div>
				</div>
			</button>
		{/each}
	</div>

	<!-- Mobile view: Show current tape with dropdown -->
	<div class="cassette-player-mobile mobile-only">
		<button class="current-tape" on:click={toggleDropdown} aria-expanded={isDropdownOpen}>
			<div class="cassette-shell">
				<div class="cassette-label">
					{#if currentTab.icon}
						<span class="cassette-icon">
							{@html currentTab.icon}
						</span>
					{/if}
					<span class="cassette-text">{currentTab.label}</span>
					{#if currentTab.disabled}
						<span class="coming-soon-badge">Coming Soon</span>
					{/if}
				</div>
				<div class="cassette-reels">
					<div class="reel left-reel"></div>
					<div class="reel right-reel"></div>
				</div>
				<div class="cassette-windows">
					<div class="window"></div>
					<div class="window"></div>
				</div>
			</div>
			<div class="dropdown-indicator">
				<svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</button>

		{#if isDropdownOpen}
			<div class="cassette-dropdown" transition:slide={{ duration: 200 }}>
				{#each tabs as tab}
					{#if tab.id !== activeTab}
						<button
							class="cassette-tape-option {tab.disabled ? 'disabled' : ''}"
							on:click={() => !tab.disabled && selectTab(tab.id)}
							disabled={tab.disabled}
						>
							{#if tab.icon}
								<span class="cassette-icon">
									{@html tab.icon}
								</span>
							{/if}
							<span>{tab.label}</span>
							{#if tab.disabled}
								<span class="option-badge">Coming Soon</span>
							{/if}
						</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.cassette-player {
		width: 100%;
		position: relative;
		font-family: 'Work Sans', sans-serif;
	}

	/* Desktop Layout */
	.cassette-rack {
		display: flex;
		gap: 8px;
		padding: 12px;
		border-radius: 8px;
		position: relative;
		justify-content: center;
	}

	.cassette-tape {
		position: relative;
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
		transition:
			transform 0.3s ease,
			filter 0.2s ease;
		width: 110px;
		transform-origin: center bottom;
		filter: saturate(0.8) brightness(0.95);
		margin: 0 4px;
	}

	.cassette-tape:not(.active):not(.disabled):hover {
		transform: translateY(-8px);
		filter: saturate(1) brightness(1.05);
		z-index: 2;
	}

	.cassette-tape.active {
		filter: saturate(1.2) brightness(1.1);
		transform: translateY(-16px) scale(1.05);
		z-index: 3;
	}

	.cassette-tape.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		filter: grayscale(0.5);
	}

	.cassette-shell {
		width: 100%;
		aspect-ratio: 3/2;
		background-color: var(--color-muted-navy, #34667f);
		border-radius: 6px;
		padding: 4px;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.2),
			inset 0 1px 2px rgba(255, 255, 255, 0.2);
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}

	.active .cassette-shell {
		background-color: var(--color-terracotta, #c17c74);
	}

	/* Different colors for different tapes */
	.cassette-tape:nth-child(2) .cassette-shell {
		background-color: var(--color-avocado-green, #7d8c5c);
	}

	.cassette-tape:nth-child(3) .cassette-shell {
		background-color: var(--color-gold, #ddb967);
	}

	.cassette-tape.active .cassette-shell {
		background-color: var(--color-terracotta, #c17c74);
	}

	.cassette-label {
		flex: 1;
		background-color: var(--color-cream-paper, #f4f1de);
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 6px;
		gap: 4px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.cassette-label::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 2px,
			rgba(0, 0, 0, 0.03) 2px,
			rgba(0, 0, 0, 0.03) 4px
		);
		pointer-events: none;
	}

	.cassette-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2px;
	}

	.cassette-icon svg {
		width: 18px;
		height: 18px;
		color: var(--color-charcoal, #33312e);
		opacity: 0.8;
	}

	.cassette-text {
		font-size: 0.8rem;
		font-weight: 600;
		text-align: center;
		color: var(--color-charcoal, #33312e);
		line-height: 1.2;
	}

	.coming-soon-badge {
		position: absolute;
		bottom: 2px;
		right: 2px;
		background-color: var(--color-warm-gray, #a0998a);
		color: white;
		font-size: 0.55rem;
		font-weight: 600;
		padding: 1px 4px;
		border-radius: 4px;
		opacity: 0.8;
		transform: rotate(-3deg);
	}

	.cassette-reels {
		display: flex;
		justify-content: space-between;
		padding: 6px 20%;
		margin-top: 4px;
		position: relative;
		z-index: 1;
	}

	.reel {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--color-beige, #e8e5d7);
		border: 2px solid var(--color-warm-gray, #a0998a);
		position: relative;
	}

	.reel::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--color-warm-gray, #a0998a);
		transform: translate(-50%, -50%);
	}

	.cassette-windows {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 4px;
		display: flex;
		justify-content: space-between;
		padding: 0 5%;
		pointer-events: none;
	}

	.window {
		width: 40%;
		height: 8px;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 2px;
	}

	.active .reel {
		animation: rotate 8s linear infinite;
	}

	.active .left-reel {
		animation-direction: reverse;
	}

	/* Mobile Layout */
	.cassette-player-mobile {
		width: 100%;
		position: relative;
	}

	.current-tape {
		width: 100%;
		background: transparent;
		border: none;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
	}

	.current-tape .cassette-shell {
		width: calc(100% - 40px);
		max-width: 220px;
	}

	.dropdown-indicator {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-cream-paper, #f4f1de);
		border-radius: 50%;
		border: 1px solid var(--color-warm-gray, #a0998a);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease;
		margin-left: 8px;
	}

	.current-tape:hover .dropdown-indicator {
		transform: translateY(2px);
	}

	.cassette-dropdown {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		right: 0;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 10;
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.cassette-tape-option {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		border: none;
		background-color: var(--color-beige, #e8e5d7);
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s ease;
		position: relative;
	}

	.cassette-tape-option:hover:not(.disabled) {
		background-color: var(--color-gold, #ddb967);
	}

	.cassette-tape-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.option-badge {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.7rem;
		background-color: var(--color-warm-gray, #a0998a);
		color: white;
		padding: 2px 6px;
		border-radius: 20px;
	}

	/* Responsive helpers */
	.mobile-only {
		display: none;
	}

	@media (max-width: 768px) {
		.desktop-only {
			display: none;
		}

		.mobile-only {
			display: block;
		}
	}

	/* Animation for reels */
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
