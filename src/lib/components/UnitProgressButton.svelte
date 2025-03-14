<!-- src/lib/components/UnitProgressButton.svelte -->
<script>
  import { updateUnitProgress } from '$lib/supabase/client.js';
  
  export let unitId;
  export let initialStatus = 'in_progress';
  
  let status = initialStatus;
  let loading = false;
  
  async function toggleStatus() {
    loading = true;
    try {
      const newStatus = status === 'completed' ? 'in_progress' : 'completed';
      await updateUnitProgress(unitId, newStatus);
      status = newStatus;
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      loading = false;
    }
  }
</script>

<button class="progress-btn {status}" on:click={toggleStatus} disabled={loading}>
  {#if loading}
    <span class="loading"></span>
  {:else if status === 'completed'}
    ✓ Completed
  {:else}
    Mark as Completed
  {/if}
</button>

<style>
  /* Style your button to match your cassette tape aesthetic */
  .progress-btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .progress-btn.completed {
    background: #4CAF50;
    color: white;
  }
  
  .progress-btn.in_progress {
    background: #f0f0f0;
    color: #333;
  }
</style>