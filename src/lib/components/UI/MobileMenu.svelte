<!-- MobileMenu.svelte -->
<script>
	export let isOpen = false;
	export let navItems = [];
	export let coreModules = [];
	export let isLoggedIn = false;
	export let subscription = { tier: 'free' };

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Add local state to control dropdown visibility
	let moduleDropdownOpen = false;

	function toggleMenu() {
		dispatch('toggleMenu');
	}

	function toggleModuleDropdown() {
		moduleDropdownOpen = !moduleDropdownOpen;
		dispatch('toggleModuleDropdown'); // Keep for backward compatibility
	}
</script>

<!-- Vintage-styled meatball menu button -->
<button on:click={toggleMenu} class="menu-button" aria-label="Open menu">
	<!-- Cassette-inspired dots pattern -->
	<div class="dots-container">
		<div class="dot"></div>
		<div class="dot"></div>
		<div class="dot"></div>
	</div>

	<!-- Vintage button effects -->
	<div class="button-shadow"></div>
	<div class="button-highlight"></div>
</button>

<!-- Mobile menu panel -->
{#if isOpen}
	<div class="menu-overlay">
		<!-- Backdrop -->
		<div class="backdrop" on:click={toggleMenu}></div>

		<!-- Panel styled like a cassette case -->
		<div class="menu-panel">
			<!-- Header with cassette-inspired design -->
			<div class="menu-header">
				<span class="menu-title">Menu</span>

				<!-- Close button styled like cassette button -->
				<button on:click={toggleMenu} class="close-button" aria-label="Close menu">
					<span class="close-icon">×</span>
					<div class="button-shadow"></div>
				</button>
			</div>

			<!-- Navigation items with cassette-inspired styling -->
			<div class="nav-container">
				<!-- Home link -->
				<a href="/" class="nav-link">
					<span class="link-text">Home</span>
				</a>

				<!-- Modules dropdown -->
				<div class="modules-section">
					<button on:click={toggleModuleDropdown} class="dropdown-button">
						<span class="link-text">Modules</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="dropdown-arrow {moduleDropdownOpen ? 'open' : ''}"
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					{#if moduleDropdownOpen}
						<div class="dropdown-content">
							{#each coreModules as module}
								<a href="/modules/{module.id}" data-sveltekit-reload class="module-item">
									<div class="module-number">
										{module.id}
									</div>
									<div class="module-info">
										<div class="module-title">{module.title}</div>
										<div class="module-subtitle">{module.fullTitle}</div>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Additional nav items -->
				<a href="/resource" class="nav-link">
					<span class="link-text">Guide</span>
				</a>

				<a href="/rwp" class="nav-link">
					<span class="link-text">RWPs</span>
				</a>

				<!-- Login button (future implementation) -->
				<div class="login-section">
					{#if isLoggedIn}
						<a
							href="/profile"
							class="mobile-login-button {subscription.tier === 'premium' ? 'premium-button' : ''}"
						>
							<span>Profile</span>
							<div class="login-button-highlight"></div>
						</a>
					{:else}
						<a href="/login" class="mobile-login-button">
							<span>Login</span>
							<div class="login-button-highlight"></div>
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.menu-button {
		position: relative;
		display: inline-flex;
		height: 2.5rem;
		width: 2.5rem;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		border: 1px solid #a0998a;
		background-color: #f4f1de;
		transition: background-color 150ms ease;
	}

	.menu-button:hover {
		background-color: #e8e5d7;
	}

	@media (min-width: 768px) {
		.menu-button {
			display: none;
		}
	}

	.dots-container {
		display: flex;
		gap: 0.25rem;
	}

	.dot {
		height: 0.375rem;
		width: 0.375rem;
		border-radius: 9999px;
		background-color: #33312e;
	}

	.button-shadow {
		position: absolute;
		inset: 0;
		border-radius: 0.375rem;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.2);
	}

	.button-highlight {
		position: absolute;
		inset: 1px;
		border-radius: 0.1875rem;
		pointer-events: none;
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
	}

	.menu-overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
	}

	@media (min-width: 768px) {
		.menu-overlay {
			display: none;
		}
	}

	.backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(51, 49, 46, 0.3);
		backdrop-filter: blur(4px);
	}

	.menu-panel {
		position: fixed;
		/* inset-y: 0; */
		top: 0;
		bottom: 0;
		right: 0;
		width: 18rem;
		background-color: #f4f1de;
		border-left: 1px solid #a0998a;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
	}

	.menu-header {
		display: flex;
		height: 4rem;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		border-bottom: 1px solid #a0998a;
		background-color: #e8e5d7;
	}

	.menu-title {
		font-family: 'Arvo', serif;
		font-size: 1.125rem;
		font-weight: bold;
		color: #34667f;
	}

	.close-button {
		position: relative;
		display: inline-flex;
		height: 2.5rem;
		width: 2.5rem;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		border: 1px solid #a0998a;
		background-color: #f4f1de;
		transition: background-color 150ms ease;
	}

	.close-button:hover {
		background-color: #e8e5d7;
	}

	.close-icon {
		color: #33312e;
		font-weight: bold;
		font-size: 1.125rem;
	}

	.nav-container {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.375rem;
		padding: 0.625rem 0.75rem;
		color: #33312e;
		transition: background-color 150ms ease;
		font-weight: 500;
		font-size: 0.875rem;
	}

	.nav-link:hover {
		background-color: #e8e5d7;
	}

	.link-text {
		color: #34667f;
		font-weight: 500;
	}

	.modules-section {
		border-bottom: 1px solid rgba(160, 153, 138, 0.3);
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.dropdown-arrow {
		margin-left: 0.25rem;
		height: 1rem;
		width: 1rem;
		transition: transform 0.2s;
	}

	.dropdown-arrow.open {
		transform: rotate(180deg);
	}

	.dropdown-button {
		width: 100%;
		text-align: left;
		border-radius: 0.375rem;
		padding: 0.625rem 0.75rem;
		color: #33312e;
		transition: background-color 150ms ease;
		font-weight: 500;
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.dropdown-button:hover {
		background-color: #e8e5d7;
	}

	.dropdown-content {
		margin-top: 0.25rem;
		padding-left: 0.75rem;
		border-left: 2px solid #ddb967;
		margin-left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.module-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.375rem;
		padding: 0.5rem 0.75rem;
		transition: background-color 150ms ease;
	}

	.module-item:hover {
		background-color: #e8e5d7;
	}

	.module-number {
		display: flex;
		height: 1.5rem;
		width: 1.5rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border-radius: 0.125rem;
		border: 1px solid #a0998a;
		background-color: #f4f1de;
		font-size: 0.75rem;
		font-weight: bold;
		box-shadow: inset 0 1px 2px rgba(51, 49, 46, 0.1);
	}

	.module-item:hover .module-number {
		border-color: #c17c74;
		color: #c17c74;
	}

	.module-info {
		display: flex;
		flex-direction: column;
	}

	.module-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
	}

	.module-subtitle {
		font-size: 0.75rem;
		color: #a0998a;
	}

	.login-section {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #a0998a;
	}

	.login-text {
		color: #c17c74;
		font-weight: 500;
	}
    
	.mobile-login-button {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		border-radius: 9999px;
		background-color: #c17c74;
		padding: 0.375rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: background-color 0.15s;
		width: fit-content;
	}

	.mobile-login-button:hover {
		background-color: #ad6c66;
	}

	.login-button-highlight {
		position: absolute;
		inset: 0;
		top: 0;
		height: 50%;
		border-top-left-radius: 9999px;
		border-top-right-radius: 9999px;
		background-color: rgba(255, 255, 255, 0.2);
	}
	/* Add to the style block in the main component */
	.premium-button {
		background-color: #ddb967; /* Gold color */
	}

	.premium-button:hover {
		background-color: #c9a658; /* Darker gold on hover */
	}
</style>
