<!-- src/lib/components/Header.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';
	import { page } from '$app/stores';

	// Core modules data for navigation
	const coreModules = [
		{ id: 1, title: 'Greetings' },
		{ id: 2, title: 'Introductions' },
		{ id: 3, title: 'Daily Activities' },
		{ id: 4, title: 'Directions' },
		{ id: 5, title: 'Transportation' },
		{ id: 6, title: 'Arranging a Meeting' },
		{ id: 7, title: 'Education' },
		{ id: 8, title: 'Business' },
		{ id: 9, title: 'Advanced Topics' }
	];

	// State for mobile menu and dropdowns
	let isMenuOpen = false;
	let isModuleDropdownOpen = false;

	// Toggle script between simplified and traditional
	function toggleScript() {
		fontPreferences.update((prefs) => ({
			...prefs,
			script: prefs.script === 'simplified' ? 'traditional' : 'simplified'
		}));
	}

	// Toggle pinyin display
	function togglePinyin() {
		fontPreferences.update((prefs) => ({
			...prefs,
			showPinyin: !prefs.showPinyin
		}));
	}

	// Helper to check if a URL path is active
	function isActive(path) {
		return $page.url.pathname.startsWith(path);
	}

	// Close mobile menu when route changes
	$: if ($page) isMenuOpen = false;
</script>

<header class="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
	<div class="container mx-auto px-4">
		<!-- Main navigation bar -->
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Site name -->
			<div class="flex-shrink-0">
				<a href="/" class="flex items-center">
					<span class="text-xl font-bold text-[#1A5276]">FSI Chinese</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center space-x-6 md:flex">
				<a
					href="/"
					class="rounded px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1A5276]"
					class:text-[#1A5276]={$page.url.pathname === '/'}
				>
					Home
				</a>

				<!-- Module Dropdown -->
				<div class="relative">
					<button
						on:click={() => (isModuleDropdownOpen = !isModuleDropdownOpen)}
						class="inline-flex items-center rounded px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1A5276]"
						class:text-[#1A5276]={isActive('/modules')}
						aria-expanded={isModuleDropdownOpen}
					>
						Modules
						<!-- Dropdown arrow icon -->
						<svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>

					{#if isModuleDropdownOpen}
						<!-- Module dropdown menu -->
						<div
							class="ring-opacity-5 absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none"
							on:mouseleave={() => (isModuleDropdownOpen = false)}
						>
							<div class="py-1">
								<a href="/modules" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									All Modules
								</a>
							</div>
							<div class="border-t border-gray-100 py-1">
								{#each coreModules as module}
									<a
										href="/modules/{module.id}"
										class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										class:bg-gray-50={isActive(`/modules/${module.id}`)}
									>
										Module {module.id}: {module.title}
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</nav>

			<!-- Language Display Settings -->
			<div class="hidden items-center space-x-3 md:flex">
				<!-- Character Script Toggle -->
				<div class="inline-flex rounded-md shadow-sm">
					<button
						class="rounded-l-md border border-r-0 border-gray-300 px-3 py-1 text-xs font-medium
              {$fontPreferences.script === 'simplified'
							? 'border-[#1A5276] bg-[#1A5276] text-white'
							: 'bg-white text-gray-700'}"
						on:click={() => ($fontPreferences.script = 'simplified')}
					>
						简体字
					</button>
					<button
						class="rounded-r-md border border-gray-300 px-3 py-1 text-xs font-medium
              {$fontPreferences.script === 'traditional'
							? 'border-[#1A5276] bg-[#1A5276] text-white'
							: 'bg-white text-gray-700'}"
						on:click={() => ($fontPreferences.script = 'traditional')}
					>
						繁體字
					</button>
				</div>

				<!-- Pinyin Toggle -->
				<button
					class="rounded-md border px-3 py-1 text-xs font-medium
            {$fontPreferences.showPinyin
						? 'border-[#1A5276] bg-[#1A5276] text-white'
						: 'border-gray-300 bg-white text-gray-700'}"
					on:click={togglePinyin}
				>
					{$fontPreferences.showPinyin ? 'Hide Pinyin' : 'Show Pinyin'}
				</button>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					on:click={() => (isMenuOpen = !isMenuOpen)}
					class="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
					aria-expanded={isMenuOpen}
				>
					<span class="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
					<!-- Menu/Close icon -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Menu Dropdown -->
		{#if isMenuOpen}
			<div class="mt-2 border-t border-gray-200 pb-3 md:hidden">
				<div class="space-y-1 pt-2 pb-3">
					<!-- Navigation Links -->
					<a
						href="/"
						class="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-[#1A5276]"
						class:bg-gray-100={$page.url.pathname === '/'}
						class:text-[#1A5276]={$page.url.pathname === '/'}
					>
						Home
					</a>
					<a
						href="/modules"
						class="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-[#1A5276]"
						class:bg-gray-100={isActive('/modules')}
						class:text-[#1A5276]={isActive('/modules')}
					>
						All Modules
					</a>

					<!-- Module Links -->
					<div class="mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
						{#each coreModules as module}
							<a
								href="/modules/{module.id}"
								class="block rounded-md px-3 py-2 text-sm hover:bg-gray-50"
								class:bg-gray-100={isActive(`/modules/${module.id}`)}
								class:text-[#1A5276]={isActive(`/modules/${module.id}`)}
							>
								Module {module.id}: {module.title}
							</a>
						{/each}
					</div>
				</div>

				<!-- Mobile Settings -->
				<div class="mt-4 border-t border-gray-200 pt-4 pb-3">
					<div class="space-y-3 px-4">
						<!-- Character Setting -->
						<div>
							<p class="mb-1 text-sm text-gray-600">Characters:</p>
							<div class="inline-flex rounded-md shadow-sm">
								<button
									class="rounded-l-md border border-r-0 border-gray-300 px-3 py-1 text-sm
                    {$fontPreferences.script === 'simplified'
										? 'border-[#1A5276] bg-[#1A5276] text-white'
										: 'bg-white text-gray-700'}"
									on:click={() => ($fontPreferences.script = 'simplified')}
								>
									简体字
								</button>
								<button
									class="rounded-r-md border border-gray-300 px-3 py-1 text-sm
                    {$fontPreferences.script === 'traditional'
										? 'border-[#1A5276] bg-[#1A5276] text-white'
										: 'bg-white text-gray-700'}"
									on:click={() => ($fontPreferences.script = 'traditional')}
								>
									繁體字
								</button>
							</div>
						</div>

						<!-- Pinyin Setting -->
						<div>
							<p class="mb-1 text-sm text-gray-600">Pinyin:</p>
							<button
								class="rounded-md border px-3 py-1 text-sm
                  {$fontPreferences.showPinyin
									? 'border-[#1A5276] bg-[#1A5276] text-white'
									: 'border-gray-300 bg-white text-gray-700'}"
								on:click={togglePinyin}
							>
								{$fontPreferences.showPinyin ? 'Hide Pinyin' : 'Show Pinyin'}
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</header>
