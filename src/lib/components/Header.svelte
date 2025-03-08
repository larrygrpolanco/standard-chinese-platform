<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Core modules data
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

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ 
			href: '/modules', 
			label: 'Core Modules',
			dropdown: true 
		},
		// { href: '/pronunciation', label: 'Pronunciation' }, // Coming Soon!
		// { href: '/extra-modules', label: 'Extra Modules' } // Coming Soon!
	];

	// UI state
	let mobileMenuOpen = false;
	let moduleDropdownOpen = false;
	
	// Helper for URL path checking
	const isActive = (path) => $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	
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
</script>

<header class="sticky top-0 z-30 border-b border-[#A0998A] bg-gradient-to-r from-[#E8E5D7] to-[#F4F1DE]">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
		<!-- Logo -->
		<a 
			href="/" 
			class="group flex items-center gap-2 transition-all hover:opacity-90"
			aria-label="Taped Chinese Home"
		>
			<div class="relative flex h-9 w-9 items-center justify-center overflow-hidden">
				<!-- Cassette icon with RoboCop-inspired styling -->
				<svg 
					class="h-8 w-8 text-[#34667F]" 
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
				<div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 group-hover:opacity-50"></div>
			</div>
			<div>
				<span class="font-['Arvo',serif] text-xl font-bold tracking-tight text-[#34667F]">
					Taped Chinese
				</span>
				<div class="h-[2px] w-0 bg-[#DDB967] transition-all duration-300 group-hover:w-full"></div>
			</div>
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden md:flex md:items-center md:gap-1">
			{#each navItems as item}
				{#if item.dropdown}
					<!-- Module dropdown -->
					<div class="relative">
						<button
							aria-haspopup="true"
							aria-expanded={moduleDropdownOpen}
							class="module-dropdown-trigger flex items-center rounded-sm px-4 py-2 font-medium text-[#33312E] outline-none transition-colors hover:bg-[#F4F1DE] focus-visible:ring-2 focus-visible:ring-[#DDB967] focus-visible:ring-offset-2 {isActive('/modules') ? 'text-[#C17C74]' : ''}"
							on:click={toggleModuleDropdown}
						>
							{item.label}
							<svg 
								class="ml-1 h-4 w-4 transition-transform duration-200 {moduleDropdownOpen ? 'rotate-180' : ''}" 
								viewBox="0 0 20 20" 
								fill="currentColor"
							>
								<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
							</svg>
						</button>
						
						{#if moduleDropdownOpen}
							<div 
								class="module-dropdown absolute right-0 z-20 mt-1 w-64 overflow-hidden rounded-md border border-[#A0998A] bg-[#F4F1DE] shadow-lg"
								style="backdrop-filter: blur(8px); box-shadow: 0 4px 14px rgba(51, 49, 46, 0.1), 0 0 0 1px rgba(51, 49, 46, 0.1);"
							>
								<!-- Header -->
								<div class="border-b border-[#A0998A]/30 bg-[#E8E5D7] px-4 py-2">
									<a 
										href="/modules"
										class="block font-['Arvo',serif] text-sm font-medium tracking-wide text-[#34667F] hover:text-[#C17C74]"
									>
										ALL CORE MODULES
									</a>
								</div>
								
								<!-- Module list -->
								<div class="max-h-[calc(100vh-200px)] overflow-y-auto p-1">
									{#each coreModules as module}
										<a
											href="/modules/{module.id}"
											class="group flex items-center gap-3 rounded-sm px-3 py-2 transition-colors hover:bg-[#E8E5D7]"
										>
											<div 
												class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm border border-[#A0998A] bg-[#F4F1DE] text-xs font-bold group-hover:border-[#C17C74] group-hover:text-[#C17C74]"
											>
												{module.id}
											</div>
											<div>
												<div class="text-sm font-medium">{module.title}</div>
												<div class="text-xs text-[#A0998A]">{module.fullTitle}</div>
											</div>
										</a>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Regular nav item -->
					<a
						href={item.href}
						class="rounded-sm px-4 py-2 font-medium text-[#33312E] outline-none transition-colors hover:bg-[#F4F1DE] focus-visible:ring-2 focus-visible:ring-[#DDB967] focus-visible:ring-offset-2 {isActive(item.href) ? 'text-[#C17C74]' : ''}"
					>
						{item.label}
					</a>
				{/if}
			{/each}
		</nav>

		<!-- Mobile Menu Button -->
		<button
			aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
			aria-expanded={mobileMenuOpen}
			class="flex h-9 w-9 items-center justify-center rounded-sm border border-[#A0998A] text-[#33312E] hover:bg-[#F4F1DE] md:hidden"
			on:click={() => mobileMenuOpen = !mobileMenuOpen}
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				{#if mobileMenuOpen}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</div>
	
	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<nav 
			class="border-t border-[#A0998A] bg-[#F4F1DE] py-3 md:hidden"
			style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);"
		>
			<div class="mx-auto max-w-7xl space-y-1 px-4">
				{#each navItems as item}
					{#if item.dropdown}
						<div class="rounded-sm bg-[#E8E5D7] p-1">
							<a 
								href="/modules"
								class="block rounded-sm px-3 py-2 font-['Arvo',serif] text-base font-medium text-[#34667F]"
							>
								{item.label}
							</a>
							
							<div class="mt-1 space-y-1 border-l-2 border-[#A0998A]/40 pl-3">
								{#each coreModules as module}
									<a
										href="/modules/{module.id}"
										class="flex items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-[#F4F1DE]"
									>
										<span class="font-bold">{module.id}:</span>
										<span>{module.title} - {module.fullTitle}</span>
									</a>
								{/each}
							</div>
						</div>
					{:else}
						<a
							href={item.href}
							class="block rounded-sm px-4 py-2 text-base font-medium text-[#33312E] transition-colors hover:bg-[#E8E5D7] {isActive(item.href) ? 'bg-[#E8E5D7] text-[#C17C74]' : ''}"
						>
							{item.label}
						</a>
					{/if}
				{/each}
			</div>
		</nav>
	{/if}
</header>