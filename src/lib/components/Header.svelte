<!-- src/lib/components/Header.svelte -->
<script>
	import { page } from '$app/stores';

	// Core modules data for navigation
	const coreModules = [
		{ id: 1, title: 'ORN', fullTitle: 'Orientation' },
		{ id: 2, title: 'BIO', fullTitle: 'Biography' },
		{ id: 3, title: 'MON', fullTitle: 'Money' },
		{ id: 4, title: 'DIR', fullTitle: 'Directions' },
		{ id: 5, title: 'TRN', fullTitle: 'Transportation' },
		{ id: 6, title: 'MTG', fullTitle: 'Meetings' },
		{ id: 7, title: 'SOC', fullTitle: 'Social' },
		{ id: 8, title: 'TVL', fullTitle: 'Travel' },
		{ id: 9, title: 'LIC', fullTitle: 'License' }
	];

	// Navigation items (expandable for future sections)
	const navItems = [
		{ href: '/', label: 'Home' },
		{ 
			label: 'Modules', 
			dropdown: true,
			items: [
				{ href: '/modules', label: 'All Modules' },
				{ type: 'divider' },
				...coreModules.map(module => ({
					href: `/modules/${module.id}`,
					label: `Module ${module.id}: ${module.title}`,
					description: module.fullTitle
				}))
			]
		}
		// Future navigation items:
		// { href: '/pronunciation', label: 'Pronunciation' },
		// { href: '/grammar', label: 'Grammar' },
		// { href: '/practice', label: 'Smart Practice' }
	];

	// UI state
	let isMenuOpen = false;
	let activeDropdown = null;

	// Helper to check if a URL path is active
	const isActive = (path) => $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');

	// Toggle dropdown visibility
	function toggleDropdown(index) {
		activeDropdown = activeDropdown === index ? null : index;
	}

	// Close dropdowns when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-trigger')) {
			activeDropdown = null;
		}
	}

	// Close mobile menu when route changes
	$: if ($page) isMenuOpen = false;
</script>

<svelte:window on:click={handleClickOutside} />

<header class="sticky top-0 z-10 border-b border-[#A0998A] bg-[#E8E5D7] shadow-sm">
	<div class="container mx-auto px-4">
		<!-- Main navigation bar -->
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center space-x-2">
				<!-- Optional: Small cassette icon -->
				<svg class="h-6 w-6 text-[#34667F]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" stroke-width="2" />
					<circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="2" />
					<circle cx="16" cy="12" r="2" stroke="currentColor" stroke-width="2" />
					<line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2" />
				</svg>
				<span class="font-['Arvo',serif] text-xl font-bold text-[#34667F]">FSI Chinese</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center space-x-1 md:flex">
				{#each navItems as item, i}
					{#if item.dropdown}
						<!-- Dropdown navigation item -->
						<div class="relative">
							<button
								class="dropdown-trigger flex items-center rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F4F1DE]"
								class:text-[#C17C74]={isActive('/modules')}
								on:click={() => toggleDropdown(i)}
								aria-expanded={activeDropdown === i}
							>
								{item.label}
								<svg 
									class="ml-1 h-4 w-4 transition-transform" 
									class:transform={activeDropdown === i} 
									class:rotate-180={activeDropdown === i} 
									viewBox="0 0 20 20" 
									fill="currentColor"
								>
									<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
								</svg>
							</button>

							{#if activeDropdown === i}
								<div
									class="dropdown-menu absolute right-0 z-20 mt-1 w-60 overflow-hidden rounded-lg border border-[#A0998A] bg-[#F4F1DE] shadow-lg"
								>
									{#each item.items as subItem}
										{#if subItem.type === 'divider'}
											<div class="border-t border-[#A0998A]"></div>
										{:else}
											<a
												href={subItem.href}
												class="block px-4 py-2 text-sm transition-colors hover:bg-[#E8E5D7]"
												class:text-[#C17C74]={isActive(subItem.href)}
											>
												<div class="font-medium">{subItem.label}</div>
												{#if subItem.description}
													<div class="text-xs text-[#A0998A]">{subItem.description}</div>
												{/if}
											</a>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					{:else}
						<!-- Standard navigation item -->
						<a
							href={item.href}
							class="rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F4F1DE]"
							class:text-[#C17C74]={isActive(item.href)}
						>
							{item.label}
						</a>
					{/if}
				{/each}
			</nav>

			<!-- Mobile Menu Button -->
			<button
				on:click={() => (isMenuOpen = !isMenuOpen)}
				class="rounded p-2 text-[#33312E] transition-colors hover:bg-[#F4F1DE] active:bg-[#E8E5D7] md:hidden"
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={isMenuOpen}
			>
				<svg class="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					/>
				</svg>
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if isMenuOpen}
			<nav class="border-t border-[#A0998A] py-2 md:hidden">
				{#each navItems as item}
					{#if item.dropdown}
						<!-- Dropdown section header -->
						<div class="px-4 py-2 text-base font-medium text-[#33312E]">
							{item.label}
						</div>
						
						<!-- Dropdown items -->
						<div class="space-y-1 border-l-2 border-[#A0998A] pl-4">
							{#each item.items as subItem}
								{#if subItem.type === 'divider'}
									<div class="my-2 border-t border-[#A0998A] opacity-50"></div>
								{:else}
									<a
										href={subItem.href}
										class="block px-3 py-2 text-sm transition-colors hover:bg-[#F4F1DE]"
										class:text-[#C17C74]={isActive(subItem.href)}
									>
										{subItem.label}
									</a>
								{/if}
							{/each}
						</div>
					{:else}
						<!-- Standard navigation item -->
						<a
							href={item.href}
							class="block px-4 py-2 text-base font-medium transition-colors hover:bg-[#F4F1DE]"
							class:text-[#C17C74]={isActive(item.href)}
						>
							{item.label}
						</a>
					{/if}
				{/each}
			</nav>
		{/if}
	</div>
</header>