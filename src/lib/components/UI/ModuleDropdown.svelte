<script>
  export let isOpen = false;
  export let coreModules = [];
  export let isActive = false;
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function handleClick(e) {
    e.stopPropagation();
    dispatch('click', e);
  }
</script>

<div class="relative module-dropdown">
  <!-- Dropdown trigger -->
  <button 
    on:click={handleClick}
    class="module-dropdown-trigger relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#33312E] transition-colors {isOpen || isActive ? 'bg-[#DDB967]/20 font-semibold' : 'hover:bg-[#E8E5D7]'}"
    aria-expanded={isOpen}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 h-4 w-4 text-[#34667F]">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75" />
    </svg>
    <span>Modules</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="ml-1 h-4 w-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>
    
    {#if isOpen || isActive}
      <div class="absolute bottom-0 left-3 right-3 h-0.5 bg-[#DDB967] rounded-full"></div>
    {/if}
  </button>
  
  <!-- Dropdown content -->
  {#if isOpen}
    <div class="absolute z-50 mt-1 w-64 origin-top-right rounded-md border border-[#A0998A] bg-[#F4F1DE] shadow-lg">
      <div class="bg-[#E8E5D7] border-b border-[#A0998A] px-4 py-2">
        <div class="text-sm font-semibold text-[#34667F]">Core Modules</div>
      </div>
      
      <div class="max-h-[calc(100vh-200px)] overflow-y-auto p-2 shadow-[inset_0_2px_4px_rgba(51,49,46,0.05)]">
        {#each coreModules as module}
          <a
            href="/modules/{module.id}"
            data-sveltekit-reload
            class="group flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#E8E5D7]"
          >
            <div
              class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm border border-[#A0998A] bg-[#F4F1DE] text-xs font-bold shadow-[inset_0_1px_2px_rgba(51,49,46,0.1)] group-hover:border-[#C17C74] group-hover:text-[#C17C74]"
            >
              {module.id}
            </div>
            <div>
              <div class="text-sm font-medium text-[#33312E]">{module.title}</div>
              <div class="text-xs text-[#A0998A]">{module.fullTitle}</div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>