<!-- src/lib/components/rwp/ReadingExercise.svelte -->
<script>
  import ChineseText from '$lib/components/UI/ChineseText.svelte';
  import FontToggle from '$lib/components/UI/FontToggle.svelte';
  import QuestionDisplay from './QuestionDisplay.svelte';
  import VocabularySection from './VocabularySection.svelte';
  
  export let content;
  
  // Logging for debugging
  console.log("ReadingExercise received content:", content);
  
  // Extract data safely with defaults
  $: title = content?.meta?.title_english || 'Reading';
  $: introduction = content?.meta?.introduction || '';
  
  // Access nested story properties correctly
  $: storyText = content?.story?.text || '';
  $: storyTraditional = content?.story?.text_traditional || storyText;
  $: storyPinyin = content?.story?.text_pinyin || '';
  $: storyEnglish = content?.story?.text_english || '';
  
  $: questions = content?.questions || [];
  $: vocabulary = content?.vocabulary || [];
  
  // State for showing answers
  let showAnswers = false;
</script>

{#if content}
  <div class="exercise-container">
    <!-- Introduction section -->
    {#if introduction}
      <div class="introduction">
        <p>{introduction}</p>
      </div>
    {/if}

    <!-- Story section -->
    <div class="story-container">
      <div class="story-header">
        <h3 class="story-title">{title}</h3>
        <FontToggle compact={true} label="" />
      </div>
      
      <div class="chinese-content">
        <ChineseText 
          simplified={storyText} 
          traditional={storyTraditional} 
          pinyin={storyPinyin} 
          english={storyEnglish} 
        />
      </div>
    </div>

    <!-- Questions section -->
    {#if questions.length > 0}
      <div class="questions-container">
        <div class="questions-header">
          <h3 class="questions-title">Comprehension Questions</h3>
          <button class="toggle-answers" on:click={() => showAnswers = !showAnswers}>
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        </div>
        
        <div class="questions-list">
          {#each questions as question}
            <QuestionDisplay {question} {showAnswers} />
          {/each}
        </div>
      </div>
    {/if}

    <!-- Vocabulary section -->
    {#if vocabulary && vocabulary.length > 0}
      <VocabularySection {vocabulary} />
    {/if}
  </div>
{:else}
  <div class="loading">Loading exercise content...</div>
{/if}

<style>
  .exercise-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .introduction {
    padding: 1rem;
    background-color: #f9f8f4;
    border-radius: 0.5rem;
    border: 1px solid #e8e5d7;
    margin-bottom: 1rem;
  }
  
  .story-container, .questions-container {
    margin-bottom: 2rem;
  }

  .story-header, .questions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.375rem;
    border-bottom: 1px solid #e8e5d7;
  }

  .story-title, .questions-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #33312e;
  }
  
  .toggle-answers {
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    background-color: #34667f;
    color: white;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .toggle-answers:hover {
    background-color: #2a5267;
  }
  
  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .loading {
    padding: 2rem;
    text-align: center;
    color: #6b6a65;
  }
</style>