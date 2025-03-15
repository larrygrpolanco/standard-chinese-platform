<!-- src/lib/components/ModuleQuestions.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let moduleId;
  export let moduleResponses = {};
  
  // Define module-specific questions (5 per module)
  const moduleQuestions = {
    1: [
      { id: "preferred_transportation", question: "What's your preferred mode of transportation?" },
      { id: "travel_frequency", question: "How often do you travel?" },
      { id: "dream_destination", question: "Where would you like to travel in China?" },
      { id: "travel_purpose", question: "Why do you usually travel?" },
      { id: "travel_companions", question: "Who do you usually travel with?" }
    ],
    2: [
      { id: "food_preferences", question: "What kinds of food do you enjoy?" },
      { id: "dining_frequency", question: "How often do you eat out?" },
      { id: "cooking_habits", question: "Do you cook at home? What do you make?" },
      { id: "favorite_restaurant", question: "Describe your favorite restaurant." },
      { id: "dietary_restrictions", question: "Do you have any dietary restrictions?" }
    ],
    // Add questions for modules 3-9
  };
  
  const questions = moduleQuestions[moduleId] || [];
  let answers = {};
  
  // Initialize from existing responses
  $: {
    answers = {};
    questions.forEach(q => {
      answers[q.id] = moduleResponses[moduleId]?.[q.id] || '';
    });
  }
  
  function handleSave() {
    const updatedResponses = { ...moduleResponses };
    
    // Ensure moduleId key exists
    if (!updatedResponses[moduleId]) {
      updatedResponses[moduleId] = {};
    }
    
    // Update with new answers
    updatedResponses[moduleId] = { 
      ...updatedResponses[moduleId],
      ...answers 
    };
    
    dispatch('save', updatedResponses);
  }
</script>

<div class="module-questions p-4 border rounded-lg bg-white">
  <h3 class="text-xl font-bold mb-2">Tell us about yourself</h3>
  <p class="text-sm text-gray-600 mb-4">Your answers help us create personalized exercises</p>
  
  {#each questions as question}
    <div class="mb-4">
      <label for={question.id} class="block text-sm font-medium mb-1">
        {question.question}
      </label>
      <textarea
        id={question.id}
        bind:value={answers[question.id]}
        class="w-full p-2 border rounded-md"
        rows="2"
      ></textarea>
    </div>
  {/each}
  
  <button 
    on:click={handleSave} 
    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
  >
    Save Responses
  </button>
</div>