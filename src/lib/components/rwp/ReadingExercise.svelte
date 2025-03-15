<!-- src/lib/components/rwp/ReadingExercise.svelte -->
<script>
  import ChineseText from '$lib/components/UI/ChineseText.svelte';
  import FontToggle from '$lib/components/UI/FontToggle.svelte';
  
  export let content;
</script>

<div class="story-container">
  <div class="story-header">
    <h3 class="story-title">Reading</h3>
    <FontToggle compact={true} label="" />
  </div>
  <!-- Traditional will use same content for now -->
  <div class="chinese-content">
    <ChineseText 
      simplified={content.story} 
      traditional={content.story} 
      pinyin={content.story_pinyin} 
      english={content.story_english} 
    />
  </div>
</div>

<style>
  .story-container {
    margin-bottom: 2rem;
  }

  .story-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.375rem;
    border-bottom: 1px solid #e8e5d7;
  }

  .story-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #33312e;
  }
  
  .chinese-content {
    margin-top: 1rem;
  }
</style>