<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { getModules } from '$lib/supabase/client';
  
  let featuredModules = [];
  let loading = true;
  
  onMount(async () => {
    // Load just the first 3 modules for featured section
    featuredModules = await getModules();
    featuredModules = featuredModules.slice(0, 3);
    loading = false;
  });
</script>

<svelte:head>
  <title>FSI Chinese Learning Platform</title>
</svelte:head>

<!-- Hero Section -->
<section class="py-12 md:py-20 text-center">
  <div class="max-w-4xl mx-auto px-4">
    <h1 class="text-4xl md:text-5xl font-bold mb-6 text-[#1A5276]">FSI Chinese Learning</h1>
    
    <p class="text-lg md:text-xl mb-8 text-gray-700 max-w-3xl mx-auto leading-relaxed">
      A modern approach to the Foreign Service Institute's "Standard Chinese" course, 
      designed to help you learn Mandarin effectively at your own pace.
    </p>
    
    <div class="flex flex-wrap justify-center gap-4">
      <a 
        href="/modules" 
        class="bg-[#1A5276] hover:bg-[#154360] text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Browse Modules
      </a>
      <a 
        href="#about" 
        class="bg-white hover:bg-gray-100 text-[#1A5276] border border-[#1A5276] font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Learn More
      </a>
    </div>
  </div>
</section>

<!-- Featured Modules Section -->
<section class="py-12 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center">Featured Modules</h2>
    
    {#if loading}
      <div class="text-center py-8">
        <p>Loading modules...</p>
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-3">
        {#each featuredModules as module}
          <a 
            href="/modules/{module.id}" 
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
          >
            <div class="rounded-full bg-[#F39C12] text-white w-10 h-10 flex items-center justify-center mb-4">
              <span class="font-bold">{module.id}</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">{module.title}</h3>
            <p class="text-gray-600 text-sm mb-4 flex-grow">{module.description}</p>
            <span class="text-[#1A5276] font-medium text-sm">Explore module →</span>
          </a>
        {/each}
      </div>
      
      <div class="text-center mt-8">
        <a 
          href="/modules" 
          class="inline-block text-[#1A5276] hover:text-[#154360] font-medium"
        >
          View all modules →
        </a>
      </div>
    {/if}
  </div>
</section>

<!-- About Section -->
<section id="about" class="py-12 md:py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">About This Platform</h2>
      
      <div class="prose prose-lg mx-auto">
        <p>
          This platform digitizes the comprehensive FSI Standard Chinese course originally developed 
          to train U.S. diplomats. The course follows a modular approach with 9 core modules 
          that build speaking, listening, reading, and writing skills.
        </p>
        
        <p>
          Each module contains multiple units with dialogues, vocabulary, audio recordings, 
          and interactive exercises. You can learn at your own pace, toggle between simplified 
          and traditional characters, and practice with authentic audio materials.
        </p>
        
        <p>
          The platform is designed to be accessible to learners at all levels, from complete 
          beginners to those looking to refine their existing Chinese language skills.
        </p>
      </div>
    </div>
  </div>
</section>