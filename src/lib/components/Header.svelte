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
  
  // Navigation item icons
  const icons = {
    home: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>`,
    guidebook: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>`,
    rwp: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>`
  };
  
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

<header
  class="sticky top-0 z-30 border-b border-[#A0998A] bg-gradient-to-r from-[#E8E5D7] to-[#F4F1DE] shadow-sm"
>
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
    <!-- Logo with cassette illustration -->
    <a
      href="/"
      class="group flex items-center gap-2 transition-all hover:opacity-90"
      aria-label="Taped Chinese Home"
    >
      <div class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-[#A0998A]/40 bg-[#F4F1DE] shadow-[inset_0_1px_2px_rgba(51,49,46,0.1)]">
        <svg
          class="h-6 w-6 text-[#34667F]"
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
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-30 group-hover:opacity-50"
        ></div>
      </div>
      <div>
        <span class="font-['Arvo',serif] text-xl font-bold tracking-tight text-[#34667F]">
          Taped Chinese
        </span>
        <div class="h-[2px] w-0 bg-[#DDB967] transition-all duration-300 group-hover:w-full"></div>
      </div>
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center space-x-1">
      <!-- Home link -->
      <NavigationItem 
        href="/" 
        label="Home" 
        isActive={isActive('/')} 
        icon={icons.home}
      />
      
      <!-- Modules dropdown -->
      <ModuleDropdown 
        isOpen={moduleDropdownOpen} 
        coreModules={coreModules} 
        isActive={isActive('/modules')}
        on:click={toggleModuleDropdown} 
      />
      
      <!-- Other navigation items -->
      <NavigationItem 
        href="/guidebook" 
        label="Guidebook" 
        isActive={isActive('/guidebook')} 
        icon={icons.guidebook}
      />
      
      <NavigationItem 
        href="/rwp" 
        label="RWPs" 
        isActive={isActive('/rwp')} 
        icon={icons.rwp}
      />
      
      <!-- Login button styled like a cassette control -->
      <a 
        href="/login" 
        class="ml-2 relative flex items-center gap-1.5 rounded-full bg-[#C17C74] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#AD6C66] shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        <span>Login</span>
        
        <!-- Button highlight effect -->
        <div class="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/20"></div>
      </a>
    </nav>

    <!-- Mobile menu button and panel -->
    <MobileMenu 
      isOpen={mobileMenuOpen} 
      navItems={navItems} 
      coreModules={coreModules}
      on:toggleMenu={toggleMobileMenu}
      on:toggleModuleDropdown={toggleModuleDropdown}
    />
  </div>
</header>