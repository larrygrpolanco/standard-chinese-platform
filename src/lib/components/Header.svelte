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

<header class="sticky top-0 z-10 bg-[#E8E5D7] border-b border-[#A0998A]">
	<div class="container mx-auto px-4">
		<!-- Main navigation bar -->
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-xl font-['Arvo',serif] font-bold text-[#34667F]">FSI Chinese</a>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex items-center space-x-4">
				<a 
					href="/" 
					class="px-3 py-2 rounded text-sm font-medium hover:bg-[#F4F1DE] transition-colors"
					class:text-[#C17C74]={$page.url.pathname === '/'}
				>
					Home
				</a>
				
				<!-- Module Dropdown -->
				<div class="relative">
					<button
						on:click={() => (isModuleDropdownOpen = !isModuleDropdownOpen)}
						class="px-3 py-2 rounded text-sm font-medium hover:bg-[#F4F1DE] transition-colors inline-flex items-center"
						class:text-[#C17C74]={isActive('/modules')}
					>
						Modules
						<svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
						</svg>
					</button>

					{#if isModuleDropdownOpen}
						<div 
							class="absolute right-0 mt-1 w-56 rounded bg-[#E8E5D7] border border-[#A0998A] z-20"
							on:mouseleave={() => (isModuleDropdownOpen = false)}
						>
							<a href="/modules" class="block px-4 py-2 text-sm hover:bg-[#F4F1DE] transition-colors">All Modules</a>
							<div class="border-t border-[#A0998A]">
								{#each coreModules as module}
									<a
										href="/modules/{module.id}"
										class="block px-4 py-2 text-sm hover:bg-[#F4F1DE] transition-colors"
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

			<!-- Language Settings -->
			<div class="hidden md:flex items-center gap-2">
				<!-- Script Toggle (Simplified/Traditional) - styled as vintage slide switch -->
				<div class="flex items-center rounded-full bg-[#F4F1DE] p-1 border border-[#A0998A]">
					<button
						class={`px-3 py-1 rounded-full text-xs font-medium transition-all ${$fontPreferences.script === 'simplified' ? 'bg-[#DDB967] shadow-inner transform translate-x-0' : 'bg-transparent transform translate-x-1'}`}
						on:click={() => ($fontPreferences.script = 'simplified')}
					>
						简体字
					</button>
					<button
						class={`px-3 py-1 rounded-full text-xs font-medium transition-all ${$fontPreferences.script === 'traditional' ? 'bg-[#DDB967] shadow-inner transform -translate-x-0' : 'bg-transparent transform -translate-x-1'}`}
						on:click={() => ($fontPreferences.script = 'traditional')}
					>
						繁體字
					</button>
				</div>

				<!-- Pinyin Toggle - vintage style switch -->
				<div class="flex items-center">
					<span class="text-xs mr-2">Pinyin</span>
					<button
						class="w-12 h-6 rounded-full bg-[#F4F1DE] border border-[#A0998A] relative transition-colors"
						class:bg-[#7D8C5C]={$fontPreferences.showPinyin}
						on:click={() => fontPreferences.update(p => ({ ...p, showPinyin: !p.showPinyin }))}
					>
						<span 
							class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#DDB967] transition-transform shadow-sm"
							class:translate-x-6={$fontPreferences.showPinyin} 
						></span>
					</button>
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<button
				on:click={() => (isMenuOpen = !isMenuOpen)}
				class="md:hidden p-2 rounded text-[#33312E] hover:bg-[#F4F1DE] active:bg-[#E8E5D7] transition-colors"
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
			>
				<svg class="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
					<path 
						stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
						d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} 
					/>
				</svg>
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if isMenuOpen}
			<nav class="md:hidden py-2 border-t border-[#A0998A]">
				<!-- Navigation Links -->
				<a
					href="/"
					class="block px-3 py-2 text-base font-medium hover:bg-[#F4F1DE] transition-colors"
					class:text-[#C17C74]={$page.url.pathname === '/'}
				>
					Home
				</a>
				<a
					href="/modules"
					class="block px-3 py-2 text-base font-medium hover:bg-[#F4F1DE] transition-colors"
					class:text-[#C17C74]={isActive('/modules')}
				>
					All Modules
				</a>
				
				<!-- Module Links -->
				<div class="pl-4 border-l-2 border-[#A0998A] mt-1">
					{#each coreModules as module}
						<a
							href="/modules/{module.id}"
							class="block px-3 py-2 text-sm hover:bg-[#F4F1DE] transition-colors"
							class:text-[#C17C74]={isActive(`/modules/${module.id}`)}
						>
							Module {module.id}: {module.title}
						</a>
					{/each}
				</div>
				
				<!-- Mobile Language Settings -->
				<div class="pt-4 mt-2 border-t border-[#A0998A] px-3 space-y-3">
					<!-- Script Toggle -->
					<div>
						<p class="text-sm text-[#A0998A] mb-1">Characters:</p>
						<div class="flex rounded-full bg-[#F4F1DE] p-1 border border-[#A0998A] w-fit">
							<button
								class={`px-3 py-1 rounded-full text-xs font-medium transition-all ${$fontPreferences.script === 'simplified' ? 'bg-[#DDB967] shadow-inner' : 'bg-transparent'}`}
								on:click={() => ($fontPreferences.script = 'simplified')}
							>
								简体字
							</button>
							<button
								class={`px-3 py-1 rounded-full text-xs font-medium transition-all ${$fontPreferences.script === 'traditional' ? 'bg-[#DDB967] shadow-inner' : 'bg-transparent'}`}
								on:click={() => ($fontPreferences.script = 'traditional')}
							>
								繁體字
							</button>
						</div>
					</div>
					
					<!-- Pinyin Toggle -->
					<div class="flex items-center">
						<span class="text-sm text-[#A0998A] mr-2">Pinyin:</span>
						<button
							class="w-12 h-6 rounded-full bg-[#F4F1DE] border border-[#A0998A] relative transition-colors"
							class:bg-[#7D8C5C]={$fontPreferences.showPinyin}
							on:click={() => fontPreferences.update(p => ({ ...p, showPinyin: !p.showPinyin }))}
						>
							<span 
								class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#DDB967] transition-transform shadow-sm"
								class:translate-x-6={$fontPreferences.showPinyin} 
							></span>
						</button>
					</div>
				</div>
			</nav>
		{/if}
	</div>
</header>