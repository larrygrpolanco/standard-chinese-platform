<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ModuleDropdown from './UI/ModuleDropdown.svelte';
	import NavigationItem from './UI/NavigationItem.svelte';
	import MobileMenu from './UI/MobileMenu.svelte';

	// Core modules data
	const coreModules = [
		{ id: 1, title: 'ORN', fullTitle: 'Orientation' },
		{ id: 2, title: 'BIO', fullTitle: 'Biography' },
		{ id: 3, title: 'MON', fullTitle: 'Money' },
		{ id: 4, title: 'DIR', fullTitle: 'Directions' },
		{ id: 5, title: 'TRN', fullTitle: 'Transportation' },
		{ id: 6, title: 'MTG', fullTitle: 'Meetings' },
		{ id: 7, title: 'SOC', fullTitle: 'Society' },
		{ id: 8, title: 'TVL', fullTitle: 'Travel' },
		{ id: 9, title: 'LIC', fullTitle: 'Living' }
	];

	// UI state
	let mobileMenuOpen = false;
	let moduleDropdownOpen = false;

	// Helper for URL path checking
	const isActive = (path) =>
		$page.url.pathname === path || $page.url.pathname.startsWith(path + '/');

	// Handle document clicks to close dropdowns
	function handleClickOutside(event) {
		const target = event.target;
		if (!target.closest('.module-dropdown') && !target.closest('.module-dropdown-trigger')) {
			moduleDropdownOpen = false;
		}
	}

	// Close mobile menu on navigation
	$: if ($page) mobileMenuOpen = false;

	// Add click handler to document
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});

	// Toggle module dropdown
	function toggleModuleDropdown(e) {
		e.stopPropagation(); // Prevent immediate closing
		moduleDropdownOpen = !moduleDropdownOpen;
	}

	// Toggle mobile menu
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Navigation items for mobile menu
	const navItems = [
		{ href: '/', label: 'Home' },
		{
			href: '/modules',
			label: 'Modules',
			dropdown: true,
			isOpen: moduleDropdownOpen
		},
		{ href: '/guidebook', label: 'Guidebook' },
		{ href: '/rwp', label: 'RWPs' }
	];
</script>

<header class="header">
	<div class="header-content">
		<!-- Logo with cassette illustration -->
		<a href="/" class="logo-link" aria-label="Taped Chinese Home">
			<div class="cassette-icon-container">
				<svg
					class="cassette-icon"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" stroke-width="2" />
					<circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="2" />
					<circle cx="16" cy="12" r="2" stroke="currentColor" stroke-width="2" />
					<line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2" />
				</svg>
				<!-- Overlay highlight effect -->
				<div class="cassette-icon-overlay"></div>
			</div>
			<div>
				<span class="logo-text">Taped Chinese</span>
				<div class="logo-underline"></div>
			</div>
		</a>

		<!-- Desktop Navigation -->
		<nav class="desktop-nav">
			<!-- Home link -->
			<NavigationItem href="/" label="Home" isActive={isActive('/')} />

			<!-- Other navigation items -->
			<NavigationItem href="/guidebook" label="Guidebook" isActive={isActive('/guidebook')} />

			<NavigationItem href="/rwp" label="RWPs" isActive={isActive('/rwp')} />

			<!-- Modules dropdown -->
			<ModuleDropdown
				isOpen={moduleDropdownOpen}
				{coreModules}
				isActive={isActive('/modules')}
				on:click={toggleModuleDropdown}
			/>

			<!-- Login button styled like a cassette control -->
			<a href="/login" class="login-button">
				<span>Login</span>
				<!-- Button highlight effect -->
				<div class="login-button-highlight"></div>
			</a>
		</nav>

		<!-- Mobile menu button and panel -->
		<MobileMenu
			isOpen={mobileMenuOpen}
			{navItems}
			{coreModules}
			on:toggleMenu={toggleMobileMenu}
			on:toggleModuleDropdown={toggleModuleDropdown}
		/>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 30;
		border-bottom: 1px solid #a0998a;
		background-image: linear-gradient(to right, #e8e5d7, #f4f1de);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.header-content {
		margin: 0 auto;
		display: flex;
		height: 4rem;
		max-width: 80rem;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
	}

	.logo-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.2s;
	}

	.logo-link:hover {
		opacity: 0.9;
	}

	.cassette-icon-container {
		position: relative;
		display: flex;
		height: 2.25rem;
		width: 2.25rem;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 0.375rem;
		border: 1px solid rgba(160, 153, 138, 0.4);
		background-color: #f4f1de;
		box-shadow: inset 0 1px 2px rgba(51, 49, 46, 0.1);
	}

	.cassette-icon {
		height: 1.5rem;
		width: 1.5rem;
		color: #34667f;
	}

	.cassette-icon-overlay {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(to bottom right, rgba(255, 255, 255, 0.4), transparent);
		opacity: 0.3;
	}

	.logo-link:hover .cassette-icon-overlay {
		opacity: 0.5;
	}

	.logo-text {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: bold;
		letter-spacing: -0.025em;
		color: #34667f;
	}

	.logo-underline {
		height: 2px;
		width: 0;
		background-color: #ddb967;
		transition: all 0.3s;
	}

	.logo-link:hover .logo-underline {
		width: 100%;
	}

	.desktop-nav {
		display: none;
		align-items: center;
		column-gap: 1rem;
	}

	@media (min-width: 768px) {
		.desktop-nav {
			display: flex;
		}
	}

	.login-button {
		position: relative;
		margin-left: 0.5rem;
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
	}

	.login-button:hover {
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
</style>
