<!-- src/lib/components/Header.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';
	import { page } from '$app/stores';

	// Core modules data for navigation
	const coreModules = [
		{ id: 1, title: 'ORN' },
		{ id: 2, title: 'BIO' },
		{ id: 3, title: 'MON' },
		{ id: 4, title: 'DIR' },
		{ id: 5, title: 'TRN' },
		{ id: 6, title: 'MTG' },
		{ id: 7, title: 'SOC' },
		{ id: 8, title: 'TVL' },
		{ id: 9, title: 'LIC' }
	];

	// UI state
	let isMenuOpen = false;
	let isModuleDropdownOpen = false;

	// Helper to check if a URL path is active
	const isActive = (path) => $page.url.pathname.startsWith(path);

	// Close mobile menu when route changes
	$: if ($page) isMenuOpen = false;
</script>

<header class="sticky top-0 z-10 border-b border-[#A0998A] bg-[#E8E5D7]">
	<div class="container mx-auto px-4">
		<!-- Main navigation bar -->
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="font-['Arvo',serif] text-xl font-bold text-[#34667F]">FSI Chinese</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center space-x-4 md:flex">
				<a
					href="/"
					class="rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F4F1DE]"
					class:text-[#C17C74]={$page.url.pathname === '/'}
				>
					Home
				</a>

				<!-- Module Dropdown -->
				<div class="relative">
					<button
						on:click={() => (isModuleDropdownOpen = !isModuleDropdownOpen)}
						class="inline-flex items-center rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F4F1DE]"
						class:text-[#C17C74]={isActive('/modules')}
					>
						Modules
						<svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							/>
						</svg>
					</button>

					{#if isModuleDropdownOpen}
						<div
							class="absolute right-0 z-20 mt-1 w-56 rounded border border-[#A0998A] bg-[#E8E5D7]"
							on:mouseleave={() => (isModuleDropdownOpen = false)}
						>
							<a
								href="/modules"
								class="block px-4 py-2 text-sm transition-colors hover:bg-[#F4F1DE]">All Modules</a
							>
							<div class="border-t border-[#A0998A]">
								{#each coreModules as module}
									<a
										href="/modules/{module.id}"
										class="block px-4 py-2 text-sm transition-colors hover:bg-[#F4F1DE]"
										class:text-[#C17C74]={isActive(`/modules/${module.id}`)}
									>
										Module {module.id}: {module.title}
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</nav>

			<!-- Mobile Menu Button -->
			<button
				on:click={() => (isMenuOpen = !isMenuOpen)}
				class="rounded p-2 text-[#33312E] transition-colors hover:bg-[#F4F1DE] active:bg-[#E8E5D7] md:hidden"
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
				<!-- Navigation Links -->
				<a
					href="/"
					class="block px-3 py-2 text-base font-medium transition-colors hover:bg-[#F4F1DE]"
					class:text-[#C17C74]={$page.url.pathname === '/'}
				>
					Home
				</a>
				<a
					href="/modules"
					class="block px-3 py-2 text-base font-medium transition-colors hover:bg-[#F4F1DE]"
					class:text-[#C17C74]={isActive('/modules')}
				>
					All Modules
				</a>

				<!-- Module Links -->
				<div class="mt-1 border-l-2 border-[#A0998A] pl-4">
					{#each coreModules as module}
						<a
							href="/modules/{module.id}"
							class="block px-3 py-2 text-sm transition-colors hover:bg-[#F4F1DE]"
							class:text-[#C17C74]={isActive(`/modules/${module.id}`)}
						>
							Module {module.id}: {module.title}
						</a>
					{/each}
				</div>
			</nav>
		{/if}
	</div>
</header>
