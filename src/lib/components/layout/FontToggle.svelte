<!-- src/lib/components/layout/FontToggle.svelte -->
<script>
  import { fontPreferences } from '$lib/stores/fontPreferences';
  
  function toggleScript() {
    fontPreferences.update(prefs => ({
      ...prefs,
      script: prefs.script === 'simplified' ? 'traditional' : 'simplified'
    }));
  }
  
  function togglePinyin() {
    fontPreferences.update(prefs => ({
      ...prefs,
      showPinyin: !prefs.showPinyin
    }));
  }
</script>

<div class="font-controls flex gap-4 p-3 bg-gray-100 rounded-lg mb-4">
  <div>
    <span class="text-sm text-gray-600 mr-2">Characters:</span>
    <button 
      class="px-3 py-1 rounded {$fontPreferences.script === 'simplified' ? 'bg-blue-600 text-white' : 'bg-gray-200'}"
      on:click={toggleScript}
    >
      简体字
    </button>
    <button 
      class="px-3 py-1 rounded {$fontPreferences.script === 'traditional' ? 'bg-blue-600 text-white' : 'bg-gray-200'}"
      on:click={toggleScript}
    >
      繁體字
    </button>
  </div>
  
  <div>
    <span class="text-sm text-gray-600 mr-2">Pinyin:</span>
    <button 
      class="px-3 py-1 rounded {$fontPreferences.showPinyin ? 'bg-blue-600 text-white' : 'bg-gray-200'}"
      on:click={togglePinyin}
    >
      {$fontPreferences.showPinyin ? 'Hide Pinyin' : 'Show Pinyin'}
    </button>
  </div>
</div>