<!-- src/lib/components/AudioPlayer.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  
  // Props
  export let audioSrc = '';
  export let title = '';
  
  // Audio element and state
  let audio;
  let duration = 0;
  let currentTime = 0;
  let playing = false;
  let playbackRate = 1;
  let loaded = false;
  
  // Format seconds to MM:SS
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Toggle play/pause
  function togglePlay() {
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    playing = !playing;
  }
  
  // Change playback speed
  function setPlaybackRate(rate) {
    playbackRate = rate;
    if (audio) audio.playbackRate = rate;
  }
  
  // Handle seeking
  function handleSeek(e) {
    if (audio) {
      audio.currentTime = e.target.value;
      currentTime = e.target.value;
    }
  }
  
  // Setup event listeners
  onMount(() => {
    if (audio) {
      audio.addEventListener('timeupdate', () => {
        currentTime = audio.currentTime;
      });
      
      audio.addEventListener('loadedmetadata', () => {
        duration = audio.duration;
        loaded = true;
      });
      
      audio.addEventListener('ended', () => {
        playing = false;
      });
    }
  });
  
  // Cleanup
  onDestroy(() => {
    if (audio) {
      audio.pause();
      // Remove event listeners
    }
  });
</script>

<div class="rounded-lg border border-gray-200 overflow-hidden">
  <!-- Hidden audio element -->
  <audio bind:this={audio} src={audioSrc} preload="metadata"></audio>
  
  <div class="p-3 sm:p-4 bg-white">
    {#if title}
      <div class="mb-2 text-sm font-medium text-gray-700">{title}</div>
    {/if}
    
    <div class="flex items-center gap-3 mb-3">
      <!-- Play/Pause button -->
      <button 
        on:click={togglePlay}
        class="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A5276] text-white flex items-center justify-center focus:outline-none hover:bg-[#154360]"
        aria-label={playing ? 'Pause' : 'Play'}
        disabled={!loaded}
      >
        {#if playing}
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
          </svg>
        {:else}
          <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7-11-7z"></path>
          </svg>
        {/if}
      </button>
      
      <!-- Time display -->
      <div class="text-xs text-gray-500 font-mono whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      
      <!-- Playback speed -->
      <div class="ml-auto">
        <select
          bind:value={playbackRate}
          on:change={() => setPlaybackRate(playbackRate)}
          class="text-xs bg-gray-100 rounded px-2 py-1 border-0"
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
      <input
        type="range"
        min="0"
        max={duration || 100}
        bind:value={currentTime}
        on:input={handleSeek}
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={!loaded}
      />
      <div 
        class="absolute left-0 top-0 bottom-0 bg-[#1A5276] rounded-full pointer-events-none" 
        style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
      ></div>
    </div>
  </div>
</div>

<style>
  /* Custom styling for the range input across browsers */
  input[type=range]:disabled {
    cursor: not-allowed;
  }
</style>