<script>
  export let href = '/';
  export let label = '';
  export let isActive = false;
  export let icon = null;
</script>

<a 
  {href} 
  class="group relative flex items-center rounded-md px-3 py-2 text-sm font-medium text-[#33312E] transition-colors {isActive ? 'bg-[#DDB967]/20 font-semibold' : 'hover:bg-[#E8E5D7]'}"
  aria-current={isActive ? 'page' : undefined}
>
  {#if icon}
    <span class="mr-2 text-[#34667F]">{@html icon}</span>
  {/if}
  <span>{label}</span>
  
  {#if isActive}
    <div class="absolute bottom-0 left-3 right-3 h-0.5 bg-[#DDB967] rounded-full"></div>
  {/if}
</a>